@extends('layouts.base', ['title' => $seeker->name.' • Users • Zodiak Op-Center'])

@use('App\Enums\OrderStatus')
@use('Illuminate\Support\Number')

@php($inr = fn (int $amount): string => Number::currency($amount, 'INR', 'en_IN', 0))

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <a href="{{ route('seekers.index') }}" class="relative z-10 inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary mb-space-md">
        <span class="material-symbols-outlined text-lg">arrow_back</span> All users
    </a>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif

    {{-- Identity --}}
    <section class="relative z-10 p-space-lg rounded-2xl bg-surface-container-low shadow-xl flex flex-col md:flex-row md:items-center gap-space-lg mb-gutter">
        <span class="w-16 h-16 rounded-full bg-gradient-to-tr from-secondary-container to-primary-container text-on-primary flex items-center justify-center font-headline-md text-headline-md shrink-0">{{ Str::upper(Str::substr($seeker->name, 0, 1)) }}</span>
        <div class="flex-1 min-w-0">
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">{{ $seeker->name }}</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">
                {{ $seeker->phone ?? 'No phone' }} • {{ $seeker->email ?? 'No email' }} • Language: {{ strtoupper($seeker->locale ?? 'en') }}
            </p>
            <p class="font-body-sm text-body-sm text-outline">Joined {{ $seeker->created_at->timezone('Asia/Kolkata')->format('j M Y, H:i') }} IST</p>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-space-sm text-center">
            @foreach ([['Credits', number_format($seeker->credits)], ['Orders', $seeker->orders_count], ['Paid', $inr($paidTotal)], ['Questions', $seeker->questions_count], ['Palm', $seeker->palm_readings_count]] as [$label, $value])
                <div class="px-space-md py-space-sm rounded-xl bg-surface-container">
                    <span class="block font-title-lg text-title-lg text-primary font-bold whitespace-nowrap">{{ $value }}</span>
                    <span class="block font-label-sm text-label-sm uppercase tracking-wider text-outline">{{ $label }}</span>
                </div>
            @endforeach
        </div>
    </section>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {{-- Birth details --}}
        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-primary">flare</span> Birth details
            </h2>
            @if ($seeker->hasBirthDetails())
                <dl class="space-y-2 font-body-md text-body-md">
                    @foreach (array_filter([
                        'Date' => $seeker->birth_date?->format('j M Y'),
                        'Time' => $seeker->birth_time_unknown ? 'Not known' : $seeker->birth_time,
                        'Place' => $seeker->birth_place,
                        'Lagna' => $seeker->chart['lagna'] ?? null,
                        'Moon sign' => $seeker->chart['moon_sign'] ?? null,
                        'Sun sign' => $seeker->chart['sun_sign'] ?? null,
                        'Nakshatra' => $seeker->chart['nakshatra'] ?? null,
                        'Dasha now' => isset($seeker->chart['mahadasha']) ? $seeker->chart['mahadasha'].' – '.$seeker->chart['antardasha'] : null,
                    ]) as $label => $value)
                        <div class="flex justify-between gap-space-sm">
                            <dt class="text-outline">{{ $label }}</dt>
                            <dd class="text-on-surface text-right">{{ $value }}</dd>
                        </div>
                    @endforeach
                </dl>
            @else
                <p class="font-body-md text-body-md text-outline">This user has not added birth details yet.</p>
            @endif
        </section>

        {{-- Credits --}}
        <section class="lg:col-span-2 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-sm">
                <span class="material-symbols-outlined text-secondary">toll</span> Credits
                <span class="ml-auto font-title-lg text-title-lg text-primary font-bold">{{ number_format($seeker->credits) }}</span>
            </h2>
            <form method="POST" action="{{ route('seekers.credits.store', $seeker) }}" class="flex flex-wrap items-center gap-1.5 mb-space-md">
                @csrf
                <input name="amount" type="number" required min="-10000" max="10000" placeholder="+10 or -5" class="w-24 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <input name="reason" required maxlength="120" placeholder="Reason (e.g. gift)" class="flex-1 min-w-32 px-3 py-2 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <button type="submit" class="px-3 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg">Save</button>
            </form>
            @error('amount')<p class="-mt-space-sm mb-space-sm font-body-sm text-body-sm text-error">{{ $message }}</p>@enderror
            @forelse ($creditHistory as $entry)
                <div class="py-1.5 flex items-center gap-space-sm font-body-sm text-body-sm {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <span class="w-12 font-semibold tabular-nums {{ $entry->amount > 0 ? 'text-primary' : 'text-on-surface-variant' }}">{{ sprintf('%+d', $entry->amount) }}</span>
                    <span class="flex-1 min-w-0 truncate text-on-surface">{{ $entry->description ?? str_replace('_', ' ', $entry->reason) }}{{ $entry->creator ? ' • '.$entry->creator->name : '' }}</span>
                    <span class="text-outline whitespace-nowrap">{{ $entry->created_at->diffForHumans(short: true) }}</span>
                </div>
            @empty
                <p class="font-body-md text-body-md text-outline">No credit history yet.</p>
            @endforelse
        </section>

        {{-- Orders --}}
        <section class="lg:col-span-3 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-primary">shopping_bag</span> Orders
            </h2>
            @forelse ($orders as $order)
                <div class="flex items-center gap-space-sm py-2.5 {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <img src="{{ $order->remedy->image }}" alt="" class="w-11 h-11 rounded-lg object-cover">
                    <div class="flex-1 min-w-0">
                        <p class="font-title-md text-body-md text-on-surface font-semibold truncate">#{{ $order->reference }} • {{ $order->remedy->name }}</p>
                        <p class="font-body-sm text-body-sm text-outline">{{ $order->created_at->timezone('Asia/Kolkata')->format('j M Y') }} • {{ ucfirst(str_replace('_', ' ', $order->payment_status->value)) }} • {{ $order->payment_gateway }}</p>
                    </div>
                    <div class="text-right">
                        <span class="block font-title-md text-body-md text-primary font-semibold">{{ $inr($order->amount) }}</span>
                        <span class="block font-label-sm text-label-sm {{ in_array($order->status, [OrderStatus::Rejected, OrderStatus::PaymentFailed], true) ? 'text-error' : 'text-secondary' }}">{{ $order->status->label() }}</span>
                    </div>
                </div>
            @empty
                <p class="font-body-md text-body-md text-outline">No orders yet.</p>
            @endforelse
        </section>

        {{-- Questions to Pandit Jii --}}
        <section class="lg:col-span-2 p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-primary">forum</span> Recent questions to Pandit Jii
            </h2>
            @forelse ($questions as $question)
                <div class="py-2.5 flex items-start gap-space-sm {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <span class="material-symbols-outlined text-lg {{ $question->is_flagged ? 'text-error' : 'text-outline' }}">{{ $question->audio_path ? 'mic' : ($question->is_flagged ? 'flag' : 'chat_bubble') }}</span>
                    <p class="flex-1 font-body-md text-body-md text-on-surface">{{ Str::limit($question->content, 220) }}</p>
                    <span class="font-body-sm text-body-sm text-outline whitespace-nowrap">{{ $question->created_at->diffForHumans() }}</span>
                </div>
            @empty
                <p class="font-body-md text-body-md text-outline">No questions yet.</p>
            @endforelse
        </section>

        {{-- Palm readings --}}
        <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs mb-space-md">
                <span class="material-symbols-outlined text-primary">front_hand</span> Palm readings
            </h2>
            @forelse ($palmReadings as $reading)
                <div class="py-2.5 {{ $loop->first ? '' : 'border-t border-surface-container-highest/50' }}">
                    <p class="font-label-md text-label-md text-secondary uppercase">{{ $reading->hand }} hand • {{ $reading->created_at->diffForHumans() }}</p>
                    <p class="font-body-sm text-body-sm text-on-surface mt-0.5">{{ Str::limit($reading->result['summary'] ?? '', 160) }}</p>
                </div>
            @empty
                <p class="font-body-md text-body-md text-outline">No palm readings yet.</p>
            @endforelse
        </section>
    </div>
</main>
@endsection
