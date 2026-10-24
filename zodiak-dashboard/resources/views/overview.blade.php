@extends('layouts.base', ['title' => 'Overview • Zodiak Op-Center'])

@use('App\Enums\OrderStatus')
@use('Illuminate\Support\Number')
@use('Illuminate\Support\Str')

@php
    $inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0);
    $periodLabel = $period === 'all' ? 'all time' : ($period === 'today' ? 'today' : 'last '.$periods[$period]);
    $statusTone = fn (OrderStatus $status): string => match ($status) {
        OrderStatus::Rejected, OrderStatus::PaymentFailed => 'text-error',
        OrderStatus::Delivered => 'text-primary',
        default => 'text-secondary',
    };

    /* Chart geometry: one 30-unit slot per day, revenue bar on the left, profit bar on the right. */
    $chartLeft = 64;
    $chartWidth = $chartLeft + count($chart) * 30;
    $plotTop = 12;
    $plotHeight = 180;
    $chartMax = max(1, max(array_column($chart, 'revenue')));
    $chartMin = min(0, min(array_column($chart, 'profit')));
    $chartRange = $chartMax - $chartMin;
    $y = fn (int $value): float => round($plotTop + ($chartMax - $value) / $chartRange * $plotHeight, 2);
    $baseline = $y(0);
    $chartRevenue = array_sum(array_column($chart, 'revenue'));
    $chartProfit = array_sum(array_column($chart, 'profit'));
@endphp

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    @if ($paymentsToCheck > 0)
        <a href="{{ route('payments.index') }}" class="relative z-10 mb-space-lg flex items-center gap-space-sm p-space-md rounded-xl bg-primary/15 ring-1 ring-primary/50 hover:bg-primary/20 transition-colors" role="status">
            <span class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">fact_check</span>
            </span>
            <span class="flex-1">
                <span class="block font-title-md text-title-md text-on-surface font-semibold">{{ $paymentsToCheck }} UPI {{ Str::plural('payment', $paymentsToCheck) }} waiting for your check</span>
                <span class="block font-body-sm text-body-sm text-on-surface-variant">Customers have paid and sent their UTR number. Match each UTR and amount in your bank app, then press Verify.</span>
            </span>
            <span class="shrink-0 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold">Check UTRs</span>
        </a>
    @endif

    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div>
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Business</span>
            <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Overview</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Money, orders and users at a glance. Money counts only payments we have received.</p>
        </div>
        <nav aria-label="Period" class="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low shadow-md self-start md:self-auto">
            @foreach ($periods as $value => $label)
                <a href="{{ route('overview', ['period' => $value]) }}" @if ($period === $value) aria-current="page" @endif
                   class="px-3 py-1.5 rounded-lg font-label-lg text-label-lg whitespace-nowrap transition-colors {{ $period === $value ? 'bg-primary/15 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container' }}">{{ $label }}</a>
            @endforeach
        </nav>
    </div>

    {{-- Money --}}
    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
        @foreach ([
            ['Revenue', $inr($kpis['revenue']), 'account_balance_wallet', 'text-primary', 'Orders '.$inr($kpis['order_revenue']).' + credits '.$inr($kpis['credit_sales']).', '.$periodLabel],
            ['Cost', $inr($kpis['cost']), 'local_shipping', 'text-secondary', 'Our cost for those orders'],
            ['Profit', $inr($kpis['profit']), 'savings', $kpis['profit'] < 0 ? 'text-error' : 'text-primary', $kpis['margin'] === null ? 'No sales yet' : $kpis['margin'].'% margin'],
            ['Orders', number_format($kpis['orders']), 'receipt_long', 'text-secondary', number_format($kpis['paid_orders']).' paid'],
        ] as [$label, $value, $icon, $tone, $hint])
            <div class="p-space-lg rounded-xl bg-surface-container-low shadow-md">
                <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-2 block font-display-lg text-display-lg font-bold whitespace-nowrap {{ $label === 'Profit' && $kpis['profit'] < 0 ? 'text-error' : 'text-on-surface' }}">{{ $value }}</span>
                <span class="block font-body-sm text-body-sm text-outline">{{ $hint }}</span>
            </div>
        @endforeach
    </div>

    {{-- Operations & users --}}
    <div class="relative z-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-gutter mb-space-lg">
        @foreach ([
            ['Credit sales', $inr($kpis['credit_sales']), 'toll', route('payments.index'), 'text-secondary', trans_choice(':count recharge|:count recharges', $kpis['credit_recharges']).', '.$periodLabel],
            ['Payments to check', number_format($kpis['payments_waiting']), 'pending_actions', route('payments.index'), $kpis['payments_waiting'] > 0 ? 'text-error' : 'text-primary', 'UTR waiting for a check'],
            ['Refunds pending', $inr($kpis['refunds_pending']), 'currency_exchange', null, $kpis['refunds_pending_orders'] > 0 ? 'text-error' : 'text-primary', trans_choice(':count order|:count orders', $kpis['refunds_pending_orders'])],
            ['Users', number_format($kpis['users']), 'group', route('seekers.index'), 'text-primary', '+'.number_format($kpis['users_this_week']).' this week'],
            ['Questions to Pandit Jii', number_format($kpis['questions']), 'forum', null, 'text-secondary', 'All time'],
            ['Palm readings', number_format($kpis['palm_readings']), 'front_hand', null, 'text-secondary', 'All time'],
        ] as [$label, $value, $icon, $link, $tone, $hint])
            @php($tag = $link ? 'a' : 'div')
            <{{ $tag }} @if ($link) href="{{ $link }}" @endif class="group p-space-md rounded-xl bg-surface-container-low shadow-md {{ $link ? 'hover:bg-surface-container transition-colors' : '' }}">
                <div class="flex items-center justify-between gap-2">
                    <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined text-lg {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-1 block font-headline-sm text-headline-sm font-bold text-on-surface whitespace-nowrap">{{ $value }}</span>
                <span class="flex items-center gap-1 font-body-sm text-body-sm text-outline">
                    {{ $hint }}
                    @if ($link)
                        <span class="material-symbols-outlined text-base ml-auto group-hover:text-primary transition-colors">arrow_forward</span>
                    @endif
                </span>
            </{{ $tag }}>
        @endforeach
    </div>

    {{-- Revenue & profit chart --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
            <div>
                <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                    <span class="material-symbols-outlined text-primary">bar_chart</span> Revenue &amp; profit, last 30 days
                </h2>
                <p class="font-body-sm text-body-sm text-outline">{{ $inr($chartRevenue) }} revenue • {{ $inr($chartProfit) }} profit. Point at a day to see its numbers.</p>
            </div>
            <div class="flex items-center gap-space-md font-label-md text-label-md text-on-surface-variant">
                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary"></span> Revenue</span>
                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-secondary"></span> Profit</span>
            </div>
        </div>
        <svg viewBox="0 0 {{ $chartWidth }} {{ $plotTop + $plotHeight + 24 }}" class="w-full h-auto" role="img" aria-labelledby="chart-title">
            <title id="chart-title">Daily revenue and profit for the last 30 days: {{ $inr($chartRevenue) }} revenue and {{ $inr($chartProfit) }} profit in total.</title>
            @foreach ([1, 0.5] as $fraction)
                <line x1="{{ $chartLeft }}" x2="{{ $chartWidth }}" y1="{{ $y((int) round($chartMax * $fraction)) }}" y2="{{ $y((int) round($chartMax * $fraction)) }}" class="stroke-outline-variant/40" stroke-dasharray="3 4" />
                <text x="{{ $chartLeft - 6 }}" y="{{ $y((int) round($chartMax * $fraction)) + 3 }}" text-anchor="end" class="fill-outline" font-size="10">{{ $chartMax > 1 ? $inr((int) round($chartMax * $fraction)) : '' }}</text>
            @endforeach
            <line x1="{{ $chartLeft }}" x2="{{ $chartWidth }}" y1="{{ $baseline }}" y2="{{ $baseline }}" class="stroke-outline-variant" />
            <text x="{{ $chartLeft - 6 }}" y="{{ $baseline + 3 }}" text-anchor="end" class="fill-outline" font-size="10">₹0</text>
            @foreach ($chart as $index => $day)
                @php($slot = $chartLeft + $index * 30)
                <g>
                    <title>{{ $day['date']->format('D, j M') }}: revenue {{ $inr($day['revenue']) }}, cost {{ $inr($day['cost']) }}, profit {{ $inr($day['profit']) }} ({{ trans_choice(':count order|:count orders', $day['orders']) }})</title>
                    <rect x="{{ $slot }}" y="0" width="30" height="{{ $plotTop + $plotHeight }}" class="fill-transparent hover:fill-surface-container-high/60" />
                    @if ($day['revenue'] > 0)
                        <rect x="{{ $slot + 4 }}" y="{{ $y($day['revenue']) }}" width="10" height="{{ max(1, $baseline - $y($day['revenue'])) }}" rx="2" class="fill-primary" />
                    @endif
                    @if ($day['profit'] !== 0)
                        <rect x="{{ $slot + 16 }}" y="{{ min($baseline, $y($day['profit'])) }}" width="10" height="{{ max(1, abs($baseline - $y($day['profit']))) }}" rx="2" class="{{ $day['profit'] < 0 ? 'fill-error' : 'fill-secondary' }}" />
                    @endif
                    @if ($index % 5 === 0 || $loop->last)
                        <text x="{{ $slot + 15 }}" y="{{ $plotTop + $plotHeight + 18 }}" text-anchor="middle" class="fill-outline" font-size="10">{{ $loop->last ? 'Today' : $day['date']->format('j M') }}</text>
                    @endif
                </g>
            @endforeach
        </svg>
    </section>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-gutter">
        {{-- Orders by status --}}
        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-primary">donut_small</span> Orders by status
            </h2>
            @php($maxStatus = max(1, $statuses->max('count')))
            <ul class="space-y-2.5">
                @foreach ($statuses as $row)
                    <li>
                        <div class="flex items-center justify-between gap-2 font-body-sm text-body-sm">
                            <span class="{{ $row['count'] ? $statusTone($row['status']) : 'text-outline' }}">{{ $row['status']->label() }}</span>
                            <span class="font-semibold {{ $row['count'] ? 'text-on-surface' : 'text-outline' }}">{{ $row['count'] }}</span>
                        </div>
                        <div class="mt-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                            <div class="h-full rounded-full bg-current {{ $statusTone($row['status']) }}" style="width: {{ round($row['count'] / $maxStatus * 100) }}%"></div>
                        </div>
                    </li>
                @endforeach
            </ul>
            <p class="mt-space-md font-body-sm text-body-sm text-outline">Orders placed {{ $periodLabel }}.</p>
        </section>

        {{-- Top products --}}
        <section class="lg:col-span-2 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <div class="flex items-center justify-between gap-space-sm mb-space-md">
                <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                    <span class="material-symbols-outlined text-primary">workspace_premium</span> Top products
                </h2>
                <a href="{{ route('products.index') }}" class="font-label-lg text-label-lg text-secondary hover:text-primary">All products</a>
            </div>
            <div class="w-full overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                            <th class="py-3 px-space-md rounded-l-lg font-semibold">Product</th>
                            <th class="py-3 px-space-md font-semibold text-center">Sold</th>
                            <th class="py-3 px-space-md font-semibold text-right">Revenue</th>
                            <th class="py-3 px-space-md font-semibold text-right">Cost</th>
                            <th class="py-3 px-space-md rounded-r-lg font-semibold text-right">Profit</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                        @forelse ($topProducts as $row)
                            @php($profit = (int) $row->revenue - (int) $row->cost)
                            <tr class="hover:bg-surface-container/60 transition-colors">
                                <td class="py-3 px-space-md">
                                    <span class="flex items-center gap-space-sm">
                                        @if ($row->remedy)
                                            <img src="{{ $row->remedy->image }}" alt="" class="w-9 h-9 rounded-lg object-cover shrink-0">
                                            <a href="{{ route('products.edit', $row->remedy) }}" class="font-semibold hover:text-primary transition-colors">{{ $row->remedy->name }}</a>
                                        @else
                                            <span class="text-outline">Deleted product</span>
                                        @endif
                                    </span>
                                </td>
                                <td class="py-3 px-space-md text-center">{{ $row->units }}</td>
                                <td class="py-3 px-space-md text-right whitespace-nowrap">{{ $inr((int) $row->revenue) }}</td>
                                <td class="py-3 px-space-md text-right whitespace-nowrap text-on-surface-variant">{{ $inr((int) $row->cost) }}</td>
                                <td class="py-3 px-space-md text-right whitespace-nowrap font-semibold {{ $profit < 0 ? 'text-error' : 'text-primary' }}">{{ $inr($profit) }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="py-space-xl text-center text-outline">
                                    <span class="material-symbols-outlined text-3xl text-primary/60">inventory_2</span>
                                    <p class="mt-2 font-body-md text-body-md">No paid orders {{ $periodLabel }}.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    {{-- Latest orders --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
        <div class="flex items-center justify-between gap-space-sm mb-space-md">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-primary">shopping_bag</span> Latest orders
            </h2>
            <a href="{{ route('orders.index') }}" class="font-label-lg text-label-lg text-secondary hover:text-primary">All orders</a>
        </div>
        @forelse ($latestOrders as $order)
            <a href="{{ route('orders.show', $order) }}" class="flex items-center gap-space-sm py-2.5 px-2 -mx-2 rounded-lg hover:bg-surface-container/60 transition-colors {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                @if ($order->remedy)
                    <img src="{{ $order->remedy->image }}" alt="" class="w-11 h-11 rounded-lg object-cover">
                @endif
                <div class="flex-1 min-w-0">
                    <p class="font-title-md text-body-md text-on-surface font-semibold truncate">#{{ $order->reference }} • {{ $order->remedy?->name ?? 'Deleted product' }}</p>
                    <p class="font-body-sm text-body-sm text-outline">{{ $order->customer_name }} • {{ $order->created_at->timezone('Asia/Kolkata')->format('j M Y, H:i') }} • {{ ucfirst(str_replace('_', ' ', $order->payment_status->value)) }}@if ($order->payment_utr) • <span class="font-mono text-on-surface">UTR {{ $order->payment_utr }}</span>@endif</p>
                </div>
                <div class="text-right">
                    <span class="block font-title-md text-body-md text-primary font-semibold">{{ $inr($order->amount) }}</span>
                    <span class="block font-label-sm text-label-sm {{ $order->needsPaymentCheck() ? 'text-primary font-bold' : $statusTone($order->status) }}">{{ $order->adminStatusLabel() }}</span>
                </div>
            </a>
        @empty
            <p class="font-body-md text-body-md text-outline">No orders yet.</p>
        @endforelse
    </section>
</main>
@endsection
