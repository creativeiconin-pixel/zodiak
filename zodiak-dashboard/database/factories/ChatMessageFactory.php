<?php

namespace Database\Factories;

use App\Models\ChatMessage;
use App\Models\Seeker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChatMessage>
 */
class ChatMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seeker_id' => Seeker::factory(),
            'role' => 'user',
            'content' => fake()->sentence(),
        ];
    }
}
