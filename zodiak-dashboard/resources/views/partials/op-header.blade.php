{{-- Shared top bar for Op-Center pages other than the main dashboard --}}
@use('Illuminate\Support\Str')
@php
    $links = [
        ['overview', 'Overview', 'monitoring', 'overview'],
        ['dashboard', 'Pandit queue', 'verified_user', 'dashboard'],
        ['orders.index', 'Orders', 'receipt_long', 'orders.*'],
        ['payments.index', 'Payments', 'payments', 'payments.*'],
        ['products.index', 'Products', 'inventory_2', 'products.*'],
        ['knowledge.index', 'Knowledge', 'menu_book', 'knowledge.*'],
        ['seekers.index', 'Users', 'group', 'seekers.*'],
        ['settings.integrations.edit', 'Integrations', 'settings', 'settings.*'],
    ];
@endphp
<header class="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="h-16 max-w-6xl mx-auto px-space-lg flex items-center justify-between gap-space-md">
        <a href="{{ route('dashboard') }}" class="flex items-center gap-space-sm text-on-surface hover:text-primary transition-colors shrink-0">
            <img alt="Zodiak" class="h-8 w-auto" src="/images/zodiak-logo.jpg">
            <span class="font-title-lg text-title-lg tracking-wider font-bold hidden md:inline">ZODIAK OP-CENTER</span>
        </a>
        <nav class="flex items-center gap-1 overflow-x-auto">
            @foreach ($links as [$name, $label, $icon, $pattern])
                @php($active = request()->routeIs($pattern))
                <a href="{{ route($name) }}" class="flex items-center gap-1.5 px-3 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap transition-colors {{ $active ? 'bg-primary/15 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container' }}">
                    <span class="material-symbols-outlined text-lg">{{ $icon }}</span> <span class="hidden xl:inline">{{ $label }}</span>
                    @if ($name === 'payments.index' && ($paymentsToCheck ?? 0) > 0)
                        <span class="min-w-5 h-5 px-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center" title="{{ $paymentsToCheck }} UTR {{ Str::plural('payment', $paymentsToCheck) }} to check">{{ $paymentsToCheck }}</span>
                    @endif
                </a>
            @endforeach
        </nav>
    </div>
</header>
