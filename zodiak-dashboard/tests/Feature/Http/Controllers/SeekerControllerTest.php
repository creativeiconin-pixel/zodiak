<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeekerControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('seekers.index'))->assertRedirect(route('login'));
    }

    public function test_seeker_session_cannot_open_the_users_page(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'seeker')
            ->get(route('seekers.index'))
            ->assertRedirect(route('login'));
    }

    public function test_lists_seekers_with_order_totals(): void
    {
        $seeker = Seeker::factory()->withBirthChart()->create(['name' => 'Ananya Sharma']);
        Order::factory()->for($seeker)->create(['amount' => 14999, 'payment_status' => PaymentStatus::EscrowHeld]);
        Order::factory()->for($seeker)->create(['amount' => 500, 'payment_status' => PaymentStatus::Refunded]);

        $this->actingAs(User::factory()->create())
            ->get(route('seekers.index'))
            ->assertOk()
            ->assertSee('Ananya Sharma')
            ->assertSee('Tula (Libra) Lagna')
            ->assertSee('₹14,999')
            ->assertDontSee('₹15,499');
    }

    public function test_search_filters_by_name_email_or_phone(): void
    {
        Seeker::factory()->create(['name' => 'Ananya Sharma', 'phone' => '+919876543210']);
        Seeker::factory()->create(['name' => 'Priya Iyer', 'phone' => '+919000000000']);

        $this->actingAs(User::factory()->create())
            ->get(route('seekers.index', ['q' => '98765']))
            ->assertSee('Ananya Sharma')
            ->assertDontSee('Priya Iyer');
    }

    public function test_profile_shows_orders_and_questions(): void
    {
        $seeker = Seeker::factory()->create(['name' => 'Rahul M.']);
        $order = Order::factory()->for($seeker)->create();
        $seeker->chatMessages()->create(['role' => 'user', 'content' => 'Will my career grow this year?']);

        $this->actingAs(User::factory()->create())
            ->get(route('seekers.show', $seeker))
            ->assertOk()
            ->assertSee('Rahul M.')
            ->assertSee("#{$order->reference}")
            ->assertSee('Will my career grow this year?');
    }

    public function test_unknown_user_returns_404(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin/users/99999')->assertNotFound();
    }
}
