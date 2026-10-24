import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PanditAvatar } from "./chat/PanditAvatar";
import { LoadingCard } from "./StatusMessage";
import { useT } from "../i18n";
import { gateText, type GateFeature } from "../i18n/pages/gate";
import { api } from "../lib/api";
import { useSession } from "../lib/session";
import { useAsync } from "../lib/useAsync";

/** Sign up / log in invitation with the free-credits offer; `next` brings them back here afterwards. */
export function SignInCard({ feature, compact = false }: { feature: GateFeature; compact?: boolean }) {
  const t = useT(gateText);
  const { pathname, search } = useLocation();
  const { data: appConfig } = useAsync(api.appConfig);
  const bonus = appConfig?.signup_bonus ?? 0;
  const next = encodeURIComponent(feature === "home" ? "/birth-details" : pathname + search);

  return (
    <section className={`animate-scale-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-container/60 via-surface-container to-surface-container-low shadow-xl text-center ${compact ? "p-space-md" : "p-space-lg"}`}>
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none animate-glow" />
      {!compact && <PanditAvatar className="relative w-20 h-20 mx-auto ring-4 ring-primary/30 shadow-xl animate-float" />}
      <h1 className={`relative font-headline-sm text-headline-sm text-on-surface font-bold ${compact ? "" : "mt-space-md"}`}>{feature === "home" ? t.homeTitle : t.titles[feature]}</h1>
      <p className="relative mt-1 font-body-md text-body-md text-on-surface-variant">{feature === "home" ? t.homeBody : t.body}</p>
      {bonus > 0 && (
        <p className="relative mt-space-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary font-label-lg text-label-lg font-bold">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span> {t.offer(bonus)}
        </p>
      )}
      {!compact && (
        <ul className="relative mt-space-md space-y-1.5 text-left max-w-xs mx-auto">
          {t.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> {perk}
            </li>
          ))}
        </ul>
      )}
      <div className="relative mt-space-md flex flex-col gap-2">
        <Link to={`/login?mode=signup&next=${next}`} className="sheen tap-scale w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">person_add</span> {t.signup}
        </Link>
        <Link to={`/login?mode=login&next=${next}`} className="tap-scale w-full py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-lg">login</span> {t.login}
        </Link>
      </div>
    </section>
  );
}

/** Shows the page only to signed-in people; everyone else is invited to sign up or log in. */
export function RequireSignIn({ feature, children }: { feature: GateFeature; children: ReactNode }) {
  const { seeker, loading } = useSession();

  if (seeker) return <>{children}</>;

  return (
    <main className="flex-1 flex flex-col justify-center w-full pt-20 pb-28 px-margin-mobile">
      {loading ? <LoadingCard /> : <SignInCard feature={feature} />}
    </main>
  );
}
