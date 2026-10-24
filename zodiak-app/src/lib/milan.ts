// Kundli Milan: Ashtakoota (36 guna) matching plus a Mangal (Manglik) dosha check.
//
// Inputs are each person's Moon (sign 0-11, nakshatra 0-27, longitude) and, for Manglik, the houses of Mars.
// Tables follow the standard North Indian (Parashari) matching tables, as printed in
// B.V. Raman, "Muhurtha" (ch. on marriage), Brihat Parashara Hora Shastra (natural friendships, ch. 3),
// and the Ashtakoota tables used by common Indian software (AstroSage, Kundli/Future Point, Jagannatha Hora).
// Where traditions differ (Vashya, Gana), the most widely printed variant is used and noted.
//
// Kept free of React and of the chart engine so it can be checked directly with
// `node --experimental-strip-types`.

export type Planet7 = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

export type MoonInput = {
  /** Sidereal Moon sign, 0 = Aries. */
  sign: number;
  /** Moon nakshatra, 0 = Ashwini ... 26 = Revati. */
  nakshatra: number;
  /** Sidereal longitude 0-360, used for the half-sign Vashya split. */
  longitude: number;
};

export type KootaKey = "varna" | "vashya" | "tara" | "yoni" | "maitri" | "gana" | "bhakoot" | "nadi";

export type KootaResult = {
  key: KootaKey;
  score: number;
  max: number;
  /** Raw category of bride and groom for this koota (e.g. animal names), for display. */
  bride: string;
  groom: string;
};

/** Sign lords, Aries first. */
export const SIGN_LORDS: Planet7[] = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

// ---------------------------------------------------------------- 1. Varna (1 point)
// Moon sign -> varna. Water signs Brahmin, fire Kshatriya, earth Vaishya, air Shudra.
export const VARNAS = ["Brahmin", "Kshatriya", "Vaishya", "Shudra"] as const;
const VARNA_OF_SIGN = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]; // index into VARNAS
// Groom's varna equal or higher than bride's -> 1, else 0.
function varna(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = VARNA_OF_SIGN[bride.sign];
  const g = VARNA_OF_SIGN[groom.sign];
  return { key: "varna", score: g <= b ? 1 : 0, max: 1, bride: VARNAS[b], groom: VARNAS[g] };
}

// ---------------------------------------------------------------- 2. Vashya (2 points)
export const VASHYAS = ["Chatushpada", "Manava", "Jalachara", "Vanachara", "Keeta"] as const;
// Sagittarius 0-15 is Manava, 15-30 Chatushpada; Capricorn 0-15 Chatushpada, 15-30 Jalachara.
function vashyaGroup(moon: MoonInput): number {
  const firstHalf = moon.longitude % 30 < 15;
  switch (moon.sign) {
    case 0: case 1: return 0;
    case 2: case 5: case 6: case 10: return 1;
    case 3: case 11: return 2;
    case 4: return 3;
    case 7: return 4;
    case 8: return firstHalf ? 1 : 0;
    case 9: return firstHalf ? 0 : 2;
    default: return 1;
  }
}
// Rows/columns in VASHYAS order. Same group 2; lion vs human/insect 0; prey (quadruped for lion,
// water for human) 0.5; otherwise 1. This is the symmetric table used by most matching software.
const VASHYA_TABLE = [
  [2, 1, 1, 0.5, 1],
  [1, 2, 0.5, 0, 1],
  [1, 0.5, 2, 1, 1],
  [0.5, 0, 1, 2, 0],
  [1, 1, 1, 0, 2],
];
function vashya(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = vashyaGroup(bride);
  const g = vashyaGroup(groom);
  return { key: "vashya", score: VASHYA_TABLE[g][b], max: 2, bride: VASHYAS[b], groom: VASHYAS[g] };
}

// ---------------------------------------------------------------- 3. Tara / Dina (3 points)
export const TARAS = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadha", "Mitra", "Ati-Mitra"] as const;
/** Tara (1-9) of `to` counted from `from`, inclusive. */
export function taraNumber(from: number, to: number): number {
  const count = ((to - from + 27) % 27) + 1;
  return ((count - 1) % 9) + 1;
}
const badTara = (n: number) => n === 3 || n === 5 || n === 7; // Vipat, Pratyari, Vadha
// Counted both ways: both good 3, one good 1.5, both bad 0.
function tara(bride: MoonInput, groom: MoonInput): KootaResult {
  const fromBride = taraNumber(bride.nakshatra, groom.nakshatra);
  const fromGroom = taraNumber(groom.nakshatra, bride.nakshatra);
  const good = [fromBride, fromGroom].filter((n) => !badTara(n)).length;
  return { key: "tara", score: good * 1.5, max: 3, bride: TARAS[fromGroom - 1], groom: TARAS[fromBride - 1] };
}

// ---------------------------------------------------------------- 4. Yoni (4 points)
export const YONIS = ["Horse", "Elephant", "Sheep", "Serpent", "Dog", "Cat", "Rat", "Cow", "Buffalo", "Tiger", "Deer", "Monkey", "Mongoose", "Lion"] as const;
export type Yoni = (typeof YONIS)[number];
// Nakshatra -> yoni animal (index into YONIS), Ashwini first.
export const YONI_OF_NAKSHATRA = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
// Standard 14x14 yoni table. Sworn-enemy pairs score 0: Horse-Buffalo, Elephant-Lion, Sheep-Monkey,
// Serpent-Mongoose, Dog-Deer, Cat-Rat, Cow-Tiger.
export const YONI_TABLE = [
  // Ho El Sh Se Do Ca Ra Co Bu Ti De Mo Mn Li
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1], // Horse
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], // Elephant
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1], // Sheep
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], // Serpent
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], // Dog
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1], // Cat
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], // Rat
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], // Cow
  [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1], // Buffalo
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], // Tiger
  [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], // Deer
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2], // Monkey
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2], // Mongoose
  [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4], // Lion
];
function yoni(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = YONI_OF_NAKSHATRA[bride.nakshatra];
  const g = YONI_OF_NAKSHATRA[groom.nakshatra];
  return { key: "yoni", score: YONI_TABLE[g][b], max: 4, bride: YONIS[b], groom: YONIS[g] };
}

// ---------------------------------------------------------------- 5. Graha Maitri (5 points)
// Naisargika (natural) friendships, BPHS ch. 3. Anything not listed is neutral.
const FRIENDS: Record<Planet7, Planet7[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES: Record<Planet7, Planet7[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};
type Relation = "friend" | "neutral" | "enemy";
export function relation(of: Planet7, towards: Planet7): Relation {
  if (FRIENDS[of].includes(towards)) return "friend";
  if (ENEMIES[of].includes(towards)) return "enemy";
  return "neutral";
}
/** Same lord or mutual friends 5; friend+neutral 4; both neutral 3; friend+enemy 1; neutral+enemy 0.5; mutual enemies 0. */
export function maitriPoints(a: Planet7, b: Planet7): number {
  if (a === b) return 5;
  const pair = [relation(a, b), relation(b, a)].sort().join("+");
  const table: Record<string, number> = {
    "friend+friend": 5, "friend+neutral": 4, "neutral+neutral": 3, "enemy+friend": 1, "enemy+neutral": 0.5, "enemy+enemy": 0,
  };
  return table[pair];
}
function maitri(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = SIGN_LORDS[bride.sign];
  const g = SIGN_LORDS[groom.sign];
  return { key: "maitri", score: maitriPoints(b, g), max: 5, bride: b, groom: g };
}

// ---------------------------------------------------------------- 6. Gana (6 points)
export const GANAS = ["Deva", "Manushya", "Rakshasa"] as const;
// Nakshatra -> gana (index into GANAS), Ashwini first.
export const GANA_OF_NAKSHATRA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
// Rows = groom, columns = bride. Deva groom + Manushya bride 6, Manushya groom + Deva bride 5,
// Deva/Rakshasa 1, Manushya/Rakshasa 0 (the most common printed variant).
const GANA_TABLE = [
  [6, 6, 1],
  [5, 6, 0],
  [1, 0, 6],
];
function gana(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = GANA_OF_NAKSHATRA[bride.nakshatra];
  const g = GANA_OF_NAKSHATRA[groom.nakshatra];
  return { key: "gana", score: GANA_TABLE[g][b], max: 6, bride: GANAS[b], groom: GANAS[g] };
}

// ---------------------------------------------------------------- 7. Bhakoot / Rashi (7 points)
/** Distance (1-12) of the groom's Moon sign counted from the bride's. */
export function signDistance(from: number, to: number): number {
  return ((to - from + 12) % 12) + 1;
}
// 2/12, 5/9 and 6/8 placements score 0; 1/1, 3/11, 4/10, 7/7 score 7.
const BAD_BHAKOOT = [2, 12, 5, 9, 6, 8];
function bhakoot(bride: MoonInput, groom: MoonInput): KootaResult {
  const d = signDistance(bride.sign, groom.sign);
  const back = signDistance(groom.sign, bride.sign);
  return { key: "bhakoot", score: BAD_BHAKOOT.includes(d) ? 0 : 7, max: 7, bride: `${back}`, groom: `${d}` };
}

// ---------------------------------------------------------------- 8. Nadi (8 points)
export const NADIS = ["Adi", "Madhya", "Antya"] as const;
// The nadis zig-zag through the nakshatras: Adi, Madhya, Antya, Antya, Madhya, Adi, repeat.
export const nadiOf = (nakshatra: number) => [0, 1, 2, 2, 1, 0][nakshatra % 6];
function nadi(bride: MoonInput, groom: MoonInput): KootaResult {
  const b = nadiOf(bride.nakshatra);
  const g = nadiOf(groom.nakshatra);
  return { key: "nadi", score: b === g ? 0 : 8, max: 8, bride: NADIS[b], groom: NADIS[g] };
}

// ---------------------------------------------------------------- Total + doshas
export type MilanResult = {
  kootas: KootaResult[];
  total: number;
  /** Nadi 0: same nadi. `softened` when a classical exception applies. */
  nadiDosha: { present: boolean; softened: boolean };
  /** Bhakoot 0: 2/12, 5/9 or 6/8. `softened` when both Moon-sign lords are the same or mutual friends. */
  bhakootDosha: { present: boolean; softened: boolean; distance: number };
};

export function ashtakoota(bride: MoonInput, groom: MoonInput): MilanResult {
  const kootas = [varna, vashya, tara, yoni, maitri, gana, bhakoot, nadi].map((koota) => koota(bride, groom));
  const total = kootas.reduce((sum, k) => sum + k.score, 0);
  const nadiScore = kootas[7].score;
  const bhakootScore = kootas[6].score;
  // Nadi exceptions: same Moon sign with different nakshatras, or same nakshatra in different signs
  // (nakshatras that straddle two signs), or same nakshatra but different padas (Muhurta Chintamani).
  const sameSign = bride.sign === groom.sign;
  const sameStar = bride.nakshatra === groom.nakshatra;
  const padaOf = (m: MoonInput) => Math.floor((m.longitude % (360 / 27)) / (360 / 108));
  const nadiSoftened = nadiScore === 0 && ((sameSign && !sameStar) || (sameStar && !sameSign) || (sameStar && padaOf(bride) !== padaOf(groom)));
  const lordB = SIGN_LORDS[bride.sign];
  const lordG = SIGN_LORDS[groom.sign];
  const bhakootSoftened = bhakootScore === 0 && (lordB === lordG || (relation(lordB, lordG) === "friend" && relation(lordG, lordB) === "friend"));
  return {
    kootas,
    total,
    nadiDosha: { present: nadiScore === 0, softened: nadiSoftened },
    bhakootDosha: { present: bhakootScore === 0, softened: bhakootSoftened, distance: signDistance(bride.sign, groom.sign) },
  };
}

export type Verdict = "great" | "good" | "care";
/** 28+ very good, 18-27 good, under 18 needs care (18 is the traditional minimum). */
export function verdict(total: number): Verdict {
  if (total >= 28) return "great";
  if (total >= 18) return "good";
  return "care";
}

// ---------------------------------------------------------------- Mangal dosha
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

export type ManglikInput = {
  marsSign: number;
  moonSign: number;
  /** Lagna sign, or null when the birth time is unknown (Lagna then unreliable). */
  lagnaSign: number | null;
};

export type ManglikResult = {
  fromLagna: boolean | null;
  fromMoon: boolean;
  /** "none", "mild" (only one of Lagna/Moon), "full" (both, or Moon only when Lagna is unknown). */
  level: "none" | "mild" | "full";
  /** Mars in its own sign (Aries, Scorpio) or exalted (Capricorn): traditionally softens the dosha. */
  softened: boolean;
};

const houseOf = (sign: number, from: number) => ((sign - from + 12) % 12) + 1;

export function manglik({ marsSign, moonSign, lagnaSign }: ManglikInput): ManglikResult {
  const fromLagna = lagnaSign === null ? null : MANGLIK_HOUSES.includes(houseOf(marsSign, lagnaSign));
  const fromMoon = MANGLIK_HOUSES.includes(houseOf(marsSign, moonSign));
  const level = fromLagna === null ? (fromMoon ? "mild" : "none") : fromLagna && fromMoon ? "full" : fromLagna || fromMoon ? "mild" : "none";
  return { fromLagna, fromMoon, level, softened: level !== "none" && [0, 7, 9].includes(marsSign) };
}

export type ManglikMatch = "none" | "balanced" | "one";
/** Both manglik (any level) -> traditionally cancels out. One manglik -> needs a look. */
export function manglikMatch(a: ManglikResult, b: ManglikResult): ManglikMatch {
  const am = a.level !== "none";
  const bm = b.level !== "none";
  if (!am && !bm) return "none";
  if (am && bm) return "balanced";
  return "one";
}
