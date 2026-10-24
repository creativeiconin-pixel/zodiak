import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClockTimePicker } from "../components/time/ClockTimePicker";
import { ApiError, type Seeker } from "../lib/api";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { birthDetailsText } from "../i18n/pages/birthDetails";
import { computeChart } from "../lib/astro";
import { saveBirthProfile, useBirthProfile } from "../lib/birthProfile";
import { formatCoordinates, searchPlaces, type Place } from "../lib/geocode";
import { useSession } from "../lib/session";
import { Reveal } from "../components/motion/Reveal";
import { useHomeHref } from "../lib/useDesktopLanding";

const GENDERS: { value: NonNullable<Seeker["gender"]>; icon: string }[] = [
  { value: "female", icon: "female" },
  { value: "male", icon: "male" },
  { value: "other", icon: "all_inclusive" },
];

const segment = (active: boolean) =>
  active ? "bg-primary-container text-on-primary font-semibold shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface font-medium";

export default function BirthDetailsPage() {
  const homeHref = useHomeHref();
  const navigate = useNavigate();
  const { seeker, setSeeker } = useSession();
  const { profile } = useBirthProfile();
  const t = useT(birthDetailsText);
  const names = useT(common);

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Seeker["gender"]>("female");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); // 24-hour "HH:mm" from the clock picker
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [showPrashna, setShowPrashna] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [placeError, setPlaceError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  // Prefill from the saved profile (or the signed-in seeker's name) once it loads
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setGender(profile.gender);
      setDate(profile.birth.date);
      setTime(profile.birth.time ?? "");
      setTimeUnknown(profile.birth.time_unknown);
      setPlace({ label: profile.birth.place, latitude: profile.birth.latitude, longitude: profile.birth.longitude, timezone: profile.birth.timezone });
      setPlaceQuery(profile.birth.place);
    } else if (seeker && seeker.name !== "Seeker") {
      setName(seeker.name);
    }
  }, [profile, seeker]);

  // Debounced birthplace search
  useEffect(() => {
    if (place && placeQuery === place.label) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchPlaces(placeQuery, controller.signal)
        .then((results) => {
          setSuggestions(results);
          setPlaceError(undefined);
        })
        .catch((error: Error) => error.name !== "AbortError" && setPlaceError(error.message));
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [placeQuery, place]);

  const time24 = timeUnknown || !time ? null : time;

  // Live Moon nakshatra preview from whatever is entered so far
  const preview = useMemo(() => {
    if (!date || !place) return null;
    const chart = computeChart({ date, time: time24, timezone: place.timezone, latitude: place.latitude, longitude: place.longitude });
    const moon = chart.planets.Moon;
    return `${names.nakshatras[moon.nakshatra]} • ${names.signs[moon.sign]}`;
  }, [date, time24, place, names]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return setFormError(t.needName);
    if (!date) return setFormError(t.needDate);
    if (!timeUnknown && !time24) return setFormError(t.needTime);
    if (!place) return setFormError(t.needPlace);

    setFormError(undefined);
    setSaving(true);
    try {
      const updated = await saveBirthProfile(
        {
          name: name.trim(),
          gender,
          birth: { date, time: time24, time_unknown: timeUnknown, place: place.label, latitude: place.latitude, longitude: place.longitude, timezone: place.timezone },
        },
        Boolean(seeker),
      );
      if (updated) setSeeker(updated);
      // A guest's details are kept on this phone until they make a free account, which saves them for good
      navigate(seeker ? "/kundli" : "/login?mode=signup&next=/kundli");
    } catch (error) {
      setFormError(error instanceof ApiError && error.status !== 0 ? error.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col relative w-full">
      <form className="flex flex-col w-full px-margin-mobile pb-space-xl" onSubmit={submit} noValidate>
        {/* Subtle Celestial Astrolabe Header Motif */}
        <div className="relative w-full flex flex-col items-center pt-space-md pb-space-sm overflow-hidden">
          <Link to={homeHref} className="tap-scale absolute left-0 top-space-md w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" aria-label={t.backHome}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Link>
          {/* Ambient Gold/Violet Glow */}
          <div className="absolute -top-12 w-48 h-48 rounded-full bg-secondary-container/25 blur-3xl pointer-events-none animate-glow [animation-duration:5s]" />
          <div className="absolute top-2 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-glow" />
          {/* Stylized Astronomical Coordinate Ring */}
          <div className="relative w-16 h-16 mb-space-sm flex items-center justify-center animate-scale-in">
            <svg className="w-full h-full text-primary animate-spin-slow" fill="none" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" opacity="0.6" r="46" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.8" />
              <circle cx="50" cy="50" opacity="0.4" r="38" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" opacity="0.85" r="28" stroke="currentColor" strokeWidth="1.2" />
              <line opacity="0.5" stroke="currentColor" strokeWidth="0.6" x1="50" x2="50" y1="4" y2="96" />
              <line opacity="0.5" stroke="currentColor" strokeWidth="0.6" x1="4" x2="96" y1="50" y2="50" />
              <circle cx="50" cy="12" fill="currentColor" r="2" />
              <circle cx="50" cy="88" fill="currentColor" r="2" />
              <circle cx="12" cy="50" fill="currentColor" r="2" />
              <circle cx="88" cy="50" fill="currentColor" r="2" />
              <path d="M50 32 L53 47 L68 50 L53 53 L50 68 L47 53 L32 50 L47 47 Z" fill="currentColor" />
            </svg>
          </div>
          {/* Stepper & Badges */}
          <div className="animate-rise [animation-delay:80ms] inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-space-xs">
            <span className="material-symbols-outlined text-primary text-[14px] animate-twinkle" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">{t.step}</span>
          </div>
          <h1 className="animate-rise [animation-delay:150ms] font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center tracking-tight">{t.title}</h1>
          <p className="animate-rise [animation-delay:220ms] font-body-sm text-body-sm text-on-surface-variant text-center max-w-xs mt-1">{t.subtitle}</p>
        </div>
        {/* Informational Vedic Trust Banner */}
        <div className="animate-rise [animation-delay:300ms] w-full mt-space-sm p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md relative overflow-hidden flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-md text-label-md text-primary font-semibold">{t.trustTitle}</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              {t.trustBody}
            </p>
          </div>
        </div>
        {/* Form Fields Container */}
        <Reveal stagger delay={350} step={80} className="w-full mt-space-md flex flex-col gap-space-md">
          {/* Field 1: Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="fullName">
              <span>{t.fullName}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.required}</span>
            </label>
            <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">account_circle</span>
              <input className="w-full py-3.5 pl-11 pr-4 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none rounded-xl" id="fullName" placeholder={t.namePlaceholder} type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          {/* Field 2: Gender Selection */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="w-full font-label-md text-label-md text-on-surface flex items-center justify-between mb-1.5">
              <span>{t.gender}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t.genderHint}</span>
            </legend>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-surface-container-low">
              {GENDERS.map((option) => (
                <button key={option.value} className={`py-2.5 px-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${segment(gender === option.value)}`} type="button" aria-pressed={gender === option.value} onClick={() => setGender(option.value)}>
                  <span className="material-symbols-outlined text-[16px]">{option.icon}</span>
                  <span className="truncate">{t.genders[option.value]}</span>
                </button>
              ))}
            </div>
          </fieldset>
          {/* Field 3: Date of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="dobInput">{t.dob}</label>
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">calendar_today</span> {t.calendarNote}
              </span>
            </div>
            <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">event</span>
              <input className="w-full py-3.5 pl-11 pr-4 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl [color-scheme:dark]" id="dobInput" type="date" min="1900-01-02" max={new Date().toISOString().slice(0, 10)} required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            {/* Mini Solar Nakshatra Preview Micro-card */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container-high/40" aria-live="polite">
              <span className="font-body-sm text-body-sm text-on-surface-variant">{t.moonPreviewLabel}</span>
              <span key={preview ?? ""} className="animate-fade-in font-label-sm text-label-sm text-primary font-medium tracking-wide">{preview ?? t.moonPreviewEmpty}</span>
            </div>
          </div>
          {/* Field 4: Time of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="timeInput">{t.time}</label>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t.timeNote}</span>
            </div>
            <ClockTimePicker id="timeInput" value={time} onChange={setTime} disabled={timeUnknown} />
            {/* Time Unknown Checkbox with Prashna note */}
            <div className="mt-1 flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low/50 transition-colors">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" className="peer sr-only" checked={timeUnknown} onChange={(e) => { setTimeUnknown(e.target.checked); setShowPrashna(e.target.checked); }} />
                <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200 peer-focus-visible:ring-1 peer-focus-visible:ring-secondary ${timeUnknown ? "bg-primary-container" : "bg-surface-container-high"}`}>
                  {timeUnknown && <span className="material-symbols-outlined text-on-primary text-[16px] animate-pop-in">check</span>}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium select-none">{t.unknownTime}</span>
              </label>
              <button className="text-secondary hover:text-primary transition-colors flex items-center mt-0.5" title={t.unknownHelp} aria-label={t.unknownHelp} aria-expanded={showPrashna} type="button" onClick={() => setShowPrashna(!showPrashna)}>
                <span className="material-symbols-outlined text-[15px]">help</span>
              </button>
            </div>
            {showPrashna && (
              <p className="animate-rise font-body-sm text-body-sm text-on-surface-variant leading-snug p-2.5 rounded-lg bg-surface-container-high/80">
                <strong className="text-secondary font-semibold">{t.unknownNoteTitle}</strong> {t.unknownNote}
              </p>
            )}
          </div>
          {/* Field 5: Place of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="placeInput">{t.place}</label>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t.placeNote}</span>
            </div>
            <div className="relative">
              <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary transition-all">
                <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">location_on</span>
                <input
                  className="w-full py-3.5 pl-11 pr-10 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl placeholder:text-outline"
                  id="placeInput" placeholder={t.placePlaceholder} type="text" autoComplete="off" role="combobox" aria-expanded={suggestions.length > 0} aria-controls="place-suggestions"
                  value={placeQuery}
                  onChange={(e) => { setPlaceQuery(e.target.value); setPlace(null); }}
                />
                <span className="material-symbols-outlined absolute right-3 text-secondary text-[18px]">gps_fixed</span>
              </div>
              {suggestions.length > 0 && !place && (
                <ul id="place-suggestions" role="listbox" className="animate-scale-in origin-top absolute z-20 mt-1 w-full rounded-xl bg-surface-container-high shadow-xl overflow-hidden">
                  {suggestions.map((s) => (
                    <li key={`${s.latitude},${s.longitude}`} role="option" aria-selected={false}>
                      <button type="button" className="w-full text-left px-4 py-2.5 font-body-md text-body-md text-on-surface hover:bg-surface-container-highest flex items-center gap-2" onClick={() => { setPlace(s); setPlaceQuery(s.label); setSuggestions([]); }}>
                        <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Coordinates pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/40">
              <span className="material-symbols-outlined text-outline text-[14px]">explore</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                {place ? formatCoordinates(place.latitude, place.longitude) : placeError ?? t.pickPlace}
              </span>
              {place && (
                <span className="animate-pop-in ml-auto font-label-sm text-label-sm text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" /> {t.placeFound}
                </span>
              )}
            </div>
          </div>
        </Reveal>
        {/* Astrological Chart Preview Card */}
        <Reveal variant="scale" className="w-full mt-space-md p-space-md rounded-xl bg-gradient-to-br from-surface-container to-surface-container-low flex items-center gap-space-md shadow-lg">
          <div className="relative w-14 h-14 rounded-lg bg-surface-container-lowest shrink-0 flex items-center justify-center p-1">
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 40 40" aria-hidden>
              <rect height="36" opacity="0.6" stroke="currentColor" strokeWidth="0.8" width="36" x="2" y="2" />
              <line opacity="0.4" stroke="currentColor" strokeWidth="0.8" x1="2" x2="38" y1="2" y2="38" />
              <line opacity="0.4" stroke="currentColor" strokeWidth="0.8" x1="38" x2="2" y1="2" y2="38" />
              <polygon opacity="0.9" points="20,2 38,20 20,38 2,20" stroke="currentColor" strokeWidth="0.8" pathLength={1} className="draw-stroke [--draw-delay:300ms]" />
              <circle cx="20" cy="20" fill="currentColor" r="2.5" className="animate-twinkle" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">{t.chartCardLabel}</span>
            <p className="font-title-md text-title-md text-on-surface truncate mt-0.5">{t.chartCardTitle}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{t.chartCardBody}</p>
          </div>
        </Reveal>
        {/* Bottom CTA */}
        <div className="w-full mt-space-lg flex flex-col gap-space-sm">
          {formError && <p className="animate-scale-in rounded-lg bg-error-container/20 p-2.5 font-body-sm text-body-sm text-error" role="alert">{formError}</p>}
          <button className="sheen relative w-full py-4 px-space-md rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden disabled:opacity-70" type="submit" disabled={saving}>
            <span className={`material-symbols-outlined text-[20px] ${saving ? "animate-spin" : ""}`} style={{ fontVariationSettings: "'FILL' 1" }}>{saving ? "progress_activity" : "stars"}</span>
            <span>{saving ? t.saving : t.submit}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div className="flex items-center justify-center gap-2 pt-2 text-center">
            <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
            <p className="font-body-sm text-body-sm text-outline">
              {seeker ? t.savedAccount : t.savedDevice}
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
