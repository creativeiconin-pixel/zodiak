<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'reference', 'remedy_id', 'seeker_id', 'customer_name', 'customer_phone', 'address_line', 'city_postal', 'lagna', 'nakshatra',
    'gotra', 'amount', 'cost_amount', 'specification', 'status', 'payment_status', 'payment_gateway', 'payment_reference', 'ai_rationale_title',
    'ai_rationale', 'chart_compatibility', 'is_high_risk', 'muhurat',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'amount' => 'integer',
            'chart_compatibility' => 'integer',
            'is_high_risk' => 'boolean',
            'reviewed_at' => 'datetime',
            'consecrated_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cost_amount' => 'integer',
            'payment_submitted_at' => 'datetime',
            'payment_verified_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    /**
     * Generate an unused public order reference such as "ZK-89241".
     */
    public static function newReference(): string
    {
        do {
            $reference = 'ZK-'.random_int(10000, 99999);
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * @return BelongsTo<Remedy, $this>
     */
    public function remedy(): BelongsTo
    {
        return $this->belongsTo(Remedy::class);
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
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function paymentVerifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
    }

    /**
     * Orders whose money has actually reached us (verified UPI, gateway capture, or held for pandit review).
     */
    #[Scope]
    protected function paid(Builder $query): void
    {
        $query->whereIn('payment_status', [PaymentStatus::EscrowHeld, PaymentStatus::Captured, PaymentStatus::RefundPending]);
    }

    /**
     * The seeker paid by UPI and sent a UTR that the team still has to match against the bank statement.
     */
    public function needsPaymentCheck(): bool
    {
        return $this->payment_status === PaymentStatus::VerificationPending;
    }

    /**
     * Status for Op-Center lists: a submitted UTR reads as money to check, not "waiting for payment".
     */
    /**
     * An order (and its payment) can be deleted from the Op-Center unless real money for it is held:
     * unpaid, a UTR waiting or rejected, refunded, or a sandbox test order.
     */
    public function canBeDeleted(): bool
    {
        return $this->payment_gateway === 'sandbox'
            || in_array($this->payment_status, [PaymentStatus::AwaitingPayment, PaymentStatus::VerificationPending, PaymentStatus::Failed, PaymentStatus::Refunded], true);
    }

    public function adminStatusLabel(): string
    {
        return $this->needsPaymentCheck() ? 'UTR received — check payment' : $this->status->label();
    }

    #[Scope]
    protected function awaitingPaymentCheck(Builder $query): void
    {
        $query->where('payment_status', PaymentStatus::VerificationPending);
    }

    #[Scope]
    protected function awaitingReview(Builder $query): void
    {
        $query->whereIn('status', [OrderStatus::AwaitingApproval, OrderStatus::TrialHold]);
    }

    #[Scope]
    protected function inFulfilment(Builder $query): void
    {
        $query->whereIn('status', [OrderStatus::Approved, OrderStatus::Consecrated, OrderStatus::Shipped]);
    }
}
