<?php

namespace App\Mcp\Tools;

use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('UPI payments waiting for a manual UTR check, and refunds still to be paid back. Oldest first.')]
class PaymentQueueTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $queue = fn (PaymentStatus $status) => Order::with('remedy:id,name')
            ->where('payment_status', $status)
            ->oldest('updated_at')
            ->limit(100)
            ->get()
            ->map(fn (Order $order) => [
                ...ListOrdersTool::summary($order),
                'payment_submitted_at' => $order->payment_submitted_at?->toIso8601String(),
            ])
            ->all();

        return Response::json([
            'waiting_for_utr_check' => $queue(PaymentStatus::VerificationPending),
            'refunds_to_pay' => $queue(PaymentStatus::RefundPending),
        ]);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
