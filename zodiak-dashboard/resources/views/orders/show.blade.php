@extends('layouts.base', ['title' => '#'.$order->reference.' • Orders • Zodiak Op-Center'])

@use('App\Enums\PaymentStatus')
@use('Illuminate\Support\Number')
@php($inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0))

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <a href="{{ route('orders.index') }}" class="relative z-10 inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary mb-space-md">
        <span class="material-symbols-outlined text-lg">arrow_back</span> All orders
    </a>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif
    @if ($errors->any())
        <div class="relative z-10 mb-space-md px-space-md py-3 rounded-xl bg-error-container/30 text-error font-body-md text-body-md" role="alert">{{ $errors->first() }}</div>
    @endif

    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col md:flex-row md:items-center gap-space-lg mb-gutter">
        <img src="{{ $order->remedy->image }}" alt="" class="w-20 h-20 rounded-xl object-cover">
        <div class="flex-1 min-w-0">
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">#{{ $order->reference }}</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ $order->remedy->name }} • {{ $order->specification }}</p>
            <p class="font-body-sm text-body-sm text-outline">Placed {{ $order->created_at->timezone('Asia/Kolkata')->format('j M Y, H:i') }} IST</p>
        </div>
        <div class="grid grid-cols-3 gap-space-sm text-center">
            @foreach ([['Amount', $inr($order->amount)], ['Cost', $order->cost_amount ? $inr($order->cost_amount) : '—'], ['Profit', $order->cost_amount ? $inr($order->amount - $order->cost_amount) : '—']] as [$label, $value])
                <div class="px-space-md py-space-sm rounded-xl bg-surface-container">
                    <span class="block font-title-lg text-title-lg text-primary font-bold whitespace-nowrap">{{ $value }}</span>
                    <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">{{ $label }}</span>
                </div>
            @endforeach
        </div>
    </section>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md"><span class="material-symbols-outlined text-primary">person</span> Customer</h2>
            <dl class="space-y-2 font-body-md text-body-md">
                @foreach (array_filter(['Name' => $order->customer_name, 'Phone' => $order->customer_phone, 'Address' => $order->address_line, 'City' => $order->city_postal, 'Lagna' => $order->lagna, 'Nakshatra' => $order->nakshatra, 'Gotra' => $order->gotra]) as $label => $value)
                    <div class="flex justify-between gap-space-sm"><dt class="text-outline">{{ $label }}</dt><dd class="text-on-surface text-right">{{ $value }}</dd></div>
                @endforeach
            </dl>
            @if ($order->seeker)
                <a href="{{ route('seekers.show', $order->seeker) }}" class="mt-space-md inline-flex items-center gap-1 font-label-lg text-label-lg text-primary">View user profile <span class="material-symbols-outlined text-base">arrow_forward</span></a>
            @endif
        </section>

        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md"><span class="material-symbols-outlined text-primary">payments</span> Payment</h2>
            <dl class="space-y-2 font-body-md text-body-md">
                @foreach (array_filter([
                    'Method' => strtoupper($order->payment_gateway),
                    'Status' => ucfirst(str_replace('_', ' ', $order->payment_status->value)),
                    'UTR' => $order->payment_utr,
                    'Reference' => $order->payment_reference,
                    'Submitted' => $order->payment_submitted_at?->timezone('Asia/Kolkata')->format('j M, H:i'),
                    'Verified' => $order->payment_verified_at ? $order->payment_verified_at->timezone('Asia/Kolkata')->format('j M, H:i').' by '.($order->paymentVerifier?->name ?? '—') : null,
                    'Note' => $order->payment_note,
                ]) as $label => $value)
                    <div class="flex justify-between gap-space-sm"><dt class="text-outline">{{ $label }}</dt><dd class="text-on-surface text-right {{ $label === 'UTR' ? 'font-mono select-all' : '' }}">{{ $value }}</dd></div>
                @endforeach
            </dl>
            @if ($order->payment_status === PaymentStatus::VerificationPending)
                <div class="mt-space-md flex flex-wrap gap-2">
                    <form method="POST" action="{{ route('orders.payment-verification.store', $order) }}">@csrf<input type="hidden" name="decision" value="verify">
                        <button class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg">Verify payment</button>
                    </form>
                    <form method="POST" action="{{ route('orders.payment-verification.store', $order) }}" class="flex gap-1">@csrf<input type="hidden" name="decision" value="reject">
                        <input name="note" required maxlength="200" placeholder="Reason" class="w-36 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-error">
                        <button class="px-3 py-2 rounded-lg bg-error-container/40 text-error font-label-lg text-label-lg">Reject</button>
                    </form>
                </div>
            @elseif ($order->payment_status === PaymentStatus::RefundPending)
                <form method="POST" action="{{ route('orders.refund.store', $order) }}" class="mt-space-md flex gap-1">@csrf
                    <input name="refund_reference" required maxlength="64" placeholder="Refund UTR / note" class="flex-1 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
                    <button class="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg">Mark refunded</button>
                </form>
            @endif
        </section>

        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md"><span class="material-symbols-outlined text-primary">temple_hindu</span> Pandit review</h2>
            <p class="font-title-md text-title-md text-secondary">{{ $order->status->label() }}</p>
            @if ($order->reviewer)
                <p class="font-body-sm text-body-sm text-outline mt-1">Reviewed by {{ $order->reviewer->name }} on {{ $order->reviewed_at?->timezone('Asia/Kolkata')->format('j M, H:i') }}</p>
            @endif
            @if ($order->ai_rationale)
                <p class="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{{ $order->ai_rationale_title }} {{ $order->ai_rationale }}</p>
            @endif
            <a href="{{ route('dashboard') }}#approvals" class="mt-space-md inline-flex items-center gap-1 font-label-lg text-label-lg text-primary">Open pandit queue <span class="material-symbols-outlined text-base">arrow_forward</span></a>
        </section>

        <section class="lg:col-span-3 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md"><span class="material-symbols-outlined text-primary">history</span> History</h2>
            @forelse ($history as $log)
                <div class="py-2 flex flex-wrap items-baseline gap-x-space-md {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <span class="font-mono text-body-sm text-outline">{{ $log->created_at->timezone('Asia/Kolkata')->format('j M H:i') }}</span>
                    <span class="font-label-md text-label-md text-primary">{{ $log->action }}</span>
                    <span class="font-body-sm text-body-sm text-on-surface flex-1">{{ $log->outcome }}</span>
                    <span class="font-body-sm text-body-sm text-outline">{{ $log->actor_name }}</span>
                </div>
            @empty
                <p class="font-body-md text-body-md text-outline">No actions yet.</p>
            @endforelse
        </section>
    </div>
</main>
@endsection
