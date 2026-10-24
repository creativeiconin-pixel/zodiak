<?php

namespace Tests\Feature\Http\Controllers\Api\V1;

use App\Models\Seeker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BirthDetailsControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function payload(array $birthOverrides = []): array
    {
        return [
            'name' => 'Ananya Sharma',
            'gender' => 'female',
            'birth' => [
                'date' => '1996-10-14',
                'time' => '06:42',
                'time_unknown' => false,
                'place' => 'New Delhi, Delhi, India',
                'latitude' => 28.6139,
                'longitude' => 77.209,
                'timezone' => 'Asia/Kolkata',
                ...$birthOverrides,
            ],
            'chart' => [
                'lagna' => 'Tula (Libra)',
                'moon_sign' => 'Mesha (Aries)',
                'sun_sign' => 'Kanya (Virgo)',
                'nakshatra' => 'Swati',
                'mahadasha' => 'Jupiter',
                'antardasha' => 'Rahu',
            ],
        ];
    }

    public function test_returns_401_when_signed_out(): void
    {
        $this->putJson('/api/v1/me/birth-details', $this->payload())->assertUnauthorized();
    }

    public function test_saves_birth_details_and_chart_summary(): void
    {
        $seeker = Seeker::factory()->create();

        $this->actingAs($seeker, 'sanctum')
            ->putJson('/api/v1/me/birth-details', $this->payload())
            ->assertOk()
            ->assertJsonPath('data.birth.time', '06:42')
            ->assertJsonPath('data.chart.lagna', 'Tula (Libra)');

        $seeker->refresh();
        $this->assertSame('1996-10-14', $seeker->birth_date->format('Y-m-d'));
        $this->assertSame('Asia/Kolkata', $seeker->birth_timezone);
    }

    public function test_unknown_birth_time_is_stored_without_a_time(): void
    {
        $seeker = Seeker::factory()->create();

        $this->actingAs($seeker, 'sanctum')
            ->putJson('/api/v1/me/birth-details', $this->payload(['time' => null, 'time_unknown' => true]))
            ->assertOk()
            ->assertJsonPath('data.birth.time', null)
            ->assertJsonPath('data.birth.time_unknown', true);
    }

    public function test_missing_time_returns_422_with_guidance(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->putJson('/api/v1/me/birth-details', $this->payload(['time' => null]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['birth.time' => 'Enter your birth time, or tick "I do not know my exact birth time".']);
    }

    public function test_invalid_timezone_returns_422(): void
    {
        $this->actingAs(Seeker::factory()->create(), 'sanctum')
            ->putJson('/api/v1/me/birth-details', $this->payload(['timezone' => 'Mars/Olympus']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['birth.timezone']);
    }
}
