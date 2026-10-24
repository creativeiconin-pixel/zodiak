@extends('layouts.base', ['title' => $product->name.' • Knowledge base • Zodiak Op-Center'])

@php
    $inputClass = 'w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary font-body-md text-body-md';
    $savedPlanets = old('planets', $knowledge->planets ?? []);
    $signGroups = [
        'good_signs' => ['Good for rising signs', 'Pandit Jii prefers this product for people with these rising signs.', 'peer-checked:bg-primary peer-checked:text-on-primary'],
        'avoid_signs' => ['Avoid for rising signs', 'Pandit Jii will never suggest it to people with these rising signs.', 'peer-checked:bg-error peer-checked:text-on-error'],
    ];
    $textFields = [
        'best_for' => ['Best for', 'Which questions and life areas is it for? e.g. job growth, studies, delayed marriage, stress.'],
        'suits_charts' => ['Suits these charts', 'Which rising signs, weak planets or dashas make it a good fit?'],
        'avoid_when' => ['Avoid when', 'Rising signs, other gemstones or situations where it should not be suggested.'],
        'how_to_use' => ['How to wear or use', 'Metal, finger, day, mantra, trial period. Pandit Jii shares this after an order too.'],
        'notes' => ['Pandit team notes (optional)', 'Anything else Pandit Jii should keep in mind.'],
    ];
@endphp

@section('body')
@include('partials.op-header')

<main class="relative max-w-4xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <a href="{{ route('knowledge.index') }}" class="relative z-10 inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary mb-space-md">
        <span class="material-symbols-outlined text-lg">arrow_back</span> Knowledge base
    </a>

    <div class="relative z-10 flex items-center gap-space-md mb-space-lg">
        <img src="{{ $product->image }}" alt="" class="w-16 h-16 rounded-xl object-cover">
        <div>
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">{{ $product->name }}</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ $product->planet['label'] ?? '' }} • {{ $product->tagline }} • <a href="{{ route('products.edit', $product) }}" class="text-primary hover:underline">Edit shop details</a></p>
        </div>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif

    @if ($errors->any())
        <div class="relative z-10 mb-space-md px-space-md py-3 rounded-xl bg-error-container/30 text-error" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('knowledge.update', $product) }}" class="relative z-10 flex flex-col gap-5">
        @csrf
        @method('PUT')

        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface mb-1">Planets</h2>
            <p class="font-body-sm text-body-sm text-outline mb-space-md">Which planets does this product strengthen or calm?</p>
            <div class="flex flex-wrap gap-2">
                @foreach ($planets as $planet)
                    <label class="cursor-pointer">
                        <input type="checkbox" name="planets[]" value="{{ $planet }}" class="peer sr-only" @checked(in_array($planet, $savedPlanets, true))>
                        <span class="inline-block px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-lg text-label-lg peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary transition-colors">{{ $planet }}</span>
                    </label>
                @endforeach
            </div>
        </section>

        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col gap-space-lg">
            @foreach ($signGroups as $field => [$label, $help, $checkedClass])
                @php($saved = old($field, $knowledge->{$field} ?? []))
                <div>
                    <h2 class="font-headline-sm text-headline-sm text-on-surface mb-1">{{ $label }}</h2>
                    <p class="font-body-sm text-body-sm text-outline mb-space-sm">{{ $help }} Leave all empty if it suits everyone.</p>
                    <div class="flex flex-wrap gap-2">
                        @foreach ($signs as $sign)
                            <label class="cursor-pointer">
                                <input type="checkbox" name="{{ $field }}[]" value="{{ $sign }}" class="peer sr-only" @checked(in_array($sign, $saved, true))>
                                <span class="inline-block px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-lg text-label-lg {{ $checkedClass }} peer-focus-visible:ring-2 peer-focus-visible:ring-secondary transition-colors">{{ $sign }}</span>
                            </label>
                        @endforeach
                    </div>
                    @error($field)<p class="mt-1 font-body-sm text-body-sm text-error">{{ $message }}</p>@enderror
                </div>
            @endforeach
        </section>

        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col gap-space-md">
            @foreach ($textFields as $field => [$label, $help])
                <div>
                    <label for="{{ $field }}" class="block font-label-lg text-label-lg text-on-surface">{{ $label }}</label>
                    <p class="font-body-sm text-body-sm text-outline mb-1">{{ $help }}</p>
                    <textarea id="{{ $field }}" name="{{ $field }}" rows="3" maxlength="1500" class="{{ $inputClass }}">{{ old($field, $knowledge->{$field}) }}</textarea>
                    @error($field)<p class="mt-1 font-body-sm text-body-sm text-error">{{ $message }}</p>@enderror
                </div>
            @endforeach
        </section>

        <details class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <summary class="cursor-pointer font-title-md text-title-md text-on-surface">What Pandit Jii reads now (before your changes)</summary>
            <pre class="mt-space-sm p-space-md rounded-lg bg-surface-container-lowest/80 text-on-surface font-mono text-body-sm whitespace-pre-wrap">{{ $preview }}</pre>
        </details>

        <div class="flex items-center gap-space-sm">
            <button type="submit" class="px-space-lg py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 flex items-center gap-1">
                <span class="material-symbols-outlined text-lg">save</span> Save knowledge
            </button>
            <a href="{{ route('knowledge.index') }}" class="px-space-md py-3 rounded-xl text-on-surface-variant font-label-lg text-label-lg hover:text-on-surface">Cancel</a>
        </div>
    </form>
</main>
@endsection
