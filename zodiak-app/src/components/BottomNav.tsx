import { Link, useLocation } from "react-router-dom";
import { PanditAvatar } from "./chat/PanditAvatar";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { useDesktopLanding } from "../lib/useDesktopLanding";

type Tab = { href: string; key: "home" | "kundli" | "ask" | "palm" | "remedies"; icon: string; match: (path: string) => boolean };

const TABS: Tab[] = [
  { href: "/", key: "home", icon: "stars", match: (p) => p === "/" || ["/home", "/horoscope", "/milan"].some((r) => p.startsWith(r)) },
  { href: "/kundli", key: "kundli", icon: "flare", match: (p) => p.startsWith("/kundli") },
  { href: "/ask", key: "ask", icon: "psychology", match: (p) => p.startsWith("/ask") },
  { href: "/palmistry", key: "palm", icon: "front_hand", match: (p) => p.startsWith("/palmistry") },
  // Profile lives on the header avatar; order pages belong to the remedy shop
  { href: "/remedies", key: "remedies", icon: "storefront", match: (p) => ["/remedies", "/orders", "/checkout"].some((r) => p.startsWith(r)) },
];

const base = "relative tap-scale flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-14 py-space-xs transition-colors duration-300";

export function BottomNav() {
  const { pathname } = useLocation();
  const t = useT(common);
  const desktopLanding = useDesktopLanding();
  // The desktop landing page has its own header and no app navigation
  if (desktopLanding && pathname === "/") return null;
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(87,27,193,0.18)]">
      <div className="flex items-center justify-around h-20 px-space-xs max-w-screen-sm mx-auto">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          if (tab.href === "/ask") {
            // The centre Pandit Jii button (same face as in the chat) is always raised
            return (
              <Link
                key={tab.href}
                to={tab.href}
                aria-current={active ? "page" : undefined}
                className="tap-scale flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-16 -mt-4 py-space-xs text-on-surface-variant group transition-colors duration-300 hover:text-on-surface"
              >
                <div
                  className={`relative w-12 h-12 rounded-full transition-transform duration-300 ease-out-expo shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-2 ${active ? "ring-primary scale-105" : "ring-primary/40"}`}
                >
                  <span aria-hidden className="motion-decor absolute -inset-1.5 -z-10 rounded-full bg-primary/25 blur-md animate-glow" />
                  <PanditAvatar
                    key={active ? "on" : "off"}
                    className={`w-12 h-12 group-hover:scale-110 transition-transform ${active ? "animate-icon-bounce" : ""}`}
                  />
                </div>
                <span className="font-label-sm text-label-sm tracking-tight mt-1 text-primary-fixed">{t.nav[tab.key]}</span>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              to={tab.key === "home" && desktopLanding ? "/home" : tab.href}
              aria-current={active ? "page" : undefined}
              className={`${base} ${active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {active && <span aria-hidden className="absolute top-0 h-[3px] w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(242,202,80,0.8)] animate-pop-in" />}
              <span key={active ? "on" : "off"} className={`material-symbols-outlined text-2xl transition-transform duration-300 ease-out-expo ${active ? "scale-110 animate-icon-bounce" : ""}`} style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm tracking-tight mt-0.5">{t.nav[tab.key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
