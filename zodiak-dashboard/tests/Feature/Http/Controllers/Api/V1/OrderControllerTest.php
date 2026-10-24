<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_checkout_creates_an_escrowed_order_and_returns_201(): void
    {
        $remedy = Remedy::factory()->create(['price' => 14999, 'specification' => '18k Gold • 4.25 Ratti']);

        $response = $this->postJson('/api/v1/orders', [
            'remedy' => $remedy->slug,
            'customer_name' => 'Ananya Sharma',
            'customer_phone' => '+91 98765 43210',
            'address_line' => 'Flat 402, Celestial Heights',
            'city_postal' => 'Bengaluru - 560038',
            'lagna' => 'Libra Lagna',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', OrderStatus::AwaitingApproval->value)
            ->assertJsonPath('data.amount', 14999)
            ->assertJsonPath('data.remedy.slug', $remedy->slug);

        $order = Order::sole();
        $this->assertSame(PaymentStatus::EscrowHeld, $order->payment_status);
        $this->assertSame('4.25 Ratti', $order->specification);
        $this->assertSame($order->reference, $response->json('data.reference'));
    }

    public function test_order_amount_comes_from_the_remedy_not_the_request(): void
    {
        $remedy = Remedy::factory()->create(['price' => 9800]);

        $this->postJson('/api/v1/orders', [
            'remedy' => $remedy->slug,
            'customer_name' => 'Ananya Sharma',
            'customer_phone' => '+91 98765 43210',
            'address_line' => 'Flat 402',
            'city_postal' => 'Bengaluru',
            'amount' => 1,
        ])->assertCreated();

        $this->assertSame(9800, Order::sole()->amount);
    }

    public function test_empty_checkout_returns_422_with_required_field_errors(): void
    {
        $this->postJson('/api/v1/orders', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['remedy', 'customer_name', 'customer_phone', 'address_line', 'city_postal']);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_unknown_remedy_returns_422(): void
    {
        $this->postJson('/api/v1/orders', [
            'remedy' => 'not-a-remedy',
            'customer_name' => 'Ananya Sharma',
            'customer_phone' => '+91 98765 43210',
            'address_line' => 'Flat 402',
            'city_postal' => 'Bengaluru',
        ])->assertUnprocessable()->assertJsonValidationErrors(['remedy' => 'The selected remedy is invalid.']);
    }

    public function test_show_returns_tracking_data_without_contact_details(): void
    {
        $order = Order::factory()->approved()->create();

        $this->getJson("/api/v1/orders/{$order->reference}")
            ->assertOk()
            ->assertJsonPath('data.status', OrderStatus::Approved->value)
            ->assertJsonPath('data.journey_step', 3)
            ->assertJsonMissingPath('data.customer_phone')
            ->assertJsonMissingPath('data.address_line');
    }

    public function test_show_returns_404_for_an_unknown_reference(): void
    {
        $this->getJson('/api/v1/orders/ZK-00000')->assertNotFound();
    }
}
