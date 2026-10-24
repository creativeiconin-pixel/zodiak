<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Remedy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => fn () => Order::newReference(),
            'remedy_id' => Remedy::factory(),
            'customer_name' => fake()->name(),
            'customer_phone' => '+91 '.fake()->numerify('9#### #####'),
            'address_line' => fake()->streetAddress(),
            'city_postal' => fake()->city().' - '.fake()->numerify('5600##'),
            'lagna' => 'Libra Lagna',
            'nakshatra' => 'Swati Nakshatra (Pada 3)',
            'amount' => fake()->numberBetween(1000, 50000),
            'specification' => '4.25 Ratti',
            'status' => OrderStatus::AwaitingApproval,
            'payment_status' => PaymentStatus::EscrowHeld,
            'payment_reference' => 'PL-'.fake()->numerify('########'),
            'chart_compatibility' => fake()->numberBetween(60, 99),
            'is_high_risk' => false,
        ];
    }

    /**
     * Indicate that a pandit has approved the order and it is being consecrated.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Approved,
            'payment_status' => PaymentStatus::Captured,
        ]);
    }

    /**
     * Indicate that the AI flagged the remedy as risky for the seeker's chart.
     */
    public function highRisk(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_high_risk' => true,
        ]);
    }

    /**
     * The seeker paid by UPI QR and sent a UTR that the team has not checked yet.
     */
    public function utrSubmitted(string $utr = '412356789012'): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::PaymentPending,
            'payment_gateway' => 'upi',
            'payment_status' => PaymentStatus::VerificationPending,
            'payment_utr' => $utr,
            'payment_submitted_at' => now(),
        ]);
    }
}
