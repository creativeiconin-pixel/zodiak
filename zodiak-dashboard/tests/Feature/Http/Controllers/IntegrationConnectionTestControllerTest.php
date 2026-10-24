<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class IntegrationConnectionTestControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_agenticorg_rejected_key_is_reported(): void
    {
        config(['services.agenticorg.base_url' => 'https://app.agenticorg.ai', 'services.agenticorg.key' => 'ao_sk_bad']);
        Http::fake(['app.agenticorg.ai/api/v1/agents' => Http::response(['detail' => 'Invalid API key'], 401)]);

        $this->actingAs(User::factory()->create())
            ->post(route('settings.integrations.test', 'agenticorg'))
            ->assertSessionHas('connection_test', ['ok' => false, 'message' => 'The API key was rejected (401: Invalid API key).', 'integration' => 'agenticorg']);

        Http::assertSent(fn (Request $request) => $request->hasHeader('Authorization', 'Bearer ao_sk_bad'));
    }

    public function test_elevenlabs_success_is_reported(): void
    {
        config(['services.elevenlabs.key' => 'xi-good', 'services.elevenlabs.voice_id' => 'voice123']);
        Http::fake(['api.elevenlabs.io/v1/user' => Http::response(['subscription' => ['character_count' => 10, 'character_limit' => 10000]])]);

        $this->actingAs(User::factory()->create())
            ->post(route('settings.integrations.test', 'elevenlabs'))
            ->assertSessionHas('connection_test.ok', true);
    }

    public function test_pinelabs_token_is_generated(): void
    {
        config(['services.pinelabs.base_url' => 'https://pluraluat.v2.pinepg.in', 'services.pinelabs.client_id' => 'cid', 'services.pinelabs.client_secret' => 'secret']);
        Http::fake(['pluraluat.v2.pinepg.in/api/auth/v1/token' => Http::response(['access_token' => 'tok', 'expires_at' => now()->addHour()->toIso8601String()])]);

        $this->actingAs(User::factory()->create())
            ->post(route('settings.integrations.test', 'pinelabs'))
            ->assertSessionHas('connection_test.ok', true);

        Http::assertSent(fn (Request $request) => $request['grant_type'] === 'client_credentials' && $request->hasHeader('Request-ID'));
    }

    public function test_missing_credentials_are_reported_without_a_request(): void
    {
        config(['services.anthropic.key' => null]);
        Http::fake();

        $this->actingAs(User::factory()->create())
            ->post(route('settings.integrations.test', 'anthropic'))
            ->assertSessionHas('connection_test.message', 'No API key saved.');

        Http::assertNothingSent();
    }

    public function test_unknown_integration_returns_404(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('settings.integrations.test', 'nope'))
            ->assertNotFound();
    }
}
