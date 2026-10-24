<?php

namespace App\Http\Resources;

use App\Actions\PaymentInstructions;
use App\Enums\RechargeStatus;
use App\Models\CreditRecharge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CreditRecharge
 */
class CreditRechargeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $needsPayment = in_array($this->status, [RechargeStatus::AwaitingPayment, RechargeStatus::Rejected], true);

        return [
            'reference' => $this->reference,
            'credits' => $this->credits,
            'amount' => $this->amount,
            'status' => $this->status->value,
            // Same shape as an order's payment fields, so the app can reuse its UPI QR screen
            'payment_status' => match ($this->status) {
                RechargeStatus::AwaitingPayment => 'awaiting_payment',
                RechargeStatus::VerificationPending => 'verification_pending',
                RechargeStatus::Rejected => 'failed',
                RechargeStatus::Credited => 'captured',
            },
            'payment_utr' => $this->payment_utr,
            'payment_note' => $this->payment_note,
            'payment_submitted_at' => $this->payment_submitted_at?->toIso8601String(),
            'upi' => $this->when($needsPayment && filled(config('services.upi.vpa')), fn () => app(PaymentInstructions::class)->upi($this->amount, $this->reference)),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
