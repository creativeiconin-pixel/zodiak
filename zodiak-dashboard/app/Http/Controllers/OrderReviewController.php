<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditLog;
use App\Enums\ActorType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\StoreOrderReviewRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number;

class OrderReviewController extends Controller
{
    /**
     * Record a pandit's verdict on an AI-prescribed remedy: approve, order a trial, or reject and refund.
     */
    public function store(StoreOrderReviewRequest $request, Order $order, RecordAuditLog $recordAuditLog): RedirectResponse
    {
        $pandit = $request->user();
        $amount = Number::currency($order->amount, 'INR', 'en_IN', 0);

        [$status, $paymentStatus, $action, $outcome] = match ($request->validated('decision')) {
            'approve' => [
                OrderStatus::Approved,
                PaymentStatus::Captured,
                "Approved {$order->remedy->name}",
                'Cleared for '.($order->muhurat ?? 'next auspicious muhurat')." Sankalpa; {$amount} released from escrow.",
            ],
            'trial' => [
                OrderStatus::TrialHold,
                PaymentStatus::EscrowHeld,
                'Ordered Amethyst Trial',
                'Mandatory 3-day trial before setting; payment remains in escrow.',
            ],
            'reject' => [
                OrderStatus::Rejected,
                // Real payments (UPI or Pine Labs) need a refund sent by hand; sandbox orders never took money
                $order->payment_gateway !== 'sandbox' ? PaymentStatus::RefundPending : PaymentStatus::Refunded,
                "Rejected {$order->remedy->name}",
                "Incompatible with {$order->lagna}. 100% refund {$amount} processed.",
            ],
        };

        DB::transaction(function () use ($order, $pandit, $status, $paymentStatus, $action, $outcome, $recordAuditLog): void {
            $order->forceFill([
                'status' => $status,
                'payment_status' => $paymentStatus,
                'reviewed_by' => $pandit->id,
                'reviewed_at' => now(),
            ])->save();

            $recordAuditLog->handle($pandit->name, ActorType::Pandit, $action, "#{$order->reference}", $outcome);
        });

        return back()->with('status', "#{$order->reference}: {$status->label()}");
    }
}
