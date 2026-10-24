{{-- Delete button for a payment row. Expects: $action (DELETE url), $label (e.g. "#ZK-12345"), optional $compact --}}
<form method="POST" action="{{ $action }}" onsubmit="return confirm('Delete {{ $label }} and its payment record? This cannot be undone.');" class="inline-flex">
    @csrf
    @method('DELETE')
    <button type="submit" title="Delete {{ $label }}" aria-label="Delete {{ $label }}" class="{{ ($compact ?? false) ? 'p-1.5' : 'px-3 py-2' }} rounded-lg text-error hover:bg-error-container/40 font-label-lg text-label-lg flex items-center gap-1 transition-colors">
        <span class="material-symbols-outlined text-base">delete</span>@unless ($compact ?? false) Delete @endunless
    </button>
</form>
