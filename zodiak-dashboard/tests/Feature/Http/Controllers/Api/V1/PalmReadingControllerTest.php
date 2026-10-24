<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Actions\ReadPalm;
use App\Models\PalmReading;
use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class PalmReadingControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function reading(array $overrides = []): array
    {
        $line = ['present' => true, 'look' => 'A long, deep curve.', 'meaning' => 'This often shows strong energy for big changes.'];

        return [
            'status' => 'reading',
            'retake_reason' => '',
            'retake_tip' => '',
            'summary' => 'Your palm suggests steady energy and a kind heart.',
            'lines' => ['life' => $line, 'head' => $line, 'heart' => $line, 'fate' => [...$line, 'present' => false]],
            'mounts' => [
                ['mount' => 'jupiter', 'strength' => 'strong', 'meaning' => 'Traditionally linked with leading others.'],
                ['mount' => 'venus', 'strength' => 'medium', 'meaning' => 'Traditionally linked with warmth.'],
            ],
            'tip' => 'Write down one goal for this week.',
            'confidence' => 'moderate',
            ...$overrides,
        ];
    }

    private function fakePalmReader(?array $reading): void
    {
        $this->mock(ReadPalm::class, function (MockInterface $mock) use ($reading): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldReceive('read')->andReturn($reading);
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return ['image' => UploadedFile::fake()->image('palm.jpg', 800, 1000), 'hand' => 'right', ...$overrides];
    }

    public function test_returns_401_when_signed_out(): void
    {
        $this->postJson('/api/v1/palm-readings', $this->payload())->assertUnauthorized();
        $this->getJson('/api/v1/palm-readings')->assertUnauthorized();
    }

    public function test_missing_image_and_bad_hand_return_422(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/palm-readings', ['hand' => 'middle'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image', 'hand']);
    }

    public function test_non_image_upload_returns_422(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/palm-readings', $this->payload(['image' => UploadedFile::fake()->create('palm.pdf', 100, 'application/pdf')]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_photo_over_8mb_returns_422(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/palm-readings', $this->payload(['image' => UploadedFile::fake()->image('palm.jpg')->size(9000)]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_returns_503_when_the_ai_is_not_configured(): void
    {
        config(['services.anthropic.key' => null, 'services.gemini.key' => null]);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/palm-readings', $this->payload())
            ->assertServiceUnavailable()
            ->assertJsonPath('message', 'The AI palm reader is not switched on yet. Please try again later.');
    }

    public function test_not_configured_message_follows_the_seekers_language(): void
    {
        config(['services.anthropic.key' => null, 'services.gemini.key' => null]);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->withHeader('X-Locale', 'kn')
            ->postJson('/api/v1/palm-readings', $this->payload())
            ->assertServiceUnavailable()
            ->assertJsonPath('message', 'AI ಹಸ್ತರೇಖೆ ಓದುಗ ಇನ್ನೂ ಆನ್ ಆಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.');
    }

    public function test_reading_is_stored_and_returned_without_keeping_the_photo(): void
    {
        Storage::fake('local');
        Storage::fake('public');
        $seeker = Seeker::factory()->create();
        $this->fakePalmReader($this->reading());

        $this->actingAs($seeker, 'sanctum')
            ->withHeader('X-Locale', 'hinglish')
            ->postJson('/api/v1/palm-readings', $this->payload(['chart_summary' => 'Lagna Leo, Moon in Rohini.']))
            ->assertCreated()
            ->assertJsonPath('data.status', 'reading')
            ->assertJsonPath('data.hand', 'right')
            ->assertJsonPath('data.lines.fate.present', false)
            ->assertJsonPath('data.mounts.0.mount', 'jupiter')
            ->assertJsonPath('data.tip', 'Write down one goal for this week.')
            ->assertJsonPath('data.confidence', 'moderate');

        $reading = PalmReading::sole();
        $this->assertTrue($reading->seeker->is($seeker));
        $this->assertSame('hinglish', $reading->locale);
        $this->assertSame('Your palm suggests steady energy and a kind heart.', $reading->result['summary']);
        $this->assertArrayNotHasKey('status', $reading->result);
        $this->assertSame([], Storage::disk('local')->allFiles());
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_photo_is_sent_to_the_ai_as_a_jpeg_with_the_seekers_language(): void
    {
        $this->mock(ReadPalm::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturnTrue();
            $mock->shouldReceive('read')
                ->once()
                ->with(
                    Mockery::on(fn (array $system) => str_contains($system[1]['text'], 'Kannada script')),
                    Mockery::type('string'),
                    'image/jpeg',
                    Mockery::on(fn (string $prompt) => str_contains($prompt, 'left hand')),
                    Mockery::type('array'),
                )
                ->andReturn($this->reading());
        });

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->withHeader('X-Locale', 'kn')
            ->postJson('/api/v1/palm-readings', $this->payload(['image' => UploadedFile::fake()->image('palm.png', 600, 800), 'hand' => 'left']))
            ->assertCreated();
    }

    public function test_unclear_photo_asks_for_a_retake_and_stores_nothing(): void
    {
        $this->fakePalmReader($this->reading(['status' => 'retake', 'retake_reason' => 'too_dark', 'retake_tip' => 'Stand near a window and try again.', 'mounts' => []]));

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->postJson('/api/v1/palm-readings', $this->payload())
            ->assertOk()
            ->assertJsonPath('data.status', 'retake')
            ->assertJsonPath('data.retake_reason', 'too_dark')
            ->assertJsonPath('data.retake_tip', 'Stand near a window and try again.');

        $this->assertDatabaseCount('palm_readings', 0);
    }

    public function test_declined_reading_becomes_a_friendly_retake(): void
    {
        $this->fakePalmReader(null);

        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->withHeader('X-Locale', 'hi')
            ->postJson('/api/v1/palm-readings', $this->payload())
            ->assertOk()
            ->assertJsonPath('data.status', 'retake')
            ->assertJsonPath('data.retake_reason', 'unclear')
            ->assertJsonPath('data.retake_tip', 'हम यह फ़ोटो नहीं पढ़ पाए। कृपया खुली हथेली की साफ़ फ़ोटो लें।');

        $this->assertDatabaseCount('palm_readings', 0);
    }

    public function test_history_lists_only_the_seekers_latest_readings(): void
    {
        $seeker = Seeker::factory()->create();
        $readings = PalmReading::factory()->count(6)->for($seeker)->create();
        PalmReading::factory()->create();

        $this->actingAs($seeker, 'sanctum')
            ->getJson('/api/v1/palm-readings')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('data.0.id', $readings->last()->id)
            ->assertJsonPath('data.0.status', 'reading');
    }
}
