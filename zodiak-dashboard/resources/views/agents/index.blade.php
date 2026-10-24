@extends('layouts.base', ['title' => 'Agents • Zodiak Op-Center'])

@php
    $agent = fn (string $slug): array => $cards[$slug];
    $flowState = fn (string $slug): string => $cards[$slug]['state'] === 'running' ? 'running' : 'stopped';
    $stateBadge = [
        'running' => ['bg-primary/15 text-primary', 'Running'],
        'paused' => ['bg-error/15 text-error', 'Paused'],
        'off' => ['bg-surface-container-high text-outline', 'Not set up'],
    ];
@endphp

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">AI</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Agents</h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">How Zodiak's AI agents work together. Pause any agent at any time: seekers get a polite "please try a little later" message and no credits are taken. The safety net and suggestion checker always stay on.</p>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif

    {{-- How it works --}}
    <section class="relative z-10 p-space-md md:p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter space-y-space-lg" aria-labelledby="flow-title">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 id="flow-title" class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-primary">account_tree</span> How it works
            </h2>
            <div class="flex flex-wrap gap-3 font-label-sm text-label-sm text-on-surface-variant">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-primary"></span> Running</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-error"></span> Paused</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span> Always on</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-outline"></span> Not set up</span>
            </div>
        </div>

        {{-- 1. A question --}}
        <div>
            <h3 class="mb-space-sm font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold">1 • A seeker asks Pandit Jii</h3>
            <div class="flex flex-col lg:flex-row lg:items-stretch">
                @include('agents.partials.node', ['label' => 'Seeker', 'icon' => 'person', 'note' => 'Types or records a voice note', 'kind' => 'person'])
                <div class="agent-arrow" data-state="running" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Voice-note listener', 'icon' => 'hearing', 'note' => 'Writes down spoken words', 'card' => $agent('listener')])
                <div class="agent-arrow" data-state="running" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Safety net', 'icon' => 'health_and_safety', 'note' => 'Distress → helpline 14416', 'kind' => 'always'])
                <div class="agent-arrow" data-state="{{ $flowState('pandit') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Pandit Jii', 'icon' => 'psychology', 'note' => 'Chart + palm + orders + store knowledge', 'card' => $agent('pandit')])
                <div class="agent-arrow" data-state="{{ $flowState('pandit') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Suggestion checker', 'icon' => 'rule', 'note' => 'Odd product → Pandit queue', 'kind' => 'always'])
                <div class="agent-arrow" data-state="{{ $flowState('pandit') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Answer in the app', 'icon' => 'chat', 'note' => 'Text, or a voice note', 'kind' => 'data'])
            </div>
            <div class="mt-space-sm flex flex-col sm:flex-row gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container font-body-sm text-body-sm text-on-surface-variant">
                    <span class="material-symbols-outlined text-base text-outline">subdirectory_arrow_right</span>
                    Voice question? <a href="#agent-voice" class="text-primary font-semibold">Voice replies</a> speaks the answer
                    <span class="w-2 h-2 rounded-full {{ ['running' => 'bg-primary', 'paused' => 'bg-error', 'off' => 'bg-outline'][$agent('voice')['state']] }}"></span>
                </span>
                <a href="{{ route('dashboard') }}#suggestion-reviews" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface">
                    <span class="material-symbols-outlined text-base text-outline">supervisor_account</span>
                    {{ $safety['held'] }} held for a human Pandit • {{ $safety['care'] }} helpline answers today
                </a>
            </div>
        </div>

        {{-- 2. A palm photo --}}
        <div>
            <h3 class="mb-space-sm font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold">2 • A seeker reads their palm</h3>
            <div class="flex flex-col lg:flex-row lg:items-stretch">
                @include('agents.partials.node', ['label' => 'Palm photo', 'icon' => 'photo_camera', 'note' => 'Never stored', 'kind' => 'person'])
                <div class="agent-arrow" data-state="{{ $flowState('palm') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Palm reader', 'icon' => 'front_hand', 'note' => 'Reads the 4 main lines', 'card' => $agent('palm')])
                <div class="agent-arrow" data-state="{{ $flowState('palm') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Reading saved', 'icon' => 'bookmark', 'note' => 'Pandit Jii uses it later', 'kind' => 'data'])
            </div>
        </div>

        {{-- 3. Outside agents --}}
        <div>
            <h3 class="mb-space-sm font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold">3 • Outside AI agents look things up</h3>
            <div class="flex flex-col lg:flex-row lg:items-stretch">
                @include('agents.partials.node', ['label' => 'AgenticOrg agents', 'icon' => 'smart_toy', 'note' => 'Use your MCP API key', 'kind' => 'person'])
                <div class="agent-arrow" data-state="{{ $flowState('mcp') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'MCP server', 'icon' => 'hub', 'note' => '6 read-only tools', 'card' => $agent('mcp')])
                <div class="agent-arrow" data-state="{{ $flowState('mcp') }}" aria-hidden="true"></div>
                @include('agents.partials.node', ['label' => 'Zodiak data', 'icon' => 'database', 'note' => 'Orders, payments, products, knowledge', 'kind' => 'data'])
            </div>
        </div>
    </section>

    {{-- Switches --}}
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-gutter">
        @foreach ($cards as $card)
            <article id="agent-{{ $card['slug'] }}" class="scroll-mt-20 p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col gap-space-sm {{ $card['state'] === 'paused' ? 'ring-1 ring-error/40' : '' }}">
                <div class="flex items-start gap-space-sm">
                    <span class="w-11 h-11 rounded-xl {{ $card['state'] === 'paused' ? 'bg-error/15 text-error' : 'bg-primary/15 text-primary' }} flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined">{{ $card['icon'] }}</span>
                    </span>
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="font-title-lg text-title-lg text-on-surface font-semibold">{{ $card['name'] }}</h2>
                            <span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold {{ $stateBadge[$card['state']][0] }}">{{ $stateBadge[$card['state']][1] }}</span>
                        </div>
                        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{{ $card['does'] }}</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 font-label-md text-label-md">
                    @foreach ($card['stats'] as $stat)
                        <span class="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">{{ $stat }}</span>
                    @endforeach
                </div>

                @if ($card['paused'])
                    <p class="font-body-sm text-body-sm text-error">Paused by {{ $card['paused']['by'] }} {{ $card['paused']['at']->diffForHumans() }}. Seekers see "please try a little later".</p>
                @endif

                <div class="mt-auto pt-space-xs flex flex-wrap items-center gap-2">
                    @if ($card['state'] === 'off')
                        <a href="{{ route('settings.integrations.edit') }}" class="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center gap-1">
                            <span class="material-symbols-outlined text-base">key</span> Set it up in Integrations
                        </a>
                    @else
                        <form method="POST" action="{{ route('agents.update', $card['slug']) }}" @if ($card['state'] === 'running') onsubmit="return confirm('Pause {{ $card['name'] }}? Seekers will be asked to try a little later until you resume it.');" @endif>
                            @csrf
                            @method('PUT')
                            @if ($card['state'] === 'running')
                                <input type="hidden" name="state" value="paused">
                                <button type="submit" class="px-4 py-2 rounded-lg bg-error-container/50 text-error font-label-lg text-label-lg flex items-center gap-1 hover:bg-error-container/80 transition-colors">
                                    <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">pause_circle</span> Pause
                                </button>
                            @else
                                <input type="hidden" name="state" value="running">
                                <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1 hover:bg-primary-fixed-dim transition-colors">
                                    <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">play_circle</span> Resume
                                </button>
                            @endif
                        </form>
                    @endif
                </div>
            </article>
        @endforeach
    </div>
</main>
@endsection
