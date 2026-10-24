<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Actions\AskClaude;
use App\Actions\TranscribeVoiceNote;
use App\Models\FlaggedChat;
use App\Models\Order;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Mockery\MockInterface;
use Tests\TestCase;

class AskControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function answer(array $overrides = []): array
    {
        return [
            'kind' => 'reading',
            'short_answer' => 'Your chart suggests steady growth at work this year.',
            'chart_points' => [['placement' => 'Jupiter in 10th house', 'meaning' => 'Traditionally linked with respect at work.']],
            'practical_step' => 'Finish one pending task each morning.',
            'confidence' => 'moderate',
            'remedy_slug' => '',
            'follow_ups' => ['Which month is best?'],
            'safety' => ['flag' => 'none', 'summary' => ''],
            ...$overrides,
        ];
    }

    private function fakeClaude(?array $answer): void
    {
        $this->mock(AskClaude::class, function (MockInterface $mock) use ($answer): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldReceive('answer')->andReturn($answer);
        });
    }

    public function test_returns_401_when_signed_out(): void
    {
        $this->postJson('/api/v1/ask', ['message' => 'Will I get a promotion?'])->assertUnauthorized();
    }

    public function test_answers_and_stores_both_turns(): void
    {
        $seeker = Seeker::factory()->withBirthChart()->create();
        $this->fakeClaude($this->answer());

        $this->actingAs($seeker, 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Will I get a promotion?'])
            ->assertCreated()
            ->assertJsonPath('data.role', 'assistant')
            ->assertJsonPath('data.answer.confidence', 'moderate');

        $this->assertSame(['user', 'assistant'], $seeker->chatMessages()->orderBy('id')->pluck('role')->all());
    }

    public function test_voice_note_is_stored_with_its_transcript_and_waveform(): void
    {
        Storage::fake('local');
        $seeker = Seeker::factory()->create();
        $this->fakeClaude($this->answer());

        $this->actingAs($seeker, 'sanctum')
            ->post('/api/v1/ask', [
                'message' => 'Meri shaadi kab hogi?',
                'audio' => UploadedFile::fake()->create('note.webm', 40, 'audio/webm'),
                'audio_duration_ms' => 4200,
                'waveform' => json_encode([0.2, 0.8, 0.5]),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('question.text', 'Meri shaadi kab hogi?')
            ->assertJsonPath('question.audio.duration_ms', 4200)
            ->assertJsonPath('question.audio.waveform', [0.2, 0.8, 0.5]);

        $note = $seeker->chatMessages()->where('role', 'user')->sole();
        Storage::disk('local')->assertExists($note->audio_path);
    }

    public function test_voice_note_without_words_is_transcribed_on_the_server(): void
    {
        Storage::fake('local');
        $seeker = Seeker::factory()->create();
        $this->fakeClaude($this->answer());
        $this->mock(TranscribeVoiceNote::class, function (MockInterface $mock): void {
            $mock->shouldReceive('handle')->once()->andReturn('मेरी शादी कब होगी?');
        });

        $this->actingAs($seeker, 'sanctum')
            ->post('/api/v1/ask', [
                'audio' => UploadedFile::fake()->create('note.m4a', 40, 'audio/mp4'),
                'audio_duration_ms' => 3000,
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('question.text', 'मेरी शादी कब होगी?');
    }

    public function test_voice_note_with_no_clear_words_asks_to_speak_again_and_costs_nothing(): void
    {
        $seeker = Seeker::factory()->create(['credits' => 5]);
        $this->mock(TranscribeVoiceNote::class, fn (MockInterface $mock) => $mock->shouldReceive('handle')->andReturnNull());

        $this->actingAs($seeker, 'sanctum')
            ->post('/api/v1/ask', ['audio' => UploadedFile::fake()->create('note.webm', 40, 'audio/webm'), 'audio_duration_ms' => 3000], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('audio');

        $this->assertSame(5, $seeker->fresh()->credits);
    }

    public function test_voice_question_gets_an_elevenlabs_voice_reply(): void
    {
        Storage::fake('local');
        config(['services.elevenlabs.key' => 'xi-key', 'services.elevenlabs.voice_id' => 'voice123']);
        Http::fake(['api.elevenlabs.io/*' => Http::response(str_repeat('a', 16000), 200, ['Content-Type' => 'audio/mpeg'])]);
        $this->fakeClaude($this->answer());

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->post('/api/v1/ask', [
                'message' => 'Meri shaadi kab hogi?',
                'audio' => UploadedFile::fake()->create('note.webm', 40, 'audio/webm'),
                'audio_duration_ms' => 4200,
            ], ['Accept' => 'application/json', 'X-Locale' => 'kn'])
            ->assertCreated()
            ->assertJsonPath('data.audio.duration_ms', 2000);

        Http::assertSent(fn ($request) => str_contains($request->url(), '/v1/text-to-speech/voice123') && $request['language_code'] === 'kn' && $request->hasHeader('xi-api-key', 'xi-key'));
    }

    public function test_non_audio_upload_returns_422(): void
    {
        Storage::fake('local');

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->post('/api/v1/ask', [
                'message' => 'Hello',
                'audio' => UploadedFile::fake()->create('note.pdf', 40, 'application/pdf'),
                'audio_duration_ms' => 4200,
            ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['audio']);
    }

    public function test_recommended_remedy_that_matches_the_knowledge_base_is_returned_with_the_answer(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'ceylon-yellow-sapphire-ring']);
        RemedyKnowledge::factory()->for($remedy)->create(['good_signs' => ['Sagittarius', 'Pisces'], 'avoid_signs' => ['Taurus']]);
        $this->fakeClaude($this->answer(['remedy_slug' => 'ceylon-yellow-sapphire-ring']));

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Which stone helps my career?', 'chart' => $this->chart("Pisces 04°10'")])
            ->assertCreated()
            ->assertJsonPath('data.remedy.slug', $remedy->slug)
            ->assertJsonPath('data.review.status', null)
            ->assertJsonPath('data.review.remedy_on_hold', false);
    }

    public function test_suggestion_the_knowledge_base_does_not_back_is_held_for_a_pandit(): void
    {
        $remedy = Remedy::factory()->create(['slug' => 'kashmir-blue-sapphire-neelam']);
        RemedyKnowledge::factory()->for($remedy)->create(['good_signs' => ['Taurus', 'Libra'], 'avoid_signs' => ['Aries']]);
        $this->fakeClaude($this->answer(['remedy_slug' => 'kashmir-blue-sapphire-neelam']));
        $seeker = Seeker::factory()->create();

        // Without a birth time the rising sign is not sure, so nothing filters a sign-specific stone out
        $this->actingAs($seeker, 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Which stone helps my career?', 'chart' => [...$this->chart("Libra 02°00'"), 'birth_time_known' => false]])
            ->assertCreated()
            ->assertJsonPath('data.remedy', null)
            ->assertJsonPath('data.review.status', 'pending')
            ->assertJsonPath('data.review.remedy_on_hold', true);

        $reply = $seeker->chatMessages()->where('role', 'assistant')->sole();
        $this->assertSame('kashmir-blue-sapphire-neelam', $reply->remedy_slug);
        $this->assertStringContainsString('Birth time unknown', $reply->review_reasons[0]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Held Product Suggestion', 'reference_token' => "#CT-{$reply->id}"]);
    }

    public function test_suggestion_without_knowledge_base_guidance_is_held(): void
    {
        Remedy::factory()->create(['slug' => 'new-bracelet']);
        $this->fakeClaude($this->answer(['remedy_slug' => 'new-bracelet']));

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Anything for peace?'])
            ->assertCreated()
            ->assertJsonPath('data.remedy', null)
            ->assertJsonPath('data.review.remedy_on_hold', true);
    }

    /**
     * @return array<string, mixed>
     */
    private function chart(string $ascendant): array
    {
        return ['ascendant' => $ascendant, 'moon_nakshatra' => 'Revati pada 1', 'mahadasha' => 'Jupiter', 'antardasha' => 'Saturn', 'birth_time_known' => true,
            'planets' => [['name' => 'Jupiter', 'sign' => 'Pisces', 'degree' => 8.2, 'house' => 1, 'nakshatra' => 'Uttara Bhadrapada', 'retrograde' => false, 'dignity' => 'Own House']]];
    }

    public function test_ai_safety_flag_escalates_to_the_pandit_dashboard(): void
    {
        $seeker = Seeker::factory()->create(['name' => 'Sneha K.']);
        $this->fakeClaude($this->answer(['safety' => ['flag' => 'legal', 'summary' => 'Wants a guaranteed court verdict.']]));

        $this->actingAs($seeker, 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Will I win my land case for sure?'])
            ->assertCreated()
            ->assertJsonPath('data.is_flagged', true);

        $chat = FlaggedChat::sole();
        $this->assertSame('Sneha K.', $chat->user_name);
        $this->assertSame('Wants a guaranteed court verdict.', $chat->summary);
        $this->assertDatabaseHas('audit_logs', ['action' => 'Auto-Flagged Sensitive Chat', 'reference_token' => $chat->session_reference]);
    }

    public function test_crisis_message_gets_helpline_without_calling_the_ai(): void
    {
        $this->mock(AskClaude::class, fn (MockInterface $mock) => $mock->shouldNotReceive('answer'));

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'I want to end my life'])
            ->assertCreated()
            ->assertJsonPath('data.answer.kind', 'care')
            ->assertJsonPath('data.answer.practical_step', 'Please call Tele-MANAS on 14416. It is free and open day and night. You can also talk to someone you trust today.');

        $this->assertSame('health', FlaggedChat::sole()->flag_type->value);
    }

    public function test_crisis_reply_follows_the_seekers_language(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->withHeader('X-Locale', 'hi')
            ->postJson('/api/v1/ask', ['message' => 'मैं आत्महत्या के बारे में सोच रहा हूँ'])
            ->assertCreated()
            ->assertJsonPath('data.answer.practical_step', 'कृपया Tele-MANAS को 14416 पर फ़ोन करें। यह मुफ़्त है और दिन-रात खुला है। आज किसी भरोसेमंद इंसान से बात भी करें।');
    }

    public function test_returns_503_when_the_ai_is_not_configured(): void
    {
        config(['services.anthropic.key' => null, 'services.gemini.key' => null]);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Will I get a promotion?'])
            ->assertServiceUnavailable()
            ->assertJsonPath('message', 'Pandit Jii is not available yet. Please try again later.');
    }

    public function test_declined_answer_is_stored_as_a_notice(): void
    {
        $this->fakeClaude(null);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Something the model declines'])
            ->assertCreated()
            ->assertJsonPath('data.answer.kind', 'notice');
    }

    public function test_invalid_chart_payload_returns_422(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/ask', ['message' => 'Hi', 'chart' => ['ascendant' => 'Libra', 'planets' => [['name' => 'Sun', 'house' => 13]]]])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['chart.planets.0.house', 'chart.moon_nakshatra']);
    }

    public function test_history_lists_only_the_seekers_messages_in_order(): void
    {
        $seeker = Seeker::factory()->create();
        $seeker->chatMessages()->create(['role' => 'user', 'content' => 'First question']);
        $seeker->chatMessages()->create(['role' => 'assistant', 'content' => json_encode($this->answer())]);
        Seeker::factory()->create()->chatMessages()->create(['role' => 'user', 'content' => 'Someone else']);

        $this->actingAs($seeker, 'sanctum')
            ->getJson('/api/v1/ask')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.text', 'First question')
            ->assertJsonPath('data.1.answer.short_answer', 'Your chart suggests steady growth at work this year.');
    }

    public function test_gemini_answers_with_saved_chart_palm_and_orders_in_context(): void
    {
        config(['services.ai.provider' => 'gemini', 'services.gemini.key' => 'AQ.test', 'services.gemini.model' => 'gemini-flash-latest']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['finishReason' => 'STOP', 'content' => ['parts' => [['text' => json_encode($this->answer())]]]]],
        ])]);
        $seeker = Seeker::factory()->withBirthChart()->create(['chart_details' => ['ascendant' => 'Libra 00°49\'', 'moon_nakshatra' => 'Swati pada 3', 'mahadasha' => 'Saturn', 'antardasha' => 'Ketu', 'planets' => []]]);
        $seeker->palmReadings()->create(['hand' => 'right', 'locale' => 'en', 'result' => ['summary' => 'Strong heart line', 'lines' => ['heart' => ['present' => true, 'meaning' => 'Warm and loyal']]]]);

        // No chart in the request: the saved chart_details must be used
        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'How is my love life?'])->assertCreated();

        Http::assertSent(function ($request) {
            $system = $request['system_instruction']['parts'][0]['text'];

            return str_contains($request->url(), 'models/gemini-flash-latest:generateContent')
                && $request->hasHeader('x-goog-api-key', 'AQ.test')
                && str_contains($system, 'Pandit Jii')
                && str_contains($system, 'Swati pada 3')
                && str_contains($system, 'Warm and loyal')
                && $request['generationConfig']['responseMimeType'] === 'application/json';
        });
    }

    public function test_store_knowledge_and_wearing_steps_reach_pandit_jii(): void
    {
        config(['services.ai.provider' => 'gemini', 'services.gemini.key' => 'AQ.test']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['finishReason' => 'STOP', 'content' => ['parts' => [['text' => json_encode($this->answer())]]]]],
        ])]);
        $knowledge = RemedyKnowledge::factory()->create([
            'remedy_id' => Remedy::factory()->create(['slug' => 'pukhraj-ring']),
            'suits_charts' => 'Sagittarius and Pisces rising.',
            'how_to_use' => 'Gold ring on the index finger, from a Thursday morning.',
        ]);
        $seeker = Seeker::factory()->create();
        Order::factory()->create(['seeker_id' => $seeker->id, 'remedy_id' => $knowledge->remedy_id]);

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Which ring should I wear?'])->assertCreated();

        Http::assertSent(function ($request) {
            $system = $request['system_instruction']['parts'][0]['text'];
            $slugs = $request['generationConfig']['responseJsonSchema']['properties']['remedy_slug']['enum'];

            return str_contains($system, '[pukhraj-ring]')
                && str_contains($system, 'Suits these charts: Sagittarius and Pisces rising.')
                && str_contains($system, 'How to wear')
                && str_contains($system, 'from a Thursday morning')
                && in_array('pukhraj-ring', $slugs, true);
        });
    }

    public function test_pandit_jii_cannot_pick_a_product_avoided_for_the_persons_rising_sign(): void
    {
        config(['services.ai.provider' => 'gemini', 'services.gemini.key' => 'AQ.test']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['finishReason' => 'STOP', 'content' => ['parts' => [['text' => json_encode($this->answer())]]]]],
        ])]);
        RemedyKnowledge::factory()->create(['remedy_id' => Remedy::factory()->create(['slug' => 'pukhraj-ring']), 'avoid_signs' => ['Taurus']]);
        RemedyKnowledge::factory()->create(['remedy_id' => Remedy::factory()->create(['slug' => 'neelam-ring']), 'good_signs' => ['Taurus'], 'avoid_signs' => []]);
        $chart = ['ascendant' => "Taurus 10°00'", 'moon_nakshatra' => 'Rohini pada 2', 'mahadasha' => 'Saturn', 'antardasha' => 'Jupiter', 'birth_time_known' => true,
            'planets' => [['name' => 'Saturn', 'sign' => 'Aquarius', 'degree' => 5.0, 'house' => 10, 'nakshatra' => 'Dhanishta', 'retrograde' => false, 'dignity' => 'Own House']]];

        $this->actingAs(Seeker::factory()->create(), 'sanctum')->postJson('/api/v1/ask', ['message' => 'Which gemstone should I wear?', 'chart' => $chart])->assertCreated();

        Http::assertSent(function ($request) {
            $system = $request['system_instruction']['parts'][0]['text'];
            $slugs = $request['generationConfig']['responseJsonSchema']['properties']['remedy_slug']['enum'];

            return ! in_array('pukhraj-ring', $slugs, true) && in_array('neelam-ring', $slugs, true)
                && ! str_contains($system, '[pukhraj-ring]') && str_contains($system, 'Fit for this person: GOOD');
        });
    }

    public function test_question_with_chart_saves_it_to_the_account(): void
    {
        $this->fakeClaude($this->answer());
        $seeker = Seeker::factory()->create();
        $chart = ['ascendant' => 'Leo 10°00\'', 'moon_nakshatra' => 'Magha pada 1', 'mahadasha' => 'Venus', 'antardasha' => 'Sun', 'planets' => [['name' => 'Sun', 'sign' => 'Leo', 'degree' => 12.5, 'house' => 1, 'nakshatra' => 'Magha', 'retrograde' => false, 'dignity' => 'Own House']]];

        $this->actingAs($seeker, 'sanctum')->postJson('/api/v1/ask', ['message' => 'Hi', 'chart' => $chart])->assertCreated();

        $this->assertSame('Magha pada 1', $seeker->fresh()->chart_details['moon_nakshatra']);
    }
}
