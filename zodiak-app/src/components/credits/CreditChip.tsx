import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import { creditsText } from "../../i18n/pages/credits";
import { useSession } from "../../lib/session";

/** Coin pill with the seeker's balance; tapping it opens the credits page. Turns red when credits run out. */
export function CreditChip({ className = "" }: { className?: string }) {
  const t = useT(creditsText);
  const { seeker } = useSession();
  if (!seeker) return null;
  const empty = seeker.credits <= 0;

  return (
    <Link
      to="/credits"
      aria-label={t.chipLabel(seeker.credits)}
      title={t.chipLabel(seeker.credits)}
      className={`tap-scale shrink-0 inline-flex items-center gap-1 h-8 pl-1.5 pr-2.5 rounded-full font-label-md text-label-md font-bold tabular-nums transition-colors ${
        empty ? "bg-error-container/40 text-error" : "bg-primary/15 text-primary"
      } ${className}`}
    >
      <span key={seeker.credits} className="material-symbols-outlined text-lg animate-pop-in" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
      {seeker.credits}
      {empty && <span className="material-symbols-outlined text-sm">add</span>}
    </Link>
  );
}
