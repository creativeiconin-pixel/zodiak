{{-- One labelled form input. Expects: $name, $label; optional: $value, $type, $placeholder, $hint, $required, $errorKey, $attributes --}}
@php
    $id = 'field-'.Str::slug(str_replace(['[', ']'], '-', $name));
    $errorKey ??= $name;
@endphp
<div class="space-y-1.5">
    <label for="{{ $id }}" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        {{ $label }}@if ($required ?? false)<span class="text-error" aria-hidden="true"> *</span>@endif
    </label>
    <input
        id="{{ $id }}"
        name="{{ $name }}"
        type="{{ $type ?? 'text' }}"
        value="{{ old($errorKey, $value ?? '') }}"
        placeholder="{{ $placeholder ?? '' }}"
        @if ($required ?? false) required @endif
        @if (($type ?? 'text') === 'number') min="0" step="1" inputmode="numeric" @endif
        @error($errorKey) aria-invalid="true" aria-describedby="{{ $id }}-error" @enderror
        class="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary font-body-md text-body-md @error($errorKey) ring-1 ring-error @enderror"
    >
    @error($errorKey)
        <p id="{{ $id }}-error" class="font-body-sm text-body-sm text-error">{{ $message }}</p>
    @else
        @isset($hint)
            <p class="font-body-sm text-body-sm text-outline">{{ $hint }}</p>
        @endisset
    @enderror
</div>
