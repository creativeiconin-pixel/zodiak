// Vedic (sidereal, Lahiri) chart calculations on top of astronomy-engine's ephemeris.
// Planet positions are geocentric apparent longitudes on the true ecliptic of date, shifted by the
// Lahiri ayanamsa. Houses are whole-sign from the Lagna; Rahu/Ketu use the mean lunar node.
import { Body, GeoVector, MakeTime, Rotation_EQJ_ECT, RotateVector, SiderealTime, SphereFromVector, e_tilt, type AstroTime } from "astronomy-engine";

export const SIGNS = [
  { sanskrit: "Mesha", english: "Aries", lord: "Mars" },
  { sanskrit: "Vrishabha", english: "Taurus", lord: "Venus" },
  { sanskrit: "Mithuna", english: "Gemini", lord: "Mercury" },
  { sanskrit: "Karka", english: "Cancer", lord: "Moon" },
  { sanskrit: "Simha", english: "Leo", lord: "Sun" },
  { sanskrit: "Kanya", english: "Virgo", lord: "Mercury" },
  { sanskrit: "Tula", english: "Libra", lord: "Venus" },
  { sanskrit: "Vrishchika", english: "Scorpio", lord: "Mars" },
  { sanskrit: "Dhanu", english: "Sagittarius", lord: "Jupiter" },
  { sanskrit: "Makara", english: "Capricorn", lord: "Saturn" },
  { sanskrit: "Kumbha", english: "Aquarius", lord: "Saturn" },
  { sanskrit: "Meena", english: "Pisces", lord: "Jupiter" },
] as const;

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const;

export type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export const PLANET_INFO: Record<Planet, { sanskrit: string; abbr: string; icon: string }> = {
  Sun: { sanskrit: "Surya", abbr: "Su", icon: "sunny" },
  Moon: { sanskrit: "Chandra", abbr: "Mo", icon: "bedtime" },
  Mars: { sanskrit: "Mangal", abbr: "Ma", icon: "shield" },
  Mercury: { sanskrit: "Budh", abbr: "Me", icon: "psychology" },
  Jupiter: { sanskrit: "Guru", abbr: "Ju", icon: "temple_buddhist" },
  Venus: { sanskrit: "Shukra", abbr: "Ve", icon: "diamond" },
  Saturn: { sanskrit: "Shani", abbr: "Sa", icon: "hourglass_top" },
  Rahu: { sanskrit: "Rahu", abbr: "Ra", icon: "north" },
  Ketu: { sanskrit: "Ketu", abbr: "Ke", icon: "south" },
};

const PLANETS: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

/** Vimshottari order (starting from Ashwini's lord) and mahadasha lengths in years. */
const DASHA_ORDER: Planet[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<Planet, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const YEAR_MS = 365.25 * 24 * 3600 * 1000;

const EXALTATION: Partial<Record<Planet, number>> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
const FRIENDS: Partial<Record<Planet, Planet[]>> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES: Partial<Record<Planet, Planet[]>> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

export type Dignity = "Exalted (Uchha)" | "Debilitated (Neecha)" | "Own House" | "Friendly" | "Neutral" | "Enemy Sign" | "Shadow Node";

export type PlanetPosition = {
  planet: Planet;
  longitude: number; // sidereal, 0-360
  sign: number; // 0-11
  degree: number; // within sign
  nakshatra: number; // 0-26
  pada: number; // 1-4
  house: number; // 1-12, whole-sign from Lagna
  retrograde: boolean;
  dignity: Dignity;
};

export type DashaPeriod = { lord: Planet; start: Date; end: Date };

export type Chart = {
  birthUtc: Date;
  ayanamsa: number;
  ascendant: { longitude: number; sign: number; degree: number; nakshatra: number; pada: number };
  planets: Record<Planet, PlanetPosition>;
  mahadashas: DashaPeriod[];
};

export type BirthInput = { date: string; time: string | null; timezone: string; latitude: number; longitude: number };

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Offset (ms) of an IANA time zone from UTC at a given instant. */
function zoneOffsetMs(timeZone: string, instant: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - instant;
}

/** Convert a civil date/time at a birthplace (IANA zone) to a UTC instant, honouring historical offsets. */
export function toUtc(date: string, time: string | null, timeZone: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time ?? "12:00").split(":").map(Number);
  const wallClock = Date.UTC(y, m - 1, d, hh, mm);
  let utc = wallClock - zoneOffsetMs(timeZone, wallClock);
  utc = wallClock - zoneOffsetMs(timeZone, utc); // second pass settles DST boundaries
  return new Date(utc);
}

function centuriesSinceJ2000(t: AstroTime) {
  return t.tt / 36525;
}

/** Lahiri (Chitrapaksha) ayanamsa in degrees. */
export function lahiriAyanamsa(t: AstroTime): number {
  const T = centuriesSinceJ2000(t);
  return 23.85709 + 1.396971 * T + 0.000308 * T * T;
}

function tropicalLongitude(body: Body, t: AstroTime): number {
  const ecliptic = RotateVector(Rotation_EQJ_ECT(t), GeoVector(body, t, true));
  return norm(SphereFromVector(ecliptic).lon);
}

/** Mean longitude of the Moon's ascending node (Rahu), tropical, of date. */
function meanNodeLongitude(t: AstroTime): number {
  const T = centuriesSinceJ2000(t);
  return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
}

function tropicalAscendant(t: AstroTime, latitude: number, longitude: number): number {
  const ramc = rad(norm(SiderealTime(t) * 15 + longitude));
  const obliquity = rad(e_tilt(t).tobl);
  const asc = deg(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(obliquity) + Math.tan(rad(latitude)) * Math.sin(obliquity))));
  return norm(asc);
}

function dignity(planet: Planet, sign: number): Dignity {
  if (planet === "Rahu" || planet === "Ketu") return "Shadow Node";
  const exalted = EXALTATION[planet]!;
  if (sign === exalted) return "Exalted (Uchha)";
  if (sign === (exalted + 6) % 12) return "Debilitated (Neecha)";
  const lord = SIGNS[sign].lord as Planet;
  if (lord === planet) return "Own House";
  if (FRIENDS[planet]!.includes(lord)) return "Friendly";
  if (ENEMIES[planet]!.includes(lord)) return "Enemy Sign";
  return "Neutral";
}

const NAKSHATRA_SPAN = 360 / 27;

function lunarMansion(longitude: number) {
  const nakshatra = Math.floor(longitude / NAKSHATRA_SPAN);
  const pada = Math.floor((longitude % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  return { nakshatra, pada };
}

export function nakshatraLord(nakshatra: number): Planet {
  return DASHA_ORDER[nakshatra % 9];
}

/** Sidereal longitudes of the nine grahas at an instant (no houses). */
export function siderealLongitudes(instant: Date): Record<Planet, number> {
  const t = MakeTime(instant);
  const ayanamsa = lahiriAyanamsa(t);
  const tropical: Record<Planet, number> = {
    Sun: tropicalLongitude(Body.Sun, t),
    Moon: tropicalLongitude(Body.Moon, t),
    Mars: tropicalLongitude(Body.Mars, t),
    Mercury: tropicalLongitude(Body.Mercury, t),
    Jupiter: tropicalLongitude(Body.Jupiter, t),
    Venus: tropicalLongitude(Body.Venus, t),
    Saturn: tropicalLongitude(Body.Saturn, t),
    Rahu: meanNodeLongitude(t),
    Ketu: norm(meanNodeLongitude(t) + 180),
  };
  return Object.fromEntries(PLANETS.map((p) => [p, norm(tropical[p] - ayanamsa)])) as Record<Planet, number>;
}

function mahadashaSequence(moonLongitude: number, birth: Date): DashaPeriod[] {
  const { nakshatra } = lunarMansion(moonLongitude);
  const traversed = (moonLongitude % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  const firstLord = nakshatraLord(nakshatra);
  const startIndex = DASHA_ORDER.indexOf(firstLord);
  // The first mahadasha began before birth; back-date its start by the elapsed fraction.
  let start = new Date(birth.getTime() - traversed * DASHA_YEARS[firstLord] * YEAR_MS);
  const periods: DashaPeriod[] = [];
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIndex + i) % 9];
    const end = new Date(start.getTime() + DASHA_YEARS[lord] * YEAR_MS);
    periods.push({ lord, start, end });
    start = end;
  }
  return periods;
}

/** Split a dasha period into its nine sub-periods (antardasha, pratyantardasha, ...). */
export function subPeriods(period: DashaPeriod): DashaPeriod[] {
  const total = period.end.getTime() - period.start.getTime();
  const startIndex = DASHA_ORDER.indexOf(period.lord);
  let start = period.start;
  return Array.from({ length: 9 }, (_, i) => {
    const lord = DASHA_ORDER[(startIndex + i) % 9];
    const end = new Date(start.getTime() + (total * DASHA_YEARS[lord]) / 120);
    const sub = { lord, start, end };
    start = end;
    return sub;
  });
}

export function activePeriod(periods: DashaPeriod[], at: Date = new Date()): DashaPeriod {
  return periods.find((p) => p.start <= at && at < p.end) ?? periods[periods.length - 1];
}

export function computeChart(input: BirthInput): Chart {
  const birthUtc = toUtc(input.date, input.time, input.timezone);
  const t = MakeTime(birthUtc);
  const ayanamsa = lahiriAyanamsa(t);
  const longitudes = siderealLongitudes(birthUtc);
  const nextDay = siderealLongitudes(new Date(birthUtc.getTime() + 24 * 3600 * 1000));

  const ascLongitude = norm(tropicalAscendant(t, input.latitude, input.longitude) - ayanamsa);
  const ascSign = Math.floor(ascLongitude / 30);

  const planets = Object.fromEntries(
    PLANETS.map((planet) => {
      const longitude = longitudes[planet];
      const sign = Math.floor(longitude / 30);
      const delta = norm(nextDay[planet] - longitude + 180) - 180;
      return [
        planet,
        {
          planet,
          longitude,
          sign,
          degree: longitude % 30,
          ...lunarMansion(longitude),
          house: ((sign - ascSign + 12) % 12) + 1,
          retrograde: planet === "Rahu" || planet === "Ketu" ? true : delta < 0,
          dignity: dignity(planet, sign),
        } satisfies PlanetPosition,
      ];
    }),
  ) as Record<Planet, PlanetPosition>;

  return {
    birthUtc,
    ayanamsa,
    ascendant: { longitude: ascLongitude, sign: ascSign, degree: ascLongitude % 30, ...lunarMansion(ascLongitude) },
    planets,
    mahadashas: mahadashaSequence(longitudes.Moon, birthUtc),
  };
}

export function formatDegree(value: number): string {
  const d = Math.floor(value);
  const m = Math.floor((value - d) * 60);
  return `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'`;
}

export const signName = (sign: number) => `${SIGNS[sign].sanskrit} (${SIGNS[sign].english})`;

/** The compact summary the Laravel API stores for orders, the pandit dashboard and the AI astrologer. */
export function summarize(chart: Chart) {
  const md = activePeriod(chart.mahadashas);
  const ad = activePeriod(subPeriods(md));
  return {
    lagna: signName(chart.ascendant.sign),
    moon_sign: signName(chart.planets.Moon.sign),
    sun_sign: signName(chart.planets.Sun.sign),
    nakshatra: NAKSHATRAS[chart.planets.Moon.nakshatra],
    mahadasha: md.lord,
    antardasha: ad.lord,
  };
}

const ENGLISH_SIGNS = SIGNS.map((s) => s.english);

/** The chart in the compact English form the Ask-AI endpoint expects. */
export function chartPayload(chart: Chart, birthTimeKnown: boolean) {
  const md = activePeriod(chart.mahadashas);
  const ad = activePeriod(subPeriods(md));
  return {
    ascendant: `${ENGLISH_SIGNS[chart.ascendant.sign]} ${formatDegree(chart.ascendant.degree)}`,
    moon_nakshatra: `${NAKSHATRAS[chart.planets.Moon.nakshatra]} pada ${chart.planets.Moon.pada}`,
    mahadasha: md.lord,
    antardasha: ad.lord,
    antardasha_until: ad.end.toISOString().slice(0, 10),
    birth_time_known: birthTimeKnown,
    planets: Object.values(chart.planets).map((p) => ({
      name: p.planet,
      sign: ENGLISH_SIGNS[p.sign],
      degree: Math.round(p.degree * 10) / 10,
      house: p.house,
      nakshatra: NAKSHATRAS[p.nakshatra],
      retrograde: p.retrograde,
      dignity: p.dignity,
    })),
  };
}
