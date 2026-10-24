<?php

namespace App\Mcp\Tools;

use App\Actions\DescribeStoreForPandit;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('The Pandit Jii knowledge base: for each store product, which planets and rising signs it suits, when to avoid it, how to wear or use it, and how complete the entry is (out of 5). Also returns the exact product guide Pandit Jii reads before answering, matched to a rising sign when one is given.')]
class GetKnowledgeBaseTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request, DescribeStoreForPandit $store): Response
    {
        $validated = $request->validate([
            'product' => ['nullable', 'string', 'max:120'],
            'sign' => ['nullable', 'string', Rule::in(RemedyKnowledge::SIGNS)],
        ]);

        $products = Remedy::with('knowledge.editor:id,name')
            ->when($validated['product'] ?? null, fn ($query, string $slug) => $query->where('slug', $slug))
            ->orderByDesc('is_active')
            ->orderBy('sort_order')
            ->get();

        if (isset($validated['product']) && $products->isEmpty()) {
            return Response::error("No product found with slug {$validated['product']}.");
        }

        return Response::json([
            'products' => $products->map(fn (Remedy $remedy) => [
                'slug' => $remedy->slug,
                'name' => $remedy->name,
                'is_active' => $remedy->is_active,
                'completeness' => $remedy->knowledge?->completeness() ?? 0,
                'planets' => $remedy->knowledge?->planets ?? [],
                'good_signs' => $remedy->knowledge?->good_signs ?? [],
                'avoid_signs' => $remedy->knowledge?->avoid_signs ?? [],
                'best_for' => $remedy->knowledge?->best_for,
                'suits_charts' => $remedy->knowledge?->suits_charts,
                'avoid_when' => $remedy->knowledge?->avoid_when,
                'how_to_use' => $remedy->knowledge?->how_to_use,
                'notes' => $remedy->knowledge?->notes,
                'updated_by' => $remedy->knowledge?->editor?->name,
                'updated_at' => $remedy->knowledge?->updated_at?->toIso8601String(),
            ])->all(),
            'pandit_guide' => $store->guide($validated['sign'] ?? null),
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
            'product' => $schema->string()->description('Only this product, by its slug (from list-products-tool).'),
            'sign' => $schema->string()->enum(RemedyKnowledge::SIGNS)->description('Rising sign, to see the guide exactly as Pandit Jii reads it for that person. Products marked "avoid" for the sign are left out.'),
        ];
    }
}
