<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

class RefundController extends Controller
{
    /**
     * Record that the money for a rejected order was sent back to the customer (by UPI or bank, outside the app).
     */
    public function __invoke(Request $request, Order $order, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $validated = $request->validate(['refund_reference' => ['required', 'string', 'max:64']]);

        abort_unless($order->payment_status === PaymentStatus::RefundPending, 409, 'This order is not waiting for a refund.');

        $order->forceFill(['payment_status' => PaymentStatus::Refunded, 'payment_note' => "Refunded: {$validated['refund_reference']}"])->save();

        $recordAuditLog->handle($request->user()->name, ActorType::Pandit, 'Refund Sent', "#{$order->reference}", Number::currency($order->amount, 'INR', 'en_IN', 0)." refunded. Reference {$validated['refund_reference']}.");

        return back()->with('status', "#{$order->reference}: refund recorded");
    }
}
