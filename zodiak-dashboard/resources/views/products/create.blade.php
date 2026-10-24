@extends('layouts.base', ['title' => 'Add product • Zodiak Op-Center'])

@section('body')
@include('partials.op-header')

<main class="relative max-w-5xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <a href="{{ route('products.index') }}" class="relative z-10 inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary mb-space-md">
        <span class="material-symbols-outlined text-lg">arrow_back</span> All products
    </a>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Shop</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Add product</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Write the English text here. Fields with <span class="text-error">*</span> are needed.</p>
    </div>

    @include('products.partials.form', ['action' => route('products.store'), 'method' => 'POST'])
</main>
@endsection
