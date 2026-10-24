import { useState } from "react";
import { Link } from "react-router-dom";
import { NorthIndianChart, SouthIndianChart } from "../components/kundli/ChartDiagrams";
import { Reveal } from "../components/motion/Reveal";
import { useLanguage, useT, type Lang } from "../i18n";
import { astroTerms, PLANET_MANTRAS } from "../i18n/astroTerms";
import { common } from "../i18n/common";
import { kundliText } from "../i18n/pages/kundli";
import { activePeriod, formatDegree, PLANET_INFO, SIGNS, subPeriods, type DashaPeriod, type Planet } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";

/** Print only the Kundli itself: hide the app header, bottom nav and buttons, keep the colours. */
const PRINT_CSS = `
@media print {
  @page { margin: 12mm; }
  html, body { background: #0b0d1b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body header, body nav { display: none !important; }
  .kundli-page section, .kundli-page article { break-inside: avoid; box-shadow: none !important; }
  .kundli-page .overflow-x-auto { overflow: visible !important; }
}`;

const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };
const PLANET_ORDER: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function yearsMonthsLeft(period: DashaPeriod, now: Date) {
  const months = Math.max(0, Math.round((period.end.getTime() - now.getTime()) / (30.4375 * 24 * 3600 * 1000)));
  return [Math.floor(months / 12), months % 12] as const;
}

/** Indexes of three neighbouring periods around the current one, kept inside the list. */
function windowAround(length: number, index: number) {
  const start = Math.min(Math.max(index - 1, 0), Math.max(length - 3, 0));
  return [start, start + 1, start + 2].filter((i) => i < length);
}

function SectionTitle({ icon, children, aside }: { icon: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-space-sm">
      <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        {children}
      </h2>
      {aside}
    </div>
  );
}

export default function KundliPage() {
  const t = useT(kundliText);
  const names = useT(common);
  const terms = useT(astroTerms);
  const { lang } = useLanguage();
  const { profile, chart } = useBirthProfile();
  const [style, setStyle] = useState<"north" | "south">("north");
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [toast, setToast] = useState<string>();

  if (!profile || !chart) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-space-md w-full pt-20 pb-28 px-margin-mobile text-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-glow" />
          <span className="material-symbols-outlined text-primary text-6xl relative animate-spin-slow">flare</span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface animate-rise">{t.noChartTitle}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs animate-rise [animation-delay:80ms]">{t.noChartBody}</p>
        <Link to="/birth-details" className="sheen tap-scale animate-rise [animation-delay:160ms] px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md flex items-center gap-2">
          <span className="material-symbols-outlined">auto_awesome</span> {t.makeChart}
        </Link>
      </main>
    );
  }

  const now = new Date();
  const locale = LOCALES[lang];
  const planetName = (p: Planet) => names.planets[p];
  const lagnaSign = chart.ascendant.sign;
  const moon = chart.planets.Moon;
  const sun = chart.planets.Sun;
  const md = activePeriod(chart.mahadashas, now);
  const antardashas = subPeriods(md);
  const ad = activePeriod(antardashas, now);
  const adIndex = antardashas.indexOf(ad);
  const pratyantars = subPeriods(ad);
  const pdIndex = pratyantars.indexOf(activePeriod(pratyantars, now));
  const adWindow = windowAround(antardashas.length, adIndex);
  const pdWindow = windowAround(pratyantars.length, pdIndex);
  const elapsed = Math.round(((now.getTime() - md.start.getTime()) / (md.end.getTime() - md.start.getTime())) * 100);
  const [yearsLeft, monthsLeft] = yearsMonthsLeft(md, now);
  const monthYear = (d: Date) => d.toLocaleDateString(locale, { month: "short", year: "numeric" });
  const birthDate = new Date(`${profile.birth.date}T00:00`).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  const houseLabel = (n: number) => terms.houseLabel(n);
  const selectedPlanets = selectedHouse ? PLANET_ORDER.filter((p) => chart.planets[p].house === selectedHouse) : [];
  const mantra = PLANET_MANTRAS[md.lord];

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: t.title(profile!.name), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t.copied);
      window.setTimeout(() => setToast(undefined), 2400);
    } catch {
      // the user closed the share sheet
    }
  }

  const trinity = [
    { key: "lagna", icon: "north_east", badge: "ASC", sign: lagnaSign, title: t.lagnaTitle(names.signs[lagnaSign]), sub: t.lagnaSub, body: t.lagnaBody(terms.signTraits[lagnaSign]) },
    { key: "moon", icon: "bedtime", sign: moon.sign, title: t.moonTitle(names.signs[moon.sign]), sub: t.moonSub(houseLabel(moon.house)), body: t.moonBody(terms.signTraits[moon.sign]) },
    { key: "sun", icon: "sunny", sign: sun.sign, title: t.sunTitle(names.signs[sun.sign]), sub: t.sunSub(houseLabel(sun.house)), body: t.sunBody(terms.signTraits[sun.sign]) },
  ];

  return (
    <main className="kundli-page flex-1 flex flex-col relative w-full pt-16 pb-24 print:pt-0 print:pb-0">
      <style>{PRINT_CSS}</style>
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl space-y-space-lg">
        {/* Header Card & Seeker Identity */}
        <section className="animate-rise relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-lg mt-space-sm">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none animate-glow" />
          <div className="relative flex items-start justify-between gap-space-sm">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> {t.method}
            </span>
            <button type="button" onClick={() => void share()} aria-label={t.share} className="tap-scale w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors print:hidden">
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>
          <h1 className="relative mt-space-sm font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{t.title(profile.name)}</h1>
          <p className="relative font-body-sm text-body-sm text-on-surface-variant">
            {t.born} {birthDate}
            {profile.birth.time && !profile.birth.time_unknown ? ` • ${profile.birth.time}` : ""} • {profile.birth.place}
          </p>
          {/* Key Trio Pills */}
          <div className="relative grid grid-cols-3 gap-space-xs mt-space-md" data-stagger="in" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
            {[
              [t.rising, names.signs[lagnaSign], `${formatDegree(chart.ascendant.degree)}`],
              [t.moonStar, names.nakshatras[moon.nakshatra], t.pada(moon.pada)],
              [t.moonSign, names.signs[moon.sign], formatDegree(moon.degree)],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-lg bg-surface-container-lowest/50 px-1.5 py-2.5 text-center">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
                <span className="block mt-1 font-title-md text-title-md text-primary leading-tight break-words">{value}</span>
                <span className="block font-label-sm text-label-sm text-secondary mt-0.5">{detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Kundli Chart */}
        <Reveal as="section" className="rounded-xl bg-surface-container p-space-md shadow-lg space-y-space-sm">
          <SectionTitle
            icon="blur_on"
            aside={
              <div className="flex items-center bg-surface-container-lowest rounded-full p-0.5 print:hidden" role="group">
                {(["north", "south"] as const).map((value) => (
                  <button key={value} type="button" aria-pressed={style === value} onClick={() => setStyle(value)} className={`tap-scale px-3 py-1 rounded-full font-label-md text-label-md transition-colors duration-300 ${style === value ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>
                    {value === "north" ? t.north : t.south}
                  </button>
                ))}
              </div>
            }
          >
            {t.chartTitle}
          </SectionTitle>
          <div className="mx-auto w-full max-w-[360px]">
            {style === "north" ? (
              <NorthIndianChart chart={chart} short={terms.planetShort} selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} houseLabel={houseLabel} ascLabel={t.asc} />
            ) : (
              <SouthIndianChart chart={chart} short={terms.planetShort} selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} houseLabel={houseLabel} ascLabel={t.asc} signNames={names.signs} />
            )}
          </div>
          {profile.birth.time_unknown && <p className="font-body-sm text-body-sm text-secondary text-center">{t.approxNote}</p>}
          {selectedHouse ? (
            <div key={selectedHouse} className="animate-rise rounded-lg bg-surface-container-low p-space-sm space-y-1" aria-live="polite">
              <p className="font-title-md text-title-md text-on-surface">
                {houseLabel(selectedHouse)} • {t.sign}: {names.signs[(lagnaSign + selectedHouse - 1) % 12]}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t.looksAfter}: {terms.houses[selectedHouse - 1]}
              </p>
              <p className="font-body-sm text-body-sm text-primary">
                {selectedPlanets.length ? `${t.planetsHere}: ${selectedPlanets.map(planetName).join(", ")}` : t.emptyHouse}
              </p>
            </div>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center print:hidden">{t.tapHint}</p>
          )}
        </Reveal>

        {/* Lagna, Moon, Sun */}
        <Reveal as="section" stagger className="space-y-space-sm">
          <SectionTitle icon="auto_awesome">{t.trinityTitle}</SectionTitle>
          {trinity.map((card) => (
            <article key={card.key} className="hover-lift rounded-xl bg-surface-container p-space-md shadow-md">
              <div className="flex items-start gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-title-lg text-title-lg text-on-surface">{card.title}</h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm">
                      {t.ruledBy(planetName(SIGNS[card.sign].lord as Planet))}
                    </span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{card.sub}</p>
                  <p className="mt-1.5 font-body-md text-body-md text-on-surface">{card.body}</p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>

        {/* Vimshottari Dasha */}
        <section className="space-y-space-sm">
          <SectionTitle icon="hourglass_empty">{t.dashaTitle}</SectionTitle>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.dashaIntro}</p>
          <Reveal className="relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary-container/50 via-surface-container to-surface-container-high p-space-md shadow-lg">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">{t.mainPeriod}</span>
            <div className="mt-1 flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/60 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl animate-float">{PLANET_INFO[md.lord].icon}</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{t.periodName(planetName(md.lord))}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{monthYear(md.start)} – {monthYear(md.end)}</p>
              </div>
            </div>
            <p className="mt-space-sm font-body-md text-body-md text-on-surface">{t.periodMeaning(names.planetMeaning[md.lord])}</p>
            <div className="mt-space-sm h-2 rounded-full bg-surface-container-lowest/70 overflow-hidden" role="progressbar" aria-valuenow={elapsed} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary origin-left animate-grow-x" style={{ width: `${elapsed}%` }} />
            </div>
            <div className="mt-1 flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>{t.done(elapsed)}</span>
              <span>{t.left(yearsLeft, monthsLeft)}</span>
            </div>
          </Reveal>

          <Reveal className="rounded-xl bg-surface-container p-space-md shadow-md space-y-space-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{t.subNow}</span>
            <h3 className="font-title-lg text-title-lg text-on-surface">{t.subName(planetName(md.lord), planetName(ad.lord))}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{monthYear(ad.start)} – {monthYear(ad.end)}</p>
            <p className="font-body-md text-body-md text-on-surface">{t.periodMeaning(names.planetMeaning[ad.lord])}</p>
            <span className="block pt-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.subSequence}</span>
            <Reveal stagger className="grid grid-cols-3 gap-space-xs">
              {adWindow.map((index) => {
                const period = antardashas[index];
                const status = index < adIndex ? t.statusDone : index === adIndex ? t.statusNow : t.statusNext;
                return (
                  <div key={index} className={`rounded-lg p-2 text-center ${index === adIndex ? "bg-primary/15 ring-1 ring-primary" : "bg-surface-container-low"}`}>
                    <span className="block font-label-md text-label-md text-on-surface">{planetName(period.lord)}</span>
                    <span className={`block font-label-sm text-label-sm ${index === adIndex ? "text-primary" : "text-on-surface-variant"}`}>{status}</span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">{period.start.getFullYear()}–{period.end.getFullYear()}</span>
                  </div>
                );
              })}
            </Reveal>
            <span className="block pt-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.smallPeriods}</span>
            <Reveal as="ul" stagger className="space-y-1.5">
              {pdWindow.map((index) => {
                const period = pratyantars[index];
                const current = index === pdIndex;
                const status = index < pdIndex ? t.statusDone : current ? t.statusNow : t.statusNext;
                const day = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "2-digit" });
                return (
                  <li key={index} className={`flex items-center gap-2 rounded-lg p-2 ${current ? "bg-secondary-container/25 border-l-2 border-primary" : "bg-surface-container-low"} ${index < pdIndex ? "opacity-60" : ""}`}>
                    <span className={`material-symbols-outlined text-lg ${current ? "text-primary animate-twinkle [animation-duration:2.4s]" : "text-outline"}`}>{index < pdIndex ? "check_circle" : current ? "radio_button_checked" : "radio_button_unchecked"}</span>
                    <span className="flex-1 min-w-0">
                      <span className={`block font-body-md text-body-md ${current ? "text-primary font-semibold" : "text-on-surface"}`}>{planetName(period.lord)}</span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">{day(period.start)} – {day(period.end)}</span>
                    </span>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded font-label-sm text-label-sm ${current ? "bg-primary/20 text-primary font-bold" : "text-outline"}`}>{status}</span>
                  </li>
                );
              })}
            </Reveal>
          </Reveal>

          {/* Free remedy for the running period */}
          <Reveal variant="scale" className="rounded-xl bg-surface-container-low p-space-md space-y-space-sm ring-1 ring-primary/20">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm animate-twinkle">shield_with_heart</span> {t.freeRemedyTitle}
            </span>
            <p className="font-headline-sm text-headline-sm text-on-surface" lang="sa">{lang === "en" || lang === "hinglish" ? mantra.roman : mantra.devanagari}</p>
            {lang !== "en" && lang !== "hinglish" && <p className="font-body-sm text-body-sm text-on-surface-variant">{mantra.roman}</p>}
            <p className="font-body-md text-body-md text-on-surface-variant">{t.freeRemedyBody(planetName(md.lord), terms.weekday[md.lord])}</p>
            <Link to="/remedies" className="group inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold print:hidden">
              {t.browseRemedies} <span className="material-symbols-outlined text-sm transition-transform duration-300 ease-out-expo group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </Reveal>
        </section>

        {/* Planetary Positions Table */}
        <Reveal as="section" className="space-y-space-sm">
          <SectionTitle icon="table_chart" aside={<span className="font-label-sm text-label-sm text-on-surface-variant">{t.tableCount}</span>}>
            {t.tableTitle}
          </SectionTitle>
          <div className="rounded-xl bg-surface-container overflow-x-auto shadow-md">
            <table className="w-full text-left">
              <thead>
                <tr className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider bg-surface-container-high">
                  {[t.colPlanet, t.colSign, t.colStar, t.colStrength].map((label) => (
                    <th key={label} scope="col" className="px-2 py-2 font-semibold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60 font-body-sm text-body-sm" data-stagger="in" style={{ "--reveal-delay": "250ms", "--stagger-step": "50ms" } as React.CSSProperties}>
                {PLANET_ORDER.map((planet) => {
                  const position = chart.planets[planet];
                  const strong = position.dignity === "Exalted (Uchha)" || position.dignity === "Own House";
                  const weak = position.dignity === "Debilitated (Neecha)" || position.dignity === "Enemy Sign";
                  return (
                    <tr key={planet}>
                      <th scope="row" className="px-2 py-2 font-medium text-on-surface whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-primary">{PLANET_INFO[planet].icon}</span>
                          {planetName(planet)}
                          {position.retrograde && planet !== "Rahu" && planet !== "Ketu" && (
                            <abbr title={t.retro} className="no-underline text-secondary font-label-sm text-label-sm">R</abbr>
                          )}
                        </span>
                      </th>
                      <td className="px-2 py-2 text-on-surface">
                        {names.signs[position.sign]}
                        <span className="block text-on-surface-variant font-mono text-[11px]">{formatDegree(position.degree)}</span>
                      </td>
                      <td className="px-2 py-2 text-on-surface-variant">{names.nakshatras[position.nakshatra]}</td>
                      <td className={`px-2 py-2 ${strong ? "text-primary" : weak ? "text-error" : "text-on-surface-variant"}`}>{terms.dignity[position.dignity]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* How we calculate */}
        <Reveal as="section" variant="left" className="flex items-start gap-space-sm rounded-xl bg-surface-container-low p-space-md">
          <img src="/images/astrolabe-emblem.jpg" alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
          <div>
            <h2 className="font-title-md text-title-md text-on-surface">{t.howTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.howBody}</p>
          </div>
        </Reveal>

        {/* Keep a copy */}
        <Reveal as="section" stagger className="flex flex-col gap-space-md print:hidden">
          <div className="rounded-xl bg-surface-container-high/90 p-space-md shadow-xl space-y-space-sm">
            <div className="flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-3xl shrink-0">picture_as_pdf</span>
              <div className="min-w-0">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">{t.printTitle}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.printBody}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => window.print()} className="sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">download</span> {t.printCta}
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-surface-container-highest via-surface-container-high to-secondary-container/40 p-space-md shadow-2xl space-y-space-sm">
            <div className="flex items-center gap-space-sm">
              <img src="/images/hardbound-kundli.jpg" alt="" className="w-16 h-20 rounded-lg object-cover shrink-0 shadow-md animate-float" />
              <div className="min-w-0">
                <h2 className="font-title-lg text-title-lg text-on-surface">{t.bookTitle}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.bookBody}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/remedies" className="px-5 py-2.5 rounded-full border border-primary/60 text-primary font-label-lg text-label-lg font-bold active:scale-95 transition-all flex items-center gap-1.5">
                {t.bookCta} <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {toast && (
        <div className="animate-fade-in fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md shadow-xl flex items-center gap-1.5" role="status">
          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> {toast}
        </div>
      )}
    </main>
  );
}
