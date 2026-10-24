<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use Tests\TestCase;

class AppConfigControllerTest extends TestCase
{
    public function test_reports_sandbox_when_nothing_is_configured(): void
    {
        config(['services.pinelabs.client_id' => null, 'services.anthropic.key' => null, 'services.gemini.key' => null, 'services.elevenlabs.key' => null, 'services.otp.debug' => false, 'services.msg91.auth_key' => null]);

        $this->getJson('/api/v1/app-config')
            ->assertOk()
            ->assertExactJson(['data' => ['payments' => 'sandbox', 'payments_environment' => null, 'ai' => false, 'voice_replies' => false, 'voice_transcription' => false, 'phone_login' => false, 'signup_bonus' => (int) config('services.credits.signup_bonus')]]);
    }

    public function test_reports_live_integrations_without_exposing_keys(): void
    {
        config([
            'services.pinelabs.client_id' => 'cid', 'services.pinelabs.client_secret' => 'top-secret', 'services.pinelabs.environment' => 'uat',
            'services.ai.provider' => 'claude', 'services.anthropic.key' => 'sk-ant-secret', 'services.elevenlabs.key' => 'xi', 'services.elevenlabs.voice_id' => 'v',
        ]);

        $this->getJson('/api/v1/app-config')
            ->assertJsonPath('data.payments', 'pinelabs')
            ->assertJsonPath('data.ai', true)
            ->assertJsonPath('data.voice_replies', true)
            ->assertDontSee('top-secret')
            ->assertDontSee('sk-ant-secret');
    }
}
