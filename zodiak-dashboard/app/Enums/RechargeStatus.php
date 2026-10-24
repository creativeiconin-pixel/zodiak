<?php

namespace App\Enums;

enum RechargeStatus: string
{
    case AwaitingPayment = 'awaiting_payment';
    case VerificationPending = 'verification_pending';
    case Credited = 'credited';
    case Rejected = 'rejected';
}
