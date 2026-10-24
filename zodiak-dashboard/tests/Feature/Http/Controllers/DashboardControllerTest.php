<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\FlaggedChat;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_renders_the_review_queue_and_open_escalations(): void
    {
        $order = Order::factory()->create(['customer_name' => 'Ananya Sharma']);
        $chat = FlaggedChat::factory()->create(['user_name' => 'Rahul M.']);
        FlaggedChat::factory()->resolved()->create(['user_name' => 'Closed Seeker']);

        $this->actingAs(User::factory()->create())
            ->get(route('dashboard'))
            ->assertOk()
            ->assertSee("#{$order->reference}")
            ->assertSee('Ananya Sharma')
            ->assertSee($chat->user_name)
            ->assertDontSee('Closed Seeker');
    }

    public function test_search_filters_the_review_queue_by_seeker_name(): void
    {
        Order::factory()->create(['customer_name' => 'Ananya Sharma']);
        Order::factory()->create(['customer_name' => 'Priya Iyer']);

        $this->actingAs(User::factory()->create())
            ->get(route('dashboard', ['q' => 'ananya']))
            ->assertOk()
            ->assertSee('Ananya Sharma')
            ->assertDontSee('Priya Iyer');
    }

    public function test_planet_filter_shows_only_saturnian_remedies(): void
    {
        $saturn = Remedy::factory()->create(['planet' => ['icon' => 'hourglass_top', 'label' => 'Shani • Saturn']]);
        $jupiter = Remedy::factory()->create(['planet' => ['icon' => 'explore', 'label' => 'Brihaspati • Jupiter']]);
        Order::factory()->for($saturn)->create(['customer_name' => 'Vikramaditya Roy']);
        Order::factory()->for($jupiter)->create(['customer_name' => 'Ananya Sharma']);

        $this->actingAs(User::factory()->create())
            ->get(route('dashboard', ['planet' => 'saturnian']))
            ->assertOk()
            ->assertSee('Vikramaditya Roy')
            ->assertDontSee('Ananya Sharma');
    }
}
