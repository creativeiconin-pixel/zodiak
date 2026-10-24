<?php

namespace Database\Factories;

use App\Enums\FlagType;
use App\Models\FlaggedChat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FlaggedChat>
 */
class FlaggedChatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_name' => fake()->firstName().' '.fake()->randomLetter().'.',
            'user_reference' => '#US-'.fake()->numerify('#####'),
            'session_reference' => '#CT-'.fake()->unique()->numerify('####'),
            'flag_type' => FlagType::Health,
            'trigger_label' => 'Severe Depressive Episode Keyword',
            'transit_axis' => 'Rahu-Ketu Transit Axis',
            'summary' => fake()->sentence(16),
            'action_taken' => 'Dispatched mental health helpline widget; astrological output quarantined.',
            'assigned_to' => null,
            'flagged_at' => now(),
            'resolved_at' => null,
        ];
    }

    /**
     * Indicate that a pandit has already closed the escalation.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'resolved_at' => now(),
        ]);
    }
}
