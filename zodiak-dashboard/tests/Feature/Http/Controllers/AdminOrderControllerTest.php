<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected(): void
    {
        $this->get(route('orders.index'))->assertRedirect(route('login'));
    }

    public function test_lists_and_filters_orders(): void
    {
        Order::factory()->create(['customer_name' => 'Ananya Sharma']);
        Order::factory()->approved()->create(['customer_name' => 'Priya Iyer']);

        $admin = User::factory()->create();
        $this->actingAs($admin)->get(route('orders.index'))->assertOk()->assertSee('Ananya Sharma')->assertSee('Priya Iyer');
        $this->actingAs($admin)->get(route('orders.index', ['status' => OrderStatus::Approved->value]))->assertSee('Priya Iyer')->assertDontSee('Ananya Sharma');
        $this->actingAs($admin)->get(route('orders.index', ['q' => 'ananya']))->assertSee('Ananya Sharma')->assertDontSee('Priya Iyer');
    }

    public function test_order_detail_shows_payment_and_customer(): void
    {
        $order = Order::factory()->create(['customer_name' => 'Rahul M.', 'payment_utr' => '111122223333']);

        $this->actingAs(User::factory()->create())->get(route('orders.show', $order))->assertOk()->assertSee('Rahul M.')->assertSee('111122223333');
    }

    public function test_orders_list_shows_the_submitted_utr_with_a_check_button(): void
    {
        $order = Order::factory()->utrSubmitted('412356789012')->create();

        $this->actingAs(User::factory()->create())
            ->get(route('orders.index'))
            ->assertOk()
            ->assertSee('UTR 412356789012')
            ->assertSee('UTR received — check payment')
            ->assertSee('Check UTR')
            ->assertSee(route('orders.show', $order), escape: false);
    }

    public function test_payments_nav_badge_counts_utrs_waiting_for_a_check(): void
    {
        Order::factory()->utrSubmitted('412356789012')->create();
        Order::factory()->utrSubmitted('412356789013')->create();
        Order::factory()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('orders.index'))
            ->assertOk()
            ->assertSee('2 UTR payments to check');
    }
}
