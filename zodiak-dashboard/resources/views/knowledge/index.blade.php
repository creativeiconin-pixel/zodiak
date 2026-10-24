@extends('layouts.base', ['title' => 'Knowledge base • Zodiak Op-Center'])

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Pandit Jii</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Store knowledge base</h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">Pandit Jii reads this before every answer. He suggests a product only when the question matches <b>Best for</b>, the person's chart matches <b>Suits these charts</b>, and nothing in <b>Avoid when</b> applies. Clear, simple notes here mean better suggestions in the app.</p>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif

    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-space-lg">
        @foreach ([['Products', $products->count(), 'inventory_2', 'text-primary'], ['Fully described', $complete, 'task_alt', 'text-secondary'], ['Need details', $products->count() - $complete, 'edit_note', $products->count() - $complete > 0 ? 'text-error' : 'text-primary']] as [$label, $value, $icon, $tone])
            <div class="p-space-lg rounded-xl bg-surface-container-low shadow-md">
                <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-2 block font-display-lg text-display-lg font-bold text-on-surface">{{ $value }}</span>
            </div>
        @endforeach
    </div>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        @foreach ($products as $product)
            @php($knowledge = $product->knowledge)
            @php($score = $knowledge?->completeness() ?? 0)
            <article class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col gap-space-sm {{ $product->is_active ? '' : 'opacity-60' }}">
                <div class="flex items-start gap-space-sm">
                    <img src="{{ $product->image }}" alt="" class="w-14 h-14 rounded-lg object-cover shrink-0">
                    <div class="flex-1 min-w-0">
                        <h2 class="font-title-lg text-title-lg text-on-surface font-semibold truncate">{{ $product->name }}</h2>
                        <p class="font-body-sm text-body-sm text-outline">
                            {{ $product->planet['label'] ?? '' }}
                            @if (filled($knowledge?->planets)) • Planets: {{ implode(', ', $knowledge->planets) }} @endif
                            @unless ($product->is_active) • Hidden from the app @endunless
                            @if ($product->stock === 0) • Out of stock (not suggested) @endif
                        </p>
                    </div>
                    <span class="shrink-0 px-2.5 py-1 rounded-full font-label-md text-label-md font-semibold {{ $score === 5 ? 'bg-primary/15 text-primary' : 'bg-error-container/40 text-error' }}">{{ $score }}/5</span>
                </div>

                @if (filled($knowledge?->good_signs) || filled($knowledge?->avoid_signs))
                    <div class="flex flex-wrap gap-1">
                        @foreach ($knowledge->good_signs ?? [] as $sign)
                            <span class="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm">✓ {{ $sign }}</span>
                        @endforeach
                        @foreach ($knowledge->avoid_signs ?? [] as $sign)
                            <span class="px-2 py-0.5 rounded-full bg-error-container/40 text-error font-label-sm text-label-sm">✕ {{ $sign }}</span>
                        @endforeach
                    </div>
                @endif

                @if ($score === 0)
                    <p class="font-body-md text-body-md text-error">Pandit Jii knows almost nothing about this product, so he will rarely suggest it. Add details.</p>
                @else
                    <dl class="space-y-1.5 font-body-sm text-body-sm">
                        @foreach ($fields as $field => $label)
                            <div>
                                <dt class="font-label-sm text-label-sm uppercase tracking-wider {{ filled($knowledge->{$field}) ? 'text-secondary' : 'text-error' }}">{{ $label }}</dt>
                                <dd class="text-on-surface">{{ filled($knowledge->{$field}) ? Str::limit($knowledge->{$field}, 180) : 'Not written yet' }}</dd>
                            </div>
                        @endforeach
                    </dl>
                @endif

                <div class="mt-auto pt-space-xs flex items-center justify-between gap-space-sm">
                    <span class="font-body-sm text-body-sm text-outline">
                        @if ($knowledge?->updated_at)
                            Updated {{ $knowledge->updated_at->diffForHumans() }}{{ $knowledge->editor ? ' by '.$knowledge->editor->name : '' }}
                        @endif
                    </span>
                    <a href="{{ route('knowledge.edit', $product) }}" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1 hover:bg-primary-fixed-dim">
                        <span class="material-symbols-outlined text-base">edit</span> {{ $score === 0 ? 'Add details' : 'Edit' }}
                    </a>
                </div>
            </article>
        @endforeach
    </div>

    {{-- The exact guide sent to the AI --}}
    <details id="guide" class="relative z-10 mt-gutter p-space-lg rounded-2xl bg-surface-container-low shadow-xl" @if ($previewSign) open @endif>
        <summary class="cursor-pointer font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary">visibility</span> What Pandit Jii reads
        </summary>
        <p class="mt-space-sm font-body-sm text-body-sm text-outline">Only products that are shown in the app and in stock are included. Pick a rising sign to see exactly what Pandit Jii reads for that person — products marked "avoid" for it disappear.</p>
        <form method="GET" action="{{ route('knowledge.index') }}#guide" class="mt-space-sm flex flex-wrap items-center gap-2">
            <label for="sign" class="font-label-lg text-label-lg text-on-surface">Rising sign</label>
            <select id="sign" name="sign" onchange="this.form.submit()" class="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-secondary">
                <option value="">Any (birth time unknown)</option>
                @foreach ($signs as $sign)
                    <option value="{{ $sign }}" @selected($previewSign === $sign)>{{ $sign }}</option>
                @endforeach
            </select>
            <noscript><button type="submit" class="px-3 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg">Show</button></noscript>
        </form>
        <pre class="mt-space-sm p-space-md rounded-lg bg-surface-container-lowest/80 text-on-surface font-mono text-body-sm whitespace-pre-wrap">{{ $guide }}</pre>
    </details>
</main>
@endsection
