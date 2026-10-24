import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, useReveal } from "../components/motion/Reveal";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { remediesText } from "../i18n/pages/remedies";
import { api, inr, type Remedy } from "../lib/api";
import { activePeriod } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";
import { useAsync } from "../lib/useAsync";

const CATEGORIES = ["all", "gemstones", "rudraksha", "yantras", "kavach"] as const;

type Category = (typeof CATEGORIES)[number];

function RemedyCard({ remedy, orderLabel, index = 0 }: { remedy: Remedy; orderLabel: string; index?: number }) {
  const accentText = remedy.accent === "primary" ? "text-primary" : "text-secondary";
  const revealRef = useReveal<HTMLElement>({ delay: Math.min(index, 5) * 70 });
  return (
    <article ref={revealRef} className="group flex flex-col rounded-xl bg-surface-container overflow-hidden shadow-lg hover-lift">
      <Link to={`/remedies/${remedy.slug}`} className="flex flex-col flex-1 tap-scale" aria-label={`${remedy.name} • ${inr(remedy.price)}`}>
        {/* Photo */}
        <div className="relative w-full aspect-square bg-surface-container-high overflow-hidden">
          <img alt={remedy.image_alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 group-active:scale-[1.03] transition-transform duration-700 ease-out-expo" src={remedy.image} />
          {remedy.badge && (
            <div className={`animate-slide-in-left [animation-delay:250ms] absolute top-2 left-2 ${remedy.compare_at_price ? "max-w-[calc(100%-4.25rem)]" : "max-w-[calc(100%-1rem)]"} flex items-center gap-1 bg-surface-container-lowest/85 backdrop-blur-md px-2 py-1 rounded-full shadow-md`}>
              <span className={`material-symbols-outlined text-[13px] shrink-0 ${accentText}`} style={{ fontVariationSettings: "'FILL' 1" }}>{remedy.badge.icon}</span>
              <span className={`truncate font-label-sm text-label-sm font-bold ${remedy.accent === "primary" ? "text-primary" : "text-secondary-fixed"}`}>{remedy.badge.label}</span>
            </div>
          )}
          {remedy.compare_at_price ? (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold">
              -{Math.round((1 - remedy.price / remedy.compare_at_price) * 100)}%
            </span>
          ) : null}
          {/* Planet */}
          <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded-full text-on-surface">
            <span className={`material-symbols-outlined text-[13px] shrink-0 ${remedy.accent === "primary" ? "text-secondary" : "text-primary"}`}>{remedy.planet.icon}</span>
            <span className="truncate font-label-sm text-label-sm">{remedy.planet.label}</span>
          </div>
        </div>
        {/* Details */}
        <div className="p-2.5 flex flex-col flex-1 gap-1">
          <span className="truncate font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">{remedy.tagline}</span>
          <h2 className="font-title-md text-body-md font-semibold text-on-surface leading-snug line-clamp-2 min-h-[2.75em]">{remedy.name}</h2>
          <div className="mt-auto pt-1 flex items-baseline flex-wrap gap-x-1.5">
            <span className="font-title-md text-title-md text-primary font-bold">{inr(remedy.price)}</span>
            {remedy.compare_at_price ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant line-through">{inr(remedy.compare_at_price)}</span>
            ) : remedy.price_detail ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{remedy.price_detail}</span>
            ) : null}
          </div>

        </div>
      </Link>
      {/* Straight to checkout; tapping anywhere else on the card opens the full details */}
      <div className="px-2.5 pb-2.5">
        <Link
          to={`/checkout/${remedy.slug}`}
          className="sheen tap-scale w-full py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1"
        >
          {orderLabel}
          <span className="material-symbols-outlined text-[16px] transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}

export default function RemediesPage() {
  const t = useT(remediesText);
  const names = useT(common);
  const { chart } = useBirthProfile();
  const [category, setCategory] = useState<Category>("all");
  const { data: remedies, error, loading, reload } = useAsync(api.remedies, [names]);
  const visible = remedies?.filter((remedy) => category === "all" || remedy.category === category);

  return (
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24">
      <div className="flex flex-col w-full text-on-surface">
        <div className="relative w-full px-margin-mobile flex flex-col gap-space-md">
          {/* Screen Title & Intro Context */}
          <div className="animate-rise flex items-center justify-between pt-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-sm">temple_hindu</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">{t.eyebrow}</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">{t.title}</h1>
            </div>
            <a href="#how-we-bless" aria-label={t.infoButton} className="tap-scale w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors shadow-sm">
              <span className="material-symbols-outlined text-xl animate-spin-slow">token</span>
            </a>
          </div>
          {/* Personalization Banner */}
          <div className="animate-rise [animation-delay:80ms] relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-md">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-glow" />
            <div className="flex items-start gap-space-sm relative z-10">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 shadow-[0_0_12px_rgba(242,202,80,0.25)]">
                <span className="material-symbols-outlined text-lg animate-twinkle" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              {chart ? (
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold">{t.synced}</span>
                  <p className="font-body-md text-body-md text-on-surface font-semibold tracking-tight mt-0.5">
                    {t.syncedLine(names.signs[chart.ascendant.sign], names.planets[activePeriod(chart.mahadashas).lord])}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.syncedBody}</p>
                </div>
              ) : (
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">{t.noChartTitle}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.noChartBody}</p>
                  <Link to="/birth-details" className="mt-2 self-start inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
                    {t.noChartCta} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Category Filter Pills (Horizontal Scrolling) */}
          <div className="flex items-center gap-space-xs overflow-x-auto py-1 -mx-margin-mobile px-margin-mobile no-scrollbar" data-stagger="in" style={{ "--reveal-delay": "140ms", "--stagger-step": "45ms" } as React.CSSProperties}>
            {CATEGORIES.map((key) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                aria-pressed={category === key}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-[transform,background-color,color] duration-300 ease-out-expo active:scale-95 ${
                  category === key ? "bg-primary text-on-primary font-bold shadow-sm shadow-primary/30 scale-105" : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t.categories[key]}
              </button>
            ))}
          </div>
          {/* Product Listing Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {loading && <div className="col-span-full"><LoadingCard label={t.loading} /></div>}
            {error && <div className="col-span-full"><ErrorCard error={error} onRetry={reload} /></div>}
            {visible?.length === 0 && (
              <p className="col-span-full animate-fade-in rounded-xl bg-surface-container p-space-lg text-center font-body-md text-body-md text-on-surface-variant">{t.empty}</p>
            )}
            {visible?.map((remedy, index) => <RemedyCard key={remedy.slug} remedy={remedy} orderLabel={t.order} index={index} />)}
          </div>
          {/* Consecration Process Story Box */}
          <Reveal id="how-we-bless" className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm mt-space-sm mb-2 scroll-mt-20">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">hotel_class</span>
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">{t.stepsTitle}</h2>
            </div>
            <Reveal stagger step={110} className="grid grid-cols-3 gap-2 pt-1 text-center">
              {t.steps.map(([title, body], index) => (
                <div key={title} className="flex flex-col items-center bg-surface-container p-2.5 rounded-lg">
                  <span className={`material-symbols-outlined text-xl mb-1 ${["text-primary", "text-secondary", "text-primary-fixed"][index]}`}>{["flare", "psychology", "lock"][index]}</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">{title}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{body}</span>
                </div>
              ))}
            </Reveal>
          </Reveal>
          {/* Trust Guarantee Editorial Footer */}
          <Reveal variant="scale" className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container mb-space-md shadow-inner">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">shield_locked</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">{t.guaranteeTitle}</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{t.guaranteeBody}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
