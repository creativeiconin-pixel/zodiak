@extends('layouts.base', ['title' => 'Orders • Zodiak Op-Center'])

@use('App\Enums\OrderStatus')
@use('App\Enums\PaymentStatus')
@use('Illuminate\Support\Number')
@php($inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0))

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Shop</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">All orders</h1>
    </div>

    {{-- Status chips --}}
    <div class="relative z-10 flex gap-2 mb-space-md overflow-x-auto pb-1 -mx-space-lg px-space-lg sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        <a href="{{ route('orders.index', array_filter(['q' => $filters['q'], 'payment' => $filters['payment']])) }}" class="shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md {{ $filters['status'] ? 'bg-surface-container text-on-surface-variant' : 'bg-primary text-on-primary' }}">All ({{ $statusCounts->sum() }})</a>
        @foreach (OrderStatus::cases() as $status)
            @if ($statusCounts[$status->value] ?? 0)
                <a href="{{ route('orders.index', array_filter(['status' => $status->value, 'q' => $filters['q'], 'payment' => $filters['payment']])) }}" class="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-label-md {{ $filters['status'] === $status->value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface' }}">{{ $status->label() }} ({{ $statusCounts[$status->value] }})</a>
            @endif
        @endforeach
    </div>

    <form method="GET" action="{{ route('orders.index') }}" class="relative z-10 flex flex-col sm:flex-row gap-space-sm mb-space-md">
        <input type="hidden" name="status" value="{{ $filters['status'] }}">
        <div class="relative flex-1">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input name="q" value="{{ $filters['q'] }}" type="search" placeholder="Order number, customer, phone or UTR..." class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary/50 font-body-md text-body-md">
        </div>
        <select name="payment" data-autosubmit aria-label="Payment status" class="px-3 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-secondary/50">
            <option value="">Any payment</option>
            @foreach (PaymentStatus::cases() as $payment)
                <option value="{{ $payment->value }}" @selected($filters['payment'] === $payment->value)>{{ ucfirst(str_replace('_', ' ', $payment->value)) }}</option>
            @endforeach
        </select>
    </form>

    <section class="relative z-10 p-space-sm md:p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
        {{-- Phones: one card per order --}}
        <div class="md:hidden divide-y divide-surface-container-high/50">
            @forelse ($orders as $order)
                <a href="{{ route('orders.show', $order) }}" class="flex gap-3 p-space-sm active:bg-surface-container/60 rounded-xl">
                    <img src="{{ $order->remedy->image }}" alt="" class="w-12 h-12 rounded-lg object-cover shrink-0">
                    <span class="flex-1 min-w-0">
                        <span class="flex items-baseline justify-between gap-2">
                            <span class="font-title-md text-body-md text-on-surface font-semibold whitespace-nowrap">#{{ $order->reference }}</span>
                            <span class="font-title-md text-body-md text-on-surface font-semibold whitespace-nowrap">{{ $inr($order->amount) }}</span>
                        </span>
                        <span class="block font-body-sm text-body-sm text-on-surface-variant truncate">{{ $order->remedy->name }} • {{ $order->customer_name }}</span>
                        @if ($order->payment_utr)
                            <span class="block font-mono text-body-sm text-on-surface tracking-wide">UTR {{ $order->payment_utr }}</span>
                        @endif
                        <span class="mt-1 flex items-center justify-between gap-2">
                            <span class="font-label-md text-label-md {{ $order->needsPaymentCheck() ? 'text-primary' : (in_array($order->status, [OrderStatus::Rejected, OrderStatus::PaymentFailed], true) ? 'text-error' : 'text-secondary') }}">{{ $order->adminStatusLabel() }}</span>
                            <span class="font-label-sm text-label-sm text-outline whitespace-nowrap">{{ $order->created_at->timezone('Asia/Kolkata')->format('j M, H:i') }}</span>
                        </span>
                    </span>
                </a>
            @empty
                <p class="py-space-xl text-center text-outline">No orders found.</p>
            @endforelse
        </div>

        <div class="hidden md:block w-full overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th class="py-3 px-space-md rounded-l-lg font-semibold">Order</th>
                        <th class="py-3 px-space-md font-semibold">Product</th>
                        <th class="py-3 px-space-md font-semibold">Customer</th>
                        <th class="py-3 px-space-md font-semibold text-right">Amount</th>
                        <th class="py-3 px-space-md font-semibold text-right">Profit</th>
                        <th class="py-3 px-space-md font-semibold">Payment</th>
                        <th class="py-3 px-space-md rounded-r-lg font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                    @forelse ($orders as $order)
                        <tr class="hover:bg-surface-container/60">
                            <td class="py-3 px-space-md">
                                <a href="{{ route('orders.show', $order) }}" class="font-semibold hover:text-primary whitespace-nowrap">#{{ $order->reference }}</a>
                                <span class="block font-body-sm text-body-sm text-outline">{{ $order->created_at->timezone('Asia/Kolkata')->format('j M, H:i') }}</span>
                            </td>
                            <td class="py-3 px-space-md">
                                <div class="flex items-center gap-2">
                                    <img src="{{ $order->remedy->image }}" alt="" class="w-9 h-9 rounded-lg object-cover">
                                    <span class="font-body-sm text-body-sm max-w-[200px] truncate">{{ $order->remedy->name }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-space-md font-body-sm text-body-sm">{{ $order->customer_name }}<span class="block text-outline">{{ $order->customer_phone }}</span></td>
                            <td class="py-3 px-space-md text-right font-semibold whitespace-nowrap">{{ $inr($order->amount) }}</td>
                            <td class="py-3 px-space-md text-right whitespace-nowrap text-primary">{{ $order->cost_amount ? $inr($order->amount - $order->cost_amount) : '—' }}</td>
                            <td class="py-3 px-space-md font-body-sm text-body-sm whitespace-nowrap">
                                <span class="uppercase text-outline">{{ $order->payment_gateway }}</span> · {{ ucfirst(str_replace('_', ' ', $order->payment_status->value)) }}
                                @if ($order->payment_utr)
                                    <span class="block font-mono text-on-surface tracking-wide" title="UTR / UPI reference number">UTR {{ $order->payment_utr }}</span>
                                @endif
                            </td>
                            <td class="py-3 px-space-md font-label-md text-label-md {{ $order->needsPaymentCheck() ? 'text-primary' : (in_array($order->status, [OrderStatus::Rejected, OrderStatus::PaymentFailed], true) ? 'text-error' : 'text-secondary') }}">
                                <span class="block">{{ $order->adminStatusLabel() }}</span>
                                @if ($order->needsPaymentCheck())
                                    <a href="{{ route('orders.show', $order) }}" class="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold whitespace-nowrap hover:bg-primary-fixed-dim">
                                        <span class="material-symbols-outlined text-sm">fact_check</span> Check UTR
                                    </a>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="7" class="py-space-xl text-center text-outline">No orders found.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($orders->hasPages())
            <div class="flex items-center justify-between pt-space-md">
                <span class="font-body-sm text-body-sm text-outline">Showing {{ $orders->firstItem() }}–{{ $orders->lastItem() }} of {{ $orders->total() }}</span>
                <div class="flex gap-2">
                    @if ($orders->previousPageUrl())<a href="{{ $orders->previousPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-label-md font-label-md">Previous</a>@endif
                    @if ($orders->nextPageUrl())<a href="{{ $orders->nextPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-label-md font-label-md">Next</a>@endif
                </div>
            </div>
        @endif
    </section>
</main>
@endsection
