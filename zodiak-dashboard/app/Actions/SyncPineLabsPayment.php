<?php

namespace App\Actions;

use App\Enums\ActorType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\PineLabsException;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

/**
 * Asks Pine Labs for the real payment result of an order (never trusting browser redirect data) and updates it.
 */
class SyncPineLabsPayment
{
    private const PAID = ['PROCESSED', 'AUTHORIZED'];

    private const FAILED = ['FAILED', 'CANCELLED'];

    public function __construct(private PineLabsClient $pineLabs, private RecordAuditLog $recordAuditLog) {}

    public function handle(Order $order): Order
    {
        if ($order->status !== OrderStatus::PaymentPending || $order->payment_reference === null) {
            return $order;
        }

        try {
            $status = $this->pineLabs->orderStatus($order->payment_reference);
        } catch (PineLabsException $exception) {
            Log::warning('Pine Labs status check failed', ['order' => $order->reference, 'error' => $exception->getMessage()]);

            return $order;
        }

        if (in_array($status, self::PAID, true)) {
            $order->forceFill(['status' => OrderStatus::AwaitingApproval, 'payment_status' => PaymentStatus::EscrowHeld])->save();
            $this->recordAuditLog->handle('Pine Labs', ActorType::Gateway, 'Payment Received', "#{$order->reference}", "Pine Labs order {$order->payment_reference} is {$status}. Sent to pandit review.");
        } elseif (in_array($status, self::FAILED, true)) {
            $order->forceFill(['status' => OrderStatus::PaymentFailed, 'payment_status' => PaymentStatus::Failed])->save();
        }

        return $order;
    }
}
