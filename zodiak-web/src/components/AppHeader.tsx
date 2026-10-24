import Link from "next/link";

export function AppHeader() {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(59,45,84,0.35)]">
      <div className="h-16 px-margin-mobile flex items-center justify-between max-w-screen-sm mx-auto">
        <Link href="/" className="flex items-center gap-space-sm">
          <img alt="Zodiak Brand Logo" className="h-8 w-auto object-contain" src="/images/zodiak-logo.jpg" />
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-md text-headline-md tracking-wider text-primary font-bold">ZODIAK</span>
            <span className="material-symbols-outlined text-primary text-base animate-pulse">auto_awesome</span>
          </div>
        </Link>
        <div className="flex items-center gap-space-sm">
          <Link
            href="/profile"
            aria-label="Profile & Orders"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-space-xs rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40" src="/images/profile-avatar.jpg" />
          </Link>
        </div>
      </div>
    </header>
  );
}
