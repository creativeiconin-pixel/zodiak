{{-- Op-Center shell: a sidebar on desktop and a top bar with a slide-out menu on phones. Included by every admin page. --}}
@use('Illuminate\Support\Str')
@php
    $count = fn (string $key): int => (int) ($menuCounts[$key] ?? 0);
    $dashboard = route('dashboard');
    $payments = route('payments.index');
    $statusFilter = request()->routeIs('orders.index') ? request('status') : null;
    $integrationNames = [
        'gemini' => 'Gemini AI', 'anthropic' => 'Claude AI', 'agenticorg' => 'AgenticOrg', 'credits' => 'Credits & packs', 'mcp' => 'MCP server',
        'upi' => 'UPI payments', 'elevenlabs' => 'Voice replies', 'pinelabs' => 'Pine Labs', 'msg91' => 'Phone OTP',
    ];

    $orderChildren = [['label' => 'All orders', 'url' => route('orders.index'), 'active' => request()->routeIs('orders.index') && ! $statusFilter]];
    foreach (\App\Enums\OrderStatus::cases() as $status) {
        if (($orderStatusCounts[$status->value] ?? 0) > 0 || $statusFilter === $status->value) {
            $orderChildren[] = ['label' => $status->label(), 'url' => route('orders.index', ['status' => $status->value]), 'count' => (int) ($orderStatusCounts[$status->value] ?? 0), 'active' => $statusFilter === $status->value];
        }
    }

    $menu = [
        'Daily work' => [
            ['label' => 'Overview', 'icon' => 'monitoring', 'url' => route('overview'), 'active' => request()->routeIs('overview'), 'count' => 0],
            ['label' => 'Pandit queue', 'icon' => 'verified_user', 'url' => $dashboard, 'active' => request()->routeIs('dashboard'), 'count' => $panditQueueCount ?? 0, 'title' => ($panditQueueCount ?? 0).' waiting in the Pandit queue', 'children' => [
                ['label' => 'Orders to approve', 'url' => $dashboard.'#approvals', 'count' => $count('approvals'), 'urgent' => true, 'active' => false],
                ['label' => 'Suggestions to check', 'url' => $dashboard.'#suggestion-reviews', 'count' => $count('suggestions'), 'urgent' => true, 'active' => false],
                ['label' => 'Sensitive chats', 'url' => $dashboard.'#sensitive-chats', 'count' => $count('sensitive'), 'urgent' => true, 'active' => false],
                ['label' => 'Blessing & shipping', 'url' => $dashboard.'#dispatch', 'count' => $count('dispatch'), 'active' => false],
                ['label' => 'Activity log', 'url' => $dashboard.'#audit-log', 'active' => false],
            ]],
            ['label' => 'Payments', 'icon' => 'payments', 'url' => $payments, 'active' => request()->routeIs('payments.*'), 'count' => $paymentsToCheck ?? 0, 'title' => ($paymentsToCheck ?? 0).' UTR '.Str::plural('payment', $paymentsToCheck ?? 0).' to check', 'children' => [
                ['label' => 'UTRs to check', 'url' => $payments.'#utrs', 'count' => $count('utrs'), 'urgent' => true, 'active' => false],
                ['label' => 'Credit recharges', 'url' => $payments.'#recharges', 'count' => $count('recharges'), 'urgent' => true, 'active' => false],
                ['label' => 'Refunds to send', 'url' => $payments.'#refunds', 'count' => $count('refunds'), 'urgent' => true, 'active' => false],
                ['label' => 'Not paid yet', 'url' => $payments.'#unpaid', 'count' => $count('unpaid'), 'active' => false],
                ['label' => 'Payment history', 'url' => $payments.'#history', 'active' => false],
            ]],
            ['label' => 'Orders', 'icon' => 'receipt_long', 'url' => route('orders.index'), 'active' => request()->routeIs('orders.*'), 'count' => 0, 'children' => $orderChildren],
        ],
        'Shop' => [
            ['label' => 'Products', 'icon' => 'inventory_2', 'url' => route('products.index'), 'active' => request()->routeIs('products.*'), 'count' => 0, 'children' => [
                ['label' => 'All products', 'url' => route('products.index'), 'active' => request()->routeIs('products.index', 'products.edit')],
                ['label' => 'Add a product', 'url' => route('products.create'), 'active' => request()->routeIs('products.create')],
            ]],
            ['label' => 'Pandit Jii knowledge', 'icon' => 'menu_book', 'url' => route('knowledge.index'), 'active' => request()->routeIs('knowledge.*'), 'count' => 0, 'children' => [
                ['label' => 'Product knowledge', 'url' => route('knowledge.index'), 'active' => request()->routeIs('knowledge.index', 'knowledge.edit')],
                ['label' => 'What Pandit Jii reads', 'url' => route('knowledge.index').'#guide', 'active' => false],
            ]],
        ],
        'People' => [
            ['label' => 'Users', 'icon' => 'group', 'url' => route('seekers.index'), 'active' => request()->routeIs('seekers.*'), 'count' => 0],
        ],
        'Settings' => [
            ['label' => 'Integrations & keys', 'icon' => 'settings', 'url' => route('settings.integrations.edit'), 'active' => request()->routeIs('settings.*'), 'count' => 0, 'children' => collect(config('integrations'))
                ->map(fn (array $integration, string $slug) => ['label' => $integrationNames[$slug] ?? Str::before($integration['label'], ' ('), 'url' => route('settings.integrations.edit').'#'.$slug, 'active' => false])
                ->values()->all()],
        ],
    ];

    $current = collect($menu)->flatten(1)->first(fn (array $item) => $item['active']);
    $user = auth()->user();
@endphp

<style>
    @media (min-width: 1024px) { body { padding-left: 16rem; } }
</style>

{{-- Desktop sidebar --}}
<aside class="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-surface-container-lowest shadow-[1px_0_12px_rgba(0,0,0,0.25)]">
    <a href="{{ route('overview') }}" class="h-16 px-5 flex items-center gap-3 shrink-0 text-on-surface hover:text-primary transition-colors">
        <img alt="" class="h-8 w-8 rounded-md object-cover" src="/images/zodiak-logo.jpg">
        <span class="font-title-lg text-title-lg tracking-wider font-bold">OP-CENTER</span>
    </a>

    <form method="GET" action="{{ route('orders.index') }}" class="px-4 pb-3" role="search">
        <label for="op-search" class="sr-only">Search orders</label>
        <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input id="op-search" name="q" type="search" data-op-search value="{{ request()->routeIs('orders.index') ? request('q') : '' }}" placeholder="Order, name, phone, UTR…" class="w-full pl-9 pr-9 py-2 rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary/60">
            <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 rounded bg-surface-container-high text-outline font-label-sm text-label-sm" title="Press / to search">/</kbd>
        </div>
    </form>

    @include('partials.op-nav', ['menu' => $menu, 'touch' => false])

    <div class="p-3 shrink-0 border-t border-surface-container-high">
        <a href="/" target="_blank" rel="noopener" class="flex items-center gap-3 px-3 py-2 rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
            <span class="material-symbols-outlined text-xl text-outline">open_in_new</span> Open the app
        </a>
        <div class="mt-1 flex items-center gap-3 px-3 py-2">
            <span class="w-9 h-9 rounded-full bg-gradient-to-tr from-secondary-container to-primary-container text-on-primary flex items-center justify-center font-label-lg text-label-lg font-bold shrink-0">{{ Str::upper(Str::substr($user?->name ?? 'P', 0, 1)) }}</span>
            <span class="flex-1 min-w-0">
                <span class="block font-label-lg text-label-lg text-on-surface truncate">{{ $user?->name }}</span>
                <span class="block font-label-sm text-label-sm text-outline truncate">{{ $user?->title ?? 'Team' }}</span>
            </span>
            <form method="POST" action="{{ route('logout') }}" data-no-busy>
                @csrf
                <button type="submit" title="Sign out" aria-label="Sign out" class="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span class="material-symbols-outlined text-xl">logout</span>
                </button>
            </form>
        </div>
    </div>
</aside>

{{-- Phone and tablet top bar --}}
<header class="lg:hidden sticky top-0 z-40 h-14 px-2 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
    <button type="button" data-op-menu-open aria-controls="op-drawer" aria-expanded="false" aria-label="Open menu" class="relative w-11 h-11 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container">
        <span class="material-symbols-outlined">menu</span>
        @if (($paymentsToCheck ?? 0) + ($panditQueueCount ?? 0) > 0)
            <span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
        @endif
    </button>
    <a href="{{ route('overview') }}" class="flex items-center gap-2 min-w-0 flex-1">
        <img alt="" class="h-7 w-7 rounded-md object-cover shrink-0" src="/images/zodiak-logo.jpg">
        <span class="font-title-md text-title-md text-on-surface font-semibold truncate">{{ $current['label'] ?? 'Op-Center' }}</span>
    </a>
    <a href="{{ route('payments.index') }}" aria-label="Payments to check" class="relative w-11 h-11 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
        <span class="material-symbols-outlined">payments</span>
        @if (($paymentsToCheck ?? 0) > 0)
            <span class="absolute top-1 right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center">{{ $paymentsToCheck }}</span>
        @endif
    </a>
</header>

{{-- Slide-out menu for phones --}}
<div id="op-drawer" class="lg:hidden fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-label="Menu">
    <div data-op-menu-close class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300" data-op-fade></div>
    <div class="absolute inset-y-0 left-0 w-[min(20rem,85vw)] flex flex-col bg-surface-container-lowest shadow-2xl -translate-x-full transition-transform duration-300 ease-out" data-op-slide>
        <div class="h-14 px-4 flex items-center justify-between shrink-0">
            <span class="flex items-center gap-2 font-title-md text-title-md font-bold text-on-surface">
                <img alt="" class="h-7 w-7 rounded-md object-cover" src="/images/zodiak-logo.jpg"> OP-CENTER
            </span>
            <button type="button" data-op-menu-close aria-label="Close menu" class="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <form method="GET" action="{{ route('orders.index') }}" class="px-4 pb-2" role="search">
            <label for="op-search-mobile" class="sr-only">Search orders</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                <input id="op-search-mobile" name="q" type="search" placeholder="Order, name, phone, UTR…" class="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary/60">
            </div>
        </form>
        @include('partials.op-nav', ['menu' => $menu, 'touch' => true])
        <div class="p-3 border-t border-surface-container-high flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" class="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl font-label-lg text-label-lg text-on-surface-variant active:bg-surface-container">
                <span class="material-symbols-outlined text-xl text-outline">open_in_new</span> Open the app
            </a>
            <form method="POST" action="{{ route('logout') }}" data-no-busy>
                @csrf
                <button type="submit" class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-label-lg text-label-lg text-on-surface-variant active:bg-surface-container">
                    <span class="material-symbols-outlined text-xl">logout</span> Sign out
                </button>
            </form>
        </div>
    </div>
</div>
