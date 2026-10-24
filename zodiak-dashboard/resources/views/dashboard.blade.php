@extends('layouts.base', ['title' => 'Pandit queue • Zodiak Op-Center'])

@use('App\Enums\ActorType')
@use('App\Enums\FlagType')
@use('App\Enums\OrderStatus')
@use('App\Models\ChatMessage')
@use('Illuminate\Support\Number')
@use('Illuminate\Support\Str')

@php
    $inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0);
    $initials = fn (string $name): string => Str::of($name)->explode(' ')->filter()->take(2)->map(fn ($part) => Str::substr($part, 0, 1))->implode('');
    // Quick-jump chips to each part of the queue
    $navItems = [
        ['#approvals', 'diamond', 'Orders to approve', $reviewQueueCount],
        ['#suggestion-reviews', 'rule', 'Suggestions to check', $suggestionReviews->count()],
        ['#sensitive-chats', 'crisis_alert', 'Sensitive chats', $flaggedChats->count()],
        ['#dispatch', 'local_shipping', 'Blessing & shipping', $fulfilmentQueue->count()],
        ['#audit-log', 'fact_check', 'Activity log', null],
    ];
@endphp

@section('body')
@include('partials.op-header')

<div class="flex flex-col min-h-screen">
    <main class="w-full bg-surface flex-1">
        <div class="relative w-full overflow-hidden px-space-lg py-space-xl">
            <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute top-10 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            @if (session('status'))
                <div class="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface shadow-xl ring-1 ring-primary/30" role="status">
                    <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
                </div>
            @endif
            @if ($errors->any())
                <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-error-container/30 text-error" role="alert">
                    <span class="material-symbols-outlined">error</span>
                    <span class="font-label-lg text-label-lg">{{ $errors->first() }}</span>
                </div>
            @endif

            {{-- Header Section --}}
            <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
                <div class="space-y-space-xs max-w-3xl">
                    <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Pandit team</span>
                    <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Pandit queue</h1>
                    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Everything waiting for a Pandit: remedy orders to check against the chart, Pandit Jii's product suggestions, sensitive chats that need a person, and remedies to bless and ship.
                    </p>
                </div>
                <form method="GET" action="{{ route('dashboard') }}" class="relative w-full md:w-80" role="search">
                    <label for="queue-search" class="sr-only">Search the queue</label>
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                    <input id="queue-search" name="q" value="{{ $search }}" type="search" placeholder="Search order number or name…" class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary/60">
                </form>
            </div>

            {{-- Jump to a part of the queue --}}
            <nav class="relative z-10 -mt-space-md mb-space-lg flex gap-2 overflow-x-auto pb-1" aria-label="Queue sections">
                @foreach ($navItems as [$href, $icon, $label, $count])
                    <a href="{{ $href }}" class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-lg text-label-lg">
                        <span class="material-symbols-outlined text-lg text-outline">{{ $icon }}</span> {{ $label }}
                        @if ($count)
                            <span class="min-w-5 h-5 px-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center">{{ $count }}</span>
                        @endif
                    </a>
                @endforeach
            </nav>

            {{-- KPI Metric Strip --}}
            <div class="op-stats relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter mb-space-xl">
                <div class="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden">
                    <div class="flex items-center justify-between mb-space-sm">
                        <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Orders to approve</span>
                        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-lg">diamond</span></div>
                    </div>
                    <div class="flex items-baseline gap-space-sm">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface">{{ $reviewQueueCount }}</span>
                        @if ($highUrgencyCount)
                            <span class="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-label-sm font-label-sm font-semibold">{{ $highUrgencyCount }} High Urgency</span>
                        @endif
                    </div>
                    <p class="mt-2 font-body-sm text-body-sm text-on-surface-variant">Paid, waiting for a Pandit to check the chart.</p>
                </div>
                <div class="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden">
                    <div class="flex items-center justify-between mb-space-sm">
                        <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Sensitive chats</span>
                        <div class="w-8 h-8 rounded-lg bg-error-container/30 flex items-center justify-center text-error"><span class="material-symbols-outlined text-lg">crisis_alert</span></div>
                    </div>
                    <div class="flex items-baseline gap-space-sm">
                        <span class="font-display-lg text-display-lg font-bold {{ $flaggedChats->isNotEmpty() ? 'text-error' : 'text-on-surface' }}">{{ $flaggedChats->count() }}</span>
                        @if ($flaggedChats->isNotEmpty())
                            <span class="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-label-sm font-semibold">Needs a person</span>
                        @endif
                    </div>
                    <p class="mt-2 font-body-sm text-body-sm text-on-surface-variant">Health, distress or legal topics that need a person</p>
                </div>
                <div class="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden">
                    <div class="flex items-center justify-between mb-space-sm">
                        <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Refunds to send</span>
                        <div class="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary"><span class="material-symbols-outlined text-lg">currency_exchange</span></div>
                    </div>
                    <div class="flex items-baseline gap-space-sm">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface">{{ $inr($refundClaimTotal) }}</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary text-label-sm font-label-sm font-semibold">{{ $refundClaimCount }} {{ Str::plural('claim', $refundClaimCount) }}</span>
                    </div>
                    <p class="mt-2 font-body-sm text-body-sm text-on-surface-variant">Money to send back to customers</p>
                </div>
                <div class="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden">
                    <div class="flex items-center justify-between mb-space-sm">
                        <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Ready to bless</span>
                        <div class="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface"><span class="material-symbols-outlined text-lg">temple_hindu</span></div>
                    </div>
                    <div class="flex items-baseline gap-space-sm">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface">{{ $pipelineCount }}</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm font-semibold">Ready</span>
                    </div>
                    <p class="mt-2 font-body-sm text-body-sm text-on-surface-variant">Approved remedies waiting to be blessed</p>
                </div>
            </div>

            {{-- Section 1: Approval Queue --}}
            <section id="approvals" class="relative z-10 mb-space-xl scroll-mt-20">
                <div class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
                        <div>
                            <div class="flex items-center gap-space-xs">
                                <span class="material-symbols-outlined text-primary text-xl">verified_user</span>
                                <h2 class="font-headline-sm text-headline-sm text-on-surface">Orders to approve</h2>
                            </div>
                            <p class="font-body-sm text-body-sm text-outline mt-1">Check each remedy against the person's chart, then approve it, ask for a trial first, or reject it (they get a full refund).</p>
                        </div>
                        <div class="flex items-center bg-surface-container rounded-lg p-1 text-label-sm font-label-sm">
                            @foreach ([null => "All ({$reviewQueueCount})", 'saturnian' => 'Saturnian (Neelam)', 'solar-jovian' => 'Solar / Jovian'] as $filterKey => $filterLabel)
                                <a href="{{ route('dashboard', array_filter(['planet' => $filterKey, 'q' => $search])) }}#approvals"
                                   class="px-3 py-1 rounded {{ $planetFilter == $filterKey ? 'bg-surface-container-highest text-primary font-semibold shadow-sm' : 'text-outline hover:text-on-surface transition-colors' }}">{{ $filterLabel }}</a>
                            @endforeach
                        </div>
                    </div>
                    <div class="w-full overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                                    <th class="py-3 px-space-md rounded-l-lg font-semibold">Order ID &amp; Customer</th>
                                    <th class="py-3 px-space-md font-semibold">Prescribed Remedy &amp; Price</th>
                                    <th class="py-3 px-space-md font-semibold min-w-[240px]">Why it was suggested</th>
                                    <th class="py-3 px-space-md font-semibold">Suitability &amp; Status</th>
                                    <th class="py-3 px-space-md rounded-r-lg font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                                @forelse ($reviewQueue as $order)
                                    @php($isRisky = $order->is_high_risk)
                                    <tr class="hover:bg-surface-container/60 transition-colors">
                                        <td class="py-4 px-space-md">
                                            <div class="flex items-center gap-space-sm">
                                                <div class="w-10 h-10 rounded-xl {{ $isRisky ? 'bg-error-container/20 text-error' : 'bg-surface-container-high text-primary' }} flex items-center justify-center shrink-0">
                                                    <span class="material-symbols-outlined text-xl">{{ $isRisky ? 'warning' : 'auto_awesome' }}</span>
                                                </div>
                                                <div>
                                                    <div class="font-title-md text-title-md text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                                                        <span>#{{ $order->reference }}</span>
                                                        <span class="text-xs {{ $loop->first ? 'text-primary' : 'text-on-surface' }} font-medium">• {{ $order->customer_name }}</span>
                                                    </div>
                                                    <div class="font-body-sm text-body-sm text-outline flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                                                        @if ($order->lagna)
                                                            <span class="px-1.5 rounded bg-surface-container text-on-surface-variant text-[11px]">{{ $order->lagna }}</span>
                                                        @endif
                                                        <span>{{ $order->nakshatra ?? 'Birth chart not linked' }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 px-space-md">
                                            <div class="flex items-center gap-space-xs">
                                                <img class="w-9 h-9 rounded-lg object-cover shadow-sm" alt="{{ $order->remedy->image_alt }}" src="{{ $order->remedy->image }}">
                                                <div class="min-w-[180px]">
                                                    <div class="font-title-md text-body-md text-on-surface font-semibold">{{ $order->remedy->name }}</div>
                                                    <div class="font-body-sm text-body-sm {{ $isRisky ? 'text-secondary' : 'text-primary' }} font-bold">{{ $order->specification }} • {{ $inr($order->amount) }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 px-space-md">
                                            @if ($order->ai_rationale)
                                                <div class="{{ $isRisky ? 'p-2 rounded-lg bg-error-container/20' : '' }} text-on-surface-variant text-body-sm leading-relaxed">
                                                    <span class="{{ $isRisky ? 'text-error font-semibold uppercase tracking-wider text-[11px]' : 'text-secondary font-medium' }}">{{ $order->ai_rationale_title }}</span>
                                                    {{ $order->ai_rationale }}
                                                </div>
                                            @else
                                                <div class="text-outline text-body-sm leading-relaxed">Direct store order — no AI prescription. Verify against the seeker's chart before approving.</div>
                                            @endif
                                        </td>
                                        <td class="py-4 px-space-md">
                                            <div class="mb-1.5 text-[11px] font-semibold whitespace-nowrap {{ $order->chart_compatibility ? ($isRisky ? 'text-error' : 'text-primary') : 'text-outline' }}">
                                                @if ($order->chart_compatibility)
                                                    {{ $order->chart_compatibility }}% {{ $isRisky ? 'Risk Threshold' : 'Compatibility' }}
                                                @else
                                                    Chart audit pending
                                                @endif
                                            </div>
                                            @if ($order->status === OrderStatus::TrialHold)
                                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-error font-label-sm text-label-sm font-semibold whitespace-nowrap">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-error"></span>{{ $order->status->label() }}
                                                </span>
                                            @else
                                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm font-semibold whitespace-nowrap">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>{{ $order->status->label() }}
                                                </span>
                                            @endif
                                        </td>
                                        <td class="py-4 px-space-md text-right">
                                            <div class="flex items-center justify-end gap-1.5">
                                                <form method="POST" action="{{ route('orders.review.store', $order) }}">
                                                    @csrf
                                                    @if ($isRisky && $order->status === OrderStatus::AwaitingApproval)
                                                        <input type="hidden" name="decision" value="trial">
                                                        <button type="submit" class="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-all shadow-sm flex items-center gap-1 whitespace-nowrap">
                                                            <span class="material-symbols-outlined text-base text-secondary">science</span>
                                                            <span>Order Amethyst Test</span>
                                                        </button>
                                                    @else
                                                        <input type="hidden" name="decision" value="approve">
                                                        <button type="submit" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm flex items-center gap-1">
                                                            <span class="material-symbols-outlined text-base">check_circle</span>
                                                            <span>Approve</span>
                                                        </button>
                                                    @endif
                                                </form>
                                                <form method="POST" action="{{ route('orders.review.store', $order) }}" onsubmit="return confirm('Reject #{{ $order->reference }} and refund {{ $inr($order->amount) }}?')">
                                                    @csrf
                                                    <input type="hidden" name="decision" value="reject">
                                                    <button type="submit" class="px-2.5 py-1.5 rounded-lg {{ $isRisky ? 'bg-error-container text-on-error-container hover:opacity-90' : 'bg-error-container/30 text-error hover:bg-error-container/60' }} transition-all font-label-md text-label-md" title="Reject &amp; Refund" aria-label="Reject and refund #{{ $order->reference }}">
                                                        <span class="material-symbols-outlined text-base">close</span>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="py-space-xl text-center text-outline">
                                            <span class="material-symbols-outlined text-3xl text-primary/60">task_alt</span>
                                            <p class="mt-2 font-body-md text-body-md">No remedies awaiting verification{{ $search || $planetFilter ? ' for this filter' : '' }}.</p>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {{-- Section 2: Consecration Dispatch --}}
            <section id="dispatch" class="relative z-10 mb-space-xl scroll-mt-20">
                <div class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                    <div class="pb-space-lg">
                        <div class="flex items-center gap-space-xs">
                            <span class="material-symbols-outlined text-primary text-xl">temple_hindu</span>
                            <h2 class="font-headline-sm text-headline-sm text-on-surface">Blessing &amp; shipping</h2>
                        </div>
                        <p class="font-body-sm text-body-sm text-outline mt-1">Approved remedies: mark each step as it happens — blessed, shipped, delivered.</p>
                    </div>
                    @if ($fulfilmentQueue->isEmpty())
                        <p class="py-space-md text-center font-body-md text-body-md text-outline">Nothing in the pipeline. Approved remedies appear here.</p>
                    @else
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
                            @foreach ($fulfilmentQueue as $order)
                                @php($nextStatus = $order->status->nextFulfilmentStatus())
                                <div class="p-space-md rounded-xl bg-surface-container flex items-center gap-space-sm">
                                    <img class="w-12 h-12 rounded-lg object-cover" alt="{{ $order->remedy->image_alt }}" src="{{ $order->remedy->image }}">
                                    <div class="flex-1 min-w-0">
                                        <div class="font-title-md text-body-md text-on-surface font-semibold">#{{ $order->reference }} • {{ $order->customer_name }}</div>
                                        <div class="font-body-sm text-body-sm text-outline truncate">{{ $order->remedy->name }}</div>
                                        <span class="font-label-sm text-label-sm text-primary uppercase">{{ $order->status->label() }}</span>
                                    </div>
                                    <form method="POST" action="{{ route('orders.fulfilment.store', $order) }}">
                                        @csrf
                                        <button type="submit" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all whitespace-nowrap">
                                            Mark {{ Str::before($nextStatus->label(), ' •') }}
                                        </button>
                                    </form>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </section>

            {{-- Section 3: Pandit Jii product suggestions and reported chats waiting for a human Pandit --}}
            <section id="suggestion-reviews" class="relative z-10 mb-space-xl scroll-mt-20">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                    <div>
                        <div class="flex items-center gap-space-xs">
                            <span class="material-symbols-outlined text-secondary text-xl">rule</span>
                            <h2 class="font-headline-sm text-headline-sm text-on-surface">Pandit Jii Suggestions to Approve</h2>
                        </div>
                        <p class="font-body-sm text-body-sm text-outline mt-1">Product suggestions that do not match the knowledge base, and chats the seeker reported. A held product stays hidden from the seeker until you approve it.</p>
                    </div>
                    @if ($suggestionReviews->isNotEmpty())
                        <span class="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-semibold whitespace-nowrap">{{ $suggestionReviews->count() }} Waiting for a Pandit</span>
                    @endif
                </div>
                @if ($suggestionReviews->isEmpty())
                    <p class="p-space-lg rounded-2xl bg-surface-container-low text-center font-body-md text-body-md text-outline">Nothing to approve. Every suggestion matches the knowledge base.</p>
                @else
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                        @foreach ($suggestionReviews as $message)
                            @php($answer = json_decode($message->content, true) ?? [])
                            @php($question = $message->question())
                            @php($chart = $message->seeker?->chart_details)
                            <div class="p-space-lg rounded-2xl bg-surface-container-low shadow-lg flex flex-col justify-between">
                                <div class="space-y-space-sm">
                                    <div class="flex items-start justify-between gap-space-sm">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-title-lg text-title-lg text-on-surface">{{ $message->seeker?->name ?? 'Seeker' }}</span>
                                                <a href="{{ route('seekers.show', $message->seeker_id) }}" class="font-label-sm text-label-sm text-outline font-semibold hover:text-primary">User #US-{{ $message->seeker_id }}</a>
                                            </div>
                                            <div class="text-body-sm font-body-sm text-outline mt-0.5">
                                                Chat #CT-{{ $message->id }} • {{ $message->created_at->timezone('Asia/Kolkata')->format('j M, H:i') }} IST
                                                @if ($chart)
                                                    • {{ $chart['ascendant'] ?? '?' }} rising{{ ($chart['birth_time_known'] ?? true) ? '' : ' (time unknown)' }} • {{ $chart['mahadasha'] ?? '?' }}–{{ $chart['antardasha'] ?? '?' }}
                                                @else
                                                    • No chart
                                                @endif
                                            </div>
                                        </div>
                                        <span class="px-2.5 py-1 rounded-full {{ $message->reported_at ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-secondary' }} font-label-sm text-label-sm font-semibold uppercase tracking-wider whitespace-nowrap">{{ $message->reported_at ? 'Reported by seeker' : 'Held by check' }}</span>
                                    </div>
                                    @if ($question)
                                        <p class="font-body-sm text-body-sm text-on-surface-variant"><span class="font-semibold text-on-surface">Question:</span> {{ Str::limit($question->content, 240) }}</p>
                                    @endif
                                    <div class="p-space-md rounded-xl bg-surface-container space-y-2">
                                        <p class="font-body-sm text-body-sm text-on-surface"><span class="font-semibold">Pandit Jii:</span> {{ $answer['short_answer'] ?? '' }}</p>
                                        @if (filled($answer['practical_step'] ?? null))
                                            <p class="font-body-sm text-body-sm text-on-surface-variant">{{ $answer['practical_step'] }}</p>
                                        @endif
                                        @if ($message->remedy)
                                            <div class="flex items-center gap-space-sm pt-1">
                                                <img src="{{ $message->remedy->image }}" alt="" class="w-10 h-10 rounded-lg object-cover">
                                                <div class="min-w-0">
                                                    <div class="font-title-md text-body-md text-on-surface font-semibold truncate">{{ $message->remedy->name }}</div>
                                                    <a href="{{ route('knowledge.edit', $message->remedy) }}" class="font-label-sm text-label-sm text-primary hover:underline">Open knowledge base entry</a>
                                                </div>
                                            </div>
                                        @endif
                                    </div>
                                    @if ($message->reported_at)
                                        <p class="font-body-sm text-body-sm text-on-surface-variant flex items-start gap-1.5">
                                            <span class="material-symbols-outlined text-error text-base">flag</span>
                                            <span><span class="font-semibold text-on-surface">Seeker's report:</span> {{ $message->report_reason ?: 'No reason given.' }}</span>
                                        </p>
                                    @endif
                                    @if ($message->remedy_slug)
                                        @if (filled($message->review_reasons))
                                            <ul class="space-y-1">
                                                @foreach ($message->review_reasons as $reason)
                                                    <li class="font-body-sm text-body-sm text-error flex items-start gap-1.5"><span class="material-symbols-outlined text-base">error</span> {{ $reason }}</li>
                                                @endforeach
                                            </ul>
                                        @else
                                            <p class="font-body-sm text-body-sm text-primary flex items-center gap-1.5"><span class="material-symbols-outlined text-base">verified</span> Knowledge-base check passed. The product is still shown to the seeker.</p>
                                        @endif
                                    @endif
                                </div>
                                <form method="POST" action="{{ route('chat-reviews.store', $message) }}" class="pt-space-md mt-space-md border-t border-surface-container-highest/50 space-y-space-sm">
                                    @csrf
                                    <input name="note" maxlength="500" class="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary/50" placeholder="Note for the seeker (optional, shown in their chat)">
                                    <div class="flex items-center justify-end gap-space-sm">
                                        @if ($message->remedy_slug)
                                            <button type="submit" name="decision" value="{{ ChatMessage::REVIEW_REMOVED }}" class="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-error text-label-sm font-label-sm font-semibold transition-all">Remove product</button>
                                        @endif
                                        <button type="submit" name="decision" value="{{ ChatMessage::REVIEW_APPROVED }}" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim text-label-sm font-label-sm font-semibold transition-all">{{ $message->remedy_slug ? 'Approve suggestion' : 'Mark checked' }}</button>
                                    </div>
                                </form>
                            </div>
                        @endforeach
                    </div>
                @endif
            </section>

            {{-- Section 4: Flagged Sensitive Chats --}}
            <section id="sensitive-chats" class="relative z-10 mb-space-xl scroll-mt-20">
                <div class="flex items-center justify-between mb-space-md">
                    <div>
                        <div class="flex items-center gap-space-xs">
                            <span class="material-symbols-outlined text-error text-xl">health_and_safety</span>
                            <h2 class="font-headline-sm text-headline-sm text-on-surface">Sensitive chats</h2>
                        </div>
                        <p class="font-body-sm text-body-sm text-outline mt-1">Chats where Pandit Jii stopped and gave a helpline or declined, so a person should follow up.</p>
                    </div>
                    @if ($flaggedChats->isNotEmpty())
                        <span class="px-3 py-1 rounded-full bg-error-container/30 text-error font-label-sm text-label-sm font-semibold flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
                            {{ $flaggedChats->count() }} need a Pandit to follow up
                        </span>
                    @endif
                </div>
                @if ($flaggedChats->isEmpty())
                    <p class="p-space-lg rounded-2xl bg-surface-container-low text-center font-body-md text-body-md text-outline">No open escalations.</p>
                @else
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                        @foreach ($flaggedChats as $chat)
                            @php($isHealth = $chat->flag_type === FlagType::Health)
                            <div class="p-space-lg rounded-2xl bg-surface-container-low shadow-lg relative overflow-hidden flex flex-col justify-between">
                                <div class="space-y-space-sm">
                                    <div class="flex items-start justify-between gap-space-sm">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-title-lg text-title-lg text-on-surface">{{ $chat->user_name }}</span>
                                                <span class="font-label-sm text-label-sm text-outline font-semibold">User {{ $chat->user_reference }}</span>
                                            </div>
                                            <div class="text-body-sm font-body-sm text-outline mt-0.5">Session Ref: {{ $chat->session_reference }} • {{ $chat->flagged_at->timezone('Asia/Kolkata')->format('H:i') }} IST</div>
                                        </div>
                                        <span class="px-2.5 py-1 rounded-full {{ $isHealth ? 'bg-error text-on-error font-bold' : 'bg-secondary-container text-secondary font-semibold' }} font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap">{{ $chat->flag_type->label() }}</span>
                                    </div>
                                    <div class="p-space-md rounded-xl bg-surface-container space-y-2">
                                        <div class="flex items-center justify-between gap-space-sm text-label-sm font-label-sm text-outline">
                                            <span class="font-semibold {{ $isHealth ? 'text-error' : 'text-secondary' }} flex items-center gap-1">
                                                <span class="material-symbols-outlined text-sm">{{ $chat->flag_type->icon() }}</span> {{ $chat->trigger_label }}
                                            </span>
                                            <span>{{ $chat->transit_axis }}</span>
                                        </div>
                                        <p class="font-body-sm text-body-sm text-on-surface italic">“{{ $chat->summary }}”</p>
                                    </div>
                                    <div class="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                                        <span class="material-symbols-outlined text-primary text-base">verified</span>
                                        <span>Action Taken: {{ $chat->action_taken }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between pt-space-md mt-space-md border-t border-surface-container-highest/50">
                                    <div class="flex items-center gap-2">
                                        @if ($chat->assigned_to)
                                            <div class="w-7 h-7 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center font-label-sm font-bold">{{ $initials(Str::after($chat->assigned_to, 'Pandit ')) }}</div>
                                            <span class="font-body-sm text-body-sm text-on-surface">Assigned: {{ $chat->assigned_to }}</span>
                                        @else
                                            <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                            <span class="font-body-sm text-body-sm text-on-surface">Unassigned</span>
                                        @endif
                                    </div>
                                    <form method="POST" action="{{ route('flagged-chats.resolution.store', $chat) }}">
                                        @csrf
                                        <button type="submit" class="px-3 py-1.5 rounded-lg {{ $isHealth ? 'bg-primary text-on-primary hover:bg-primary-fixed-dim' : 'bg-surface-container-highest text-outline hover:text-on-surface' }} text-label-sm font-label-sm font-semibold transition-all">
                                            Resolve &amp; Close
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </section>

            {{-- Section 5: Audit Trail --}}
            <section id="audit-log" class="relative z-10 mb-space-xl scroll-mt-20">
                <div class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
                        <div>
                            <div class="flex items-center gap-space-xs">
                                <span class="material-symbols-outlined text-secondary text-xl">fact_check</span>
                                <h2 class="font-headline-sm text-headline-sm text-on-surface">Activity log</h2>
                            </div>
                            <p class="font-body-sm text-body-sm text-outline mt-1">Everything the team and Pandit Jii did, newest first. Entries are chained so they can't be changed later.</p>
                        </div>
                        <div class="flex items-center gap-space-xs text-label-sm font-label-sm text-outline">
                            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span>{{ number_format($latestAuditLogId) }} entries</span>
                        </div>
                    </div>
                    <div class="w-full overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                                    <th class="py-3 px-space-md rounded-l-lg font-semibold">Timestamp (IST)</th>
                                    <th class="py-3 px-space-md font-semibold">Pandit / Agent Name</th>
                                    <th class="py-3 px-space-md font-semibold">Action Type</th>
                                    <th class="py-3 px-space-md font-semibold">Ref Token</th>
                                    <th class="py-3 px-space-md font-semibold">Outcome &amp; Details</th>
                                    <th class="py-3 px-space-md rounded-r-lg font-semibold text-right">Verification Hash</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                                @foreach ($auditLogs as $log)
                                    @php($isAlert = Str::contains($log->action, ['Reject', 'Flag']))
                                    <tr class="hover:bg-surface-container/40 transition-colors">
                                        <td class="py-3.5 px-space-md text-body-sm font-mono text-outline whitespace-nowrap">{{ $log->created_at->timezone('Asia/Kolkata')->format('H:i:s') }}</td>
                                        <td class="py-3.5 px-space-md">
                                            <div class="flex items-center gap-2">
                                                @if ($log->actor_type === ActorType::Ai)
                                                    <div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary"><span class="material-symbols-outlined text-sm">smart_toy</span></div>
                                                @else
                                                    <div class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-[10px] font-bold">{{ $initials($log->actor_name) }}</div>
                                                @endif
                                                <span class="font-title-md text-body-md text-on-surface whitespace-nowrap">{{ $log->actor_name }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3.5 px-space-md">
                                            <span class="px-2 py-0.5 rounded {{ $isAlert ? 'bg-error-container/30 text-error' : 'bg-primary/10 text-primary' }} text-label-sm font-label-sm font-semibold">{{ $log->action }}</span>
                                        </td>
                                        <td class="py-3.5 px-space-md font-mono text-body-sm text-on-surface-variant font-medium whitespace-nowrap">{{ $log->reference_token }}</td>
                                        <td class="py-3.5 px-space-md text-body-sm text-on-surface">{{ $log->outcome }}</td>
                                        <td class="py-3.5 px-space-md text-right font-mono text-body-sm text-outline" title="{{ $log->hash }}">{{ $log->shortHash() }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="flex items-center justify-between pt-space-md">
                        <span class="font-body-sm text-body-sm text-outline">Showing {{ $auditLogs->count() }} of {{ $auditLogs->total() }} entries</span>
                        <div class="flex items-center gap-2">
                            @if ($auditLogs->previousPageUrl())
                                <a href="{{ $auditLogs->previousPageUrl() }}#audit-log" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Previous</a>
                            @endif
                            @if ($auditLogs->nextPageUrl())
                                <a href="{{ $auditLogs->nextPageUrl() }}#audit-log" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Next</a>
                            @endif
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</div>
@endsection
