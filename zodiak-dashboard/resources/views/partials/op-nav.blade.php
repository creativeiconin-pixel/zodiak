{{-- Sidebar menu with sub-menus. Used by the desktop sidebar and the phone slide-out menu. Expects: $menu (built in partials.op-header), $touch (bool) --}}
@php
    $rowPadding = $touch ? 'py-3' : 'py-2.5';
    $subPadding = $touch ? 'py-2.5' : 'py-2';
@endphp
<nav class="flex-1 overflow-y-auto px-3 pb-4" aria-label="Op-Center">
    @foreach ($menu as $heading => $items)
        <p class="px-3 pt-4 pb-1.5 font-label-sm text-label-sm uppercase tracking-widest text-outline">{{ $heading }}</p>
        @foreach ($items as $item)
            @if (empty($item['children']))
                <a href="{{ $item['url'] }}" @if ($item['active']) aria-current="page" @endif class="group flex items-center gap-3 px-3 {{ $rowPadding }} rounded-xl font-label-lg text-label-lg transition-colors {{ $item['active'] ? 'bg-primary/15 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' }}">
                    <span class="material-symbols-outlined text-xl {{ $item['active'] ? '' : 'text-outline group-hover:text-primary' }} transition-colors" @if ($item['active']) style="font-variation-settings: 'FILL' 1;" @endif>{{ $item['icon'] }}</span>
                    <span class="flex-1">{{ $item['label'] }}</span>
                    @if ($item['count'])
                        <span class="min-w-6 h-6 px-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center" title="{{ $item['title'] ?? $item['count'].' waiting' }}">{{ $item['count'] }}</span>
                    @endif
                </a>
            @else
                <details class="group/menu" @if ($item['active']) open @endif>
                    <summary class="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none flex items-center gap-3 px-3 {{ $rowPadding }} rounded-xl font-label-lg text-label-lg transition-colors {{ $item['active'] ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' }}">
                        <span class="material-symbols-outlined text-xl {{ $item['active'] ? '' : 'text-outline' }}" @if ($item['active']) style="font-variation-settings: 'FILL' 1;" @endif>{{ $item['icon'] }}</span>
                        <span class="flex-1">{{ $item['label'] }}</span>
                        @if ($item['count'])
                            <span class="min-w-6 h-6 px-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center" title="{{ $item['title'] ?? $item['count'].' waiting' }}">{{ $item['count'] }}</span>
                        @endif
                        <span class="material-symbols-outlined text-lg text-outline transition-transform duration-200 group-open/menu:rotate-90">chevron_right</span>
                    </summary>
                    <div class="ml-[1.35rem] mt-0.5 mb-1.5 pl-3 border-l border-surface-container-highest space-y-0.5">
                        @foreach ($item['children'] as $child)
                            <a href="{{ $child['url'] }}" data-op-menu-link @if ($child['active']) aria-current="page" @endif class="flex items-center gap-2 pl-3 pr-2 {{ $subPadding }} rounded-lg font-body-sm text-body-sm transition-colors {{ $child['active'] ? 'bg-primary/15 text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' }}">
                                <span class="flex-1 truncate">{{ $child['label'] }}</span>
                                @if ($child['count'] ?? null)
                                    <span class="min-w-5 h-5 px-1.5 rounded-full {{ ($child['urgent'] ?? false) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant' }} font-label-sm text-label-sm font-bold flex items-center justify-center">{{ $child['count'] }}</span>
                                @endif
                            </a>
                        @endforeach
                    </div>
                </details>
            @endif
        @endforeach
    @endforeach
</nav>
