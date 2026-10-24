<?php

namespace Database\Factories;

use App\Enums\ActorType;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'actor_name' => fake()->name(),
            'actor_type' => ActorType::Pandit,
            'action' => 'Approved Remedy',
            'reference_token' => '#ZK-'.fake()->numerify('#####'),
            'outcome' => fake()->sentence(),
            'previous_hash' => null,
            'hash' => hash('sha256', fake()->unique()->uuid()),
            'created_at' => now(),
        ];
    }
}
