<?php

namespace Tests\Feature\Http\Controllers\Api\V1\Auth;

use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeekerSessionControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Sanctum only starts a session for requests coming from the SPA's own origin.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Origin', 'http://localhost:5173');
    }

    public function test_valid_credentials_sign_the_seeker_in(): void
    {
        $seeker = Seeker::factory()->create(['email' => 'ananya@example.com']);

        $this->postJson('/api/v1/auth/login', ['email' => 'ananya@example.com', 'password' => 'password'])
            ->assertOk()
            ->assertJsonPath('data.id', $seeker->id);

        $this->assertAuthenticatedAs($seeker, 'seeker');
    }

    public function test_wrong_password_returns_422(): void
    {
        Seeker::factory()->create(['email' => 'ananya@example.com']);

        $this->postJson('/api/v1/auth/login', ['email' => 'ananya@example.com', 'password' => 'wrong'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'These credentials do not match our records.']);
    }

    public function test_profile_returns_401_when_signed_out(): void
    {
        $this->getJson('/api/v1/me')->assertUnauthorized();
    }

    public function test_profile_returns_the_signed_in_seeker(): void
    {
        $seeker = Seeker::factory()->withBirthChart()->create();

        $this->actingAs($seeker, 'sanctum')
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.birth.timezone', 'Asia/Kolkata')
            ->assertJsonPath('data.chart.nakshatra', 'Swati');
    }
}
