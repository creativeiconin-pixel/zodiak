<?php

namespace Database\Factories;

use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RemedyKnowledge>
 */
class RemedyKnowledgeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'remedy_id' => Remedy::factory(),
            'planets' => ['Jupiter'],
            'good_signs' => ['Sagittarius', 'Pisces'],
            'avoid_signs' => ['Taurus', 'Libra'],
            'best_for' => 'Growth in work and wisdom.',
            'suits_charts' => 'Sagittarius and Pisces rising; Jupiter mahadasha.',
            'avoid_when' => 'Taurus and Libra rising.',
            'how_to_use' => 'Gold ring on the index finger, from a Thursday morning.',
            'notes' => null,
        ];
    }
}
