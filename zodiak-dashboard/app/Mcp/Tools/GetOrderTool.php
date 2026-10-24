<?php

namespace App\Mcp\Tools;

use App\Models\Order;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('Get one order by its reference, such as "ZK-89241", with its payment and delivery timeline.')]
class GetOrderTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $validated = $request->validate(['reference' => ['required', 'string', 'max:20']]);

        $order = Order::with('remedy:id,name')->where('reference', strtoupper(trim($validated['reference'])))->first();

        if (! $order) {
            return Response::error("No order found with reference {$validated['reference']}.");
        }

        return Response::json([
            ...ListOrdersTool::summary($order),
            'city_postal' => $order->city_postal,
            'payment_submitted_at' => $order->payment_submitted_at?->toIso8601String(),
            'payment_verified_at' => $order->payment_verified_at?->toIso8601String(),
            'payment_note' => $order->payment_note,
            'reviewed_at' => $order->reviewed_at?->toIso8601String(),
            'shipped_at' => $order->shipped_at?->toIso8601String(),
            'delivered_at' => $order->delivered_at?->toIso8601String(),
        ]);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'reference' => $schema->string()->description('The order reference, for example ZK-89241.')->required(),
        ];
    }
}
