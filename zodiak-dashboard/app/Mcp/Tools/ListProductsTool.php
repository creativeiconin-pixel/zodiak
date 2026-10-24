<?php

namespace App\Mcp\Tools;

use App\Models\Remedy;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('All store products with selling price, cost price, profit per piece, stock and whether they are shown in the app.')]
class ListProductsTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $products = Remedy::query()
            ->withCount(['orders as paid_orders' => fn ($query) => $query->paid()])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Remedy $remedy) => [
                'slug' => $remedy->slug,
                'name' => $remedy->name,
                'category' => $remedy->category,
                'price' => $remedy->price,
                'mrp' => $remedy->compare_at_price,
                'cost_price' => $remedy->cost_price,
                'profit_per_piece' => $remedy->price - (int) $remedy->cost_price,
                'stock' => $remedy->stock,
                'is_active' => $remedy->is_active,
                'paid_orders' => $remedy->paid_orders,
            ]);

        return Response::json($products->all());
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
