<?php

namespace Database\Factories;

use App\Models\Remedy;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Remedy>
 */
class RemedyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'slug' => Str::slug($name),
            'name' => Str::title($name),
            'category' => fake()->randomElement(['gemstones', 'rudraksha', 'yantras', 'kavach']),
            'tagline' => 'Ratna Vidya Verified',
            'origin' => 'Origin: '.fake()->country(),
            'image' => '/images/yellow-sapphire-ring.jpg',
            'image_alt' => $name,
            'accent' => 'primary',
            'badge' => null,
            'planet' => ['icon' => 'explore', 'label' => 'Brihaspati • Jupiter'],
            'benefits' => [['icon' => 'trending_up', 'label' => 'Career Breakthroughs']],
            'assurance' => ['icon' => 'verified', 'label' => 'Govt Lab Certified'],
            'price' => fake()->numberBetween(1000, 50000),
            'compare_at_price' => null,
            'price_detail' => null,
            'price_note' => 'Inc. Pooja & Astrological Box',
            'specification' => '18k Gold • 4.25 Ratti',
            'sort_order' => 0,
        ];
    }
}
