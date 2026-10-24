<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderFulfilmentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_order_advances_to_consecrated(): void
    {
        $order = Order::factory()->approved()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.fulfilment.store', $order))
            ->assertRedirect();

        $order->refresh();
        $this->assertSame(OrderStatus::Consecrated, $order->status);
        $this->assertNotNull($order->consecrated_at);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Consecration Completed', 'reference_token' => "#{$order->reference}"]);
    }

    public function test_returns_409_for_an_order_still_awaiting_review(): void
    {
        $order = Order::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('orders.fulfilment.store', $order))
            ->assertConflict();

        $this->assertSame(OrderStatus::AwaitingApproval, $order->fresh()->status);
    }
}
