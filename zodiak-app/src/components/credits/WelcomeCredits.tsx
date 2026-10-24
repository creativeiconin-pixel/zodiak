import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { PanditAvatar } from "../chat/PanditAvatar";
import { useT } from "../../i18n";
import { creditsText } from "../../i18n/pages/credits";
import { useSession } from "../../lib/session";

/** One-time celebration after sign-up: "We added 30 free credits". */
export function WelcomeCredits() {
  const t = useT(creditsText);
  const { welcomeCredits, dismissWelcome } = useSession();

  useEffect(() => {
    if (!welcomeCredits) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && dismissWelcome();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [welcomeCredits, dismissWelcome]);

  if (!welcomeCredits) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-margin-mobile bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="welcome-credits-title" onClick={dismissWelcome}>
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container p-space-lg text-center shadow-2xl animate-scale-in overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-glow" />
        <div className="relative mx-auto w-24 h-24">
          <PanditAvatar className="w-24 h-24 ring-4 ring-primary/40 shadow-xl" />
          <span className="absolute -right-2 -bottom-1 w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg animate-pop-in [animation-delay:250ms]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
          </span>
        </div>
        <h2 id="welcome-credits-title" className="relative mt-space-md font-headline-sm text-headline-sm text-on-surface font-bold">{t.welcomeTitle}</h2>
        <p className="relative mt-1 flex items-center justify-center gap-1 text-primary font-display-lg text-display-lg font-bold tabular-nums animate-pop-in [animation-delay:150ms]">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>+{welcomeCredits}
        </p>
        <p className="relative mt-1 font-body-md text-body-md text-on-surface-variant">{t.welcomeBody(welcomeCredits)}</p>
        <Link to="/ask" onClick={dismissWelcome} className="sheen tap-scale relative mt-space-md w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold">
          {t.welcomeCta} <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
        <button type="button" onClick={dismissWelcome} className="tap-scale relative mt-1 w-full py-2 font-label-md text-label-md text-on-surface-variant">{t.welcomeLater}</button>
      </div>
    </div>,
    document.body,
  );
}
