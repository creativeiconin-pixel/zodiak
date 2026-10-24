<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number;

class PaymentVerificationController extends Controller
{
    /**
     * Confirm (or reject) a UPI payment after checking the UTR in the bank statement.
     */
    public function store(Request $request, Order $order, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $validated = $request->validate([
            'decision' => ['required', 'in:verify,reject'],
            'note' => ['nullable', 'required_if:decision,reject', 'string', 'max:200'],
        ], ['note.required_if' => 'Write a short reason so the customer knows what to fix.']);

        abort_unless($order->payment_status === PaymentStatus::VerificationPending, 409, 'This payment is not waiting for a check.');

        $user = $request->user();
        $verified = $validated['decision'] === 'verify';
        $amount = Number::currency($order->amount, 'INR', 'en_IN', 0);

        DB::transaction(function () use ($order, $user, $verified, $validated, $amount, $recordAuditLog): void {
            $order->forceFill($verified ? [
                'status' => OrderStatus::AwaitingApproval,
                'payment_status' => PaymentStatus::EscrowHeld,
                'payment_verified_at' => now(),
                'payment_verified_by' => $user->id,
            ] : [
                'status' => OrderStatus::PaymentFailed,
                'payment_status' => PaymentStatus::Failed,
                'payment_note' => $validated['note'],
            ])->save();

            $recordAuditLog->handle(
                $user->name,
                ActorType::Pandit,
                $verified ? 'UPI Payment Verified' : 'UPI Payment Rejected',
                "#{$order->reference}",
                $verified ? "UTR {$order->payment_utr} matched for {$amount}. Sent to pandit review." : "UTR {$order->payment_utr} not found: {$validated['note']}",
            );
        });

        return back()->with('status', "#{$order->reference}: ".($verified ? 'payment verified' : 'payment rejected'));
    }
}
