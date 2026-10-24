<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class IntegrationSettingsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('settings.integrations.edit'))->assertRedirect(route('login'));
    }

    public function test_page_lists_every_integration_without_revealing_secrets(): void
    {
        config(['services.anthropic.key' => 'sk-ant-secret-value-1234']);

        $this->actingAs(User::factory()->create())
            ->get(route('settings.integrations.edit'))
            ->assertOk()
            ->assertSee('AgenticOrg')
            ->assertSee('ElevenLabs')
            ->assertSee('Pine Labs Online')
            ->assertSee('•••• 1234')
            ->assertDontSee('sk-ant-secret-value-1234');
    }

    public function test_saving_a_key_encrypts_it_and_applies_it_to_config(): void
    {
        $this->actingAs(User::factory()->create())
            ->put(route('settings.integrations.update'), ['agenticorg__api_key' => 'ao_sk_new_key_9999'])
            ->assertRedirect()
            ->assertSessionHas('status', 'Integration settings saved.');

        $this->assertSame('ao_sk_new_key_9999', Setting::where('key', 'agenticorg.api_key')->sole()->value);
        $this->assertNotSame('ao_sk_new_key_9999', DB::table('settings')->value('value'));
        $this->assertSame('ao_sk_new_key_9999', config('services.agenticorg.key'));
        $this->assertDatabaseHas('audit_logs', ['action' => 'Integration Settings Changed']);
        $this->assertDatabaseMissing('audit_logs', ['outcome' => 'ao_sk_new_key_9999']);
    }

    public function test_empty_secret_field_keeps_the_saved_key(): void
    {
        Setting::create(['key' => 'elevenlabs.api_key', 'value' => 'xi-existing']);

        $this->actingAs(User::factory()->create())
            ->put(route('settings.integrations.update'), ['elevenlabs__api_key' => ''])
            ->assertSessionHas('status', 'Nothing changed.');

        $this->assertSame('xi-existing', Setting::sole()->value);
    }

    public function test_clearing_a_value_falls_back_to_env(): void
    {
        Setting::create(['key' => 'pinelabs.client_id', 'value' => 'dashboard-client']);

        $this->actingAs(User::factory()->create())
            ->put(route('settings.integrations.update'), ['clear' => ['pinelabs.client_id']])
            ->assertSessionHas('status', 'Integration settings saved.');

        $this->assertDatabaseCount('settings', 0);
    }

    public function test_base_url_must_be_https(): void
    {
        $this->actingAs(User::factory()->create())
            ->put(route('settings.integrations.update'), ['pinelabs__base_url' => 'http://insecure.example'])
            ->assertSessionHasErrors('pinelabs__base_url');
    }

    public function test_demo_otp_switch_turns_phone_login_on_and_off(): void
    {
        config(['services.otp.debug' => false]);
        $user = User::factory()->create();

        $this->actingAs($user)->put(route('settings.integrations.update'), ['otp__demo_mode' => '1'])->assertSessionHas('status', 'Integration settings saved.');
        $this->assertTrue(config('services.otp.debug'));
        $this->getJson('/api/v1/app-config')->assertJsonPath('data.phone_login', true);

        $this->actingAs($user)->put(route('settings.integrations.update'), ['otp__demo_mode' => '0']);
        $this->assertFalse(config('services.otp.debug'));
    }
}
