@extends('layouts.base', ['title' => 'Sign in • Zodiak Op-Center'])

@section('body')
<main class="relative min-h-screen flex items-center justify-center px-space-lg overflow-hidden">
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md">
        <div class="flex flex-col items-center text-center mb-space-lg">
            <img alt="Zodiak Brand Logo" class="w-20 h-20 rounded-xl object-cover drop-shadow-[0_0_16px_rgba(242,202,80,0.35)] mb-space-md" src="/images/zodiak-logo.jpg">
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">Op-Center • Pandit Access</span>
            <h1 class="mt-space-sm font-headline-lg text-headline-lg text-on-surface tracking-tight">Remedy Verification</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Sign in to review AI-prescribed remedies and escalations.</p>
        </div>

        <form method="POST" action="{{ route('login.store') }}" class="p-space-lg rounded-2xl bg-surface-container-low shadow-xl space-y-space-md">
            @csrf
            <div class="space-y-1.5">
                <label for="email" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus autocomplete="username"
                    class="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary">
                @error('email')
                    <p class="font-body-sm text-body-sm text-error">{{ $message }}</p>
                @enderror
            </div>
            <div class="space-y-1.5">
                <label for="password" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Password</label>
                <input id="password" name="password" type="password" required autocomplete="current-password"
                    class="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest/80 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary">
            </div>
            <label class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <input type="checkbox" name="remember" class="accent-primary"> Keep me signed in this shift
            </label>
            <button type="submit" class="w-full flex items-center justify-center gap-space-xs px-space-md py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                <span class="material-symbols-outlined text-lg">lock_open</span>
                <span>Enter Op-Center</span>
            </button>
        </form>
    </div>
</main>
@endsection
