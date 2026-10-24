<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\PaymentInstructions;
use App\Actions\PineLabsClient;
use App\Actions\SyncPineLabsPayment;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\PineLabsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Remedy;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Place a remedy order. UPI: the seeker pays by QR and submits the UTR for manual checking. Pine Labs: hosted checkout.
     * Sandbox (nothing configured): the order goes straight to pandit review.
     */
    public function store(StoreOrderRequest $request, PaymentInstructions $payments, PineLabsClient $pineLabs): JsonResponse
    {
        $remedy = Remedy::where('slug', $request->validated('remedy'))->firstOrFail();
        $mode = $payments->mode();

        $order = Order::create([
            ...$request->safe()->only(['customer_name', 'customer_phone', 'address_line', 'city_postal', 'lagna', 'nakshatra', 'gotra']),
            'reference' => Order::newReference(),
            'remedy_id' => $remedy->id,
            'seeker_id' => $request->user('sanctum')?->id,
            'amount' => $remedy->price,
            'cost_amount' => $remedy->cost_price,
            'specification' => Str::afterLast($remedy->specification, '• '),
            'status' => $mode === 'sandbox' ? OrderStatus::AwaitingApproval : OrderStatus::PaymentPending,
            'payment_status' => $mode === 'sandbox' ? PaymentStatus::EscrowHeld : PaymentStatus::AwaitingPayment,
            'payment_gateway' => $mode,
            'payment_reference' => $mode === 'sandbox' ? 'PL-SANDBOX-'.Str::upper(Str::random(8)) : null,
        ]);

        $checkoutUrl = null;

        if ($mode === 'pinelabs') {
            try {
                $checkout = $pineLabs->createCheckout($order, route('payments.pinelabs.callback', $order));
            } catch (PineLabsException $exception) {
                Log::error('Pine Labs checkout failed', ['order' => $order->reference, 'error' => $exception->getMessage()]);
                $order->delete();

                return response()->json(['message' => __('Payment could not be started. Please try again in a minute.')], 502);
            }

            $order->forceFill(['payment_reference' => $checkout['order_id']])->save();
            $checkoutUrl = $checkout['redirect_url'];
        }

        return (new OrderResource($order->load('remedy')))
            ->additional(['checkout_url' => $checkoutUrl])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Order $order, SyncPineLabsPayment $syncPineLabsPayment): OrderResource
    {
        $syncPineLabsPayment->handle($order);

        return new OrderResource($order->load(['remedy', 'reviewer']));
    }
}
