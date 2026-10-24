<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Models\ChatMessage;
use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ChatAudioControllerTest extends TestCase
{
    use RefreshDatabase;

    private function voiceNote(Seeker $seeker): ChatMessage
    {
        Storage::fake('local');
        Storage::disk('local')->put('voice-notes/note.webm', 'fake-audio');

        return ChatMessage::factory()->for($seeker)->create(['audio_path' => 'voice-notes/note.webm', 'audio_duration_ms' => 3000]);
    }

    public function test_owner_can_play_their_voice_note(): void
    {
        $seeker = Seeker::factory()->create();
        $note = $this->voiceNote($seeker);

        $response = $this->actingAs($seeker, 'sanctum')->get("/api/v1/ask/messages/{$note->id}/audio");

        $response->assertOk()->assertHeader('Content-Type', 'audio/webm');
        $this->assertSame('fake-audio', file_get_contents($response->baseResponse->getFile()->getPathname()));
    }

    public function test_range_request_gets_partial_content_for_iphone_playback(): void
    {
        $seeker = Seeker::factory()->create();
        $note = $this->voiceNote($seeker);

        $this->actingAs($seeker, 'sanctum')
            ->get("/api/v1/ask/messages/{$note->id}/audio", ['Range' => 'bytes=0-3'])
            ->assertStatus(206)
            ->assertHeader('Content-Range', 'bytes 0-3/10')
            ->assertHeader('Accept-Ranges', 'bytes');
    }

    public function test_ai_voice_reply_is_served_as_mp3(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('voice-notes/reply.mp3', 'fake-mp3');
        $seeker = Seeker::factory()->create();
        $reply = ChatMessage::factory()->for($seeker)->create(['role' => 'assistant', 'audio_path' => 'voice-notes/reply.mp3', 'audio_duration_ms' => 4000]);

        $this->actingAs($seeker, 'sanctum')
            ->get("/api/v1/ask/messages/{$reply->id}/audio")
            ->assertOk()
            ->assertHeader('Content-Type', 'audio/mpeg');
    }

    public function test_missing_audio_file_returns_404(): void
    {
        Storage::fake('local');
        $seeker = Seeker::factory()->create();
        $note = ChatMessage::factory()->for($seeker)->create(['audio_path' => 'voice-notes/gone.webm', 'audio_duration_ms' => 3000]);

        $this->actingAs($seeker, 'sanctum')
            ->getJson("/api/v1/ask/messages/{$note->id}/audio")
            ->assertNotFound();
    }

    public function test_another_seeker_gets_404(): void
    {
        $note = $this->voiceNote(Seeker::factory()->create());

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->getJson("/api/v1/ask/messages/{$note->id}/audio")
            ->assertNotFound();
    }

    public function test_text_message_has_no_audio_and_returns_404(): void
    {
        $seeker = Seeker::factory()->create();
        $message = ChatMessage::factory()->for($seeker)->create();

        $this->actingAs($seeker, 'sanctum')
            ->getJson("/api/v1/ask/messages/{$message->id}/audio")
            ->assertNotFound();
    }
}
