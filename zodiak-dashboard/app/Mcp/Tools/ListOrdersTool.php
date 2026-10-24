<?php

namespace App\Mcp\Tools;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('List the latest store orders, newest first. Can filter by order status or payment status.')]
class ListOrdersTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
            'payment_status' => ['nullable', Rule::enum(PaymentStatus::class)],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $orders = Order::with('remedy:id,name')
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($validated['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->latest()
            ->limit($validated['limit'] ?? 20)
            ->get();

        return Response::json($orders->map(fn (Order $order) => self::summary($order))->all());
    }

    /**
     * The order fields shared with MCP clients (no phone number or address).
     *
     * @return array<string, mixed>
     */
    public static function summary(Order $order): array
    {
        return [
            'reference' => $order->reference,
            'product' => $order->remedy?->name,
            'customer_name' => $order->customer_name,
            'amount' => $order->amount,
            'cost' => $order->cost_amount,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'payment_method' => $order->payment_gateway,
            'payment_utr' => $order->payment_utr,
            'placed_at' => $order->created_at?->toIso8601String(),
        ];
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->enum(array_column(OrderStatus::cases(), 'value'))->description('Only orders with this status.'),
            'payment_status' => $schema->string()->enum(array_column(PaymentStatus::cases(), 'value'))->description('Only orders with this payment status.'),
            'limit' => $schema->integer()->description('How many orders to return, 1 to 100. Default 20.'),
        ];
    }
}
