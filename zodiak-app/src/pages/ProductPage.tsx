import { Link, useParams } from "react-router-dom";
import { PanditAvatar } from "../components/chat/PanditAvatar";
import { Reveal } from "../components/motion/Reveal";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { productText } from "../i18n/pages/product";
import { remediesText } from "../i18n/pages/remedies";
import { api, inr } from "../lib/api";
import { useAsync } from "../lib/useAsync";

const STEP_ICONS = ["flare", "self_improvement", "lock"];

/** Everything about one Store product, with an "Order now" bar that stays above the bottom navigation. */
export default function ProductPage() {
  const t = useT(productText);
  const store = useT(remediesText);
  const names = useT(common);
  const { slug = "" } = useParams();
  const { data: remedy, error, loading, reload } = useAsync(() => api.remedy(slug), [slug, names]);

  if (loading || error || !remedy) {
    return (
      <main className="flex-1 w-full pt-20 pb-28 px-margin-mobile">
        {error ? <ErrorCard error={error} onRetry={reload} /> : <LoadingCard label={t.loading} />}
      </main>
    );
  }

  const accentText = remedy.accent === "primary" ? "text-primary" : "text-secondary";
  const discount = remedy.compare_at_price ? Math.round((1 - remedy.price / remedy.compare_at_price) * 100) : 0;

  return (
    <main className="flex-1 flex flex-col w-full pt-16 pb-44">
      {/* Photo */}
      <div className="animate-fade-in relative w-full aspect-square max-h-[60vh] bg-surface-container-high overflow-hidden">
        <img src={remedy.image} alt={remedy.image_alt} className="w-full h-full object-cover animate-scale-in" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <Link to="/remedies" aria-label={names.back} className="tap-scale absolute top-3 left-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md animate-pop-in">{t.off(discount)}</span>
        )}
      </div>

      <div className="relative -mt-8 px-margin-mobile flex flex-col gap-space-md">
        {/* Title and price */}
        <section className="animate-rise rounded-2xl bg-surface-container p-space-md shadow-xl space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {remedy.badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm font-bold">
                <span className={`material-symbols-outlined text-[14px] ${accentText}`} style={{ fontVariationSettings: "'FILL' 1" }}>{remedy.badge.icon}</span>
                <span className={accentText}>{remedy.badge.label}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-on-surface">
              <span className="material-symbols-outlined text-[14px] text-primary">{remedy.planet.icon}</span> {remedy.planet.label}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant">{store.categories[remedy.category as keyof typeof store.categories] ?? remedy.category}</span>
          </div>
          <span className="block font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">{remedy.tagline}</span>
          <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">{remedy.name}</h1>
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 pt-1">
            <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">{inr(remedy.price)}</span>
            {remedy.compare_at_price ? (
              <span className="font-body-md text-body-md text-on-surface-variant">
                {t.mrp} <span className="line-through">{inr(remedy.compare_at_price)}</span>
              </span>
            ) : null}
            {remedy.price_detail && <span className="font-body-sm text-body-sm text-on-surface-variant">{remedy.price_detail}</span>}
          </div>
          {remedy.price_note && <p className="font-body-sm text-body-sm text-on-surface-variant">{remedy.price_note}</p>}
        </section>

        {/* Benefits */}
        {remedy.benefits.length > 0 && (
          <Reveal as="section" className="rounded-xl bg-surface-container p-space-md space-y-space-sm">
            <h2 className="font-title-md text-title-md text-on-surface">{t.benefitsTitle}</h2>
            <ul className="space-y-2">
              {remedy.benefits.map((benefit) => (
                <li key={benefit.label} className="flex items-start gap-space-sm">
                  <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{benefit.icon}</span>
                  </span>
                  <span className="font-body-md text-body-md text-on-surface pt-1">{benefit.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* Origin and what you get */}
        <Reveal as="section" className="rounded-xl bg-surface-container p-space-md space-y-space-sm">
          {remedy.origin && (
            <div>
              <h2 className="font-label-md text-label-md uppercase tracking-wider text-secondary font-semibold">{t.originTitle}</h2>
              <p className="mt-0.5 font-body-md text-body-md text-on-surface">{remedy.origin}</p>
            </div>
          )}
          {remedy.specification && (
            <div>
              <h2 className="font-label-md text-label-md uppercase tracking-wider text-secondary font-semibold">{t.specTitle}</h2>
              <p className="mt-0.5 font-body-md text-body-md text-on-surface whitespace-pre-line">{remedy.specification}</p>
            </div>
          )}
          <div className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-2.5">
            <span className="material-symbols-outlined text-primary">{remedy.assurance.icon}</span>
            <span className="font-body-sm text-body-sm text-on-surface">{remedy.assurance.label}</span>
          </div>
        </Reveal>

        {/* How we bless it */}
        <Reveal as="section" className="rounded-xl bg-surface-container-low p-space-md">
          <h2 className="font-title-md text-title-md text-on-surface mb-space-sm">{t.stepsTitle}</h2>
          <Reveal stagger step={110} className="grid grid-cols-3 gap-2 text-center">
            {t.steps.map(([title, body], index) => (
              <div key={title} className="flex flex-col items-center bg-surface-container p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-xl mb-1 text-primary">{STEP_ICONS[index]}</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">{title}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{body}</span>
              </div>
            ))}
          </Reveal>
        </Reveal>

        {/* Promise */}
        <Reveal as="section" variant="scale" className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container shadow-inner">
          <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">shield_locked</span>
          </span>
          <div>
            <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">{t.promiseTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{t.promiseBody}</p>
          </div>
        </Reveal>

        {/* Ask Pandit Jii */}
        <Link to="/ask" className="group tap-scale flex items-center gap-space-sm rounded-xl bg-gradient-to-r from-secondary-container/50 to-surface-container p-space-md shadow-md">
          <PanditAvatar className="w-12 h-12 ring-2 ring-primary/40" />
          <span className="flex-1 min-w-0">
            <span className="block font-title-md text-title-md text-on-surface">{t.askTitle}</span>
            <span className="block font-body-sm text-body-sm text-on-surface-variant">{t.askBody}</span>
          </span>
          <span className="material-symbols-outlined text-primary transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">chevron_right</span>
        </Link>
      </div>

      {/* Order bar, sitting just above the bottom navigation */}
      <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 px-margin-mobile pb-2 pointer-events-none">
        <div className="pointer-events-auto max-w-screen-sm mx-auto flex items-center gap-space-sm rounded-2xl bg-surface-container-high/95 backdrop-blur-xl p-2 pl-space-md shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.5)] animate-rise">
          <div className="min-w-0 flex-1">
            <span className="block font-title-lg text-title-lg text-primary font-bold tabular-nums leading-tight">{inr(remedy.price)}</span>
            <span className="block font-label-sm text-label-sm text-on-surface-variant truncate">{remedy.name}</span>
          </div>
          <Link to={`/checkout/${remedy.slug}`} className="sheen tap-scale shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-lg shadow-primary/20">
            {t.orderNow} <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
