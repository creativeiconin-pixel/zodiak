<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\RechargeStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreditRechargeResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CreditRechargePaymentProofController extends Controller
{
    /**
     * The seeker paid for credits by UPI QR and sends the 12-digit UTR for the team to check.
     */
    public function __invoke(Request $request, string $reference): CreditRechargeResource
    {
        $recharge = $request->user()->creditRecharges()->where('reference', $reference)->firstOrFail();

        $request->merge(['utr' => preg_replace('/\s+/', '', (string) $request->input('utr'))]);
        $validated = $request->validate([
            'utr' => [
                'required',
                'digits:12',
                Rule::unique('credit_recharges', 'payment_utr')->ignore($recharge->id),
                Rule::unique('orders', 'payment_utr'),
            ],
        ], [
            'utr.digits' => __('The UTR number has 12 digits. You can find it in your UPI app under the payment details.'),
            'utr.unique' => __('This UTR number is already used for another payment.'),
        ]);

        if ($recharge->status === RechargeStatus::Credited) {
            throw ValidationException::withMessages(['utr' => __('These credits are already added.')]);
        }

        $recharge->forceFill([
            'status' => RechargeStatus::VerificationPending,
            'payment_utr' => $validated['utr'],
            'payment_submitted_at' => now(),
            'payment_note' => null,
        ])->save();

        return new CreditRechargeResource($recharge);
    }
}
