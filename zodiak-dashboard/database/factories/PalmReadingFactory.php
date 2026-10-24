<?php

namespace Database\Factories;

use App\Models\PalmReading;
use App\Models\Seeker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PalmReading>
 */
class PalmReadingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $line = fn (string $meaning): array => ['present' => true, 'look' => 'Long and clear.', 'meaning' => $meaning];

        return [
            'seeker_id' => Seeker::factory(),
            'hand' => fake()->randomElement(['left', 'right']),
            'locale' => 'en',
            'result' => [
                'summary' => 'Your palm suggests steady energy and a kind heart.',
                'lines' => [
                    'life' => $line('You have good energy for big changes.'),
                    'head' => $line('You think things through calmly.'),
                    'heart' => $line('You care deeply for your people.'),
                    'fate' => $line('You like steady work and clear goals.'),
                ],
                'mounts' => [
                    ['mount' => 'jupiter', 'strength' => 'strong', 'meaning' => 'Traditionally linked with leading others.'],
                    ['mount' => 'venus', 'strength' => 'medium', 'meaning' => 'Traditionally linked with warmth and love of beauty.'],
                ],
                'tip' => 'Write down one goal for this week.',
                'confidence' => 'moderate',
            ],
        ];
    }
}
