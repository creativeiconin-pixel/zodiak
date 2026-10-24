<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PaymentProofController extends Controller
{
    /**
     * The seeker paid by UPI QR and sends the 12-digit UTR so the team can check it against the bank statement.
     */
    public function __invoke(Request $request, Order $order): OrderResource
    {
        $request->merge(['utr' => preg_replace('/\s+/', '', (string) $request->input('utr'))]);
        $validated = $request->validate([
            'utr' => ['required', 'digits:12', Rule::unique('orders', 'payment_utr')->ignore($order->id), Rule::unique('credit_recharges', 'payment_utr')],
        ], [
            'utr.digits' => __('The UTR number has 12 digits. You can find it in your UPI app under the payment details.'),
            'utr.unique' => __('This UTR number is already used for another order.'),
        ]);

        $canSubmit = $order->payment_gateway === 'upi'
            && in_array($order->status, [OrderStatus::PaymentPending, OrderStatus::PaymentFailed], true)
            && in_array($order->payment_status, [PaymentStatus::AwaitingPayment, PaymentStatus::Failed, PaymentStatus::VerificationPending], true);

        if (! $canSubmit) {
            throw ValidationException::withMessages(['utr' => __('This order does not need a payment number.')]);
        }

        $order->forceFill([
            'status' => OrderStatus::PaymentPending,
            'payment_status' => PaymentStatus::VerificationPending,
            'payment_utr' => $validated['utr'],
            'payment_submitted_at' => now(),
            'payment_note' => null,
        ])->save();

        return new OrderResource($order->load('remedy'));
    }
}
