<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One line in a seeker's credit history: positive when credits are added, negative when spent.
 */
#[Fillable(['seeker_id', 'amount', 'balance_after', 'reason', 'description', 'credit_recharge_id', 'created_by'])]
class CreditTransaction extends Model
{
    public const SIGNUP_BONUS = 'signup_bonus';

    public const QUESTION = 'question';

    public const PALM_READING = 'palm_reading';

    public const REFUND = 'refund';

    public const RECHARGE = 'recharge';

    public const ADMIN = 'admin';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'balance_after' => 'integer',
        ];
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
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
