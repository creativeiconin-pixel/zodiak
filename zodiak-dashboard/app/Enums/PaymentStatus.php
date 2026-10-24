<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case AwaitingPayment = 'awaiting_payment';
    case VerificationPending = 'verification_pending';
    case Failed = 'failed';
    case EscrowHeld = 'escrow_held';
    case Captured = 'captured';
    case RefundPending = 'refund_pending';
    case Refunded = 'refunded';
}
