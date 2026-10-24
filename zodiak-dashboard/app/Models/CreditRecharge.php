<?php

namespace App\Models;

use App\Enums\RechargeStatus;
use Database\Factories\CreditRechargeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A credit pack the seeker buys by UPI QR. Credits are added once the team matches the UTR.
 */
#[Fillable(['reference', 'seeker_id', 'credits', 'amount', 'status'])]
class CreditRecharge extends Model
{
    /** @use HasFactory<CreditRechargeFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => RechargeStatus::class,
            'credits' => 'integer',
            'amount' => 'integer',
            'payment_submitted_at' => 'datetime',
            'payment_verified_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    /**
     * Generate an unused public recharge reference such as "CR-48213".
     */
    public static function newReference(): string
    {
        do {
            $reference = 'CR-'.random_int(10000, 99999);
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * A recharge can be deleted until its credits have been added to the seeker's balance.
     */
    public function canBeDeleted(): bool
    {
        return $this->status !== RechargeStatus::Credited;
    }

    /**
     * @return BelongsTo<Seeker, $this>
     */
    public function seeker(): BelongsTo
    {
        return $this->belongsTo(Seeker::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function paymentVerifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
    }
}
