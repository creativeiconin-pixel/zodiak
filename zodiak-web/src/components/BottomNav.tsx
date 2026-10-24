"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; icon: string; match: (path: string) => boolean };

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: "stars", match: (p) => p === "/" || ["/horoscope", "/milan", "/palmistry"].some((r) => p.startsWith(r)) },
  { href: "/kundli", label: "Kundli", icon: "flare", match: (p) => p.startsWith("/kundli") },
  { href: "/ask", label: "Ask AI", icon: "psychology", match: (p) => p.startsWith("/ask") },
  { href: "/remedies", label: "Remedies", icon: "storefront", match: (p) => p.startsWith("/remedies") },
  { href: "/profile", label: "Profile", icon: "account_circle", match: (p) => p.startsWith("/profile") || p.startsWith("/orders") },
];

const base = "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-14 py-space-xs transition-all duration-300";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(87,27,193,0.18)]">
      <div className="flex items-center justify-around h-20 px-space-xs max-w-screen-sm mx-auto">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          if (tab.href === "/ask") {
            // The centre "Ask AI" orb is always raised, regardless of active state
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-16 -mt-4 py-space-xs text-on-surface-variant group transition-all duration-300 hover:text-on-surface"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-tr from-secondary-container via-surface-container-high to-primary flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-1 ${active ? "ring-primary scale-105" : "ring-primary/30"}`}
                >
                  <span className="material-symbols-outlined text-on-primary text-2xl group-hover:scale-110 transition-transform">{tab.icon}</span>
                </div>
                <span className="font-label-sm text-label-sm tracking-tight mt-1 text-primary-fixed">{tab.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`${base} ${active ? "text-primary scale-105" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-2xl" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm tracking-tight mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
