<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Models\Order;
use App\Models\Remedy;
use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeekerOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_only_the_signed_in_seekers_orders(): void
    {
        $seeker = Seeker::factory()->create();
        $mine = Order::factory()->for($seeker)->create();
        Order::factory()->for(Seeker::factory())->create();

        $this->actingAs($seeker, 'sanctum')
            ->getJson('/api/v1/me/orders')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reference', $mine->reference);
    }

    public function test_checkout_while_signed_in_links_the_order_to_the_seeker(): void
    {
        $seeker = Seeker::factory()->create();
        $remedy = Remedy::factory()->create();

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/orders', [
            'remedy' => $remedy->slug,
            'customer_name' => $seeker->name,
            'customer_phone' => '+91 98765 43210',
            'address_line' => 'Flat 402',
            'city_postal' => 'Bengaluru',
        ])->assertCreated();

        $this->assertTrue(Order::sole()->seeker->is($seeker));
    }
}
