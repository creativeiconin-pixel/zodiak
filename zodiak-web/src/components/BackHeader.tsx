"use client";

import { useRouter } from "next/navigation";

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(59,45,84,0.35)]">
      <div className="h-16 px-margin-mobile flex items-center justify-between max-w-screen-sm mx-auto">
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="Go Back"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            onClick={() => router.back()}
          >
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <img alt="Zodiak Brand Logo" className="h-7 w-auto object-contain" src="/images/zodiak-logo.jpg" />
          <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold ml-space-xs truncate max-w-[180px]">{title}</h1>
        </div>
        <div className="flex items-center gap-space-sm">
          <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40" src="/images/profile-avatar.jpg" />
        </div>
      </div>
    </header>
  );
}
