<?php

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_credentials_sign_in_and_redirect_to_dashboard(): void
    {
        $user = User::factory()->create(['email' => 'pandit@zodiak.test']);

        $this->post(route('login.store'), ['email' => 'pandit@zodiak.test', 'password' => 'password'])
            ->assertRedirect(route('overview'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_wrong_password_returns_an_error_and_stays_signed_out(): void
    {
        User::factory()->create(['email' => 'pandit@zodiak.test']);

        $this->post(route('login.store'), ['email' => 'pandit@zodiak.test', 'password' => 'wrong'])
            ->assertSessionHasErrors(['email' => 'These credentials do not match our records.']);

        $this->assertGuest();
    }

    public function test_logout_signs_the_user_out(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('logout'))
            ->assertRedirect(route('login'));

        $this->assertGuest();
    }
}
