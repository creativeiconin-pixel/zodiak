@extends('layouts.base', ['title' => 'Integrations • Zodiak Op-Center'])

@section('body')
@include('partials.op-header')

<main class="relative max-w-5xl mx-auto px-space-lg py-space-xl overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 mb-space-lg">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Settings</span>
        <h1 class="mt-space-xs font-headline-lg text-headline-lg text-on-surface tracking-tight">Integrations &amp; API Keys</h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Add or change keys here at any time. Saved keys are encrypted in the database and override the values in <code class="text-secondary">.env</code>.
            Secrets are never shown again — leave a secret field empty to keep the current key.
        </p>
    </div>

    @if (session('status'))
        <div class="relative z-10 mb-space-md flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary/10 text-primary" role="status">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-label-lg text-label-lg">{{ session('status') }}</span>
        </div>
    @endif
    @if ($errors->any())
        <div class="relative z-10 mb-space-md px-space-md py-3 rounded-xl bg-error-container/30 text-error" role="alert">
            <ul class="list-disc pl-5 font-body-md text-body-md">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form id="integrations-form" method="POST" action="{{ route('settings.integrations.update') }}" class="relative z-10 flex flex-col gap-5">
        @csrf
        @method('PUT')

        @foreach ($integrations as $slug => $integration)
            @php($test = session('connection_test'))
            <section class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                <div class="flex flex-wrap items-center justify-between gap-space-sm pb-space-md">
                    <div class="flex items-center gap-space-sm">
                        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <span class="material-symbols-outlined">{{ $integration['icon'] }}</span>
                        </div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface">{{ $integration['label'] }}</h2>
                    </div>
                    @if ($integration['testable'])
                        <button type="submit" form="test-{{ $slug }}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-all">
                            <span class="material-symbols-outlined text-base text-secondary">network_check</span> Test connection
                        </button>
                    @endif
                </div>

                @if ($test && $test['integration'] === $slug)
                    <div class="mb-space-md flex items-center gap-space-sm px-space-md py-2.5 rounded-lg {{ $test['ok'] ? 'bg-primary/10 text-primary' : 'bg-error-container/30 text-error' }}" role="status">
                        <span class="material-symbols-outlined">{{ $test['ok'] ? 'task_alt' : 'error' }}</span>
                        <span class="font-body-md text-body-md">{{ $test['message'] }}</span>
                    </div>
                @endif

                <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    @foreach ($integration['fields'] as $key => $field)
                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between gap-2">
                                <label for="{{ $field['input'] }}" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{{ $field['label'] }}</label>
                                <span class="font-label-sm text-label-sm {{ ['dashboard' => 'text-primary', 'env' => 'text-secondary', 'missing' => 'text-outline'][$field['source']] }}">
                                    {{ ['dashboard' => 'Saved here', 'env' => 'From .env', 'missing' => 'Not set'][$field['source']] }}
                                </span>
                            </div>
                            @if ($field['type'] === 'boolean')
                                <select id="{{ $field['input'] }}" name="{{ $field['input'] }}" class="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-body-md text-body-md">
                                    <option value="0" @selected($field['display'] === '0')>Off</option>
                                    <option value="1" @selected($field['display'] === '1')>On</option>
                                </select>
                            @else
                            <input
                                id="{{ $field['input'] }}"
                                name="{{ $field['input'] }}"
                                type="{{ $field['secret'] ? 'password' : 'text' }}"
                                autocomplete="off"
                                value="{{ $field['secret'] ? '' : old($field['input'], $field['display']) }}"
                                placeholder="{{ $field['secret'] && $field['display'] ? $field['display'].'  (leave empty to keep)' : $field['placeholder'] }}"
                                class="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary font-body-md text-body-md"
                            >
                            @endif
                            @if ($field['source'] === 'dashboard')
                                <label class="flex items-center gap-2 font-body-sm text-body-sm text-outline">
                                    <input type="checkbox" name="clear[]" value="{{ $key }}" class="accent-error">
                                    Remove saved value{{ $field['updated_at'] ? ' (saved '.$field['updated_at']->diffForHumans().')' : '' }}
                                </label>
                            @endif
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach

        <div class="flex justify-end">
            <button type="submit" class="flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                <span class="material-symbols-outlined text-lg">save</span> Save settings
            </button>
        </div>
    </form>

    {{-- Test forms live outside the settings form so a test never submits unsaved keys --}}
    @foreach ($integrations as $slug => $integration)
        @if ($integration['testable'])
            <form id="test-{{ $slug }}" method="POST" action="{{ route('settings.integrations.test', $slug) }}" class="hidden">@csrf</form>
        @endif
    @endforeach

    <p class="relative z-10 mt-space-lg font-body-sm text-body-sm text-outline">
        Tests only make read-only calls (Claude: model lookup · AgenticOrg: list agents · ElevenLabs: account info · Pine Labs: token). Save first, then test.
    </p>
</main>
@endsection
