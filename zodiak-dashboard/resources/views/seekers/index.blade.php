@extends('layouts.base', ['title' => 'Users • Zodiak Op-Center'])

@use('Illuminate\Support\Number')

@section('body')
@include('partials.op-header')

<main class="relative max-w-6xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div>
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Seekers</span>
            <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Users</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Everyone who has signed up to the Zodiak app.</p>
        </div>
        <form method="GET" action="{{ route('seekers.index') }}" class="relative w-full md:w-96">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input name="q" value="{{ $search }}" type="search" placeholder="Search name, email or phone..." class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary/50 font-body-md text-body-md">
        </form>
    </div>

    <div class="op-stats relative z-10 grid grid-cols-3 gap-3 sm:gap-gutter mb-space-lg">
        @foreach ([['Total users', $totals['all'], 'group', 'text-primary'], ['With birth chart', $totals['with_chart'], 'flare', 'text-secondary'], ['Joined this week', $totals['this_week'], 'trending_up', 'text-primary']] as [$label, $value, $icon, $tone])
            <div class="p-space-lg rounded-xl bg-surface-container-low shadow-md">
                <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">{{ $label }}</span>
                    <span class="material-symbols-outlined {{ $tone }}">{{ $icon }}</span>
                </div>
                <span class="mt-2 block font-display-lg text-display-lg font-bold text-on-surface">{{ number_format($value) }}</span>
            </div>
        @endforeach
    </div>

    <section class="relative z-10 p-space-sm md:p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
        {{-- Phones: one card per user --}}
        <div class="md:hidden divide-y divide-surface-container-high/50">
            @forelse ($seekers as $seeker)
                <a href="{{ route('seekers.show', $seeker) }}" class="flex items-center gap-3 p-space-sm rounded-xl active:bg-surface-container/60">
                    <span class="w-10 h-10 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center font-label-md font-bold shrink-0">{{ Str::upper(Str::substr($seeker->name, 0, 1)) }}</span>
                    <span class="flex-1 min-w-0">
                        <span class="block font-title-md text-body-md text-on-surface font-semibold truncate">{{ $seeker->name }}</span>
                        <span class="block font-body-sm text-body-sm text-outline truncate">{{ $seeker->phone ?? $seeker->email }} • {{ $seeker->created_at->diffForHumans(short: true) }}</span>
                        <span class="block font-body-sm text-body-sm text-on-surface-variant">{{ $seeker->orders_count }} orders • {{ $seeker->questions_count }} questions • {{ $seeker->chart ? $seeker->chart['lagna'].' Lagna' : 'no chart' }}</span>
                    </span>
                    <span class="text-right shrink-0">
                        <span class="block font-title-md text-body-md font-bold {{ $seeker->credits > 0 ? 'text-primary' : 'text-error' }}">{{ number_format($seeker->credits) }}</span>
                        <span class="block font-label-sm text-label-sm text-outline">credits</span>
                    </span>
                </a>
            @empty
                <p class="py-space-xl text-center text-outline">{{ $search ? 'No users match this search.' : 'No one has signed up yet.' }}</p>
            @endforelse
        </div>

        <div class="hidden md:block w-full overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th class="py-3 px-space-md rounded-l-lg font-semibold">User</th>
                        <th class="py-3 px-space-md font-semibold">Contact</th>
                        <th class="py-3 px-space-md font-semibold">Birth chart</th>
                        <th class="py-3 px-space-md font-semibold text-center">Orders</th>
                        <th class="py-3 px-space-md font-semibold text-right">Paid</th>
                        <th class="py-3 px-space-md font-semibold text-center">Questions</th>
                        <th class="py-3 px-space-md font-semibold text-center">Palm</th>
                        <th class="py-3 px-space-md font-semibold text-center">Credits</th>
                        <th class="py-3 px-space-md rounded-r-lg font-semibold">Joined</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                    @forelse ($seekers as $seeker)
                        <tr class="hover:bg-surface-container/60 transition-colors">
                            <td class="py-3.5 px-space-md">
                                <a href="{{ route('seekers.show', $seeker) }}" class="flex items-center gap-space-sm group">
                                    <span class="w-9 h-9 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center font-label-md font-bold shrink-0">{{ Str::upper(Str::substr($seeker->name, 0, 1)) }}</span>
                                    <span>
                                        <span class="block font-title-md text-body-md font-semibold group-hover:text-primary transition-colors">{{ $seeker->name }}</span>
                                        <span class="block font-body-sm text-body-sm text-outline uppercase">{{ $seeker->locale ?? 'en' }}{{ $seeker->gender ? ' • '.$seeker->gender : '' }}</span>
                                    </span>
                                </a>
                            </td>
                            <td class="py-3.5 px-space-md font-body-sm text-body-sm">
                                <span class="block">{{ $seeker->phone ?? '—' }}</span>
                                <span class="block text-outline">{{ $seeker->email ?? '' }}</span>
                            </td>
                            <td class="py-3.5 px-space-md font-body-sm text-body-sm">
                                @if ($seeker->chart)
                                    <span class="block text-on-surface">{{ $seeker->chart['lagna'] }} Lagna</span>
                                    <span class="block text-outline">{{ $seeker->chart['nakshatra'] }} • {{ $seeker->chart['mahadasha'] }} dasha</span>
                                @else
                                    <span class="text-outline">Not added</span>
                                @endif
                            </td>
                            <td class="py-3.5 px-space-md text-center">{{ $seeker->orders_count }}</td>
                            <td class="py-3.5 px-space-md text-right whitespace-nowrap {{ $seeker->paid_total ? 'text-primary font-semibold' : 'text-outline' }}">{{ Number::currency((int) $seeker->paid_total, 'INR', 'en_IN', 0) }}</td>
                            <td class="py-3.5 px-space-md text-center">{{ $seeker->questions_count }}</td>
                            <td class="py-3.5 px-space-md text-center">{{ $seeker->palm_readings_count }}</td>
                            <td class="py-3.5 px-space-md text-center font-semibold {{ $seeker->credits > 0 ? 'text-primary' : 'text-error' }}">{{ number_format($seeker->credits) }}</td>
                            <td class="py-3.5 px-space-md font-body-sm text-body-sm text-outline whitespace-nowrap" title="{{ $seeker->created_at->timezone('Asia/Kolkata')->format('j M Y, H:i') }} IST">{{ $seeker->created_at->diffForHumans() }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="py-space-xl text-center text-outline">
                                <span class="material-symbols-outlined text-3xl text-primary/60">group_off</span>
                                <p class="mt-2 font-body-md text-body-md">{{ $search ? 'No users match this search.' : 'No one has signed up yet.' }}</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($seekers->hasPages())
            <div class="flex items-center justify-between pt-space-md">
                <span class="font-body-sm text-body-sm text-outline">Showing {{ $seekers->firstItem() }}–{{ $seekers->lastItem() }} of {{ $seekers->total() }}</span>
                <div class="flex items-center gap-2">
                    @if ($seekers->previousPageUrl())
                        <a href="{{ $seekers->previousPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Previous</a>
                    @endif
                    @if ($seekers->nextPageUrl())
                        <a href="{{ $seekers->nextPageUrl() }}" class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-label-md">Next</a>
                    @endif
                </div>
            </div>
        @endif
    </section>
</main>
@endsection
