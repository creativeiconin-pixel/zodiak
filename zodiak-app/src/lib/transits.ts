// Gochar (transit) calculations for the Horoscope and Home pages.
// Everything is measured from the natal Moon sign (Chandra gochar), the classical way Vedic
// astrologers read day-to-day transits. All results are deterministic for a given chart + instant.
import { Body, Observer, SearchRiseSet, MakeTime } from "astronomy-engine";
import { siderealLongitudes, toUtc, type Chart, type Planet } from "./astro";

export const GRAHAS: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const NAK_SPAN = 360 / 27;
const DAY_MS = 24 * 3600 * 1000;
const norm = (d: number) => ((d % 360) + 360) % 360;

/** House (1-12) of `sign` counted from `fromSign`, whole-sign. */
export const houseFrom = (fromSign: number, sign: number) => ((sign - fromSign + 12) % 12) + 1;

/**
 * Classical "good" transit houses counted from the natal Moon (Phaladeepika-style gochar table).
 * A planet in any other house is treated as unhelpful for this simple reading.
 */
export const GOOD_HOUSES: Record<Planet, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 11],
  Ketu: [3, 6, 11],
};

export const isGoodTransit = (planet: Planet, house: number) => GOOD_HOUSES[planet].includes(house);

export type TransitPosition = {
  planet: Planet;
  longitude: number;
  sign: number;
  degree: number;
  nakshatra: number;
  pada: number;
  retrograde: boolean;
  houseFromMoon: number;
  houseFromLagna: number;
  good: boolean;
};

/** Where the nine grahas are at `at`, with houses counted from the natal Moon and Lagna. */
export function transitPositions(chart: Chart, at: Date): Record<Planet, TransitPosition> {
  const now = siderealLongitudes(at);
  const next = siderealLongitudes(new Date(at.getTime() + DAY_MS));
  const moonSign = chart.planets.Moon.sign;
  return Object.fromEntries(
    GRAHAS.map((planet) => {
      const longitude = now[planet];
      const sign = Math.floor(longitude / 30);
      const delta = norm(next[planet] - longitude + 180) - 180;
      const houseFromMoon = houseFrom(moonSign, sign);
      return [
        planet,
        {
          planet,
          longitude,
          sign,
          degree: longitude % 30,
          nakshatra: Math.floor(longitude / NAK_SPAN),
          pada: Math.floor((longitude % NAK_SPAN) / (NAK_SPAN / 4)) + 1,
          retrograde: planet === "Rahu" || planet === "Ketu" ? true : delta < 0,
          houseFromMoon,
          houseFromLagna: houseFrom(chart.ascendant.sign, sign),
          good: isGoodTransit(planet, houseFromMoon),
        } satisfies TransitPosition,
      ];
    }),
  ) as Record<Planet, TransitPosition>;
}

/* ------------------------------------------------------------------ Tara bala */

/** The nine taras in order. Index = (count from birth star - 1) % 9. */
export const TARAS = ["janma", "sampat", "vipat", "kshema", "pratyari", "sadhaka", "vadha", "mitra", "paramaMitra"] as const;
export type Tara = (typeof TARAS)[number];

/** +1 helpful, -1 difficult, 0 mixed (Janma, your own birth star). */
export const TARA_EFFECT: Record<Tara, -1 | 0 | 1> = {
  janma: 0, sampat: 1, vipat: -1, kshema: 1, pratyari: -1, sadhaka: 1, vadha: -1, mitra: 1, paramaMitra: 1,
};

export function taraFor(birthNakshatra: number, transitNakshatra: number): Tara {
  const count = ((transitNakshatra - birthNakshatra + 27) % 27) + 1;
  return TARAS[(count - 1) % 9];
}

/* ------------------------------------------------------------------ Day quality & area scores */

export type Area = "love" | "work" | "money" | "health";
export const AREAS: Area[] = ["love", "work", "money", "health"];

/**
 * Simple scoring rule (documented so a Pandit can check it):
 *  - Each planet scores +1 if it sits in one of its GOOD_HOUSES from the natal Moon, else -1.
 *  - Each life area adds up a few planets with weights that total 4:
 *      love   = Venus x2 + Moon x1 + Mars x1      (Venus = love, Moon = feelings, Mars = quarrels/passion)
 *      work   = Saturn x2 + Mars x1 + Moon x1     (Saturn = work and effort, Mars = drive)
 *      money  = Jupiter x2 + Venus x1 + Moon x1   (Jupiter = growth and luck, Venus = comforts)
 *      health = Moon x2 + Mars x1 + Saturn x1     (Moon = mind/body, Mars = energy, Saturn = tiredness)
 *  - Score (1-5 stars) = 3 + sum / 2, plus 0.5 on a helpful tara day or minus 0.5 on a difficult one,
 *    clamped to 1-5 and rounded to the nearest half star.
 *  - Weekly / monthly scores are the average of the daily scores (taken at local noon) over 7 / 30 days.
 */
const AREA_WEIGHTS: Record<Area, Partial<Record<Planet, number>>> = {
  love: { Venus: 2, Moon: 1, Mars: 1 },
  work: { Saturn: 2, Mars: 1, Moon: 1 },
  money: { Jupiter: 2, Venus: 1, Moon: 1 },
  health: { Moon: 2, Mars: 1, Saturn: 1 },
};

const roundHalf = (n: number) => Math.round(n * 2) / 2;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export type DayReading = {
  at: Date;
  /** Local calendar date at the birthplace, YYYY-MM-DD. */
  date: string;
  moonHouse: number;
  moonNakshatra: number;
  tara: Tara;
  /** 2 = great, 1 = good, 0 = okay, -1 or less = go slow. */
  quality: number;
  scores: Record<Area, number>;
};

/** Day quality = tara effect (+1/0/-1) + Moon house effect (+1 good house, -1 for 4/8/12, else 0). */
function moonHouseEffect(house: number): -1 | 0 | 1 {
  if (GOOD_HOUSES.Moon.includes(house)) return 1;
  if ([4, 8, 12].includes(house)) return -1;
  return 0;
}

export function readDay(chart: Chart, at: Date, timeZone: string): DayReading {
  const pos = transitPositions(chart, at);
  const tara = taraFor(chart.planets.Moon.nakshatra, pos.Moon.nakshatra);
  const taraEffect = TARA_EFFECT[tara];
  const scores = Object.fromEntries(
    AREAS.map((area) => {
      const sum = Object.entries(AREA_WEIGHTS[area]).reduce((acc, [planet, w]) => acc + (pos[planet as Planet].good ? w : -w), 0);
      return [area, clamp(roundHalf(3 + sum / 2 + taraEffect * 0.5), 1, 5)];
    }),
  ) as Record<Area, number>;
  return {
    at,
    date: localDate(at, timeZone),
    moonHouse: pos.Moon.houseFromMoon,
    moonNakshatra: pos.Moon.nakshatra,
    tara,
    quality: taraEffect + moonHouseEffect(pos.Moon.houseFromMoon),
    scores,
  };
}

/** Daily readings at local noon for `days` days starting today (birthplace calendar). */
export function readDays(chart: Chart, timeZone: string, days: number, from: Date = new Date()): DayReading[] {
  const start = localDate(from, timeZone);
  return Array.from({ length: days }, (_, i) => readDay(chart, toUtc(addDays(start, i), "12:00", timeZone), timeZone));
}

export function averageScores(readings: DayReading[]): Record<Area, number> {
  return Object.fromEntries(
    AREAS.map((area) => [area, roundHalf(readings.reduce((acc, r) => acc + r.scores[area], 0) / readings.length)]),
  ) as Record<Area, number>;
}

/** Plain label bucket for a day's quality number. */
export type Quality = "great" | "good" | "okay" | "slow";
export const qualityOf = (q: number): Quality => (q >= 2 ? "great" : q === 1 ? "good" : q === 0 ? "okay" : "slow");

export type Level = "high" | "mid" | "low";
export const scoreLevel = (score: number): Level => (score >= 4 ? "high" : score >= 2.75 ? "mid" : "low");

/* ------------------------------------------------------------------ Moon timing */

/** When the Moon leaves its current nakshatra (searching up to 2 days ahead). */
export function moonNakshatraEnds(at: Date): Date {
  const nakAt = (d: Date) => Math.floor(siderealLongitudes(d).Moon / NAK_SPAN);
  const current = nakAt(at);
  let lo = at.getTime();
  let hi = lo + 2 * DAY_MS;
  for (let step = lo + 3 * 3600 * 1000; step <= hi; step += 3 * 3600 * 1000) {
    if (nakAt(new Date(step)) !== current) {
      hi = step;
      break;
    }
    lo = step;
  }
  while (hi - lo > 60 * 1000) {
    const mid = (lo + hi) / 2;
    if (nakAt(new Date(mid)) === current) lo = mid;
    else hi = mid;
  }
  return new Date(hi);
}

/* ------------------------------------------------------------------ Ingresses */

export type Ingress = { planet: Planet; at: Date; fromSign: number; toSign: number; houseFromMoon: number; good: boolean };

/**
 * Sign changes over the next `days` days, found by stepping every 6 hours and bisecting each
 * change to the minute. The Moon (which changes sign every ~2.5 days) is included only when asked.
 */
export function upcomingIngresses(chart: Chart, days: number, includeMoon: boolean, from: Date = new Date()): Ingress[] {
  const planets = GRAHAS.filter((p) => includeMoon || p !== "Moon");
  const signsAt = (t: number) => {
    const lon = siderealLongitudes(new Date(t));
    return Object.fromEntries(planets.map((p) => [p, Math.floor(lon[p] / 30)])) as Record<Planet, number>;
  };
  const step = 6 * 3600 * 1000;
  const end = from.getTime() + days * DAY_MS;
  const result: Ingress[] = [];
  let t = from.getTime();
  let prev = signsAt(t);
  while (t < end) {
    const nextT = Math.min(t + step, end);
    const next = signsAt(nextT);
    for (const planet of planets) {
      if (next[planet] === prev[planet]) continue;
      let lo = t;
      let hi = nextT;
      while (hi - lo > 60 * 1000) {
        const mid = (lo + hi) / 2;
        if (Math.floor(siderealLongitudes(new Date(mid))[planet] / 30) === prev[planet]) lo = mid;
        else hi = mid;
      }
      const houseFromMoon = houseFrom(chart.planets.Moon.sign, next[planet]);
      result.push({ planet, at: new Date(hi), fromSign: prev[planet], toSign: next[planet], houseFromMoon, good: isGoodTransit(planet, houseFromMoon) });
    }
    prev = next;
    t = nextT;
  }
  return result.sort((a, b) => a.at.getTime() - b.at.getTime());
}

/** Sade Sati (Saturn's 7.5-year phase) is on when Saturn is in the 12th, 1st or 2nd house from the natal Moon. */
export const sadeSatiActive = (saturnHouseFromMoon: number) => [12, 1, 2].includes(saturnHouseFromMoon);

/* ------------------------------------------------------------------ Weekday, lucky items, Rahu Kaal */

/** Weekday lords, Sunday first. */
export const WEEKDAY_LORDS: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

/** Traditional number of each graha (Chaldean order used in Indian numerology). */
export const PLANET_NUMBER: Record<Planet, number> = { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 };

/** Two swatch colours per weekday lord (names live in the page dictionary). */
export const PLANET_COLOURS: Record<Planet, [string, string]> = {
  Sun: ["#f97316", "#f2ca50"],
  Moon: ["#f8fafc", "#cbd5e1"],
  Mars: ["#ef4444", "#b91c1c"],
  Mercury: ["#22c55e", "#15803d"],
  Jupiter: ["#facc15", "#f59e0b"],
  Venus: ["#f8fafc", "#f9a8d4"],
  Saturn: ["#1e3a8a", "#111827"],
  Rahu: ["#1e3a8a", "#6b7280"],
  Ketu: ["#78716c", "#a16207"],
};

/** Weekday index (0 = Sunday) of an instant in a time zone. */
export function localWeekday(at: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(at);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

export function localDate(at: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Rahu Kaal is this eighth (1-based) of the daytime, Sunday first. */
const RAHU_KAAL_PART = [8, 2, 7, 5, 6, 4, 3];

export type DayTimes = { sunrise: Date; sunset: Date; rahuKaal: [Date, Date]; abhijit: [Date, Date] | null; weekday: number };

/**
 * Sunrise, sunset, Rahu Kaal and Abhijit muhurat for a local date at a place.
 * Rahu Kaal: daytime split into 8 equal parts; the weekday picks the part.
 * Abhijit: the 8th of 15 daytime muhurtas (around local noon); traditionally skipped on Wednesdays.
 * Returns null near the poles where the Sun may not rise or set.
 */
export function dayTimes(date: string, latitude: number, longitude: number, timeZone: string): DayTimes | null {
  const observer = new Observer(latitude, longitude, 0);
  const midnight = toUtc(date, "00:00", timeZone);
  const rise = SearchRiseSet(Body.Sun, observer, +1, MakeTime(midnight), 1);
  if (!rise) return null;
  const set = SearchRiseSet(Body.Sun, observer, -1, rise, 1);
  if (!set) return null;
  const sunrise = rise.date;
  const sunset = set.date;
  const day = sunset.getTime() - sunrise.getTime();
  const weekday = localWeekday(new Date(midnight.getTime() + 12 * 3600 * 1000), timeZone);
  const part = RAHU_KAAL_PART[weekday] - 1;
  const rahuKaal: [Date, Date] = [new Date(sunrise.getTime() + (day * part) / 8), new Date(sunrise.getTime() + (day * (part + 1)) / 8)];
  const abhijit: [Date, Date] | null =
    weekday === 3 ? null : [new Date(sunrise.getTime() + (day * 7) / 15), new Date(sunrise.getTime() + (day * 8) / 15)];
  return { sunrise, sunset, rahuKaal, abhijit, weekday };
}

/* ------------------------------------------------------------------ Remedy pick */

/**
 * Which planet to suggest a small remedy for:
 *  - on a "go slow" day (quality <= -1) the Moon, to calm the mind;
 *  - otherwise the first of Saturn, Rahu, Ketu, Mars, Sun that is in an unhelpful house from the Moon;
 *  - if all are fine, Jupiter, to keep good luck flowing.
 */
export function remedyPlanet(positions: Record<Planet, TransitPosition>, quality: number): Planet {
  if (quality <= -1) return "Moon";
  return (["Saturn", "Rahu", "Ketu", "Mars", "Sun"] as Planet[]).find((p) => !positions[p].good) ?? "Jupiter";
}

/* ------------------------------------------------------------------ Formatting */

const LOCALE: Record<string, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };
export const localeFor = (lang: string) => LOCALE[lang] ?? "en-IN";

export function formatTime(at: Date, timeZone: string, lang: string): string {
  return new Intl.DateTimeFormat(localeFor(lang), { timeZone, hour: "numeric", minute: "2-digit" }).format(at);
}

export function formatDay(at: Date, timeZone: string, lang: string, withWeekday = true): string {
  return new Intl.DateTimeFormat(localeFor(lang), { timeZone, day: "numeric", month: "short", ...(withWeekday ? { weekday: "short" } : {}) }).format(at);
}
