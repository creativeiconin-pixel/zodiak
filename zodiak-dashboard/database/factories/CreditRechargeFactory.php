<?php

namespace Database\Factories;

use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use App\Models\Seeker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CreditRecharge>
 */
class CreditRechargeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'CR-'.fake()->unique()->numberBetween(10000, 99999),
            'seeker_id' => Seeker::factory(),
            'credits' => 120,
            'amount' => 99,
            'status' => RechargeStatus::AwaitingPayment,
        ];
    }

    /**
     * The seeker has paid and sent a UTR that the team still has to check.
     */
    public function submitted(string $utr = '512345678901'): static
    {
        return $this->state(fn (array $attributes) => ['status' => RechargeStatus::VerificationPending])
            ->afterMaking(function (CreditRecharge $recharge) use ($utr) {
                $recharge->forceFill(['payment_utr' => $utr, 'payment_submitted_at' => now()]);
            });
    }
}
