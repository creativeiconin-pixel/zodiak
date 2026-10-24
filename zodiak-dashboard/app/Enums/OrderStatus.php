<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PaymentPending = 'payment_pending';
    case PaymentFailed = 'payment_failed';
    case AwaitingApproval = 'awaiting_approval';
    case TrialHold = 'trial_hold';
    case Approved = 'approved';
    case Consecrated = 'consecrated';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PaymentPending => 'Waiting for Payment',
            self::PaymentFailed => 'Payment Failed',
            self::AwaitingApproval => 'Awaiting Approval',
            self::TrialHold => 'Special Trial Hold',
            self::Approved => 'Approved • Consecrating',
            self::Consecrated => 'Consecrated',
            self::Shipped => 'Shipped',
            self::Delivered => 'Delivered',
            self::Rejected => 'Rejected • Refunded',
        };
    }

    /**
     * Whether a pandit still has to approve or reject the order.
     */
    public function isAwaitingReview(): bool
    {
        return in_array($this, [self::AwaitingApproval, self::TrialHold], true);
    }

    /**
     * The status the order moves to on its next fulfilment step, if any.
     */
    public function nextFulfilmentStatus(): ?self
    {
        return match ($this) {
            self::Approved => self::Consecrated,
            self::Consecrated => self::Shipped,
            self::Shipped => self::Delivered,
            default => null,
        };
    }

    /**
     * The active step (1-5) of the seeker-facing consecration journey; 6 once delivered.
     */
    public function journeyStep(): int
    {
        return match ($this) {
            self::PaymentPending, self::PaymentFailed => 1,
            self::AwaitingApproval, self::TrialHold, self::Rejected => 2,
            self::Approved => 3,
            self::Consecrated => 4,
            self::Shipped => 5,
            self::Delivered => 6,
        };
    }
}
