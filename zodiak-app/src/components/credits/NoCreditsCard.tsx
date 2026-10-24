import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import { creditsText } from "../../i18n/pages/credits";

/** Shown when Pandit Jii or the palm reader says the seeker has no credits left. */
export function NoCreditsCard({ cost, message }: { cost?: number; message?: string }) {
  const t = useT(creditsText);
  return (
    <div className="animate-scale-in rounded-xl bg-surface-container p-space-md flex items-start gap-space-sm shadow-lg relative overflow-hidden" role="alert">
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <span className="relative w-11 h-11 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-2xl animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
      </span>
      <div className="relative flex-1 min-w-0">
        <p className="font-title-md text-title-md text-on-surface font-semibold">{t.noCreditsTitle}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{message ?? t.noCreditsBody(cost ?? 1)}</p>
        <Link to="/credits" className="sheen tap-scale mt-space-sm inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold">
          <span className="material-symbols-outlined text-base">add_circle</span> {t.addCredits}
        </Link>
      </div>
    </div>
  );
}
