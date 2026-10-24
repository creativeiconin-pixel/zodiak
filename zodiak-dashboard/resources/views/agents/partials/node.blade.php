{{-- One box in the agents diagram. Expects: $label, $icon, $note; optional $card (agent card array) or $kind ('person'|'always'|'data') --}}
@php
    $state = isset($card) ? $card['state'] : ($kind ?? 'data');
    $styles = [
        'running' => ['ring-primary/50 bg-surface-container', 'bg-primary', 'Running'],
        'paused' => ['ring-error/60 bg-error-container/15', 'bg-error', 'Paused'],
        'off' => ['ring-outline-variant/40 bg-surface-container-low opacity-70', 'bg-outline', 'Not set up'],
        'always' => ['ring-secondary/40 bg-surface-container', 'bg-secondary', 'Always on'],
        'person' => ['ring-outline-variant/30 bg-surface-container-low', null, null],
        'data' => ['ring-outline-variant/30 bg-surface-container-low', null, null],
    ][$state];
@endphp
<{{ isset($card) ? 'a' : 'div' }} @isset($card) href="#agent-{{ $card['slug'] }}" @endisset class="agent-node relative shrink-0 w-full lg:w-auto lg:flex-1 lg:basis-0 lg:min-w-0 lg:max-w-[11rem] rounded-2xl ring-1 {{ $styles[0] }} p-3 flex lg:flex-col items-center lg:text-center gap-3 lg:gap-1.5 {{ isset($card) ? 'hover:ring-2 transition-shadow' : '' }}">
    <span class="relative w-11 h-11 rounded-xl {{ $state === 'paused' ? 'bg-error/15 text-error' : ($state === 'running' ? 'bg-primary/15 text-primary' : 'bg-surface-container-high text-on-surface-variant') }} flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined">{{ $icon }}</span>
        @if ($styles[1])
            <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full {{ $styles[1] }} ring-2 ring-surface {{ $state === 'running' ? 'animate-pulse' : '' }}"></span>
        @endif
    </span>
    <span class="min-w-0 flex-1 lg:flex-none">
        <span class="block font-label-lg text-label-lg text-on-surface font-semibold leading-tight">{{ $label }}</span>
        <span class="block font-body-sm text-body-sm text-outline leading-snug">{{ $note }}</span>
        @if ($styles[2])
            <span class="mt-1 inline-block px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold {{ $state === 'paused' ? 'bg-error/15 text-error' : ($state === 'running' ? 'bg-primary/15 text-primary' : ($state === 'always' ? 'bg-secondary/15 text-secondary' : 'bg-surface-container-high text-outline')) }}">{{ $styles[2] }}</span>
        @endif
    </span>
</{{ isset($card) ? 'a' : 'div' }}>
