<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatReviewTest extends TestCase
{
    use RefreshDatabase;

    private function reply(Seeker $seeker, ?string $remedySlug = null, array $attributes = []): ChatMessage
    {
        ChatMessage::factory()->for($seeker)->create(['content' => 'Which stone helps my career?']);

        return ChatMessage::factory()->for($seeker)->create([
            'role' => 'assistant',
            'content' => json_encode(['short_answer' => 'Your Jupiter is strong.', 'practical_step' => 'Pray on Thursdays.']),
            'remedy_slug' => $remedySlug,
            ...$attributes,
        ]);
    }

    public function test_reported_suggestion_is_checked_against_the_knowledge_base_and_hidden_when_it_fails(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'blue-sapphire']);
        RemedyKnowledge::factory()->for($remedy)->create(['good_signs' => ['Taurus', 'Libra'], 'avoid_signs' => ['Aries']]);
        $seeker = Seeker::factory()->create(['chart_details' => ['ascendant' => "Aries 12°00'", 'birth_time_known' => true]]);
        $reply = $this->reply($seeker, 'blue-sapphire');

        $this->actingAs($seeker, 'sanctum')
            ->postJson("/api/v1/ask/messages/{$reply->id}/report", ['reason' => 'My pandit says Neelam is not for me.'])
            ->assertOk()
            ->assertJsonPath('data.remedy', null)
            ->assertJsonPath('data.review.status', 'pending')
            ->assertJsonPath('data.review.reported', true);

        $reply->refresh();
        $this->assertSame('My pandit says Neelam is not for me.', $reply->report_reason);
        $this->assertSame(['The knowledge base says to avoid this product for Aries rising.'], $reply->review_reasons);

        $this->actingAs(User::factory()->create(), 'web')
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertSee(['Pandit Jii Suggestions to Approve', 'Reported by seeker', 'My pandit says Neelam is not for me.', 'avoid this product for Aries rising']);
    }

    public function test_reported_suggestion_that_passes_the_check_stays_visible_while_a_pandit_looks(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'yellow-sapphire']);
        RemedyKnowledge::factory()->for($remedy)->create(['good_signs' => ['Pisces'], 'avoid_signs' => []]);
        $seeker = Seeker::factory()->create(['chart_details' => ['ascendant' => "Pisces 01°00'", 'birth_time_known' => true]]);
        $reply = $this->reply($seeker, 'yellow-sapphire');

        $this->actingAs($seeker, 'sanctum')
            ->postJson("/api/v1/ask/messages/{$reply->id}/report")
            ->assertOk()
            ->assertJsonPath('data.remedy.slug', 'yellow-sapphire')
            ->assertJsonPath('data.review.status', 'pending');
    }

    public function test_seekers_can_only_report_their_own_answers(): void
    {
        $reply = $this->reply(Seeker::factory()->create());

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->postJson("/api/v1/ask/messages/{$reply->id}/report")->assertNotFound();
        $this->assertNull($reply->fresh()->review_status);
    }

    public function test_pandit_approval_shows_the_held_product(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'emerald']);
        $seeker = Seeker::factory()->create();
        $reply = $this->reply($seeker, 'emerald', ['review_status' => ChatMessage::REVIEW_PENDING, 'review_reasons' => ['No guidance yet.']]);
        $pandit = User::factory()->create(['name' => 'Pandit Raghav']);

        $this->actingAs($pandit, 'web')->post("/admin/chat-reviews/{$reply->id}", ['decision' => 'approved'])->assertRedirect();

        $this->assertSame(ChatMessage::REVIEW_APPROVED, $reply->fresh()->review_status);
        $this->assertSame($pandit->id, $reply->fresh()->reviewed_by);
        $this->assertDatabaseHas('audit_logs', ['actor_name' => 'Pandit Raghav', 'action' => 'Approved Pandit Jii Answer']);
        $this->actingAs($seeker, 'sanctum')->getJson('/api/v1/ask')->assertJsonPath('data.1.remedy.slug', $remedy->slug);
    }

    public function test_pandit_can_remove_the_product_with_a_note_for_the_seeker(): void
    {
        Remedy::factory()->create(['slug' => 'red-coral']);
        $seeker = Seeker::factory()->create();
        $reply = $this->reply($seeker, 'red-coral', ['review_status' => ChatMessage::REVIEW_PENDING]);

        $this->actingAs(User::factory()->create(), 'web')
            ->post("/admin/chat-reviews/{$reply->id}", ['decision' => 'removed', 'note' => 'A 5 Mukhi Rudraksha suits you better.'])
            ->assertRedirect();

        $this->actingAs($seeker, 'sanctum')
            ->getJson('/api/v1/ask')
            ->assertJsonPath('data.1.remedy', null)
            ->assertJsonPath('data.1.review.status', 'removed')
            ->assertJsonPath('data.1.review.note', 'A 5 Mukhi Rudraksha suits you better.');
    }

    public function test_an_answer_is_reviewed_only_once(): void
    {
        $reply = $this->reply(Seeker::factory()->create(), null, ['review_status' => ChatMessage::REVIEW_APPROVED]);

        $this->actingAs(User::factory()->create(), 'web')->post("/admin/chat-reviews/{$reply->id}", ['decision' => 'approved'])->assertStatus(409);
    }
}
