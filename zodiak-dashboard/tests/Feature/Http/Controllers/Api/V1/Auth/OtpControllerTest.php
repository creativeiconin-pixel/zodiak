<?php

namespace Tests\Feature\Http\Controllers\Api\V1\Auth;

use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OtpControllerTest extends TestCase
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

    public function test_debug_mode_returns_the_code_with_the_response(): void
    {
        config(['services.otp.debug' => true]);

        $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])
            ->assertOk()
            ->assertJsonStructure(['message', 'debug_code']);
    }

    public function test_returns_503_when_no_sms_provider_and_not_debug(): void
    {
        config(['services.otp.debug' => false, 'services.msg91.auth_key' => null]);

        $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])
            ->assertServiceUnavailable()
            ->assertJsonPath('message', 'Phone sign-in is not available yet. Please sign up with your email.');
    }

    public function test_sends_the_code_by_msg91_without_exposing_it(): void
    {
        config(['services.otp.debug' => false, 'services.msg91.auth_key' => 'msg-key', 'services.msg91.template_id' => 'tpl-1']);
        Http::fake(['control.msg91.com/*' => Http::response(['type' => 'success'])]);

        $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])
            ->assertOk()
            ->assertJsonMissingPath('debug_code');

        Http::assertSent(fn ($request) => $request->hasHeader('authkey', 'msg-key') && str_contains($request->url(), 'mobile=919876543210') && str_contains($request->url(), 'template_id=tpl-1'));
    }

    public function test_returns_502_when_msg91_rejects_the_send(): void
    {
        config(['services.otp.debug' => false, 'services.msg91.auth_key' => 'msg-key', 'services.msg91.template_id' => 'tpl-1']);
        Http::fake(['control.msg91.com/*' => Http::response(['type' => 'error', 'message' => 'Invalid template'], 400)]);

        $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->assertStatus(502);
    }

    public function test_first_sign_in_creates_the_seeker_signs_them_in_and_returns_201(): void
    {
        config(['services.otp.debug' => true]);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->json('debug_code');

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code, 'name' => 'Ananya Sharma'])
            ->assertCreated()
            ->assertJsonPath('data.phone', '+919876543210')
            ->assertJsonPath('data.name', 'Ananya Sharma');

        $this->assertAuthenticatedAs(Seeker::sole(), 'seeker');
    }

    public function test_returning_seeker_signs_in_with_200(): void
    {
        config(['services.otp.debug' => true]);
        $seeker = Seeker::factory()->create(['phone' => '+919876543210']);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->json('debug_code');

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code])
            ->assertOk()
            ->assertJsonPath('data.id', $seeker->id);
    }

    public function test_wrong_code_returns_422_and_stays_signed_out(): void
    {
        config(['services.otp.debug' => true]);
        $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210']);

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => '000000'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['code' => 'That code is incorrect or has expired.']);

        $this->assertGuest('seeker');
    }

    public function test_code_cannot_be_reused(): void
    {
        config(['services.otp.debug' => true]);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->json('debug_code');
        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code])->assertSuccessful();

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code])->assertUnprocessable();
    }

    public function test_seeker_session_does_not_grant_dashboard_access(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'seeker')
            ->get(route('dashboard'))
            ->assertRedirect(route('login'));

        $this->assertSame(0, User::count());
    }

    public function test_login_with_a_number_that_has_no_account_asks_to_sign_up(): void
    {
        config(['services.otp.debug' => true]);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 11111'])->json('debug_code');

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 11111', 'code' => $code, 'intent' => 'login'])
            ->assertJsonValidationErrors('phone');

        $this->assertSame(0, Seeker::count());
    }

    public function test_sign_up_needs_a_name_and_creates_the_account(): void
    {
        config(['services.otp.debug' => true]);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 22222'])->json('debug_code');

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 22222', 'code' => $code, 'intent' => 'signup'])
            ->assertJsonValidationErrors('name');

        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 22222'])->json('debug_code');
        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 22222', 'code' => $code, 'intent' => 'signup', 'name' => 'Meera'])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Meera');
    }

    public function test_sign_up_with_an_existing_number_just_signs_in(): void
    {
        config(['services.otp.debug' => true]);
        Seeker::factory()->create(['phone' => '+919876533333', 'name' => 'Old Name']);
        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 33333'])->json('debug_code');

        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 33333', 'code' => $code, 'intent' => 'signup', 'name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Old Name');
    }
}
