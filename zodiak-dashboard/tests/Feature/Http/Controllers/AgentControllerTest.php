<?php

namespace Tests\Feature\Http\Controllers;

use App\Actions\AskClaude;
use App\Actions\ReadPalm;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Mockery\MockInterface;
use Tests\TestCase;

class AgentControllerTest extends TestCase
{
    use RefreshDatabase;

    private function pause(string $agent): void
    {
        $this->actingAs(User::factory()->create())->put(route('agents.update', $agent), ['state' => 'paused'])->assertRedirect();
    }

    public function test_guests_cannot_see_or_pause_agents(): void
    {
        $this->get(route('agents.index'))->assertRedirect(route('login'));
        $this->put(route('agents.update', 'pandit'), ['state' => 'paused'])->assertRedirect(route('login'));
    }

    public function test_page_shows_the_diagram_and_every_agent(): void
    {
        config(['services.ai.provider' => 'gemini', 'services.gemini.key' => 'AQ.test']);

        $this->actingAs(User::factory()->create())
            ->get(route('agents.index'))
            ->assertOk()
            ->assertSee('How it works')
            ->assertSee(['Pandit Jii', 'Palm reader', 'Voice-note listener', 'Voice replies', 'Outside agents (MCP)'])
            ->assertSee('Pause');
    }

    public function test_pausing_pandit_jii_turns_questions_away_without_taking_credits(): void
    {
        $this->mock(AskClaude::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldNotReceive('answer');
        });
        $this->pause('pandit');
        $this->assertDatabaseHas('audit_logs', ['action' => 'Agent Paused', 'reference_token' => '#AGENT-PANDIT']);

        $seeker = Seeker::factory()->create(['credits' => 5]);
        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Will I get a job?'])
            ->assertStatus(503)
            ->assertJsonPath('code', 'agent_paused');

        $this->assertSame(5, $seeker->fresh()->credits);
        $this->getJson('/api/v1/app-config')->assertJsonPath('data.ai', false);
    }

    public function test_the_safety_net_still_answers_while_pandit_jii_is_paused(): void
    {
        $this->pause('pandit');

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->postJson('/api/v1/ask', ['message' => 'I want to kill myself'])
            ->assertCreated()
            ->assertJsonPath('data.answer.kind', 'care');
    }

    public function test_resuming_lets_pandit_jii_answer_again(): void
    {
        $admin = User::factory()->create();
        $this->pause('pandit');
        $this->actingAs($admin)->put(route('agents.update', 'pandit'), ['state' => 'running'])->assertRedirect();

        $this->mock(AskClaude::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldReceive('answer')->andReturn([
                'kind' => 'reading', 'short_answer' => 'Yes.', 'chart_points' => [], 'practical_step' => 'Walk.', 'confidence' => 'low',
                'remedy_slug' => '', 'follow_ups' => [], 'safety' => ['flag' => 'none', 'summary' => ''],
            ]);
        });

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->postJson('/api/v1/ask', ['message' => 'Will I get a job?'])->assertCreated();
        $this->assertDatabaseHas('audit_logs', ['action' => 'Agent Resumed']);
    }

    public function test_paused_palm_reader_and_mcp_turn_requests_away(): void
    {
        $this->mock(ReadPalm::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldNotReceive('read');
        });
        config(['services.mcp.key' => 'test-mcp-key-0123456789abcdefghijklmnop']);
        $this->pause('palm');
        $this->pause('mcp');

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->post('/api/v1/palm-readings', ['image' => UploadedFile::fake()->image('palm.jpg', 800, 1000), 'hand' => 'right'], ['Accept' => 'application/json'])
            ->assertStatus(503);

        $this->postJson('/api/mcp', ['jsonrpc' => '2.0', 'id' => 1, 'method' => 'ping'], ['Authorization' => 'Bearer test-mcp-key-0123456789abcdefghijklmnop'])
            ->assertStatus(503);
    }

    public function test_unknown_agents_and_states_are_rejected(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->put(route('agents.update', 'nope'), ['state' => 'paused'])->assertNotFound();
        $this->actingAs($admin)->put(route('agents.update', 'pandit'), ['state' => 'off'])->assertSessionHasErrors('state');
    }
}
