import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../components/motion/CountUp";
import { Reveal } from "../components/motion/Reveal";
import { LoadingCard } from "../components/StatusMessage";
import { useLanguage, useT } from "../i18n";
import { PLANET_MANTRAS, astroTerms } from "../i18n/astroTerms";
import { common } from "../i18n/common";
import { horoscopeText, type Period } from "../i18n/pages/horoscope";
import { PLANET_INFO, formatDegree, nakshatraLord, type Chart } from "../lib/astro";
import { useBirthProfile, type BirthProfile } from "../lib/birthProfile";
import {
  AREAS,
  GRAHAS,
  PLANET_COLOURS,
  PLANET_NUMBER,
  WEEKDAY_LORDS,
  averageScores,
  dayTimes,
  formatDay,
  formatTime,
  localDate,
  localeFor,
  moonNakshatraEnds,
  qualityOf,
  readDay,
  readDays,
  remedyPlanet,
  sadeSatiActive,
  scoreLevel,
  transitPositions,
  upcomingIngresses,
  type Area,
  type DayReading,
  type Quality,
} from "../lib/transits";

const FILL = { fontVariationSettings: "'FILL' 1" } as const;

const QUALITY_STYLE: Record<Quality, { icon: string; text: string; bar: string; width: string }> = {
  great: { icon: "sentiment_very_satisfied", text: "text-primary", bar: "from-secondary to-primary", width: "100%" },
  good: { icon: "sentiment_satisfied", text: "text-primary-fixed", bar: "from-secondary to-primary", width: "75%" },
  okay: { icon: "sentiment_neutral", text: "text-secondary", bar: "from-secondary to-secondary", width: "50%" },
  slow: { icon: "sentiment_dissatisfied", text: "text-on-surface-variant", bar: "from-outline to-outline", width: "25%" },
};

const AREA_STYLE: Record<Area, { icon: string; iconBox: string; bar: string; filled: boolean }> = {
  love: { icon: "favorite", iconBox: "bg-secondary-container/30 text-secondary", bar: "bg-secondary", filled: true },
  work: { icon: "trending_up", iconBox: "bg-primary-container/20 text-primary", bar: "bg-primary", filled: true },
  money: { icon: "account_balance_wallet", iconBox: "bg-surface-container-high text-primary-fixed", bar: "bg-primary-fixed", filled: false },
  health: { icon: "spa", iconBox: "bg-secondary-container/20 text-tertiary", bar: "bg-secondary-fixed-dim", filled: false },
};

function NoChart() {
  const t = useT(horoscopeText);
  return (
    <div className="animate-scale-in relative overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-xl flex flex-col items-center text-center gap-space-sm">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none animate-glow" />
      <span className="material-symbols-outlined text-primary text-4xl animate-twinkle" style={FILL}>
        auto_awesome
      </span>
      <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{t.noChartTitle}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">{t.noChartBody}</p>
      <Link
        to="/birth-details"
        className="sheen mt-space-xs px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
      >
        {t.noChartCta}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </Link>
    </div>
  );
}

export default function HoroscopePage() {
  const { profile, chart, loading } = useBirthProfile();
  return (
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24">
      <div className="flex flex-col w-full px-margin-mobile pt-space-sm pb-space-xl">
        {chart && profile ? <Horoscope chart={chart} profile={profile} /> : loading ? <LoadingCard /> : <NoChart />}
      </div>
    </main>
  );
}

function Horoscope({ chart, profile }: { chart: Chart; profile: BirthProfile }) {
  const t = useT(horoscopeText);
  const names = useT(common);
  const terms = useT(astroTerms);
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("daily");
  const [showPlanets, setShowPlanets] = useState(false);

  const birth = profile.birth;
  const tz = birth.timezone;
  const place = birth.place.split(",")[0];
  const time = (d: Date) => formatTime(d, tz, lang);

  // Everything for "today" is fixed when the page opens.
  const now = useMemo(() => new Date(), []);
  const positions = useMemo(() => transitPositions(chart, now), [chart, now]);
  const today = useMemo(() => readDay(chart, now, tz), [chart, now, tz]);
  const moonEnds = useMemo(() => moonNakshatraEnds(now), [now]);
  const times = useMemo(() => dayTimes(localDate(now, tz), birth.latitude, birth.longitude, tz), [now, tz, birth.latitude, birth.longitude]);
  const week = useMemo(() => (period === "weekly" ? readDays(chart, tz, 7, now) : null), [period, chart, tz, now]);
  const month = useMemo(() => (period === "monthly" ? readDays(chart, tz, 30, now) : null), [period, chart, tz, now]);
  const moves = useMemo(
    () => (period === "daily" ? [] : upcomingIngresses(chart, period === "weekly" ? 7 : 30, period === "weekly", now)),
    [period, chart, now],
  );

  const moonSign = chart.planets.Moon.sign;
  const moonHouse = positions.Moon.houseFromMoon;
  const quality = qualityOf(today.quality);
  const scores = period === "daily" ? today.scores : averageScores((period === "weekly" ? week : month) ?? [today]);

  const weekday = times?.weekday ?? now.getDay();
  const dayLord = WEEKDAY_LORDS[weekday];
  const dayName = new Intl.DateTimeFormat(localeFor(lang), { timeZone: tz, weekday: "long" }).format(now);
  const starLord = nakshatraLord(positions.Moon.nakshatra);
  const luckyNumbers = [...new Set([PLANET_NUMBER[dayLord], PLANET_NUMBER[starLord]])];

  const remedy = remedyPlanet(positions, today.quality);
  const mantra = lang === "hi" ? PLANET_MANTRAS[remedy].devanagari : PLANET_MANTRAS[remedy].roman;
  const sadeSati = sadeSatiActive(positions.Saturn.houseFromMoon);

  const moonEndsLabel = localDate(moonEnds, tz) === localDate(now, tz) ? time(moonEnds) : `${formatDay(moonEnds, tz, lang)}, ${time(moonEnds)}`;

  const rahuStatus = times ? (now < times.rahuKaal[0] ? t.rahuLater : now > times.rahuKaal[1] ? t.rahuDone : t.rahuNow) : null;
  const rahuActive = times ? now >= times.rahuKaal[0] && now <= times.rahuKaal[1] : false;

  const bestDays = (month ?? [])
    .filter((r) => r.quality >= 1)
    .sort((a, b) => b.quality - a.quality || a.at.getTime() - b.at.getTime())
    .slice(0, 6)
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  return (
    <>
      {/* Header card: Moon sign + today's Moon */}
      <div className="animate-rise relative w-full overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-xl">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none animate-glow [animation-duration:5s]" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-glow" />
        <div className="relative flex flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary animate-twinkle" style={FILL}>
                auto_awesome
              </span>
              {t.eyebrow}
            </span>
            <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-xs text-primary">verified</span>
              <span className="font-label-sm text-label-sm tracking-tight text-on-surface-variant font-medium">{t.fromChart}</span>
            </div>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight mt-1">{t.title}</h1>
          <div className="flex items-center gap-space-sm mt-1 bg-surface-container/70 rounded-lg p-2 backdrop-blur-md">
            <div className="w-9 h-9 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-xl animate-float">bedtime</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{t.moonSign(names.signs[moonSign])}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t.moonToday(names.nakshatras[positions.Moon.nakshatra], moonEndsLabel)}</span>
            </div>
            <Link
              to="/birth-details"
              aria-label={t.changeDetails}
              title={t.changeDetails}
              className="tap-scale ml-auto shrink-0 w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </Link>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{t.moonSignHint}</p>
        </div>
        {/* Astrolabe + today's main message */}
        <div className="relative mt-space-md w-full bg-surface-container-lowest/80 rounded-xl p-space-md flex items-center gap-space-md overflow-hidden">
          <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 animate-[spin_60s_linear_infinite]" fill="none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" opacity="0.4" r="46" stroke="#99907c" strokeDasharray="2 3" strokeWidth="0.75" />
              <circle cx="50" cy="50" opacity="0.6" r="38" stroke="#d4af37" strokeWidth="0.8" />
              <circle cx="50" cy="50" opacity="0.5" r="30" stroke="#d0bcff" strokeDasharray="4 2" strokeWidth="0.5" />
              <line opacity="0.3" stroke="#d4af37" strokeWidth="0.5" x1="50" x2="50" y1="4" y2="96" />
              <line opacity="0.3" stroke="#d4af37" strokeWidth="0.5" x1="4" x2="96" y1="50" y2="50" />
              <path d="M 50 14 A 36 36 0 0 1 86 50" opacity="0.8" stroke="#f2ca50" strokeWidth="1.2" />
              <circle cx="50" cy="14" fill="#f2ca50" r="2" />
              <circle cx="86" cy="50" fill="#d0bcff" r="1.5" />
              <circle cx="26" cy="74" fill="#f2ca50" r="1.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-title-lg text-title-lg text-primary font-bold animate-pop-in [animation-delay:400ms]">{moonHouse}</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">{t.summaryTitle}</span>
            <p className="font-body-sm text-body-sm text-on-surface mt-0.5">{t.summary(t.ordinal(moonHouse), terms.houses[moonHouse - 1])}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.moonHouse[moonHouse - 1]}</p>
          </div>
        </div>
        {sadeSati && (
          <div className="animate-rise [animation-delay:300ms] relative mt-space-sm flex items-start gap-2 rounded-lg bg-surface-container/70 p-2.5">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">hourglass_top</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.sadeSati}</p>
          </div>
        )}
      </div>

      {/* Period tabs */}
      <div role="tablist" className="animate-rise [animation-delay:120ms] relative mt-space-md w-full bg-surface-container-high rounded-full p-1 flex items-center justify-between shadow-inner">
        {/* Sliding gold pill behind the selected tab */}
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-primary shadow-md transition-transform duration-500 ease-out-expo"
          style={{ transform: `translateX(${(["daily", "weekly", "monthly"] as Period[]).indexOf(period) * 100}%)` }}
        />
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={period === p}
            onClick={() => setPeriod(p)}
            className={`tap-scale relative z-10 flex-1 py-1.5 rounded-full font-label-lg text-label-lg font-semibold text-center transition-colors duration-300 ${
              period === p ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.tabs[p]}
          </button>
        ))}
      </div>

      {period === "daily" && (
        <>
          {/* Mood, good time, lucky colour and number */}
          <div className="mt-space-md grid grid-cols-2 gap-gutter-mobile" data-stagger="in" style={{ "--reveal-delay": "150ms", "--stagger-step": "70ms" } as React.CSSProperties}>
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-lg">{QUALITY_STYLE[quality].icon}</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">{t.dayType}</span>
              </div>
              <div className="mt-2">
                <span className={`font-title-md text-title-md font-semibold block leading-snug ${QUALITY_STYLE[quality].text}`}>{t.quality[quality]}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">{t.starCheck(t.taraName[today.tara])}</span>
              </div>
              <div className="mt-space-sm h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r rounded-full origin-left animate-grow-x [animation-delay:500ms] ${QUALITY_STYLE[quality].bar}`} style={{ width: QUALITY_STYLE[quality].width }} />
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">{t.goodTime}</span>
              </div>
              <div className="mt-2">
                {times?.abhijit ? (
                  <span className="font-body-md text-body-md text-on-surface font-bold block leading-snug">
                    {time(times.abhijit[0])} – {time(times.abhijit[1])}
                  </span>
                ) : (
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold block">{t.noGoodTime}</span>
                )}
                <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">{t.goodTimeHint}</span>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-1.5 text-tertiary">
                <span className="material-symbols-outlined text-lg">palette</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">{t.luckyColour}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {PLANET_COLOURS[dayLord].map((c) => (
                  <div key={c} className="w-4 h-4 shrink-0 rounded-full shadow-sm ring-1 ring-outline-variant animate-pop-in [animation-delay:450ms]" style={{ backgroundColor: c }} />
                ))}
                <span className="font-body-sm text-body-sm text-on-surface font-medium">{t.colourName[dayLord]}</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">{t.dayOf(dayName, names.planets[dayLord])}</span>
            </div>
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-fixed">
                <span className="material-symbols-outlined text-lg">casino</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">{t.luckyNumber}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {luckyNumbers.map((n, i) => (
                  <span
                    key={n}
                    className={`w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-lg text-title-lg font-bold animate-pop-in ${i ? "text-secondary" : "text-primary"}`}
                    style={{ animationDelay: `${500 + i * 120}ms` }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">{t.numberHint(names.planets[dayLord])}</span>
            </div>
          </div>
          <p className="animate-fade-in [animation-delay:400ms] mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{t.taraMeaning[today.tara]}</p>

          {/* Rahu Kaal */}
          {times && (
            <Reveal className="mt-space-md rounded-xl bg-surface-container-low p-space-md shadow-sm flex items-start gap-space-sm">
              <div className="w-10 h-10 shrink-0 rounded-full bg-error-container/30 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-xl">do_not_disturb_on</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-md text-label-md text-on-surface font-semibold">{t.rahuTitle}</span>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    {time(times.rahuKaal[0])} – {time(times.rahuKaal[1])}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                      rahuActive ? "bg-error-container/40 text-error animate-pulse" : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {rahuStatus}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.rahuBody(place)}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">wb_twilight</span>
                  {t.sun(time(times.sunrise), time(times.sunset))}
                </p>
              </div>
            </Reveal>
          )}
        </>
      )}

      {period === "weekly" && week && (
        <section className="animate-rise mt-space-md flex flex-col gap-space-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">{t.weekTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.weekSub}</p>
          </div>
          <div className="flex flex-col gap-1.5" data-stagger="in" style={{ "--reveal-delay": "120ms", "--stagger-step": "55ms" } as React.CSSProperties}>
            {week.map((day, i) => (
              <DayRow key={day.date} day={day} isToday={i === 0} tz={tz} />
            ))}
          </div>
        </section>
      )}

      {period === "monthly" && month && (
        <section className="animate-rise mt-space-md flex flex-col gap-space-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">{t.monthTitle}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.monthSub}</p>
          </div>
          {bestDays.length ? (
            <div className="grid grid-cols-2 gap-gutter-mobile" data-stagger="in" style={{ "--reveal-delay": "150ms", "--stagger-step": "60ms" } as React.CSSProperties}>
              {bestDays.map((day) => {
                const q = qualityOf(day.quality);
                return (
                  <div key={day.date} className="bg-surface-container rounded-xl p-space-sm flex items-center gap-2 shadow-sm">
                    <span className={`material-symbols-outlined text-xl ${QUALITY_STYLE[q].text}`} style={FILL}>
                      {q === "great" ? "star" : "star_half"}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{formatDay(day.at, tz, lang)}</span>
                      <span className={`font-label-sm text-label-sm ${QUALITY_STYLE[q].text}`}>{t.quality[q]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.noBestDays}</p>
          )}
        </section>
      )}

      {/* Focus areas */}
      <Reveal as="section" stagger className="mt-space-lg flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">{t.areasTitle}</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{t.areasWhen[period]}</span>
        </div>
        {AREAS.map((area) => {
          const score = scores[area];
          const level = scoreLevel(score);
          const style = AREA_STYLE[area];
          return (
            <div key={area} className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.iconBox}`}>
                    <span className="material-symbols-outlined text-lg" style={style.filled ? FILL : undefined}>
                      {style.icon}
                    </span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">{t.areaName[area]}</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm text-primary" style={FILL}>
                    star
                  </span>
                  <CountUp value={score} decimals={1} duration={800} className="font-label-sm text-label-sm text-primary font-bold" />
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">{t.areaText[area][level]}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div key={period} className={`h-full rounded-full origin-left animate-grow-x ${level === "low" ? "bg-outline" : style.bar}`} style={{ width: `${(score / 5) * 100}%` }} />
                </div>
                <span className={`font-label-sm text-label-sm font-semibold ${level === "low" ? "text-on-surface-variant" : "text-primary"}`}>{t.level[level]}</span>
              </div>
            </div>
          );
        })}
      </Reveal>

      {/* Upcoming sign changes */}
      {period !== "daily" && (
        <Reveal as="section" stagger step={80} className="mt-space-lg flex flex-col gap-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">{t.movesTitle[period]}</h2>
          {moves.length ? (
            moves.map((m) => (
              <div key={`${m.planet}-${m.at.getTime()}`} className="bg-surface-container rounded-xl p-space-md flex items-start gap-space-sm shadow-sm">
                <div className="w-9 h-9 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">{PLANET_INFO[m.planet].icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{t.moveLine(names.planets[m.planet], names.signs[m.toSign])}</span>
                    <span className="font-label-sm text-label-sm text-primary shrink-0">{formatDay(m.at, tz, lang)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {t.moveHouse(t.ordinal(m.houseFromMoon), terms.houses[m.houseFromMoon - 1])}{" "}
                    <span className={m.good ? "text-primary" : "text-secondary"}>{m.good ? t.moveGood : t.moveSlow}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.movesNone}</p>
          )}
        </Reveal>
      )}

      {/* Simple remedy */}
      <Reveal variant="scale" className="mt-space-lg relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-space-md shadow-lg">
        <div className="flex items-start gap-space-md">
          <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-primary text-2xl animate-float">{PLANET_INFO[remedy].icon}</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-ping" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">{t.remedyEyebrow}</span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold mt-0.5">{t.remedyTitle(names.planets[remedy])}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.remedyWhy(names.planets[remedy], names.planetMeaning[remedy])}</p>
            <p className="font-body-md text-body-md text-on-surface mt-1">{t.remedyAction[remedy]}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t.remedyMantra(mantra, terms.weekday[remedy])}</p>
            <Link
              to="/remedies"
              className="sheen mt-space-md py-2.5 px-space-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>{t.remedyCta}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Planet positions today */}
      <Reveal className="mt-space-md bg-surface-container rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPlanets((v) => !v)}
          aria-expanded={showPlanets}
          className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-xl">blur_on</span>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-semibold">{t.planetsTitle}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t.planetsSub}</span>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ease-out-expo ${showPlanets ? "rotate-180" : ""}`}>expand_more</span>
        </button>
        {showPlanets && (
          <ul className="px-space-md pb-space-md flex flex-col gap-2" data-stagger="in" style={{ "--reveal-delay": "0ms", "--stagger-step": "40ms" } as React.CSSProperties}>
            {GRAHAS.map((planet) => {
              const p = positions[planet];
              return (
                <li key={planet} className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">{PLANET_INFO[planet].icon}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {names.planets[planet]} • {names.signs[p.sign]} {formatDegree(p.degree)}
                      </span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${p.good ? "bg-primary/15 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                        {p.good ? t.helpful : t.notHelpful}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {names.nakshatras[p.nakshatra]} • {t.fromMoon(t.ordinal(p.houseFromMoon))}
                      {!birth.time_unknown && ` • ${t.fromLagna(t.ordinal(p.houseFromLagna))}`}
                    </span>
                    {p.retrograde && planet !== "Rahu" && planet !== "Ketu" && <span className="font-label-sm text-label-sm text-secondary">{t.retro}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Reveal>

      <p className="mt-space-md font-label-sm text-label-sm text-on-surface-variant text-center">{t.note}</p>
    </>
  );
}

function DayRow({ day, isToday, tz }: { day: DayReading; isToday: boolean; tz: string }) {
  const t = useT(horoscopeText);
  const names = useT(common);
  const { lang } = useLanguage();
  const q = qualityOf(day.quality);
  return (
    <div className={`rounded-xl p-space-sm flex items-center gap-space-sm shadow-sm ${isToday ? "bg-surface-container-high ring-1 ring-primary/40" : "bg-surface-container"}`}>
      <span className={`material-symbols-outlined text-2xl ${QUALITY_STYLE[q].text}`} style={FILL}>
        {QUALITY_STYLE[q].icon}
      </span>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-label-md text-label-md text-on-surface font-semibold">
          {isToday ? `${t.today} • ` : ""}
          {formatDay(day.at, tz, lang)}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
          {names.nakshatras[day.moonNakshatra]} • {t.taraName[day.tara]}
        </span>
      </div>
      <span className={`shrink-0 font-label-md text-label-md font-semibold ${QUALITY_STYLE[q].text}`}>{t.qualityShort[q]}</span>
    </div>
  );
}
