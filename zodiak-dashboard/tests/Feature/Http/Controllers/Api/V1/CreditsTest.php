<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Actions\AskClaude;
use App\Actions\ReadPalm;
use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use App\Models\Order;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Mockery\MockInterface;
use RuntimeException;
use Tests\TestCase;

class CreditsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.credits.signup_bonus' => 30,
            'services.credits.per_question' => 1,
            'services.credits.per_palm_reading' => 5,
            'services.credits.packs' => '120=99, 50=49',
            'services.upi.vpa' => 'zodiak@okhdfcbank',
        ]);
    }

    private function fakeAi(mixed $answer): void
    {
        $this->mock(AskClaude::class, function (MockInterface $mock) use ($answer): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $answer instanceof RuntimeException
                ? $mock->shouldReceive('answer')->andThrow($answer)
                : $mock->shouldReceive('answer')->andReturn($answer);
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function answer(): array
    {
        return [
            'kind' => 'reading', 'short_answer' => 'Steady growth.', 'chart_points' => [], 'practical_step' => 'Walk daily.',
            'confidence' => 'moderate', 'remedy_slug' => '', 'follow_ups' => [], 'safety' => ['flag' => 'none', 'summary' => ''],
        ];
    }

    public function test_first_otp_sign_in_gives_welcome_credits_once(): void
    {
        $this->withHeader('Origin', 'http://localhost:5173');
        config(['services.otp.debug' => true]);

        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->json('debug_code');
        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code])
            ->assertCreated()
            ->assertJsonPath('data.credits', 30)
            ->assertJsonPath('welcome_credits', 30);

        $code = $this->postJson('/api/v1/auth/otp', ['phone' => '+91 98765 43210'])->json('debug_code');
        $this->postJson('/api/v1/auth/otp/verify', ['phone' => '+91 98765 43210', 'code' => $code])
            ->assertOk()
            ->assertJsonMissingPath('welcome_credits');

        $seeker = Seeker::sole();
        $this->assertSame(30, $seeker->credits);
        $this->assertSame(1, $seeker->creditTransactions()->count());
    }

    public function test_email_sign_up_gives_welcome_credits(): void
    {
        $this->withHeader('Origin', 'http://localhost:5173');

        $this->postJson('/api/v1/auth/register', ['name' => 'Ravi', 'email' => 'ravi@example.com', 'password' => 'secret-pass-1'])
            ->assertCreated()
            ->assertJsonPath('data.credits', 30);
    }

    public function test_each_answer_costs_one_credit(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 3]);
        $this->fakeAi($this->answer());

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Will I get a job?'])
            ->assertCreated()
            ->assertJsonPath('credits', 2);

        $this->assertDatabaseHas('credit_transactions', ['seeker_id' => $seeker->id, 'amount' => -1, 'balance_after' => 2, 'reason' => 'question']);
    }

    public function test_no_credits_returns_402_without_calling_the_ai(): void
    {
        $seeker = Seeker::factory()->withoutCredits()->create();
        $this->mock(AskClaude::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldNotReceive('answer');
        });

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Will I get a job?'])
            ->assertStatus(402)
            ->assertJsonPath('code', 'no_credits');

        $this->assertSame(0, $seeker->chatMessages()->count());
    }

    public function test_someone_in_distress_is_answered_even_with_no_credits(): void
    {
        $seeker = Seeker::factory()->withoutCredits()->create();

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'I want to kill myself'])
            ->assertCreated()
            ->assertJsonPath('data.answer.kind', 'care');
    }

    public function test_credit_is_given_back_when_the_ai_fails(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 1]);
        $this->fakeAi(new RuntimeException('Gemini is busy'));

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Will I get a job?'])->assertStatus(502);

        $this->assertSame(1, $seeker->fresh()->credits);
    }

    public function test_palm_retake_is_free_and_a_reading_costs_five(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 5]);
        $this->mock(ReadPalm::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldReceive('read')->andReturn(['status' => 'retake', 'retake_reason' => 'blurry', 'retake_tip' => 'Hold still.']);
        });

        $this->actingAs($seeker, 'sanctum')->post('/api/v1/palm-readings', ['image' => UploadedFile::fake()->image('palm.jpg', 800, 1000), 'hand' => 'right'], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('credits', 5);

        $seeker->forceFill(['credits' => 4])->save();
        $this->actingAs($seeker, 'sanctum')->post('/api/v1/palm-readings', ['image' => UploadedFile::fake()->image('palm.jpg', 800, 1000), 'hand' => 'right'], ['Accept' => 'application/json'])
            ->assertStatus(402);
    }

    public function test_wallet_shows_balance_costs_and_packs(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 12]);

        $this->actingAs($seeker, 'sanctum')->getJson('/api/v1/credits')
            ->assertOk()
            ->assertJsonPath('data.balance', 12)
            ->assertJsonPath('data.costs.palm_reading', 5)
            ->assertJsonPath('data.packs.0', ['id' => '50-49', 'credits' => 50, 'price' => 49])
            ->assertJsonPath('data.recharge_available', true);
    }

    public function test_recharge_needs_a_upi_id(): void
    {
        config(['services.upi.vpa' => null]);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->postJson('/api/v1/credit-recharges', ['pack' => '50-49'])->assertStatus(503);
    }

    public function test_full_recharge_flow_adds_credits_once_after_admin_check(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 0]);

        $reference = $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/credit-recharges', ['pack' => '120-99'])
            ->assertCreated()
            ->assertJsonPath('data.amount', 99)
            ->assertJsonPath('data.upi.amount', 99)
            ->json('data.reference');

        $this->actingAs($seeker, 'sanctum')->postJson("/api/v1/credit-recharges/{$reference}/payment-proof", ['utr' => '5123 4567 8901'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'verification_pending');

        // Sanctum's actingAs switched the default guard; the Op-Center uses the web guard
        $this->app['auth']->forgetGuards();
        $this->app['auth']->shouldUse('web');
        $admin = User::factory()->create();
        $recharge = CreditRecharge::sole();
        $this->actingAs($admin)->post(route('credit-recharges.verification.store', $recharge), ['decision' => 'verify'])->assertRedirect();
        $this->actingAs($admin, 'web')->post(route('credit-recharges.verification.store', $recharge), ['decision' => 'verify'])->assertStatus(409);

        $this->assertSame(120, $seeker->fresh()->credits);
        $this->assertSame(RechargeStatus::Credited, $recharge->fresh()->status);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Credit Recharge Verified']);
    }

    public function test_rejected_recharge_can_be_sent_again_with_a_new_utr(): void
    {
        $recharge = CreditRecharge::factory()->submitted()->create();
        $this->actingAs(User::factory()->create())->post(route('credit-recharges.verification.store', $recharge), ['decision' => 'reject', 'note' => 'Not found'])->assertSessionHasNoErrors();
        $this->assertSame(RechargeStatus::Rejected, $recharge->fresh()->status);

        $this->actingAs($recharge->seeker, 'sanctum')->getJson("/api/v1/credit-recharges/{$recharge->reference}")
            ->assertJsonPath('data.payment_status', 'failed')
            ->assertJsonPath('data.payment_note', 'Not found');

        $this->actingAs($recharge->seeker, 'sanctum')->postJson("/api/v1/credit-recharges/{$recharge->reference}/payment-proof", ['utr' => '598765432101'])
            ->assertJsonPath('data.payment_status', 'verification_pending');
    }

    public function test_a_utr_cannot_be_used_for_an_order_and_a_recharge(): void
    {
        Order::factory()->create(['payment_utr' => '512345678901']);
        $recharge = CreditRecharge::factory()->create();

        $this->actingAs($recharge->seeker, 'sanctum')->postJson("/api/v1/credit-recharges/{$recharge->reference}/payment-proof", ['utr' => '512345678901'])
            ->assertJsonValidationErrors('utr');
    }

    public function test_seekers_cannot_see_each_others_recharges(): void
    {
        $recharge = CreditRecharge::factory()->create();

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->getJson("/api/v1/credit-recharges/{$recharge->reference}")->assertNotFound();
    }

    public function test_admin_can_gift_credits_but_not_go_below_zero(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 3]);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post(route('seekers.credits.store', $seeker), ['amount' => 10, 'reason' => 'Diwali gift'])->assertRedirect();
        $this->assertSame(13, $seeker->fresh()->credits);

        $this->actingAs($admin)->post(route('seekers.credits.store', $seeker), ['amount' => -50, 'reason' => 'Mistake'])->assertRedirect();
        $this->assertSame(0, $seeker->fresh()->credits);
    }
}
