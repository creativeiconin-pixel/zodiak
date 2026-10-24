<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentVerificationControllerTest extends TestCase
{
    use RefreshDatabase;

    private function submitted(): Order
    {
        return Order::factory()->create([
            'status' => OrderStatus::PaymentPending,
            'payment_status' => PaymentStatus::VerificationPending,
            'payment_gateway' => 'upi',
            'payment_utr' => '412356789012',
            'payment_submitted_at' => now(),
        ]);
    }

    public function test_guest_is_redirected(): void
    {
        $this->post(route('orders.payment-verification.store', $this->submitted()), ['decision' => 'verify'])->assertRedirect(route('login'));
    }

    public function test_verifying_sends_the_order_to_pandit_review(): void
    {
        $admin = User::factory()->create();
        $order = $this->submitted();

        $this->actingAs($admin)->post(route('orders.payment-verification.store', $order), ['decision' => 'verify'])->assertRedirect();

        $order->refresh();
        $this->assertSame(OrderStatus::AwaitingApproval, $order->status);
        $this->assertSame(PaymentStatus::EscrowHeld, $order->payment_status);
        $this->assertTrue($order->paymentVerifier->is($admin));
        $this->assertSame(1, Order::awaitingReview()->count());
        $this->assertDatabaseHas('audit_logs', ['action' => 'UPI Payment Verified']);
    }

    public function test_rejecting_needs_a_reason_and_lets_the_customer_retry(): void
    {
        $order = $this->submitted();
        $admin = User::factory()->create();

        $this->actingAs($admin)->post(route('orders.payment-verification.store', $order), ['decision' => 'reject'])->assertSessionHasErrors('note');

        $this->actingAs($admin)->post(route('orders.payment-verification.store', $order), ['decision' => 'reject', 'note' => 'UTR not in statement']);

        $order->refresh();
        $this->assertSame(OrderStatus::PaymentFailed, $order->status);
        $this->assertSame('UTR not in statement', $order->payment_note);
    }

    public function test_returns_409_when_not_waiting_for_a_check(): void
    {
        $order = Order::factory()->create();

        $this->actingAs(User::factory()->create())->post(route('orders.payment-verification.store', $order), ['decision' => 'verify'])->assertConflict();
    }

    public function test_refund_can_be_recorded(): void
    {
        $order = Order::factory()->create(['payment_status' => PaymentStatus::RefundPending]);

        $this->actingAs(User::factory()->create())->post(route('orders.refund.store', $order), ['refund_reference' => 'UPI 555444333222'])->assertRedirect();

        $this->assertSame(PaymentStatus::Refunded, $order->fresh()->payment_status);
    }

    public function test_payments_page_lists_utrs_to_check(): void
    {
        $order = $this->submitted();

        $this->actingAs(User::factory()->create())->get(route('payments.index'))->assertOk()->assertSee('412356789012')->assertSee("#{$order->reference}");
    }
}
