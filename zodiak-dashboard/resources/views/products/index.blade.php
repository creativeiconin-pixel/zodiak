@extends('layouts.base', ['title' => 'Products • Zodiak Op-Center'])

@use('Illuminate\Support\Number')

@php($inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0))

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div>
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Shop</span>
            <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Products</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Prices, our cost, stock, and what each product has sold.</p>
        </div>
        <div class="flex flex-wrap gap-space-sm">
        <a href="{{ route('knowledge.index') }}" class="flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg shadow-md hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined text-lg text-primary">menu_book</span> Pandit Jii knowledge
        </a>
        <a href="{{ route('products.create') }}" class="flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
            <span class="material-symbols-outlined text-lg">add</span> Add product
        </a>
        </div>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif

    <div class="op-stats relative z-10 grid grid-cols-3 gap-3 sm:gap-gutter mb-space-lg">
        @foreach ([['All products', $totals['all'], 'inventory_2', 'text-primary'], ['Shown in app', $totals['active'], 'visibility', 'text-secondary'], ['Out of stock', $totals['out_of_stock'], 'production_quantity_limits', $totals['out_of_stock'] ? 'text-error' : 'text-primary']] as [$label, $value, $icon, $tone])
            <div class="p-space-lg rounded-xl bg-surface-container-low shadow-md">
                <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-2 block font-display-lg text-display-lg font-bold text-on-surface">{{ number_format($value) }}</span>
            </div>
        @endforeach
    </div>

    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
        <form method="GET" action="{{ route('products.index') }}" class="flex flex-col sm:flex-row gap-space-sm mb-space-md">
            <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                <label for="q" class="sr-only">Search products</label>
                <input id="q" name="q" value="{{ $search }}" type="search" placeholder="Search product name..." class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary/50 font-body-md text-body-md">
            </div>
            <label for="category" class="sr-only">Category</label>
            <select id="category" name="category" onchange="this.form.submit()" class="sm:w-52 px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary/50 font-body-md text-body-md">
                <option value="">All categories</option>
                @foreach ($categories as $value => $label)
                    <option value="{{ $value }}" @selected($category === $value)>{{ $label }}</option>
                @endforeach
            </select>
            <button type="submit" class="px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors">Filter</button>
        </form>

        <div class="w-full overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th class="py-3 px-space-md rounded-l-lg font-semibold">Product</th>
                        <th class="py-3 px-space-md font-semibold text-right">Price</th>
                        <th class="py-3 px-space-md font-semibold text-right">Cost</th>
                        <th class="py-3 px-space-md font-semibold text-right">Margin</th>
                        <th class="py-3 px-space-md font-semibold text-center">Stock</th>
                        <th class="py-3 px-space-md font-semibold text-right">Sold</th>
                        <th class="py-3 px-space-md font-semibold text-center">In app</th>
                        <th class="py-3 px-space-md rounded-r-lg font-semibold"><span class="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                    @forelse ($products as $product)
                        @php($margin = $product->price - $product->cost_price)
                        <tr class="hover:bg-surface-container/60 transition-colors {{ $product->is_active ? '' : 'opacity-60' }}">
                            <td class="py-3 px-space-md">
                                <a href="{{ route('products.edit', $product) }}" class="flex items-center gap-space-sm group">
                                    <img src="{{ $product->image }}" alt="" class="w-11 h-11 rounded-lg object-cover shrink-0 bg-surface-container">
                                    <span class="min-w-0">
                                        <span class="block font-title-md text-body-md font-semibold group-hover:text-primary transition-colors">{{ $product->name }}</span>
                                        <span class="block font-body-sm text-body-sm text-outline">{{ $categories[$product->category] ?? Str::headline($product->category) }}</span>
                                    </span>
                                </a>
                            </td>
                            <td class="py-3 px-space-md text-right whitespace-nowrap">
                                {{ $inr($product->price) }}
                                @if ($product->compare_at_price)
                                    <span class="block font-body-sm text-body-sm text-outline line-through">{{ $inr($product->compare_at_price) }}</span>
                                @endif
                            </td>
                            <td class="py-3 px-space-md text-right whitespace-nowrap {{ $product->cost_price ? 'text-on-surface-variant' : 'text-outline' }}">{{ $product->cost_price ? $inr($product->cost_price) : 'Not set' }}</td>
                            <td class="py-3 px-space-md text-right whitespace-nowrap">
                                @if ($product->cost_price)
                                    <span class="font-semibold {{ $margin < 0 ? 'text-error' : 'text-primary' }}">{{ $inr($margin) }}</span>
                                    <span class="block font-body-sm text-body-sm text-outline">{{ round($margin / max(1, $product->price) * 100) }}%</span>
                                @else
                                    <span class="text-outline" title="Add our cost to see the margin">—</span>
                                @endif
                            </td>
                            <td class="py-3 px-space-md text-center whitespace-nowrap">
                                @if ($product->stock === null)
                                    <span class="text-outline" title="Unlimited stock">∞</span>
                                @elseif ($product->stock === 0)
                                    <span class="text-error font-semibold">Out</span>
                                @else
                                    {{ number_format($product->stock) }}
                                @endif
                            </td>
                            <td class="py-3 px-space-md text-right whitespace-nowrap">
                                {{ $product->units_sold }}
                                <span class="block font-body-sm text-body-sm {{ $product->revenue ? 'text-primary' : 'text-outline' }}">{{ $inr((int) $product->revenue) }}</span>
                            </td>
                            <td class="py-3 px-space-md text-center">
                                <form method="POST" action="{{ route('products.toggle', $product) }}">
                                    @csrf
                                    <button type="submit" role="switch" aria-checked="{{ $product->is_active ? 'true' : 'false' }}" aria-label="{{ $product->is_active ? 'Hide' : 'Show' }} {{ $product->name }} in the app" title="{{ $product->is_active ? 'Shown in app — click to hide' : 'Hidden — click to show' }}"
                                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {{ $product->is_active ? 'bg-primary' : 'bg-surface-container-highest' }}">
                                        <span class="inline-block h-4 w-4 rounded-full bg-on-primary shadow transition-transform {{ $product->is_active ? 'translate-x-6' : 'translate-x-1' }}"></span>
                                    </button>
                                </form>
                            </td>
                            <td class="py-3 px-space-md text-right">
                                <a href="{{ route('products.edit', $product) }}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors">
                                    <span class="material-symbols-outlined text-base text-secondary">edit</span> Edit
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="py-space-xl text-center text-outline">
                                <span class="material-symbols-outlined text-3xl text-primary/60">inventory_2</span>
                                <p class="mt-2 font-body-md text-body-md">{{ $search || $category ? 'No products match this filter.' : 'No products yet. Add your first one.' }}</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($products->hasPages())
            <div class="flex items-center justify-between pt-space-md">
                <span class="font-body-sm text-body-sm text-outline">Showing {{ $products->firstItem() }}–{{ $products->lastItem() }} of {{ $products->total() }}</span>
                <div class="flex items-center gap-2">
                    @if ($products->previousPageUrl())
                        <a href="{{ $products->previousPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Previous</a>
                    @endif
                    @if ($products->nextPageUrl())
                        <a href="{{ $products->nextPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Next</a>
                    @endif
                </div>
            </div>
        @endif
        <p class="pt-space-md font-body-sm text-body-sm text-outline">Sold and revenue count paid orders only. Margin is price minus our cost, per piece.</p>
    </section>
</main>
@endsection
