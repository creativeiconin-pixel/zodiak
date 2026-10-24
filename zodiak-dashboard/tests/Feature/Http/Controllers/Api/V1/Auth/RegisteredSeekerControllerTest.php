<?php

namespace Tests\Feature\Http\Controllers\Api\V1\Auth;

use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisteredSeekerControllerTest extends TestCase
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

    public function test_valid_registration_creates_the_seeker_and_returns_201(): void
    {
        $this->postJson('/api/v1/auth/register', ['name' => 'Ananya Sharma', 'email' => 'ananya@example.com', 'password' => 'vedic-secret'])
            ->assertCreated()
            ->assertJsonPath('data.email', 'ananya@example.com');

        $this->assertAuthenticatedAs(Seeker::sole(), 'seeker');
    }

    public function test_duplicate_email_returns_422(): void
    {
        Seeker::factory()->create(['email' => 'ananya@example.com']);

        $this->postJson('/api/v1/auth/register', ['name' => 'Ananya', 'email' => 'ananya@example.com', 'password' => 'vedic-secret'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'The email has already been taken.']);
    }

    public function test_short_password_returns_422(): void
    {
        $this->postJson('/api/v1/auth/register', ['name' => 'Ananya', 'email' => 'ananya@example.com', 'password' => 'short'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password' => 'The password field must be at least 8 characters.']);
    }
}
