import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../components/motion/CountUp";
import { Reveal } from "../components/motion/Reveal";
import { UpiPayFlow } from "../components/payment/UpiPayment";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useLanguage, useT } from "../i18n";
import { common } from "../i18n/common";
import { creditsText } from "../i18n/pages/credits";
import { api, ApiError, inr, type CreditPack, type CreditRecharge } from "../lib/api";
import { useSession } from "../lib/session";
import { useAsync } from "../lib/useAsync";

const POLL_INTERVAL_MS = 15_000;
const LOCALES = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" } as const;

const REASON_ICONS: Record<string, string> = {
  signup_bonus: "redeem", question: "forum", palm_reading: "front_hand", refund: "undo", recharge: "add_card", admin: "volunteer_activism",
};

/** Price for one credit, e.g. "₹0.83", for comparing packs. */
const perCredit = (pack: CreditPack) => `₹${(pack.price / pack.credits).toFixed(2).replace(/\.00$/, "")}`;

function PackCard({ pack, tag, busy, onBuy }: { pack: CreditPack; tag?: string; busy: boolean; onBuy: () => void }) {
  const t = useT(creditsText);
  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={busy}
      className={`group tap-scale relative text-left rounded-xl p-space-md flex flex-col gap-1 shadow-md transition-colors disabled:opacity-60 ${
        tag ? "bg-gradient-to-br from-secondary-container/60 to-surface-container ring-1 ring-primary/40" : "bg-surface-container hover:bg-surface-container-high"
      }`}
    >
      {tag && <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow">{tag}</span>}
      <span className="flex items-center gap-1 text-primary">
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
        <span className="font-headline-sm text-headline-sm font-bold tabular-nums">{pack.credits}</span>
      </span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{t.perCredit(perCredit(pack))}</span>
      <span className="mt-1 flex items-center justify-between gap-1">
        <span className="font-title-lg text-title-lg text-on-surface font-bold tabular-nums">{inr(pack.price)}</span>
        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold">{t.buy}</span>
      </span>
    </button>
  );
}

export default function CreditsPage() {
  const t = useT(creditsText);
  const names = useT(common);
  const { lang } = useLanguage();
  const { seeker, loading: sessionLoading, setCredits } = useSession();
  const { data: wallet, error, loading, reload } = useAsync(() => (seeker ? api.wallet() : Promise.resolve(undefined)), [seeker?.id]);
  const [recharge, setRecharge] = useState<CreditRecharge>();
  const [starting, setStarting] = useState<string>();
  const [startError, setStartError] = useState<string>();
  const [justCredited, setJustCredited] = useState<number>();

  // Pick up an unfinished recharge (e.g. the seeker paid, closed the app, and came back)
  useEffect(() => {
    if (wallet) setCredits(wallet.balance);
    if (wallet && !recharge) setRecharge(wallet.open_recharges[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // While our team checks the UTR, look for the credits every few seconds
  useEffect(() => {
    if (recharge?.status !== "verification_pending") return;
    const timer = window.setInterval(() => {
      api.recharge(recharge.reference).then((next) => {
        if (next.status === "credited") {
          setJustCredited(next.credits);
          setRecharge(undefined);
          reload();
        } else {
          setRecharge(next);
        }
      }).catch(() => undefined);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [recharge, reload]);

  async function buy(pack: CreditPack) {
    setStarting(pack.id);
    setStartError(undefined);
    setJustCredited(undefined);
    try {
      setRecharge(await api.startRecharge(pack.id));
      window.setTimeout(() => document.getElementById("recharge-pay")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (caught) {
      setStartError(caught instanceof ApiError && caught.status !== 0 ? caught.message : names.serverDown);
    } finally {
      setStarting(undefined);
    }
  }

  if (!sessionLoading && !seeker) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center w-full pt-20 pb-28 px-margin-mobile text-center gap-space-sm">
        <span className="material-symbols-outlined text-primary text-5xl animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">{t.signInTitle}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">{t.signInBody}</p>
        <Link to="/login?mode=signup&next=/credits" className="sheen tap-scale mt-space-sm px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg">{names.signIn}</Link>
      </main>
    );
  }

  const packs = wallet?.packs ?? [];
  const best = packs.length > 1 ? packs.reduce((a, b) => (a.price / a.credits <= b.price / b.credits ? a : b)) : undefined;
  const popular = packs.length > 2 ? packs[1] : undefined;
  const date = (iso: string) => new Date(iso).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "short" });

  return (
    <main className="flex-1 flex flex-col w-full pt-20 pb-28 px-margin-mobile gap-space-md">
      {/* Balance */}
      <section className="animate-rise relative overflow-hidden rounded-2xl p-space-lg bg-gradient-to-br from-secondary-container/70 via-surface-container to-surface-container-low shadow-xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-glow" />
        <h1 className="relative font-title-md text-title-md text-on-surface-variant">{t.title}</h1>
        <div className="relative mt-1 flex items-end gap-2">
          <span className="material-symbols-outlined text-primary text-4xl mb-1 animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
          <span className="font-display-lg text-display-lg font-bold text-on-surface tabular-nums leading-none">
            <CountUp value={seeker?.credits ?? 0} />
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant mb-1.5">{t.balanceLabel}</span>
        </div>
        <p className="relative mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{t.subtitle}</p>
        {justCredited && (
          <p className="relative mt-space-sm inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold animate-pop-in" role="status">
            <span className="material-symbols-outlined text-base">celebration</span> {t.credited(justCredited)}
          </p>
        )}
      </section>

      {loading && <LoadingCard />}
      {error && <ErrorCard error={error} onRetry={reload} />}

      {wallet && (
        <>
          {/* What things cost */}
          <Reveal as="section" className="rounded-xl bg-surface-container p-space-md space-y-2">
            <h2 className="font-title-md text-title-md text-on-surface">{t.howTitle}</h2>
            <p className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
              <span className="material-symbols-outlined text-primary">forum</span> {t.questionCost(wallet.costs.question)}
            </p>
            <p className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
              <span className="material-symbols-outlined text-primary">front_hand</span> {t.palmCost(wallet.costs.palm_reading)}
            </p>
            <p className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-lg">verified_user</span> {t.retakeFree}
            </p>
          </Reveal>

          {/* Payment in progress */}
          {recharge && (
            <section id="recharge-pay" className="scroll-mt-24 space-y-space-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-title-md text-title-md text-on-surface">{t.payingFor(recharge.credits)}</h2>
                {recharge.status !== "verification_pending" && (
                  <button type="button" onClick={() => setRecharge(undefined)} className="tap-scale font-label-md text-label-md text-primary">{t.otherPack}</button>
                )}
              </div>
              <UpiPayFlow
                payable={recharge}
                onUpdate={setRecharge}
                submit={(utr) => api.submitRechargeProof(recharge.reference, utr)}
                purpose="recharge"
              />
            </section>
          )}

          {/* Packs */}
          {!recharge && (
            <Reveal as="section" className="space-y-space-sm">
              <h2 className="font-title-md text-title-md text-on-surface">{t.packsTitle}</h2>
              {wallet.recharge_available ? (
                <div className="grid grid-cols-2 gap-space-sm pt-1">
                  {packs.map((pack) => (
                    <PackCard
                      key={pack.id}
                      pack={pack}
                      tag={pack === best ? t.bestValue : pack === popular ? t.popular : undefined}
                      busy={starting !== undefined}
                      onBuy={() => void buy(pack)}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-surface-container p-space-md font-body-md text-body-md text-on-surface-variant">{t.rechargeSoon}</p>
              )}
              {starting && <p className="font-label-md text-label-md text-primary text-center animate-pulse">{t.starting}</p>}
              {startError && <p className="font-body-sm text-body-sm text-error text-center" role="alert">{startError}</p>}
            </Reveal>
          )}

          {/* History */}
          <Reveal as="section" className="rounded-xl bg-surface-container p-space-md">
            <h2 className="font-title-md text-title-md text-on-surface mb-space-xs">{t.historyTitle}</h2>
            {wallet.history.length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">{t.emptyHistory}</p>
            ) : (
              <ul className="divide-y divide-outline-variant/30">
                {wallet.history.map((entry) => (
                  <li key={entry.id} className="py-2 flex items-center gap-space-sm">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${entry.amount > 0 ? "bg-primary/15 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-lg">{REASON_ICONS[entry.reason] ?? "toll"}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-body-md text-body-md text-on-surface truncate">{t.reasons[entry.reason] ?? entry.reason}</span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">{date(entry.created_at)}</span>
                    </span>
                    <span className={`font-title-md text-title-md font-bold tabular-nums ${entry.amount > 0 ? "text-primary" : "text-on-surface-variant"}`}>
                      {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </>
      )}
    </main>
  );
}
