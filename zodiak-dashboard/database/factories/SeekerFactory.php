<?php

namespace Database\Factories;

use App\Models\Seeker;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Seeker>
 */
class SeekerFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+91'.fake()->unique()->numerify('9#########'),
            'password' => static::$password ??= Hash::make('password'),
            'gender' => fake()->randomElement(['female', 'male']),
            'credits' => 100,
        ];
    }

    /**
     * A seeker who has used up every credit.
     */
    public function withoutCredits(): static
    {
        return $this->state(fn (array $attributes) => ['credits' => 0]);
    }

    /**
     * Give the seeker saved birth details and a computed chart summary.
     */
    public function withBirthChart(): static
    {
        return $this->state(fn (array $attributes) => [
            'birth_date' => '1996-10-14',
            'birth_time' => '06:42',
            'birth_time_unknown' => false,
            'birth_place' => 'New Delhi, Delhi, India',
            'birth_latitude' => 28.6139,
            'birth_longitude' => 77.209,
            'birth_timezone' => 'Asia/Kolkata',
            'chart' => [
                'lagna' => 'Tula (Libra)',
                'moon_sign' => 'Mesha (Aries)',
                'sun_sign' => 'Kanya (Virgo)',
                'nakshatra' => 'Swati',
                'mahadasha' => 'Jupiter',
                'antardasha' => 'Rahu',
            ],
        ]);
    }
}
