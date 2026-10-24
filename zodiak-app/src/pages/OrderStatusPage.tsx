import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PulseRing } from "../components/motion/PulseRing";
import { needsUpiStep, UpiPayment } from "../components/payment/UpiPayment";
import { Reveal } from "../components/motion/Reveal";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useLanguage, useT } from "../i18n";
import { common } from "../i18n/common";
import { orderStatusText } from "../i18n/pages/orderStatus";
import { upiText } from "../i18n/pages/upi";
import { api, inr, type Order } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { useHomeHref } from "../lib/useDesktopLanding";

const POLL_INTERVAL_MS = 15_000;

const LOCALES = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" } as const;

function formatDate(iso: string | null, locale: string) {
  return iso ? new Date(iso).toLocaleString(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : null;
}

function milestoneIso(order: Order, index: number) {
  return [order.created_at, order.reviewed_at, order.consecrated_at, order.shipped_at, order.delivered_at][index];
}

function headerPill(order: Order, t: ReturnType<typeof useT<typeof orderStatusText.en>>, statusNames: Record<Order["status"], string>, checkingPayment: string) {
  if (needsUpiStep(order)) {
    return order.payment_status === "verification_pending"
      ? { label: checkingPayment, tone: "bg-secondary-container/40 text-primary", dot: "bg-secondary animate-pulse" }
      : { label: statusNames[order.status], tone: order.status === "payment_failed" ? "bg-error-container/40 text-error" : "bg-secondary-container/40 text-primary", dot: order.status === "payment_failed" ? "bg-error" : "bg-primary animate-pulse" };
  }
  if (order.status === "rejected") return { label: t.refunded, tone: "bg-error-container/40 text-error", dot: "bg-error" };
  if (order.status === "delivered") return { label: t.delivered, tone: "bg-primary/15 text-primary", dot: "bg-primary" };
  if (order.journey_step <= 2) return { label: t.inCheck, tone: "bg-secondary-container/40 text-primary", dot: "bg-primary animate-ping" };
  return { label: statusNames[order.status], tone: "bg-secondary-container/40 text-primary", dot: "bg-primary animate-pulse" };
}

export default function OrderStatusPage() {
  const homeHref = useHomeHref();
  const t = useT(orderStatusText);
  const names = useT(common);
  const upiCopy = useT(upiText);
  const locale = LOCALES[useLanguage().lang];
  const { reference = "" } = useParams();
  const [searchParams] = useSearchParams();
  const paymentReturn = searchParams.get("payment");
  const { data: order, error, loading, reload } = useAsync(() => api.order(reference), [reference, names]);
  const [auditOpen, setAuditOpen] = useState(false);
  const [live, setLive] = useState<Order>();
  const [upiWasPending, setUpiWasPending] = useState(false);
  const current = live?.reference === order?.reference ? live : order;
  const status = current?.status;

  // A fresh load (new order or new language) replaces any polled copy
  useEffect(() => setLive(undefined), [order]);

  // Remember that this visit started with a UPI payment step, to say "Payment received" once our team verifies it
  useEffect(() => {
    if (current && needsUpiStep(current)) setUpiWasPending(true);
  }, [current]);

  // Keep the journey live while a pandit works through the order in the Op-Center (and while our team checks a UPI
  // payment); it resumes after a new UTR is sent for a payment_failed UPI order because it follows the live status
  useEffect(() => {
    if (!status || ["delivered", "rejected", "payment_failed"].includes(status)) return;
    const timer = window.setInterval(() => api.order(reference).then(setLive).catch(() => undefined), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [status, reference]);

  if (loading || error || !current) {
    return (
      <main className="flex-1 flex flex-col w-full pt-20 pb-24 px-margin-mobile">
        {error ? <ErrorCard error={error} onRetry={reload} /> : <LoadingCard label={t.loading} />}
      </main>
    );
  }

  const remedy = current.remedy!;
  const pill = headerPill(current, t, names.orderStatus, upiCopy.pillChecking);
  const upiOrder = current.payment_method === "upi";
  const upiStep = needsUpiStep(current);
  const paidNow = paymentReturn === "success" || (upiOrder && upiWasPending && !upiStep && current.status !== "rejected");
  const step = current.journey_step;
  const rejected = current.status === "rejected";
  const trackHeight = `${(Math.min(step, 5) - 1) * 20}%`;

  return (
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl">
        <div className="relative w-full overflow-hidden">
          {/* Order Summary Pill Header */}
          <div className="animate-rise flex items-center justify-between mt-space-sm mb-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-base">receipt_long</span>
              </span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block">{t.reference}</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold tracking-wide">#{current.reference}</span>
              </div>
            </div>
            <div className={`animate-pop-in [animation-delay:200ms] flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm ${pill.tone}`}>
              <span className={`w-2 h-2 rounded-full ${pill.dot}`} />
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">{pill.label}</span>
            </div>
          </div>
          {/* Gemstone Item Card (Smoked Obsidian Glassmorphism) */}
          <div className="animate-rise [animation-delay:90ms] relative rounded-xl p-space-md bg-surface-container/80 backdrop-blur-xl shadow-xl overflow-hidden mb-space-lg">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none animate-glow" />
            <div className="flex items-start gap-space-md relative z-10">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-md bg-surface-container-highest">
                <img className="w-full h-full object-cover animate-scale-in [animation-delay:250ms]" alt={remedy.image_alt} src={remedy.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1.5 font-label-sm text-label-sm text-primary font-bold">{current.specification.split(" (")[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">{t.grade}</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold leading-snug line-clamp-2">{remedy.name}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-1">{remedy.planet.label}</p>
                <div className="flex items-baseline gap-space-xs mt-2">
                  <span className="font-title-md text-title-md font-bold text-primary">{inr(current.amount)}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">{t.inclPooja}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UPI QR: pay and send the UTR, or wait while our team checks it (handles a rejected UTR too) */}
          {upiStep ? (
            <UpiPayment order={current} onUpdate={setLive} />
          ) : /* Shown after Pine Labs sends the seeker back from its payment page */ current.status === "payment_failed" && !upiOrder ? (
            <div className="rounded-xl p-space-md bg-error-container/20 mb-space-lg flex items-start gap-space-sm animate-scale-in" role="alert">
              <span className="material-symbols-outlined text-error text-xl shrink-0">credit_card_off</span>
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">{t.failedTitle}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.failedBody}</p>
                {remedy && (
                  <Link to={`/checkout/${remedy.slug}`} className="mt-2 inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
                    {t.tryAgain} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          ) : current.status === "payment_pending" && !upiOrder ? (
            <div className="rounded-xl p-space-md bg-secondary-container/25 mb-space-lg flex items-center gap-space-sm" role="status">
              <span className="material-symbols-outlined text-secondary animate-spin">progress_activity</span>
              <p className="font-body-sm text-body-sm text-on-surface">{t.pendingPay}</p>
            </div>
          ) : paidNow ? (
            <div className="rounded-xl p-space-md bg-primary/10 mb-space-lg flex items-start gap-space-sm animate-scale-in" role="status">
              <span className="material-symbols-outlined text-primary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">{t.paidTitle}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.paidBody}</p>
              </div>
            </div>
          ) : null}

          {rejected && (
            <div className="animate-scale-in rounded-xl p-space-md bg-error-container/20 mb-space-lg flex items-start gap-space-sm" role="status">
              <span className="material-symbols-outlined text-error text-xl shrink-0">currency_exchange</span>
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">{t.rejectedTitle}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.rejectedBody(current.reviewer?.name ?? t.ourPandit, inr(current.amount))}</p>
                <Link to="/ask" className="mt-2 inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
                  {t.findAlternative} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

          {/* Active Vedic Consecration Progress Timeline */}
          <Reveal delay={150} className="rounded-xl p-space-md bg-surface-container/60 backdrop-blur-xl shadow-xl mb-space-lg">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">timeline</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">{t.journey}</h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{step > 5 ? t.complete : t.stepOf(step)}</span>
            </div>
            {/* Vertical Stepper List */}
            <ol className="relative pl-6 space-y-space-lg">
              {/* Vertical Continuous Track Line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-surface-container-highest" aria-hidden />
              <div className="absolute left-2.5 top-3 w-0.5 bg-gradient-to-b from-primary via-secondary to-secondary-container transition-all duration-700 origin-top animate-grow-y [animation-duration:1400ms] [animation-delay:300ms]" style={{ height: trackHeight }} aria-hidden />
              {t.milestones.map((milestone, index) => {
                const position = index + 1;
                const done = position < step && !(rejected && position > 1);
                const active = position === step && !rejected;
                const date = formatDate(milestoneIso(current, index), locale);
                if (active) {
                  return (
                    <li key={milestone.title} className="animate-slide-in-left relative flex items-start gap-space-md p-space-sm -mx-space-sm rounded-lg bg-surface-container-high/70 shadow-[0_0_24px_rgba(87,27,193,0.35)]" style={{ animationDelay: `${300 + index * 140}ms` }} aria-current="step">
                      <span aria-hidden className="motion-decor absolute inset-0 -z-10 rounded-lg shadow-[0_0_28px_rgba(208,188,255,0.45)] animate-twinkle [animation-duration:2.4s]" />
                      <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center shadow-[0_0_12px_rgba(208,188,255,0.8)]">
                        <PulseRing className="bg-secondary/50" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-title-md text-title-md text-primary font-semibold flex items-center gap-1">
                            {position === 2 && current.status === "trial_hold" ? t.trialTitle : milestone.title}{" "}
                            <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary font-bold">{t.inProgress}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-relaxed">
                          {position === 2 && current.status === "trial_hold" ? t.trialBody : milestone.body}
                        </p>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={milestone.title} className={`animate-slide-in-left relative flex items-start gap-space-md ${done ? "" : "opacity-60"}`} style={{ animationDelay: `${300 + index * 140}ms` }}>
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-primary shadow-md" : "bg-surface-container-highest"}`}>
                      {done ? (
                        <span className="material-symbols-outlined text-on-primary text-xs font-bold animate-pop-in" style={{ fontVariationSettings: "'FILL' 1", animationDelay: `${450 + index * 140}ms` }}>check</span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-title-md text-title-md text-on-surface font-medium">{milestone.title}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{done && date ? date : t.stage(position)}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{milestone.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          {/* Detailed Status Focus: Expert Pandit Review Card */}
          <Reveal className="rounded-xl p-space-md bg-surface-container/70 backdrop-blur-xl shadow-xl mb-space-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">psychology_alt</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  {current.reviewer ? t.auditDone : t.auditActive}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="font-label-sm text-label-sm font-semibold">{t.assurance}</span>
              </div>
            </div>
            {/* Pandit Profile Snippet */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest/70 mb-space-md">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high shadow-inner">
                <img className="w-full h-full object-cover" alt="" src="/images/pandit-vidyadhar.jpg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-title-md text-title-md text-on-surface font-semibold truncate">{current.reviewer?.name ?? t.panditCouncil}</span>
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant block truncate">
                  {current.reviewer ? t.reviewedOn(current.reviewer.title ?? "Jyotish Acharya", formatDate(current.reviewed_at, locale) ?? "") : t.assigning}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-medium block mt-0.5">{t.certified}</span>
              </div>
            </div>
            {/* Chart Compatibility Guarantee Clause */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/50 flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-lg mt-0.5 shrink-0">shield</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {t.guarantee(remedy.planet.label.split(" • ").pop() ?? "")}
                <span className="text-on-surface font-semibold">{t.guaranteeBold}</span>
                {t.guaranteeEnd}
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">auto_graph</span>
                <span className="font-label-sm text-label-sm">{current.lagna ? t.analyzing(current.lagna, current.nakshatra ?? "") : t.linkChart}</span>
              </div>
              <button className="group tap-scale font-label-sm text-label-sm text-primary font-bold hover:underline flex items-center gap-0.5" onClick={() => setAuditOpen(true)}>
                {t.viewAudit}{" "}
                <span className="material-symbols-outlined text-xs transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">arrow_forward</span>
              </button>
            </div>
          </Reveal>

          {/* Sacred Temple Coordinator Banner */}
          <Reveal variant="scale" className="rounded-xl p-space-md bg-gradient-to-br from-secondary-container/40 via-surface-container to-surface-container-high shadow-lg mb-space-lg flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shrink-0 shadow-md">
                <span className="material-symbols-outlined text-xl animate-float">self_improvement</span>
              </div>
              <div className="min-w-0">
                <span className="font-title-md text-title-md text-on-surface font-semibold block">{t.sankalpa}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  {t.registeredUnder(current.customer_name, current.gotra)}
                </span>
              </div>
            </div>
            <Link to="/ask" className="shrink-0 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">chat_bubble</span> {t.askAi}
            </Link>
          </Reveal>
          {/* Action Center */}
          <Reveal stagger className="flex flex-col gap-space-sm">
            <button
              onClick={() => window.print()}
              className="w-full py-3 px-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-title-md text-title-md font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-md active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-primary text-xl">download</span> {t.invoice}
            </button>
            <div className="grid grid-cols-2 gap-space-sm">
              <a
                className="h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                href={`mailto:seva@zodiak.app?subject=Order%20%23${current.reference}`}
              >
                <span className="material-symbols-outlined text-base">support_agent</span> {t.help}
              </a>
              <Link className="h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 transition-transform shadow-md active:scale-95" to={homeHref}>
                <span className="material-symbols-outlined text-base">home</span> {t.home}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Chart Audit Drawer */}
        {auditOpen && (
          <div className="animate-fade-in fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex flex-col justify-end p-margin-mobile" role="dialog" aria-modal="true" aria-labelledby="audit-title" onClick={() => setAuditOpen(false)}>
            <div className="animate-sheet-up w-full max-w-screen-sm mx-auto bg-surface-container-high rounded-2xl p-space-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 bg-outline/40 rounded-full mx-auto mb-space-md" />
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">{t.drawerEyebrow}</span>
                  <h4 id="audit-title" className="font-headline-sm text-headline-sm text-on-surface font-semibold">{t.drawerTitle}</h4>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant" onClick={() => setAuditOpen(false)} aria-label={names.close}>
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              <dl className="space-y-space-sm mb-space-lg" data-stagger="in" style={{ "--reveal-delay": "150ms", "--stagger-step": "55ms" } as React.CSSProperties}>
                {[
                  [t.planetLord, remedy.planet.label, "text-primary"],
                  [t.lagna, current.lagna ?? t.notLinked, "text-on-surface"],
                  [t.nakshatra, current.nakshatra ?? t.notLinked, "text-on-surface"],
                  [t.compatibility, current.chart_compatibility ? `${current.chart_compatibility}%` : t.pendingAudit, "text-on-surface"],
                  [t.muhurat, current.muhurat ?? t.afterApproval, "text-secondary"],
                ].map(([label, value, tone]) => (
                  <div key={label} className="flex items-center justify-between gap-space-sm p-space-sm rounded-lg bg-surface-container">
                    <dt className="font-body-md text-body-md text-on-surface-variant">{label}</dt>
                    <dd className={`font-title-md text-title-md font-semibold text-right ${tone}`}>{value}</dd>
                  </div>
                ))}
              </dl>
              <button className="tap-scale w-full py-3 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold shadow-lg" onClick={() => setAuditOpen(false)}>
                {t.understood}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
