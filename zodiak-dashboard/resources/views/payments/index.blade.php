@extends('layouts.base', ['title' => 'Payments • Zodiak Op-Center'])

@use('Illuminate\Support\Number')
@php($inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0))

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">UPI</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Payments</h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">Open your bank or UPI app, find the payment with the same <b>UTR</b> and <b>amount</b>, then press Verify. If you can't find it, Reject with a short reason — the customer can enter a new UTR.</p>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif
    @if ($errors->any())
        <div class="relative z-10 mb-space-md px-space-md py-3 rounded-xl bg-error-container/30 text-error font-body-md text-body-md" role="alert">{{ $errors->first() }}</div>
    @endif

    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-space-lg">
        @foreach ([['To verify now', $toVerify->count() + $rechargesToVerify->count(), 'pending_actions', 'text-error'], ['Waiting for customer to pay', $awaitingCount, 'hourglass_top', 'text-secondary'], ['Verified today', $inr($collectedToday), 'savings', 'text-primary']] as [$label, $value, $icon, $tone])
            <div class="p-space-lg rounded-xl bg-surface-container-low shadow-md">
                <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-2 block font-display-lg text-display-lg font-bold text-on-surface">{{ $value }}</span>
            </div>
        @endforeach
    </div>

    {{-- Verification queue --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter">
        <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
            <span class="material-symbols-outlined text-error">pending_actions</span> Check these UTRs
        </h2>
        @forelse ($toVerify as $order)
            <div class="py-space-md flex flex-col lg:flex-row lg:items-center gap-space-md {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                <div class="flex items-center gap-space-sm flex-1 min-w-0">
                    <img src="{{ $order->remedy->image }}" alt="" class="w-12 h-12 rounded-lg object-cover">
                    <div class="min-w-0">
                        <a href="{{ route('orders.show', $order) }}" class="font-title-md text-body-md text-on-surface font-semibold hover:text-primary">#{{ $order->reference }} • {{ $order->customer_name }}</a>
                        <p class="font-body-sm text-body-sm text-outline truncate">{{ $order->remedy->name }} • {{ $order->customer_phone }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-space-lg">
                    <div>
                        <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">Amount</span>
                        <span class="block font-title-lg text-title-lg text-primary font-bold">{{ $inr($order->amount) }}</span>
                    </div>
                    <div>
                        <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">UTR</span>
                        <span class="block font-mono text-title-md text-on-surface tracking-wider select-all">{{ $order->payment_utr }}</span>
                        <span class="block font-body-sm text-body-sm text-outline">{{ $order->payment_submitted_at?->diffForHumans() }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <form method="POST" action="{{ route('orders.payment-verification.store', $order) }}">
                        @csrf
                        <input type="hidden" name="decision" value="verify">
                        <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1 hover:bg-primary-fixed-dim">
                            <span class="material-symbols-outlined text-base">verified</span> Verify
                        </button>
                    </form>
                    <form method="POST" action="{{ route('orders.payment-verification.store', $order) }}" class="flex items-center gap-1">
                        @csrf
                        <input type="hidden" name="decision" value="reject">
                        <input name="note" required maxlength="200" placeholder="Reason (e.g. UTR not found)" class="w-48 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-error">
                        <button type="submit" class="px-3 py-2 rounded-lg bg-error-container/40 text-error font-label-lg text-label-lg hover:bg-error-container/70">Reject</button>
                    </form>
                    @include('payments.partials.delete-button', ['action' => route('orders.destroy', $order), 'label' => '#'.$order->reference, 'compact' => true])
                </div>
            </div>
        @empty
            <p class="font-body-md text-body-md text-outline">No payments waiting for a check. 🎉</p>
        @endforelse
    </section>

    {{-- Credit recharge queue --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter">
        <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
            <span class="material-symbols-outlined text-secondary">toll</span> Credit recharges to check
        </h2>
        @forelse ($rechargesToVerify as $recharge)
            <div class="py-space-md flex flex-col lg:flex-row lg:items-center gap-space-md {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                <div class="flex items-center gap-space-sm flex-1 min-w-0">
                    <span class="w-12 h-12 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined">toll</span>
                    </span>
                    <div class="min-w-0">
                        <a href="{{ route('seekers.show', $recharge->seeker) }}" class="font-title-md text-body-md text-on-surface font-semibold hover:text-primary">#{{ $recharge->reference }} • {{ $recharge->seeker->name }}</a>
                        <p class="font-body-sm text-body-sm text-outline truncate">{{ number_format($recharge->credits) }} credits • {{ $recharge->seeker->phone ?? $recharge->seeker->email }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-space-lg">
                    <div>
                        <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">Amount</span>
                        <span class="block font-title-lg text-title-lg text-primary font-bold">{{ $inr($recharge->amount) }}</span>
                    </div>
                    <div>
                        <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">UTR</span>
                        <span class="block font-mono text-title-md text-on-surface tracking-wider select-all">{{ $recharge->payment_utr }}</span>
                        <span class="block font-body-sm text-body-sm text-outline">{{ $recharge->payment_submitted_at?->diffForHumans() }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <form method="POST" action="{{ route('credit-recharges.verification.store', $recharge) }}">
                        @csrf
                        <input type="hidden" name="decision" value="verify">
                        <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1 hover:bg-primary-fixed-dim">
                            <span class="material-symbols-outlined text-base">verified</span> Verify &amp; add credits
                        </button>
                    </form>
                    <form method="POST" action="{{ route('credit-recharges.verification.store', $recharge) }}" class="flex items-center gap-1">
                        @csrf
                        <input type="hidden" name="decision" value="reject">
                        <input name="note" required maxlength="200" placeholder="Reason (e.g. UTR not found)" class="w-48 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-error">
                        <button type="submit" class="px-3 py-2 rounded-lg bg-error-container/40 text-error font-label-lg text-label-lg hover:bg-error-container/70">Reject</button>
                    </form>
                    @include('payments.partials.delete-button', ['action' => route('credit-recharges.destroy', $recharge), 'label' => '#'.$recharge->reference, 'compact' => true])
                </div>
            </div>
        @empty
            <p class="font-body-md text-body-md text-outline">No credit recharges waiting for a check.</p>
        @endforelse

        @if ($recentRecharges->isNotEmpty())
            <h3 class="mt-space-lg mb-space-xs font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Recently checked</h3>
            <div class="w-full overflow-x-auto">
                <table class="w-full text-left border-collapse font-body-sm text-body-sm text-on-surface">
                    <tbody class="divide-y divide-surface-container-high/40">
                        @foreach ($recentRecharges as $recharge)
                            <tr>
                                <td class="py-2 pr-space-md"><span class="font-semibold">#{{ $recharge->reference }}</span> <span class="text-outline">{{ $recharge->seeker->name }}</span></td>
                                <td class="py-2 pr-space-md">{{ number_format($recharge->credits) }} credits</td>
                                <td class="py-2 pr-space-md font-mono">{{ $recharge->payment_utr }}</td>
                                <td class="py-2 pr-space-md text-right font-semibold">{{ $inr($recharge->amount) }}</td>
                                <td class="py-2 pr-space-md {{ $recharge->status->value === 'credited' ? 'text-primary' : 'text-error' }}">{{ ucfirst($recharge->status->value) }}{{ $recharge->payment_note ? ' — '.$recharge->payment_note : '' }}</td>
                                <td class="py-2 text-outline">{{ $recharge->paymentVerifier?->name ?? '—' }} {{ $recharge->updated_at->timezone('Asia/Kolkata')->format('j M, H:i') }}</td>
                                <td class="py-2 text-right">
                                    @if ($recharge->canBeDeleted())
                                        @include('payments.partials.delete-button', ['action' => route('credit-recharges.destroy', $recharge), 'label' => '#'.$recharge->reference, 'compact' => true])
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    {{-- Refunds to send --}}
    @if ($refundPending->isNotEmpty())
        <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-secondary">currency_exchange</span> Refunds to send
            </h2>
            @foreach ($refundPending as $order)
                <div class="py-3 flex flex-col md:flex-row md:items-center gap-space-sm {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <a href="{{ route('orders.show', $order) }}" class="flex-1 font-title-md text-body-md text-on-surface font-semibold hover:text-primary">#{{ $order->reference }} • {{ $order->customer_name }} • {{ $order->customer_phone }}</a>
                    <span class="font-title-md text-title-md text-secondary font-bold">{{ $inr($order->amount) }}</span>
                    <form method="POST" action="{{ route('orders.refund.store', $order) }}" class="flex items-center gap-1">
                        @csrf
                        <input name="refund_reference" required maxlength="64" placeholder="Refund UTR / note" class="w-44 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
                        <button type="submit" class="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg">Mark refunded</button>
                    </form>
                </div>
            @endforeach
        </section>
    @endif

    {{-- Not paid yet: started but no UTR sent --}}
    @if ($awaitingOrders->isNotEmpty() || $unpaidRecharges->isNotEmpty())
        <details class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl mb-gutter">
            <summary class="cursor-pointer font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-secondary">hourglass_top</span> Not paid yet ({{ $awaitingOrders->count() + $unpaidRecharges->count() }})
            </summary>
            <p class="mt-1 font-body-sm text-body-sm text-outline">Started but no UTR sent. Delete old or test ones to keep this tidy.</p>
            <div class="mt-space-sm divide-y divide-surface-container-highest/50">
                @foreach ($awaitingOrders as $order)
                    <div class="py-2 flex items-center gap-space-sm font-body-md text-body-md">
                        <a href="{{ route('orders.show', $order) }}" class="flex-1 min-w-0 truncate hover:text-primary"><b>#{{ $order->reference }}</b> • {{ $order->customer_name }} • {{ $order->remedy?->name }}</a>
                        <span class="font-semibold">{{ $inr($order->amount) }}</span>
                        <span class="text-outline font-body-sm text-body-sm whitespace-nowrap">{{ $order->created_at->diffForHumans() }}</span>
                        @include('payments.partials.delete-button', ['action' => route('orders.destroy', $order), 'label' => '#'.$order->reference, 'compact' => true])
                    </div>
                @endforeach
                @foreach ($unpaidRecharges as $recharge)
                    <div class="py-2 flex items-center gap-space-sm font-body-md text-body-md">
                        <span class="flex-1 min-w-0 truncate"><b>#{{ $recharge->reference }}</b> • {{ $recharge->seeker?->name }} • {{ number_format($recharge->credits) }} credits</span>
                        <span class="font-semibold">{{ $inr($recharge->amount) }}</span>
                        <span class="text-outline font-body-sm text-body-sm whitespace-nowrap">{{ $recharge->created_at->diffForHumans() }}</span>
                        @include('payments.partials.delete-button', ['action' => route('credit-recharges.destroy', $recharge), 'label' => '#'.$recharge->reference, 'compact' => true])
                    </div>
                @endforeach
            </div>
        </details>
    @endif

    {{-- History --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
        <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
            <span class="material-symbols-outlined text-primary">history</span> Payment history
        </h2>
        <div class="w-full overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th class="py-3 px-space-md rounded-l-lg font-semibold">Order</th>
                        <th class="py-3 px-space-md font-semibold">Method</th>
                        <th class="py-3 px-space-md font-semibold">UTR / reference</th>
                        <th class="py-3 px-space-md font-semibold text-right">Amount</th>
                        <th class="py-3 px-space-md font-semibold">Status</th>
                        <th class="py-3 px-space-md font-semibold">Checked by</th>
                        <th class="py-3 px-space-md rounded-r-lg font-semibold"><span class="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                    @forelse ($history as $order)
                        <tr class="hover:bg-surface-container/60">
                            <td class="py-3 px-space-md"><a href="{{ route('orders.show', $order) }}" class="hover:text-primary font-semibold">#{{ $order->reference }}</a> <span class="text-outline font-body-sm text-body-sm">{{ $order->customer_name }}</span></td>
                            <td class="py-3 px-space-md uppercase font-label-md text-label-md text-on-surface-variant">{{ $order->payment_gateway }}</td>
                            <td class="py-3 px-space-md font-mono text-body-sm">{{ $order->payment_utr ?? $order->payment_reference ?? '—' }}</td>
                            <td class="py-3 px-space-md text-right font-semibold">{{ $inr($order->amount) }}</td>
                            <td class="py-3 px-space-md font-body-sm text-body-sm">{{ ucfirst(str_replace('_', ' ', $order->payment_status->value)) }}{{ $order->payment_note ? ' — '.$order->payment_note : '' }}</td>
                            <td class="py-3 px-space-md font-body-sm text-body-sm text-outline">{{ $order->paymentVerifier?->name ?? '—' }} {{ $order->payment_verified_at?->timezone('Asia/Kolkata')->format('j M, H:i') }}</td>
                            <td class="py-3 px-space-md text-right">
                                @if ($order->canBeDeleted())
                                    @include('payments.partials.delete-button', ['action' => route('orders.destroy', $order), 'label' => '#'.$order->reference, 'compact' => true])
                                @else
                                    <span class="material-symbols-outlined text-base text-outline" title="Verified payment — refund before deleting">lock</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="7" class="py-space-lg text-center text-outline">No payments yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($history->hasPages())
            <div class="flex justify-end gap-2 pt-space-md">
                @if ($history->previousPageUrl())<a href="{{ $history->previousPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-label-md font-label-md">Previous</a>@endif
                @if ($history->nextPageUrl())<a href="{{ $history->nextPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-label-md font-label-md">Next</a>@endif
            </div>
        @endif
    </section>
</main>
@endsection
