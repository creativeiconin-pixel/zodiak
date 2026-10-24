<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentProofControllerTest extends TestCase
{
    use RefreshDatabase;

    private function upiOrder(array $overrides = []): Order
    {
        return Order::factory()->create([
            'status' => OrderStatus::PaymentPending,
            'payment_status' => PaymentStatus::AwaitingPayment,
            'payment_gateway' => 'upi',
            'payment_reference' => null,
            ...$overrides,
        ]);
    }

    public function test_upi_checkout_returns_qr_details(): void
    {
        config(['services.upi.vpa' => 'zodiak@okhdfcbank', 'services.upi.payee_name' => 'Zodiak']);
        $remedy = Remedy::factory()->create(['price' => 2499, 'cost_price' => 900]);

        $response = $this->postJson('/api/v1/orders', [
            'remedy' => $remedy->slug, 'customer_name' => 'Ananya', 'customer_phone' => '+91 98765 43210', 'address_line' => 'Flat 1', 'city_postal' => 'Delhi',
        ])->assertCreated()->assertJsonPath('data.payment_method', 'upi')->assertJsonPath('data.status', 'payment_pending');

        $this->assertStringStartsWith('upi://pay?pa=zodiak%40okhdfcbank', $response->json('data.upi.link'));
        $this->assertStringContainsString('am=2499.00', $response->json('data.upi.link'));
        $this->assertSame(900, Order::sole()->cost_amount);
        $this->assertSame(0, Order::awaitingReview()->count());
    }

    public function test_valid_utr_moves_payment_to_verification(): void
    {
        $order = $this->upiOrder();

        $this->postJson("/api/v1/orders/{$order->reference}/payment-proof", ['utr' => '4123 5678 9012'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'verification_pending')
            ->assertJsonPath('data.payment_utr', '412356789012');
    }

    public function test_utr_must_have_12_digits(): void
    {
        $order = $this->upiOrder();

        $this->postJson("/api/v1/orders/{$order->reference}/payment-proof", ['utr' => '12345'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['utr' => 'The UTR number has 12 digits. You can find it in your UPI app under the payment details.']);
    }

    public function test_utr_cannot_be_reused_for_another_order(): void
    {
        $this->upiOrder(['payment_utr' => '412356789012', 'payment_status' => PaymentStatus::EscrowHeld, 'status' => OrderStatus::AwaitingApproval]);
        $order = $this->upiOrder();

        $this->postJson("/api/v1/orders/{$order->reference}/payment-proof", ['utr' => '412356789012'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['utr' => 'This UTR number is already used for another order.']);
    }

    public function test_rejected_payment_can_be_resubmitted(): void
    {
        $order = $this->upiOrder(['status' => OrderStatus::PaymentFailed, 'payment_status' => PaymentStatus::Failed, 'payment_note' => 'UTR not found']);

        $this->postJson("/api/v1/orders/{$order->reference}/payment-proof", ['utr' => '999988887777'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'verification_pending')
            ->assertJsonPath('data.payment_note', null);
    }

    public function test_paid_order_rejects_new_utr(): void
    {
        $order = $this->upiOrder(['status' => OrderStatus::AwaitingApproval, 'payment_status' => PaymentStatus::EscrowHeld]);

        $this->postJson("/api/v1/orders/{$order->reference}/payment-proof", ['utr' => '999988887777'])->assertUnprocessable();
    }
}
