<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PineLabsCallbackControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.pinelabs.base_url' => 'https://pluraluat.v2.pinepg.in',
            'services.pinelabs.client_id' => 'cid',
            'services.pinelabs.client_secret' => 'secret',
            'app.frontend_url' => 'http://localhost:5173',
        ]);
    }

    private function pendingOrder(): Order
    {
        return Order::factory()->create([
            'status' => OrderStatus::PaymentPending,
            'payment_status' => PaymentStatus::AwaitingPayment,
            'payment_gateway' => 'pinelabs',
            'payment_reference' => 'v1-pl-order-1',
        ]);
    }

    private function fakePineLabs(string $status): void
    {
        Http::fake([
            '*/api/auth/v1/token' => Http::response(['access_token' => 'tok', 'expires_at' => now()->addHour()->toIso8601String()]),
            '*/api/pay/v1/orders/*' => Http::response(['data' => ['status' => $status]]),
        ]);
    }

    public function test_checkout_with_pinelabs_returns_a_checkout_url_and_waits_for_payment(): void
    {
        $remedy = Remedy::factory()->create(['price' => 14999]);
        Http::fake([
            '*/api/auth/v1/token' => Http::response(['access_token' => 'tok', 'expires_at' => now()->addHour()->toIso8601String()]),
            '*/api/checkout/v1/orders' => Http::response(['order_id' => 'v1-pl-123', 'redirect_url' => 'https://pay.example/checkout?token=x']),
        ]);

        $this->postJson('/api/v1/orders', [
            'remedy' => $remedy->slug,
            'customer_name' => 'Ananya Sharma',
            'customer_phone' => '+91 98765 43210',
            'address_line' => 'Flat 402',
            'city_postal' => 'Bengaluru',
        ])->assertCreated()->assertJsonPath('checkout_url', 'https://pay.example/checkout?token=x')->assertJsonPath('data.status', 'payment_pending');

        $order = Order::sole();
        $this->assertSame('v1-pl-123', $order->payment_reference);
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/api/checkout/v1/orders') && $request['order_amount']['value'] === 1499900);
        $this->assertSame(0, Order::awaitingReview()->count());
    }

    public function test_paid_order_moves_to_pandit_review_and_redirects_with_success(): void
    {
        $order = $this->pendingOrder();
        $this->fakePineLabs('PROCESSED');

        $this->post(route('payments.pinelabs.callback', $order), ['status' => 'FAILED'])
            ->assertRedirect("http://localhost:5173/orders/{$order->reference}?payment=success");

        $this->assertSame(OrderStatus::AwaitingApproval, $order->fresh()->status);
        $this->assertSame(PaymentStatus::EscrowHeld, $order->fresh()->payment_status);
    }

    public function test_failed_payment_is_marked_failed(): void
    {
        $order = $this->pendingOrder();
        $this->fakePineLabs('FAILED');

        $this->get(route('payments.pinelabs.callback', $order))
            ->assertRedirect("http://localhost:5173/orders/{$order->reference}?payment=failed");

        $this->assertSame(OrderStatus::PaymentFailed, $order->fresh()->status);
    }

    public function test_rejecting_a_paid_pinelabs_order_marks_refund_pending(): void
    {
        $order = Order::factory()->create(['payment_gateway' => 'pinelabs']);

        $this->actingAs(User::factory()->create())
            ->post(route('orders.review.store', $order), ['decision' => 'reject']);

        $this->assertSame(PaymentStatus::RefundPending, $order->fresh()->payment_status);
    }
}
