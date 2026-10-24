import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/motion/Reveal";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { homeText } from "../i18n/pages/home";
import type { Chart } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";
import { SignInCard } from "../components/RequireSignIn";
import { useSession } from "../lib/session";
import { ZodiacWheel } from "../components/motion/ZodiacWheel";
import { qualityOf, readDay } from "../lib/transits";

const FILL = { fontVariationSettings: "'FILL' 1" } as const;

const FEATURES = [
  { icon: "all_inclusive", accent: "text-primary", badge: "bg-primary/10 text-primary", to: null },
  { icon: "menu_book", accent: "text-secondary", badge: "bg-secondary-container/30 text-secondary", to: "/kundli" },
  { icon: "favorite", accent: "text-primary", badge: "bg-primary/10 text-primary", to: "/milan" },
  { icon: "front_hand", accent: "text-tertiary", badge: "bg-surface-container-highest text-on-surface-variant", to: "/palmistry" },
  { icon: "calendar_month", accent: "text-primary", badge: "bg-primary/10 text-primary", to: "/horoscope" },
  { icon: "diamond", accent: "text-secondary", badge: "bg-secondary-container/30 text-secondary", to: "/remedies" },
] as const;

/** Prices are shown as in the design; links go to where each product is ordered. */
const TIERS = [
  { price: "₹0", compare: null, to: null, featured: false },
  { price: "₹49", compare: "₹299", to: "/kundli", featured: false },
  { price: "₹99", compare: "₹499", to: "/milan", featured: false },
  { price: "₹299", compare: "₹999", to: "/remedies", featured: true },
] as const;

const REVIEW_PEOPLE = [
  { name: "Ananya S.", photo: "/images/testimonial-ananya.jpg" },
  { name: "Vikram I.", photo: "/images/testimonial-vikram.jpg" },
];

function Stars({ size }: { size: string }) {
  return (
    <div className="flex text-primary">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`material-symbols-outlined ${size}`} style={FILL}>
          star
        </span>
      ))}
    </div>
  );
}

function TodayCard({ chart, name, tz }: { chart: Chart; name: string; tz: string }) {
  const t = useT(homeText);
  const names = useT(common);
  const today = useMemo(() => readDay(chart, new Date(), tz), [chart, tz]);
  const quality = qualityOf(today.quality);
  return (
    <section className="px-margin-mobile pt-space-md">
      <Link
        to="/horoscope"
        className="group animate-rise relative block overflow-hidden rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-md active:scale-[0.99] transition-transform"
      >
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-glow" />
        <div className="relative flex items-start gap-space-sm">
          <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(242,202,80,0.25)]">
            <span className="material-symbols-outlined text-xl animate-float" style={FILL}>
              bedtime
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold">
              {t.todayEyebrow}
              {name && ` • ${t.todayHello(name.split(" ")[0])}`}
            </span>
            <p className="font-body-md text-body-md text-on-surface font-semibold mt-0.5">{t.todayMoonSign(names.signs[chart.planets.Moon.sign])}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.todayMoonStar(names.nakshatras[today.moonNakshatra])}</p>
            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-primary font-semibold">{t.todayQuality[quality]}</span>
              <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
                {t.todayCta} <span className="material-symbols-outlined text-sm transition-transform duration-300 ease-out-expo group-hover:translate-x-1">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default function HomePage() {
  const t = useT(homeText);
  const { profile, chart } = useBirthProfile();
  const { seeker, loading: sessionLoading } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const chartLink = chart ? "/kundli" : "/birth-details";
  const chartCta = chart ? t.ctaOpenChart : t.ctaFreeChart;

  return (
    <main className="flex-1 flex flex-col w-full pt-16 pb-24">
      <div className="flex flex-col w-full text-on-surface">
        {chart && profile && <TodayCard chart={chart} name={profile.name} tz={profile.birth.timezone} />}
        {!sessionLoading && !seeker && (
          <div className="px-margin-mobile pt-space-md">
            <SignInCard feature="home" compact />
          </div>
        )}

        {/* Hero */}
        <section className="relative px-margin-mobile pt-space-md pb-space-xl overflow-hidden flex flex-col items-center text-center">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none animate-fade-in [animation-duration:1200ms]" />
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-56 h-56 bg-primary-container/20 rounded-full blur-2xl pointer-events-none animate-fade-in [animation-duration:1600ms]" />
          <div className="animate-pop-in relative z-10 inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-surface-container-high/90 shadow-md backdrop-blur-md mb-space-md">
            <span className="material-symbols-outlined text-primary text-sm" style={FILL}>
              verified
            </span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase text-primary font-semibold">{t.heroPill}</span>
          </div>
          {/* Zodiac wheel: the 12 signs turning, planets circling the sun */}
          <div className="animate-scale-in [animation-delay:100ms] [animation-duration:900ms] relative z-10 mb-space-md">
            <ZodiacWheel className="w-56 h-56" />
          </div>
          <h1 className="animate-rise [animation-delay:200ms] relative z-10 font-headline-lg-mobile text-headline-lg-mobile font-semibold text-on-surface tracking-tight max-w-xs">
            {t.heroTitle}
            <br />
            <span className="text-primary italic font-headline-lg-mobile">{t.heroAccent}</span>
          </h1>
          <p className="animate-rise [animation-delay:300ms] relative z-10 mt-space-sm text-body-md font-body-md text-on-surface-variant max-w-sm">{t.heroBody}</p>
          <div className="relative z-10 w-full mt-space-lg flex flex-col gap-space-sm max-w-xs" data-stagger="in" style={{ "--reveal-delay": "400ms", "--stagger-step": "90ms" } as React.CSSProperties}>
            <Link
              to={chartLink}
              className="sheen w-full min-h-[48px] py-3 px-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md shadow-[0_0_24px_rgba(242,202,80,0.35)] active:scale-[0.98] transition-transform flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <span>{chartCta}</span>
            </Link>
            <Link
              to="/remedies"
              className="w-full min-h-[44px] py-2.5 px-6 rounded-full bg-surface-container-high/90 text-on-surface font-title-md text-title-md shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-secondary text-lg">cyclone</span>
              <span>{t.ctaRemedies}</span>
              <span className="text-on-surface-variant text-sm">✦</span>
            </Link>
          </div>
          {/* Honest trust points */}
          <ul className="relative z-10 mt-space-md flex flex-col items-center gap-1.5 text-on-surface-variant" data-stagger="in" style={{ "--reveal-delay": "600ms", "--stagger-step": "80ms" } as React.CSSProperties}>
            {t.trustPoints.map((point, i) => (
              <li key={point} className="flex items-center gap-1.5 font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-primary text-base" style={FILL}>
                  {["verified_user", "currency_rupee", "public"][i]}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Feature grid */}
        <section className="px-margin-mobile py-space-md flex flex-col gap-space-md">
          <Reveal className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-sm animate-twinkle">stars</span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase">{t.featuresEyebrow}</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">{t.featuresTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.featuresSub}</p>
          </Reveal>
          <Reveal stagger step={80} className="grid grid-cols-1 gap-space-sm">
            {FEATURES.map((f, i) => {
              const copy = t.features[i];
              return (
                <Link
                  key={f.icon}
                  to={f.to ?? chartLink}
                  className="group relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl active:scale-[0.98] transition-[transform,background-color] duration-300 ease-out-expo hover:bg-surface-container-high"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-11 h-11 shrink-0 rounded-lg bg-surface-container-high flex items-center justify-center shadow-inner transition-transform duration-300 ease-out-expo group-hover:scale-110 group-active:scale-95 ${f.accent}`}>
                      <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                    </div>
                    <span className={`font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full font-semibold text-right ${f.badge}`}>{copy.badge}</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">{copy.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{copy.body}</p>
                  <div className={`mt-space-sm flex items-center gap-space-xs font-label-md text-label-md font-semibold ${f.accent}`}>
                    <span>{copy.cta}</span>
                    <span className="material-symbols-outlined text-sm transition-transform duration-300 ease-out-expo group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </Link>
              );
            })}
            {/* Ask AI */}
            <Link
              to="/ask"
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-md flex items-center gap-space-sm active:scale-[0.98] transition-transform duration-300 ease-out-expo"
            >
              <div className="w-11 h-11 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl animate-float">psychology</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">{t.askTitle}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t.askBody}</p>
              </div>
              <span className="sheen shrink-0 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold">{t.askCta}</span>
            </Link>
          </Reveal>
        </section>

        {/* Showcase */}
        <section className="px-margin-mobile py-space-sm">
          <Reveal variant="scale" className="group rounded-xl overflow-hidden bg-surface-container-high relative shadow-lg">
            <img className="w-full h-48 object-cover opacity-85 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105" alt="" src="/images/astrolabe-manuscript.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent p-space-md flex flex-col justify-end">
              <div className="inline-flex items-center gap-1.5 text-primary mb-1">
                <span className="material-symbols-outlined text-sm" style={FILL}>
                  workspace_premium
                </span>
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">{t.showcaseBadge}</span>
              </div>
              <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">{t.showcaseTitle}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.showcaseBody}</p>
            </div>
          </Reveal>
        </section>

        {/* Pricing strip */}
        <section className="px-margin-mobile py-space-lg flex flex-col">
          <Reveal className="text-center mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">{t.pricingEyebrow}</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">{t.pricingTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.pricingSub}</p>
          </Reveal>
          <Reveal stagger step={90} className="flex gap-space-sm overflow-x-auto pb-space-sm snap-x snap-mandatory -mx-margin-mobile px-margin-mobile no-scrollbar">
            {TIERS.map((tier, i) => {
              const copy = t.tiers[i];
              return (
                <div
                  key={tier.price}
                  className={`snap-center shrink-0 w-64 rounded-xl p-space-md flex flex-col justify-between ${
                    tier.featured ? "bg-surface-container-high shadow-xl shadow-primary-container/10" : "bg-surface-container/95 shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center gap-2">
                      <span className={`font-label-sm text-label-sm uppercase tracking-wider font-semibold ${tier.featured ? "text-primary" : i === 1 ? "text-secondary" : "text-on-surface-variant"}`}>
                        {copy.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tier.featured ? "bg-primary/20 text-primary" : i === 1 ? "bg-secondary-container/40 text-secondary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {copy.tag}
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-xs">{copy.title}</h3>
                    <div className="mt-space-md flex items-baseline gap-1">
                      <span className={`font-headline-lg-mobile text-headline-lg-mobile font-bold ${i === 0 ? "text-on-surface" : "text-primary"}`}>{tier.price}</span>
                      {tier.compare ? (
                        <span className="font-body-sm text-body-sm line-through text-outline">{tier.compare}</span>
                      ) : (
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{copy.per}</span>
                      )}
                    </div>
                    {tier.featured && <p className="font-label-sm text-label-sm text-secondary mt-0.5">{t.delivery}</p>}
                    <ul className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                      {copy.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={tier.to ?? chartLink}
                    className={`mt-space-lg w-full py-2.5 rounded-lg font-label-lg text-label-lg text-center active:scale-95 transition-transform ${
                      tier.featured
                        ? "sheen bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-md"
                        : `bg-surface-container-high ${i === 0 ? "text-on-surface" : "text-primary"}`
                    }`}
                  >
                    {copy.cta}
                  </Link>
                </div>
              );
            })}
          </Reveal>
        </section>

        {/* Pandit check */}
        <section className="px-margin-mobile py-space-md">
          <Reveal className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 text-primary pointer-events-none animate-spin-slow">
              <svg fill="currentColor" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2" />
                <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex items-center gap-space-sm mb-space-sm">
              <div className="w-12 h-12 shrink-0 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">{t.trustEyebrow}</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">{t.trustTitle}</h3>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.trustBody}</p>
            <Reveal stagger step={110} className="grid grid-cols-3 gap-space-xs mt-space-md bg-surface-container-high/50 p-space-sm rounded-lg">
              {t.trustBadges.map(([title, sub], i) => (
                <div key={title} className="flex flex-col items-center text-center">
                  <span className={`material-symbols-outlined text-xl ${i === 1 ? "text-secondary" : "text-primary"}`}>
                    {["workspace_premium", "self_improvement", "local_shipping"][i]}
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">{title}</span>
                  <span className="font-label-sm text-on-surface-variant text-[10px] leading-tight">{sub}</span>
                </div>
              ))}
            </Reveal>
          </Reveal>
        </section>

        {/* Testimonials */}
        <section className="px-margin-mobile py-space-md flex flex-col">
          <Reveal className="mb-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">{t.reviewsEyebrow}</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{t.reviewsTitle}</h2>
          </Reveal>
          <Reveal stagger step={120} className="flex gap-space-sm overflow-x-auto pb-space-sm snap-x -mx-margin-mobile px-margin-mobile no-scrollbar">
            {t.reviews.map((review, i) => (
              <div key={REVIEW_PEOPLE[i].name} className="snap-start shrink-0 w-72 rounded-xl bg-surface-container/90 p-space-md shadow-md flex flex-col justify-between">
                <div>
                  <div className="mb-space-xs">
                    <Stars size="text-sm" />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface italic">{review.quote}</p>
                </div>
                <div className="mt-space-md flex items-center gap-space-sm pt-space-xs">
                  <img className="w-9 h-9 rounded-full object-cover" alt="" src={REVIEW_PEOPLE[i].photo} />
                  <div>
                    <p className="font-label-md text-label-md font-semibold text-on-surface">{REVIEW_PEOPLE[i].name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{review.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="px-margin-mobile py-space-md mb-space-md">
          <Reveal className="text-center mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">{t.faqEyebrow}</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">{t.faqTitle}</h2>
          </Reveal>
          <Reveal stagger step={60} className="flex flex-col gap-space-xs">
            {t.faqs.map(([question, answer], i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`rounded-xl overflow-hidden transition-colors duration-300 ${open ? "bg-surface-container-high/90" : "bg-surface-container/90"}`}>
                  <button
                    aria-expanded={open}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="tap-scale w-full p-space-md text-left flex justify-between items-center gap-2"
                  >
                    <span className="font-title-md text-title-md text-on-surface font-semibold">{question}</span>
                    <span className={`material-symbols-outlined text-primary text-xl transition-transform duration-300 ease-out-expo ${open ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  {open && (
                    <div id={`faq-${i}`} className="animate-rise [animation-duration:400ms] px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="px-margin-mobile pb-space-lg">
          <Reveal variant="scale" className="rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-high p-space-lg text-center relative overflow-hidden shadow-xl">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none animate-glow" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-space-xs animate-float">stars</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t.finalTitle}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-1 mb-space-md">{t.finalBody}</p>
              <Link
                to={chartLink}
                className="sheen w-full max-w-xs py-3 px-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-semibold shadow-[0_0_24px_rgba(242,202,80,0.4)] active:scale-[0.98] transition-transform"
              >
                {chartCta}
              </Link>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">lock</span>
                {t.finalNoCard}
              </p>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
