<?php

namespace App\Http\Controllers;

use App\Actions\DescribeStoreForPandit;
use App\Http\Requests\UpdateRemedyKnowledgeRequest;
use App\Models\Remedy;
use App\Models\RemedyKnowledge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class KnowledgeBaseController extends Controller
{
    /**
     * Every product with what Pandit Jii knows about it, and the exact guide he reads.
     */
    public function index(Request $request, DescribeStoreForPandit $store): View
    {
        $products = Remedy::with('knowledge.editor')->orderByDesc('is_active')->orderBy('sort_order')->get();
        $previewSign = in_array($request->query('sign'), RemedyKnowledge::SIGNS, true) ? $request->query('sign') : null;

        return view('knowledge.index', [
            'products' => $products,
            'complete' => $products->filter(fn (Remedy $product) => $product->knowledge?->completeness() === 5)->count(),
            'guide' => $store->guide($previewSign),
            'previewSign' => $previewSign,
            'signs' => RemedyKnowledge::SIGNS,
            'fields' => RemedyKnowledge::FIELDS,
        ]);
    }

    public function edit(Remedy $product): View
    {
        return view('knowledge.edit', [
            'product' => $product,
            'knowledge' => $product->knowledge ?? new RemedyKnowledge,
            'planets' => RemedyKnowledge::PLANETS,
            'signs' => RemedyKnowledge::SIGNS,
            'preview' => app(DescribeStoreForPandit::class)->describe($product->loadMissing('knowledge')),
        ]);
    }

    public function update(UpdateRemedyKnowledgeRequest $request, Remedy $product): RedirectResponse
    {
        $product->knowledge()->updateOrCreate([], [
            ...$request->validated(),
            'planets' => array_values($request->validated('planets') ?? []),
            'good_signs' => array_values($request->validated('good_signs') ?? []),
            'avoid_signs' => array_values($request->validated('avoid_signs') ?? []),
            'updated_by' => $request->user()->id,
        ]);

        return to_route('knowledge.index')->with('status', "Pandit Jii now knows the new details for {$product->name}.");
    }
}
