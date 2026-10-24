import { ClockTimePicker } from "../components/time/ClockTimePicker";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../components/motion/CountUp";
import { Reveal } from "../components/motion/Reveal";
import { useLanguage, useT } from "../i18n";
import { common } from "../i18n/common";
import { milanText, type GroupKey, type KootaStatus } from "../i18n/pages/milan";
import { computeChart } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";
import { searchPlaces, type Place } from "../lib/geocode";
import { MILAN_PARTNER_KEY } from "../lib/personalData";
import { ashtakoota, manglik, manglikMatch, verdict, type KootaKey, type KootaResult, type ManglikMatch, type ManglikResult, type MilanResult, type MoonInput } from "../lib/milan";

type Gender = "female" | "male";

type Draft = { name: string; gender: Gender; date: string; time: string; timeUnknown: boolean; place: Place | null };

type PersonView = {
  name: string;
  gender: Gender;
  lagnaSign: number | null;
  moonSign: number;
  nakshatra: number;
  manglik: ManglikResult;
};

type MatchView = { bride: PersonView; groom: PersonView; milan: MilanResult; manglik: ManglikMatch };

const PARTNER_KEY = MILAN_PARTNER_KEY;

const KOOTA_ICONS: Record<KootaKey, string> = {
  varna: "psychology_alt",
  vashya: "balance",
  tara: "flare",
  yoni: "favorite",
  maitri: "handshake",
  gana: "groups",
  bhakoot: "savings",
  nadi: "vital_signs",
};

const GROUPS: Record<GroupKey, KootaKey[]> = {
  mind: ["maitri", "gana"],
  body: ["yoni", "nadi"],
  luck: ["varna", "vashya", "tara", "bhakoot"],
};

const emptyDraft = (gender: Gender): Draft => ({ name: "", gender, date: "", time: "", timeUnknown: false, place: null });

function readPartner(): Draft | null {
  try {
    const raw = localStorage.getItem(PARTNER_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function writePartner(draft: Draft) {
  try {
    localStorage.setItem(PARTNER_KEY, JSON.stringify(draft));
  } catch {
    // Storage may be blocked; the match still works for this visit.
  }
}

const fmt = (n: number) => (n % 1 ? n.toFixed(1) : String(n));

function statusOf(score: number, max: number): KootaStatus {
  const ratio = score / max;
  if (ratio >= 1) return "full";
  if (ratio >= 0.5) return "good";
  if (ratio > 0) return "some";
  return "low";
}

function analyse(draft: Draft): { view: PersonView; moon: MoonInput } {
  const place = draft.place!;
  const chart = computeChart({ date: draft.date, time: draft.timeUnknown ? null : draft.time, timezone: place.timezone, latitude: place.latitude, longitude: place.longitude });
  const { Moon, Mars } = chart.planets;
  // Without a birth time the Lagna is a guess, so Manglik is then read from the Moon only.
  const lagnaSign = draft.timeUnknown ? null : chart.ascendant.sign;
  return {
    view: {
      name: draft.name.trim(),
      gender: draft.gender,
      lagnaSign,
      moonSign: Moon.sign,
      nakshatra: Moon.nakshatra,
      manglik: manglik({ marsSign: Mars.sign, moonSign: Moon.sign, lagnaSign }),
    },
    moon: { sign: Moon.sign, nakshatra: Moon.nakshatra, longitude: Moon.longitude },
  };
}

function matchOf(p1: Draft, p2: Draft): MatchView {
  // The bride is the woman; if both share a gender, person 1 takes the bride's side of the tables.
  const [brideDraft, groomDraft] = p1.gender === "male" && p2.gender === "female" ? [p2, p1] : [p1, p2];
  const bride = analyse(brideDraft);
  const groom = analyse(groomDraft);
  return { bride: bride.view, groom: groom.view, milan: ashtakoota(bride.moon, groom.moon), manglik: manglikMatch(bride.view.manglik, groom.view.manglik) };
}

// ------------------------------------------------------------------ form pieces

const inputShell = "relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary transition-all";
const inputBase = "w-full py-3 pl-11 pr-4 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none rounded-xl";

function PlaceField({ id, place, onPick }: { id: string; place: Place | null; onPick: (place: Place | null) => void }) {
  const t = useT(milanText);
  const [query, setQuery] = useState(place?.label ?? "");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (place) setQuery(place.label);
  }, [place]);

  useEffect(() => {
    if (place && query === place.label) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchPlaces(query, controller.signal)
        .then((results) => {
          setSuggestions(results);
          setError(undefined);
        })
        .catch((e: Error) => e.name !== "AbortError" && setError(e.message));
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, place]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={id}>{t.fields.place}</label>
      <div className="relative">
        <div className={inputShell}>
          <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">location_on</span>
          <input
            id={id}
            className={inputBase}
            placeholder={t.fields.placePh}
            type="text"
            autoComplete="off"
            role="combobox"
            aria-expanded={suggestions.length > 0 && !place}
            aria-controls={`${id}-list`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onPick(null);
            }}
          />
        </div>
        {suggestions.length > 0 && !place && (
          <ul id={`${id}-list`} role="listbox" className="animate-scale-in origin-top absolute z-20 mt-1 w-full rounded-xl bg-surface-container-high shadow-xl overflow-hidden">
            {suggestions.map((s) => (
              <li key={`${s.latitude},${s.longitude}`} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 font-body-md text-body-md text-on-surface hover:bg-surface-container-highest flex items-center gap-2"
                  onClick={() => {
                    onPick(s);
                    setSuggestions([]);
                  }}
                >
                  <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className={`font-label-sm text-label-sm flex items-center gap-1 px-1 transition-colors duration-300 ${place ? "text-secondary" : "text-on-surface-variant"}`}>
        <span key={place ? "found" : "pick"} className="material-symbols-outlined text-[14px] animate-pop-in">{place ? "check_circle" : "explore"}</span>
        {place ? t.fields.placeFound : error ?? t.fields.pickPlace}
      </span>
    </div>
  );
}

function PersonForm({ id, title, icon, draft, onChange }: { id: string; title: string; icon: string; draft: Draft; onChange: (draft: Draft) => void }) {
  const t = useT(milanText);
  const set = (patch: Partial<Draft>) => onChange({ ...draft, ...patch });
  const segment = (active: boolean) =>
    active ? "bg-primary-container text-on-primary font-semibold shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface font-medium";

  return (
    <fieldset className="animate-rise rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-lg flex flex-col gap-space-md">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-2" aria-hidden>
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-base">{icon}</span>
        </div>
        <span className="font-title-md text-title-md text-on-surface font-semibold">{title}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-md text-label-md text-on-surface" htmlFor={`${id}-name`}>{t.fields.name}</label>
        <div className={inputShell}>
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">account_circle</span>
          <input id={`${id}-name`} className={inputBase} placeholder={t.fields.namePh} type="text" value={draft.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md text-on-surface">{t.fields.gender}</span>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-container-low" role="group" aria-label={t.fields.gender}>
          {(["female", "male"] as const).map((g) => (
            <button key={g} type="button" aria-pressed={draft.gender === g} onClick={() => set({ gender: g })} className={`py-2 px-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${segment(draft.gender === g)}`}>
              <span className="material-symbols-outlined text-[16px]">{g}</span>
              {t.fields[g]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <label className="font-label-md text-label-md text-on-surface" htmlFor={`${id}-date`}>{t.fields.date}</label>
          <div className={inputShell}>
            <input id={`${id}-date`} className="w-full py-3 px-3 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl [color-scheme:dark] min-w-0" type="date" min="1900-01-02" max={new Date().toISOString().slice(0, 10)} value={draft.date} onChange={(e) => set({ date: e.target.value })} />
          </div>
        </div>
        <div className={`flex flex-col gap-1.5 min-w-0 transition-opacity duration-300 ${draft.timeUnknown ? "opacity-40" : ""}`}>
          <label className="font-label-md text-label-md text-on-surface" htmlFor={`${id}-time`}>{t.fields.time}</label>
          <ClockTimePicker id={`${id}-time`} value={draft.time} onChange={(time) => set({ time })} disabled={draft.timeUnknown} className="py-3 pl-3 pr-3" />
        </div>
      </div>
      <div className="-mt-2 flex flex-col gap-1">
        <label className="flex items-center gap-2.5 cursor-pointer p-1">
          <input type="checkbox" className="peer sr-only" checked={draft.timeUnknown} onChange={(e) => set({ timeUnknown: e.target.checked })} />
          <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 peer-focus-visible:ring-1 peer-focus-visible:ring-secondary ${draft.timeUnknown ? "bg-primary-container" : "bg-surface-container-high"}`}>
            {draft.timeUnknown && <span className="material-symbols-outlined text-on-primary text-[16px] animate-pop-in">check</span>}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface select-none">{t.fields.timeUnknown}</span>
        </label>
        {draft.timeUnknown && <p className="animate-rise font-body-sm text-body-sm text-on-surface-variant px-1">{t.fields.timeUnknownNote}</p>}
      </div>
      <PlaceField id={`${id}-place`} place={draft.place} onPick={(place) => set({ place })} />
    </fieldset>
  );
}

// ------------------------------------------------------------------ results pieces

function PartnerCard({ person, role }: { person: PersonView; role: "bride" | "groom" }) {
  const t = useT(milanText);
  const names = useT(common);
  return (
    <div className="flex flex-col items-start gap-1 p-2 rounded-lg bg-surface-container-high/60 min-w-0">
      <div className="flex items-center gap-2 min-w-0 w-full">
        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${role === "bride" ? "bg-secondary-container text-secondary" : "bg-primary-container/20 text-primary"}`}>
          <span className="material-symbols-outlined text-base">{person.gender}</span>
        </div>
        <div className="min-w-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">{t[role]}</span>
          <p className="font-title-md text-title-md text-on-surface font-semibold leading-tight break-words">{person.name}</p>
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-0.5 text-on-surface-variant">
        <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">explore</span>
          {person.lagnaSign === null ? t.lagnaUnknown : t.lagna(names.signs[person.lagnaSign])}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{t.moonLine(names.nakshatras[person.nakshatra], names.signs[person.moonSign])}</span>
      </div>
    </div>
  );
}

function Gauge({ total }: { total: number }) {
  const t = useT(milanText);
  const pct = (total / 36) * 100;
  return (
    <div className="relative w-52 h-28 flex items-end justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 88" aria-hidden>
        <defs>
          <linearGradient id="milanGold" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#D0BCFF" />
            <stop offset="50%" stopColor="#F2CA50" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        <path d="M 14 80 A 66 66 0 0 1 146 80" fill="none" stroke="#272938" strokeWidth="10" strokeLinecap="round" pathLength={100} />
        {total > 0 && (
          <path d="M 14 80 A 66 66 0 0 1 146 80" fill="none" stroke="url(#milanGold)" strokeWidth="10" strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} className="dash-fill" style={{ "--dash-from": pct } as React.CSSProperties} />
        )}
      </svg>
      <div className="relative flex flex-col items-center pb-0.5">
        <div className="flex items-baseline">
          <CountUp value={total} duration={1400} format={fmt} className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight" />
          <span className="font-title-md text-title-md text-on-surface-variant ml-1 font-normal">{t.outOf}</span>
        </div>
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest -mt-1 font-semibold">{t.gunas}</span>
      </div>
    </div>
  );
}

function KootaRow({ koota }: { koota: KootaResult }) {
  const t = useT(milanText);
  const copy = t.kootas[koota.key];
  const status = statusOf(koota.score, koota.max);
  const statusColor = status === "full" ? "text-secondary-fixed" : status === "low" ? "text-secondary" : "text-on-surface-variant";
  return (
    <div className="hover-lift p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-base">{KOOTA_ICONS[koota.key]}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-title-md text-title-md text-on-surface">{copy.name}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">• {copy.short}</span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary">{copy.meaning}</p>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 pl-1 text-right">
        <span className="font-title-md text-title-md text-primary font-bold whitespace-nowrap">
          {fmt(koota.score)} / {koota.max}
        </span>
        <span className={`font-label-sm text-label-sm ${statusColor}`}>{t.status[status]}</span>
      </div>
    </div>
  );
}

function DoshaCard({ icon, title, body, note, remedy, tone, children }: { icon: string; title: string; body: string; note?: string; remedy?: string; tone: "care" | "ok"; children?: ReactNode }) {
  const t = useT(milanText);
  return (
    <div className="p-3 rounded-lg bg-surface-container-high/90 backdrop-blur-sm flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 shrink-0 rounded-lg bg-surface-container flex items-center justify-center ${tone === "care" ? "text-secondary" : "text-primary"}`}>
          <span className="material-symbols-outlined text-base">{icon}</span>
        </div>
        <div className="min-w-0 flex flex-col gap-1">
          <span className="font-title-md text-title-md text-on-surface">{title}</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{body}</p>
          {children}
          {note && (
            <p className="font-body-sm text-body-sm text-primary flex items-start gap-1">
              <span className="material-symbols-outlined text-sm mt-0.5">verified</span>
              <span>{note}</span>
            </p>
          )}
        </div>
      </div>
      {remedy && (
        <div className="p-2 rounded bg-surface-container-lowest/80 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-secondary font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-sm">spa</span>
              {t.remedyTag}
            </span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">{t.easyFix}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{remedy}</p>
        </div>
      )}
    </div>
  );
}

function Results({ match, onEdit, onReset }: { match: MatchView; onEdit: () => void; onReset: () => void }) {
  const t = useT(milanText);
  const { bride, groom, milan } = match;
  const v = verdict(milan.total);
  const score = (key: KootaKey) => milan.kootas.find((k) => k.key === key)!;

  const groupScore = (key: GroupKey) => {
    const parts = GROUPS[key].map(score);
    return { score: parts.reduce((s, k) => s + k.score, 0), max: parts.reduce((s, k) => s + k.max, 0) };
  };

  const ranked = [...milan.kootas].sort((a, b) => b.score / b.max - a.score / a.max || b.max - a.max);
  const best = t.kootas[ranked[0].key];
  // The part that loses the most points (among those under half marks) is the one worth a gentle word.
  const weakest = [...milan.kootas].filter((k) => k.score / k.max < 0.5).sort((a, b) => b.max - b.score - (a.max - a.score))[0];

  const manglikOne = bride.manglik.level !== "none" ? bride.name : groom.name;
  const manglikPeople = [bride, groom];
  const anyLagnaUnknown = manglikPeople.some((p) => p.lagnaSign === null);
  const anySoftened = manglikPeople.some((p) => p.manglik.softened);

  return (
    <>
      {/* Partner Synergy Bridge Card */}
      <div className="animate-rise relative w-full rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-xl overflow-hidden">
        <svg className="absolute top-0 right-0 w-36 h-36 opacity-15 pointer-events-none text-primary animate-spin-slow" fill="none" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.5" />
          <line stroke="currentColor" strokeWidth="0.5" x1="50" x2="50" y1="0" y2="100" />
          <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
          <line stroke="currentColor" strokeWidth="0.3" x1="15" x2="85" y1="15" y2="85" />
          <line stroke="currentColor" strokeWidth="0.3" x1="15" x2="85" y1="85" y2="15" />
        </svg>
        <div className="relative z-10 grid grid-cols-2 gap-3 items-stretch" data-stagger="in" style={{ "--reveal-delay": "150ms", "--stagger-step": "120ms" } as React.CSSProperties}>
          <PartnerCard person={bride} role="bride" />
          <PartnerCard person={groom} role="groom" />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-2 mt-3 pt-2 text-on-surface-variant">
          <button type="button" onClick={onEdit} className="tap-scale flex items-center gap-1 text-primary font-label-sm text-label-sm tracking-wide">
            <span className="material-symbols-outlined text-sm">edit</span>
            {t.editDetails}
          </button>
          <div className="flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-0.5 rounded-full text-secondary">
            <span className="material-symbols-outlined text-xs">{match.manglik === "one" ? "info" : "check_circle"}</span>
            <span className="font-label-sm text-label-sm">{t.manglikChip[match.manglik]}</span>
          </div>
        </div>
      </div>

      {/* Overall Guna Score Gauge */}
      <div className="animate-rise [animation-delay:120ms] relative w-full rounded-xl bg-surface-container/70 backdrop-blur-md p-space-lg flex flex-col items-center justify-center text-center shadow-lg">
        <Gauge total={milan.total} />
        <div className="mt-2 flex flex-col items-center gap-1.5 w-full">
          <div className={`animate-pop-in [animation-delay:900ms] inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${v === "care" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
            <span className="material-symbols-outlined text-sm">{v === "care" ? "spa" : "stars"}</span>
            <span className="font-label-md text-label-md font-semibold tracking-wide">
              {t.verdict[v].label} • {t.percent(Math.round((milan.total / 36) * 100))}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">{t.verdict[v].body}</p>
        </div>
        <div className="w-full grid grid-cols-3 gap-2 mt-4 bg-surface-container-high/40 rounded-lg p-2.5" data-stagger="in" style={{ "--reveal-delay": "500ms", "--stagger-step": "90ms" } as React.CSSProperties}>
          {(Object.keys(GROUPS) as GroupKey[]).map((key) => {
            const g = groupScore(key);
            const status = statusOf(g.score, g.max);
            return (
              <div key={key} className="flex flex-col items-center min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant text-center">{t.groups[key]}</span>
                <span className="font-title-md text-title-md font-bold text-primary mt-0.5 whitespace-nowrap">
                  <CountUp value={g.score} duration={1100} format={fmt} /> / {g.max}
                </span>
                <span className={`font-label-sm text-label-sm text-center ${status === "full" ? "text-primary-fixed" : "text-secondary"}`}>{t.status[status]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Method Capsule */}
      <Reveal variant="fade" className="w-full p-space-sm px-space-md rounded-full bg-surface-container-high/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-base">verified</span>
          <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface font-semibold truncate">{t.method}</span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{t.methodNote}</span>
      </Reveal>

      {/* 8 Kootas */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{t.kootasTitle}</h2>
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider shrink-0">{t.kootasCount}</span>
        </div>
        <Reveal stagger step={60} className="flex flex-col gap-2">
          {milan.kootas.map((k) => (
            <KootaRow key={k.key} koota={k} />
          ))}
        </Reveal>
      </div>

      {/* Dosha callouts */}
      <Reveal stagger step={90} className="w-full flex flex-col gap-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface px-1">{t.doshaTitle}</h2>
        {milan.nadiDosha.present && (
          <DoshaCard icon="vital_signs" tone="care" title={t.nadi.title} body={t.nadi.body} note={milan.nadiDosha.softened ? t.nadi.softened : undefined} remedy={t.nadi.remedy} />
        )}
        {milan.bhakootDosha.present && (
          <DoshaCard
            icon="savings"
            tone="care"
            title={t.bhakoot.title}
            body={t.bhakoot.body(`${milan.bhakootDosha.distance}/${14 - milan.bhakootDosha.distance}`)}
            note={milan.bhakootDosha.softened ? t.bhakoot.softened : undefined}
            remedy={t.bhakoot.remedy}
          />
        )}
        {!milan.nadiDosha.present && !milan.bhakootDosha.present && <DoshaCard icon="check_circle" tone="ok" title={`${t.kootas.nadi.name} • ${t.kootas.bhakoot.name}`} body={t.noDosha} />}
        <DoshaCard
          icon="shield"
          tone={match.manglik === "one" ? "care" : "ok"}
          title={t.manglik.title}
          body={[
            t.manglik.intro,
            match.manglik === "one" ? t.manglik.match.one(manglikOne) : t.manglik.match[match.manglik],
            anyLagnaUnknown ? t.manglik.lagnaUnknown : "",
          ]
            .filter(Boolean)
            .join(" ")}
          note={anySoftened ? t.manglik.softened : undefined}
          remedy={match.manglik === "one" ? t.manglik.remedy : undefined}
        >
          <div className="grid grid-cols-2 gap-2 pt-1">
            {manglikPeople.map((p, i) => (
              <div key={i} className="flex flex-col px-2.5 py-1.5 rounded-lg bg-surface-container min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{p.name}</span>
                <span className={`font-label-md text-label-md font-semibold ${p.manglik.level === "none" ? "text-primary" : "text-secondary"}`}>{t.manglik.level[p.manglik.level]}</span>
              </div>
            ))}
          </div>
        </DoshaCard>
      </Reveal>

      {/* AI note card */}
      <Reveal variant="scale" className="w-full rounded-xl bg-gradient-to-br from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-base animate-float">psychology</span>
            </div>
            <span className="font-title-md text-title-md text-on-surface font-semibold">{t.aiTitle}</span>
          </div>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary shrink-0">{t.aiBadge}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          {t.aiSummary({ p1: bride.name, p2: groom.name, total: fmt(milan.total), best: best.name, weak: weakest ? t.kootas[weakest.key].name : null })}
        </p>
        <Link to="/ask" className="group flex items-center gap-2 pt-1 text-primary font-label-md text-label-md font-semibold">
          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
          <span>{t.aiCta}</span>
          <span className="material-symbols-outlined text-sm ml-auto transition-transform duration-300 ease-out-expo group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </Reveal>

      {/* Actions */}
      <Reveal stagger className="flex flex-col gap-3 pt-2 mb-2">
        <Link
          to="/remedies"
          className="sheen w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold flex items-center justify-between gap-2 shadow-lg active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">support_agent</span>
            <span>{t.panditCta}</span>
          </span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 px-4 rounded-xl bg-surface-container-high/90 text-on-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow hover:bg-surface-bright transition-colors active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-primary text-xl">diversity_1</span>
          <span>{t.another}</span>
        </button>
        <p className="font-label-sm text-label-sm text-center text-on-surface-variant pb-1">{t.footer}</p>
      </Reveal>
    </>
  );
}

// ------------------------------------------------------------------ page

export default function MilanPage() {
  const t = useT(milanText);
  const { lang } = useLanguage();
  const { profile } = useBirthProfile();
  const niceDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });

  const [me, setMe] = useState<Draft>(emptyDraft("female"));
  const [editMe, setEditMe] = useState(false);
  const [partner, setPartner] = useState<Draft>(() => readPartner() ?? emptyDraft("male"));
  const [error, setError] = useState<string>();
  const [match, setMatch] = useState<MatchView | null>(null);

  // Prefill "You" from the saved birth profile once it is available
  useEffect(() => {
    if (!profile) return;
    const gender: Gender = profile.gender === "male" ? "male" : "female";
    const b = profile.birth;
    setMe({
      name: profile.name,
      gender,
      date: b.date,
      time: b.time ?? "",
      timeUnknown: b.time_unknown,
      place: { label: b.place, latitude: b.latitude, longitude: b.longitude, timezone: b.timezone },
    });
    if (!readPartner()) setPartner((p) => (p.name || p.date ? p : emptyDraft(gender === "male" ? "female" : "male")));
  }, [profile]);

  function validate(draft: Draft, who: string): string | undefined {
    if (!draft.name.trim()) return t.needName(who);
    if (!draft.date) return t.needDate(who);
    if (!draft.timeUnknown && !/^\d{2}:\d{2}$/.test(draft.time)) return t.needTime(who);
    if (!draft.place) return t.needPlace(who);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const problem = validate(me, t.person1) ?? validate(partner, t.person2);
    if (problem) {
      if (validate(me, t.person1)) setEditMe(true);
      return setError(problem);
    }
    setError(undefined);
    writePartner(partner);
    setMatch(matchOf(me, partner));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showMeSummary = Boolean(profile) && !editMe;

  return (
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24">
      <div className="flex flex-col w-full text-on-surface">
        <div className="relative w-full px-margin-mobile flex flex-col gap-space-md">
          {/* Title */}
          <div className="animate-rise flex flex-col items-center text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary mb-1">
              <span className="material-symbols-outlined text-sm text-primary">diversity_1</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">{t.eyebrow}</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight flex items-center justify-center gap-2">
              {t.title}
              <span className="material-symbols-outlined text-primary text-xl animate-twinkle">auto_awesome</span>
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-0.5">{t.subtitle}</p>
          </div>

          {match ? (
            <Results
              match={match}
              onEdit={() => setMatch(null)}
              onReset={() => {
                setPartner(emptyDraft(me.gender === "male" ? "female" : "male"));
                setMatch(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ) : (
            <form className="flex flex-col gap-space-md" onSubmit={submit} noValidate>
              {showMeSummary ? (
                <div className="animate-rise rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-xl">{me.gender}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">{t.person1}</span>
                    <p className="font-title-md text-title-md text-on-surface truncate font-semibold">{me.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {[niceDate(me.date), me.timeUnknown ? null : me.time, me.place?.label].filter(Boolean).join(" • ")}
                    </p>
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {t.fromProfile}
                    </span>
                  </div>
                  <button type="button" onClick={() => setEditMe(true)} className="tap-scale shrink-0 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    {t.change}
                  </button>
                </div>
              ) : (
                <>
                  <PersonForm id="me" title={t.person1} icon="person" draft={me} onChange={setMe} />
                  {!profile && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant px-1 -mt-1">
                      {t.noProfile}{" "}
                      <Link to="/birth-details" className="text-primary font-semibold">
                        {t.noProfileCta}
                      </Link>
                    </p>
                  )}
                </>
              )}

              <div className="flex items-center justify-center text-primary -my-1" aria-hidden>
                <span className="material-symbols-outlined text-2xl animate-glow">all_inclusive</span>
              </div>

              <PersonForm id="partner" title={t.person2} icon="favorite" draft={partner} onChange={setPartner} />

              {error && (
                <p className="animate-scale-in rounded-lg bg-error-container/20 p-2.5 font-body-sm text-body-sm text-error" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="sheen w-full py-4 px-space-md rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-2"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  diversity_1
                </span>
                <span>{t.check}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
