<?php

namespace App\Actions;

use App\Models\CreditRecharge;
use App\Models\CreditTransaction;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Seekers pay for Pandit Jii answers and palm readings with credits. Every change goes through here so the
 * balance and the credit history always match, even when two requests arrive at once.
 */
class CreditWallet
{
    public function signupBonus(): int
    {
        return max(0, (int) config('services.credits.signup_bonus'));
    }

    public function questionCost(): int
    {
        return max(0, (int) config('services.credits.per_question'));
    }

    public function palmReadingCost(): int
    {
        return max(0, (int) config('services.credits.per_palm_reading'));
    }

    /**
     * Recharge packs from the "credits=price" list in Integrations, e.g. "50=49, 120=99, 300=199".
     *
     * @return list<array{id: string, credits: int, price: int}>
     */
    public function packs(): array
    {
        $packs = [];

        foreach (explode(',', (string) config('services.credits.packs')) as $pack) {
            if (preg_match('/^\s*(\d+)\s*[=:]\s*(\d+)\s*$/', $pack, $match) && (int) $match[1] > 0 && (int) $match[2] > 0) {
                $packs[] = ['id' => "{$match[1]}-{$match[2]}", 'credits' => (int) $match[1], 'price' => (int) $match[2]];
            }
        }

        usort($packs, fn (array $a, array $b) => $a['price'] <=> $b['price']);

        return $packs;
    }

    /**
     * @return array{id: string, credits: int, price: int}|null
     */
    public function pack(string $id): ?array
    {
        return collect($this->packs())->firstWhere('id', $id);
    }

    /**
     * Give a brand-new seeker their free welcome credits.
     */
    public function grantSignupBonus(Seeker $seeker): int
    {
        $bonus = $this->signupBonus();

        if ($bonus > 0) {
            $this->add($seeker, $bonus, CreditTransaction::SIGNUP_BONUS, 'Free welcome credits');
        }

        return $bonus;
    }

    public function add(Seeker $seeker, int $amount, string $reason, ?string $description = null, ?CreditRecharge $recharge = null, ?User $by = null): CreditTransaction
    {
        return $this->change($seeker, abs($amount), $reason, $description, $recharge, $by);
    }

    /**
     * Take credits for a paid feature. Returns null (and changes nothing) when the balance is too low.
     */
    public function spend(Seeker $seeker, int $amount, string $reason, ?string $description = null): ?CreditTransaction
    {
        if ($amount <= 0) {
            return null;
        }

        return DB::transaction(function () use ($seeker, $amount, $reason, $description): ?CreditTransaction {
            $balance = (int) Seeker::whereKey($seeker->id)->lockForUpdate()->value('credits');

            return $balance < $amount ? null : $this->change($seeker, -$amount, $reason, $description);
        });
    }

    /**
     * Give back credits taken by spend() when the AI could not answer.
     */
    public function refund(Seeker $seeker, ?CreditTransaction $charge, string $description): void
    {
        if ($charge !== null) {
            $this->add($seeker, abs($charge->amount), CreditTransaction::REFUND, $description);
        }
    }

    /**
     * A manual correction from the Op-Center. A removal never takes the balance below zero.
     */
    public function adjust(Seeker $seeker, int $amount, string $description, User $by): CreditTransaction
    {
        return DB::transaction(function () use ($seeker, $amount, $description, $by): CreditTransaction {
            $balance = (int) Seeker::whereKey($seeker->id)->lockForUpdate()->value('credits');

            return $this->change($seeker, max($amount, -$balance), CreditTransaction::ADMIN, $description, by: $by);
        });
    }

    private function change(Seeker $seeker, int $amount, string $reason, ?string $description, ?CreditRecharge $recharge = null, ?User $by = null): CreditTransaction
    {
        return DB::transaction(function () use ($seeker, $amount, $reason, $description, $recharge, $by): CreditTransaction {
            $balance = (int) Seeker::whereKey($seeker->id)->lockForUpdate()->value('credits') + $amount;
            Seeker::whereKey($seeker->id)->update(['credits' => $balance]);
            $seeker->setRawAttributes([...$seeker->getAttributes(), 'credits' => $balance], sync: true);

            return $seeker->creditTransactions()->create([
                'amount' => $amount,
                'balance_after' => $balance,
                'reason' => $reason,
                'description' => $description !== null ? mb_substr($description, 0, 255) : null,
                'credit_recharge_id' => $recharge?->id,
                'created_by' => $by?->id,
            ]);
        });
    }
}
