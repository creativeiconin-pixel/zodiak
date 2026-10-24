import { Link } from "react-router-dom";
import { CreditChip } from "./credits/CreditChip";
import { LanguagePicker } from "./LanguagePicker";
import { useHomeHref } from "../lib/useDesktopLanding";

export function AppHeader() {
  const homeHref = useHomeHref();
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(59,45,84,0.35)]">
      <div className="h-16 px-margin-mobile flex items-center justify-between max-w-screen-sm mx-auto">
        <Link to={homeHref} className="group tap-scale flex items-center gap-space-sm">
          <img alt="Zodiak Brand Logo" className="h-8 w-auto object-contain transition-transform duration-500 ease-out-expo group-hover:rotate-12" src="/images/zodiak-logo.jpg" />
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-md text-headline-md tracking-wider text-primary font-bold">ZODIAK</span>
            <span className="material-symbols-outlined text-primary text-base animate-twinkle">auto_awesome</span>
          </div>
        </Link>
        <div className="flex items-center gap-space-xs">
          <CreditChip />
          <LanguagePicker />
          <Link
            to="/profile"
            aria-label="Profile & Orders"
            className="tap-scale min-w-[44px] min-h-[44px] flex items-center justify-center p-space-xs rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40 transition-shadow duration-300 hover:ring-primary" src="/images/profile-avatar.jpg" />
          </Link>
        </div>
      </div>
    </header>
  );
}
