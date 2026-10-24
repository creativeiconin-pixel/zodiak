<?php

namespace App\Actions;

use App\Exceptions\PineLabsException;
use App\Models\Order;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Minimal client for Pine Labs Online (Plural v2): OAuth token, hosted checkout, and order lookup.
 *
 * @see https://www.pinelabs.com/docs/online-payments/api/authentication/generate-token.md
 * @see https://www.pinelabs.com/docs/online-payments/api/checkout/generate-checkout-link.md
 * @see https://www.pinelabs.com/docs/online-payments/api/orders/get-order-by-id.md
 */
class PineLabsClient
{
    public function isConfigured(): bool
    {
        return filled(config('services.pinelabs.client_id')) && filled(config('services.pinelabs.client_secret'));
    }

    public function accessToken(bool $fresh = false): string
    {
        $cacheKey = 'pinelabs-token:'.md5(config('services.pinelabs.base_url').config('services.pinelabs.client_id'));

        if (! $fresh && ($cached = Cache::get($cacheKey))) {
            return decrypt($cached);
        }

        $response = $this->send(fn (PendingRequest $http) => $http->post('/api/auth/v1/token', [
            'client_id' => config('services.pinelabs.client_id'),
            'client_secret' => config('services.pinelabs.client_secret'),
            'grant_type' => 'client_credentials',
        ]));

        $token = $response->json('access_token') ?? throw new PineLabsException('Pine Labs did not return an access token.');
        $expiresAt = $response->json('expires_at') ? now()->parse($response->json('expires_at')) : now()->addMinutes(30);
        Cache::put($cacheKey, encrypt($token), $expiresAt->subMinute());

        return $token;
    }

    /**
     * Create a hosted checkout for an order. Amounts go to Pine Labs in paise.
     *
     * @return array{order_id: string, redirect_url: string}
     */
    public function createCheckout(Order $order, string $callbackUrl): array
    {
        $digits = preg_replace('/\D/', '', $order->customer_phone);

        $response = $this->send(fn (PendingRequest $http) => $http->withToken($this->accessToken())->post('/api/checkout/v1/orders', [
            'merchant_order_reference' => $order->reference.'-'.Str::lower(Str::random(6)),
            'order_amount' => ['value' => $order->amount * 100, 'currency' => 'INR'],
            'callback_url' => $callbackUrl,
            'failure_callback_url' => $callbackUrl,
            'purchase_details' => [
                'customer' => [
                    'first_name' => Str::before($order->customer_name, ' '),
                    'last_name' => Str::after($order->customer_name, ' ') ?: null,
                    'mobile_number' => Str::substr($digits, -10),
                    'country_code' => '91',
                ],
            ],
        ]));

        $orderId = $response->json('order_id');
        $redirectUrl = $response->json('redirect_url');

        if (! $orderId || ! $redirectUrl) {
            throw new PineLabsException('Pine Labs did not return a checkout link.');
        }

        return ['order_id' => $orderId, 'redirect_url' => $redirectUrl];
    }

    /**
     * The current Pine Labs status of an order, e.g. CREATED, PENDING, PROCESSED, AUTHORIZED, FAILED, CANCELLED.
     */
    public function orderStatus(string $pineLabsOrderId): string
    {
        $response = $this->send(fn (PendingRequest $http) => $http->withToken($this->accessToken())->get('/api/pay/v1/orders/'.rawurlencode($pineLabsOrderId)));

        return $response->json('data.status') ?? throw new PineLabsException('Pine Labs returned an order without a status.');
    }

    /**
     * @param  callable(PendingRequest): Response  $call
     */
    private function send(callable $call): Response
    {
        $http = Http::baseUrl(rtrim((string) config('services.pinelabs.base_url'), '/'))
            ->acceptJson()
            ->asJson()
            ->timeout(20)
            ->withHeaders([
                'Request-ID' => (string) Str::uuid(),
                'Request-Timestamp' => now('UTC')->format('Y-m-d\TH:i:s.v\Z'),
            ]);

        try {
            $response = $call($http);
        } catch (ConnectionException) {
            throw new PineLabsException('Could not reach Pine Labs at '.config('services.pinelabs.base_url').'.');
        }

        if ($response->failed()) {
            $reason = $response->json('message') ?? $response->json('error_message') ?? $response->json('response_message') ?? $response->reason();

            throw new PineLabsException("Pine Labs returned HTTP {$response->status()}: {$reason}");
        }

        return $response;
    }
}
