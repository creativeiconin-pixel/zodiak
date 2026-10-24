<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete(): void
    {
        $order = Order::factory()->create(['payment_status' => PaymentStatus::AwaitingPayment, 'status' => OrderStatus::PaymentPending]);

        $this->delete(route('orders.destroy', $order))->assertRedirect(route('login'));
        $this->assertModelExists($order);
    }

    public function test_unpaid_or_rejected_order_payments_can_be_deleted_and_are_logged(): void
    {
        $order = Order::factory()->create(['payment_status' => PaymentStatus::Failed, 'status' => OrderStatus::PaymentFailed, 'payment_utr' => '412356789012']);

        $this->actingAs(User::factory()->create())
            ->from(route('payments.index'))
            ->delete(route('orders.destroy', $order))
            ->assertRedirect(route('payments.index'))
            ->assertSessionHas('status');

        $this->assertModelMissing($order);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Order Payment Deleted', 'reference_token' => "#{$order->reference}"]);
    }

    public function test_orders_with_verified_money_are_kept(): void
    {
        $order = Order::factory()->create(['payment_status' => PaymentStatus::EscrowHeld, 'status' => OrderStatus::AwaitingApproval, 'payment_gateway' => 'upi']);

        $this->actingAs(User::factory()->create())
            ->from(route('payments.index'))
            ->delete(route('orders.destroy', $order))
            ->assertSessionHasErrors('delete');

        $this->assertModelExists($order);
    }

    public function test_sandbox_test_orders_can_be_deleted_even_when_marked_paid(): void
    {
        $order = Order::factory()->create(['payment_status' => PaymentStatus::Captured, 'payment_gateway' => 'sandbox']);

        $this->actingAs(User::factory()->create())->delete(route('orders.destroy', $order));

        $this->assertModelMissing($order);
    }

    public function test_recharges_can_be_deleted_until_credited(): void
    {
        $admin = User::factory()->create();
        $waiting = CreditRecharge::factory()->submitted()->create();
        $credited = CreditRecharge::factory()->create(['status' => RechargeStatus::Credited]);

        $this->actingAs($admin)->delete(route('credit-recharges.destroy', $waiting))->assertSessionHas('status');
        $this->actingAs($admin)->delete(route('credit-recharges.destroy', $credited))->assertSessionHasErrors('delete');

        $this->assertModelMissing($waiting);
        $this->assertModelExists($credited);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Credit Recharge Deleted']);
    }

    public function test_payments_page_shows_delete_buttons_and_unpaid_list(): void
    {
        $unpaid = Order::factory()->create(['payment_status' => PaymentStatus::AwaitingPayment, 'status' => OrderStatus::PaymentPending]);

        $this->actingAs(User::factory()->create())
            ->get(route('payments.index'))
            ->assertOk()
            ->assertSee('Not paid yet')
            ->assertSee(route('orders.destroy', $unpaid), false);
    }
}
