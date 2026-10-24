<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\FlaggedChat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FlaggedChatResolutionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_resolving_closes_the_escalation_and_logs_it(): void
    {
        $chat = FlaggedChat::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('flagged-chats.resolution.store', $chat))
            ->assertRedirect();

        $this->assertNotNull($chat->fresh()->resolved_at);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Resolved Sensitive Chat', 'reference_token' => $chat->session_reference]);
    }

    public function test_returns_409_for_an_already_resolved_escalation(): void
    {
        $chat = FlaggedChat::factory()->resolved()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('flagged-chats.resolution.store', $chat))
            ->assertConflict();
    }
}
