<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $order = Order::factory()->create();

        $this->post(route('orders.review.store', $order), ['decision' => 'approve'])->assertRedirect(route('login'));

        $this->assertSame(OrderStatus::AwaitingApproval, $order->fresh()->status);
    }

    public function test_approval_captures_payment_and_records_the_reviewer(): void
    {
        $pandit = User::factory()->create(['name' => 'Pandit Vidyadhar Shastri']);
        $order = Order::factory()->create();

        $this->actingAs($pandit)
            ->post(route('orders.review.store', $order), ['decision' => 'approve'])
            ->assertRedirect()
            ->assertSessionHas('status', "#{$order->reference}: Approved • Consecrating");

        $order->refresh();
        $this->assertSame(OrderStatus::Approved, $order->status);
        $this->assertSame(PaymentStatus::Captured, $order->payment_status);
        $this->assertTrue($order->reviewer->is($pandit));
        $this->assertSame('Pandit Vidyadhar Shastri', AuditLog::sole()->actor_name);
        $this->assertSame("#{$order->reference}", AuditLog::sole()->reference_token);
    }

    public function test_rejection_refunds_the_escrowed_payment(): void
    {
        $order = Order::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.review.store', $order), ['decision' => 'reject'])
            ->assertRedirect();

        $order->refresh();
        $this->assertSame(OrderStatus::Rejected, $order->status);
        $this->assertSame(PaymentStatus::Refunded, $order->payment_status);
    }

    public function test_trial_keeps_the_payment_in_escrow(): void
    {
        $order = Order::factory()->highRisk()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.review.store', $order), ['decision' => 'trial'])
            ->assertRedirect();

        $order->refresh();
        $this->assertSame(OrderStatus::TrialHold, $order->status);
        $this->assertSame(PaymentStatus::EscrowHeld, $order->payment_status);
    }

    public function test_already_reviewed_order_cannot_be_reviewed_again(): void
    {
        $order = Order::factory()->approved()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.review.store', $order), ['decision' => 'reject'])
            ->assertSessionHasErrors(['decision' => 'This order has already been reviewed.']);

        $this->assertSame(OrderStatus::Approved, $order->fresh()->status);
        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_unknown_decision_is_rejected(): void
    {
        $order = Order::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.review.store', $order), ['decision' => 'maybe'])
            ->assertSessionHasErrors(['decision' => 'The selected decision is invalid.']);
    }
}
