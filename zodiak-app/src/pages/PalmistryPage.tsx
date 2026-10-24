import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { NoCreditsCard } from "../components/credits/NoCreditsCard";
import { Reveal } from "../components/motion/Reveal";
import { useLanguage, useT, type Lang } from "../i18n";
import { common } from "../i18n/common";
import { creditsText } from "../i18n/pages/credits";
import { palmistryText } from "../i18n/pages/palmistry";
import { summarize } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";
import { ApiError, PhotoDecodeError, palmApi, shrinkPhoto, type Hand, type PalmLineKey, type PalmMountKey, type PalmReading, type PalmResult, type PalmRetake } from "../lib/palmApi";
import { useCreditCosts } from "../lib/credits";
import { useSession } from "../lib/session";

const SAMPLE_PHOTO = "/images/palm-scan.jpg";

const LINE_ORDER: PalmLineKey[] = ["life", "head", "heart", "fate"];

const LINE_STYLE: Record<PalmLineKey, { dot: string; text: string; icon: string }> = {
  life: { dot: "bg-primary", text: "text-primary", icon: "bolt" },
  head: { dot: "bg-tertiary", text: "text-tertiary", icon: "psychology" },
  heart: { dot: "bg-secondary-fixed", text: "text-secondary", icon: "favorite" },
  fate: { dot: "bg-primary-fixed", text: "text-primary", icon: "route" },
};

const MOUNT_GLYPH: Record<PalmMountKey, string> = { jupiter: "♃", saturn: "♄", sun: "☉", mercury: "☿", venus: "♀", moon: "☽", mars: "♂" };

const DATE_LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };

type Phase = "idle" | "scanning" | "done";

const isReading = (result: PalmResult | null): result is PalmReading => result?.status === "reading";

/** The HUD palm viewfinder from the Stitch design, now showing the seeker's own photo. */
function Scanner({ photo, phase, result, hand }: { photo: string | null; phase: Phase; result: PalmResult | null; hand: Hand }) {
  const t = useT(palmistryText);
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [photo]);

  const reading = isReading(result) ? result : null;
  const traced = (line: PalmLineKey) => (reading ? reading.lines[line].present : phase !== "scanning" && !photo);
  const status = phase === "scanning" ? t.hudScanning : result?.status === "retake" ? t.hudRetake : reading ? t.hudDone : t.hudReady;
  const src = photo && !broken ? photo : SAMPLE_PHOTO;
  // A left palm photographed face-on is the mirror image of a right palm, so flip the line overlay to match.
  const mirror = hand === "left" ? "scale(-1,1) translate(-360,0)" : undefined;

  return (
    <div className="animate-scale-in [animation-delay:120ms] relative w-full rounded-xl overflow-hidden bg-surface-container-high/60 backdrop-blur-2xl shadow-xl flex flex-col">
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
        <span className="material-symbols-outlined text-primary text-xs">filter_center_focus</span>
        <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">{t.hudLabel}</span>
      </div>
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md" role="status">
        <span className={`w-1.5 h-1.5 rounded-full ${result?.status === "retake" ? "bg-error" : "bg-primary"} ${phase === "scanning" ? "animate-ping" : ""}`} />
        <span key={status} className="animate-fade-in font-label-sm text-label-sm text-on-surface font-medium">{status}</span>
      </div>

      <div className="relative w-full h-[370px] flex items-center justify-center overflow-hidden bg-surface-container-lowest">
        <img
          className={`w-full h-full object-cover object-center transition-all duration-700 ${phase === "scanning" ? "scale-110 brightness-90" : "scale-105"}`}
          alt={photo ? t.hands[hand] : t.sample}
          src={src}
          onError={() => setBroken(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/50 via-transparent to-surface-container-lowest/50 pointer-events-none" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none" viewBox="0 0 360 370" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="180" cy="185" r="140" stroke="#f2ca50" strokeDasharray="4 6" strokeOpacity="0.18" className={phase === "scanning" ? "animate-spin [animation-duration:12s]" : ""} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <circle cx="180" cy="185" r="90" stroke="#d0bcff" strokeOpacity="0.15" />
          <circle cx="180" cy="185" r="30" stroke="#f2ca50" strokeOpacity="0.25" />
          {!photo || reading ? (
            <g transform={mirror} className="transition-opacity duration-700">
              {traced("heart") && <path className="palm-trace drop-shadow-[0_0_8px_rgba(242,202,80,0.8)]" d="M 85 145 C 130 135, 205 130, 260 170" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2.5" />}
              {traced("head") && <path className="palm-trace drop-shadow-[0_0_6px_rgba(208,188,255,0.8)]" style={{ animationDelay: "250ms" }} d="M 95 190 C 150 180, 225 188, 280 230" stroke="#d0bcff" strokeLinecap="round" strokeWidth="2" />}
              {traced("life") && <path className="palm-trace drop-shadow-[0_0_8px_rgba(242,202,80,0.8)]" style={{ animationDelay: "500ms" }} d="M 98 190 C 130 220, 150 270, 160 330" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2.5" />}
              {traced("fate") && <path className="animate-fade-in [animation-duration:900ms] [animation-delay:800ms] drop-shadow-[0_0_7px_rgba(233,195,73,0.9)]" d="M 180 340 C 182 280, 185 200, 180 150" stroke="#e9c349" strokeDasharray="4 4" strokeLinecap="round" strokeWidth="2" />}
            </g>
          ) : null}
          <path d="M 20 40 L 20 20 L 40 20" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" pathLength={1} className="draw-stroke [--draw-delay:300ms]" />
          <path d="M 340 40 L 340 20 L 320 20" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" pathLength={1} className="draw-stroke [--draw-delay:380ms]" />
          <path d="M 20 330 L 20 350 L 40 350" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" pathLength={1} className="draw-stroke [--draw-delay:460ms]" />
          <path d="M 340 330 L 340 350 L 320 350" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" pathLength={1} className="draw-stroke [--draw-delay:540ms]" />
        </svg>

        {phase === "scanning" && (
          <>
            <div className="palm-scan-bar absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 z-20 pointer-events-none shadow-[0_0_12px_#f2ca50]" />
            <div className="absolute inset-0 z-10 bg-primary/5 pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}

function ScanProgress() {
  const t = useT(palmistryText);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setStep((s) => Math.min(s + 1, t.scanSteps.length - 1)), 4000);
    return () => window.clearInterval(timer);
  }, [t.scanSteps.length]);

  return (
    <div className="animate-rise flex flex-col gap-space-sm rounded-xl bg-surface-container p-space-md" role="status" aria-live="polite">
      <div className="flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
        <span className="font-title-md text-title-md text-on-surface">{t.scanning}</span>
      </div>
      <ol className="flex flex-col gap-1.5">
        {t.scanSteps.map((label, index) => (
          <li key={label} className={`flex items-center gap-2 font-body-sm text-body-sm transition-colors duration-500 ${index <= step ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            <span key={index < step ? "done" : "todo"} className={`material-symbols-outlined text-sm ${index < step ? "text-primary animate-pop-in" : index === step ? "text-primary animate-pulse" : ""}`}>
              {index < step ? "check_circle" : "radio_button_unchecked"}
            </span>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function RetakeCard({ retake }: { retake: PalmRetake }) {
  const t = useT(palmistryText);
  return (
    <div className="animate-scale-in flex flex-col gap-space-xs rounded-xl bg-error-container/20 p-space-md" role="alert">
      <div className="flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-error">photo_camera</span>
        <h2 className="font-title-md text-title-md text-on-surface font-semibold">{t.retakeTitle}</h2>
      </div>
      <p className="font-body-md text-body-md text-on-surface">{t.retakeReasons[retake.retake_reason]}</p>
      {retake.retake_tip && <p className="font-body-md text-body-md text-on-surface-variant">{retake.retake_tip}</p>}
    </div>
  );
}

function ReadingView({ reading }: { reading: PalmReading }) {
  const t = useT(palmistryText);
  return (
    <div className="flex flex-col gap-space-lg">
      {/* Summary */}
      <section className="animate-rise p-space-md rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container-high/60 to-surface-container flex flex-col gap-space-xs shadow-lg">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary animate-twinkle" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h2 className="font-title-md text-title-md text-on-surface font-bold">{t.summaryTitle}</h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">{reading.summary}</p>
        <div className="flex items-start gap-1.5 pt-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-primary">visibility</span>
          <span className="font-label-sm text-label-sm">
            {t.confidenceTitle} {t.confidence[reading.confidence]}
          </span>
        </div>
      </section>

      {/* Lines */}
      <Reveal as="section" stagger step={90} className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.linesTitle}</h2>
          <span className="material-symbols-outlined text-primary text-sm">timeline</span>
        </div>
        {LINE_ORDER.map((key) => {
          const line = reading.lines[key];
          const style = LINE_STYLE[key];
          return (
            <article key={key} className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-xs">
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${style.dot} ${line.present ? "animate-twinkle [animation-duration:3s]" : "opacity-40"}`} />
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">{t.lines[key].name}</h3>
                    <p className={`font-body-sm text-body-sm leading-snug ${style.text}`}>{t.lines[key].hint}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full bg-surface-container-highest font-label-sm text-label-sm ${line.present ? style.text : "text-on-surface-variant"}`}>
                  {line.present ? t.lineSeen : t.lineFaint}
                </span>
              </div>
              {line.look && <p className="font-body-sm text-body-sm text-on-surface-variant italic">{line.look}</p>}
              {line.meaning && (
                <div className={`flex items-start gap-space-xs pt-space-xs ${style.text}`}>
                  <span className="material-symbols-outlined text-sm mt-0.5">{style.icon}</span>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">{line.meaning}</p>
                </div>
              )}
            </article>
          );
        })}
      </Reveal>

      {/* Mounts */}
      {reading.mounts.length > 0 && (
        <Reveal as="section" className="flex flex-col gap-space-xs">
          <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.mountsTitle}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.mountsHint}</p>
          <Reveal stagger step={70} className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-space-sm pt-1">
            {reading.mounts.map((mount) => (
              <article key={mount.mount} className="hover-lift p-space-md rounded-xl bg-surface-container-high/80 backdrop-blur-xl flex flex-col gap-1.5 shadow-md">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs text-secondary-fixed">{MOUNT_GLYPH[mount.mount]}</span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold leading-tight">{t.mounts[mount.mount].name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">{t.strength[mount.strength]}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{t.mounts[mount.mount].where}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">{mount.meaning}</p>
              </article>
            ))}
          </Reveal>
        </Reveal>
      )}

      {/* Practical tip */}
      {reading.tip && (
        <Reveal as="section" variant="scale" className="p-space-md rounded-xl bg-surface-container-high/90 backdrop-blur-xl flex items-start gap-space-md shadow-xl">
          <div className="w-11 h-11 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl animate-glow" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-title-md text-title-md text-on-surface font-bold">{t.tipTitle}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-snug">{reading.tip}</p>
          </div>
        </Reveal>
      )}

      <p className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-sm text-primary">info</span>
        {t.note}
      </p>
    </div>
  );
}

function ErrorNotice({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const t = useT(palmistryText);
  const c = useT(common);
  const status = error instanceof ApiError ? error.status : -1;
  if (error instanceof ApiError && error.noCredits) return <NoCreditsCard message={error.message} />;
  const title = status === 503 ? t.notReadyTitle : null;
  const message =
    error instanceof PhotoDecodeError
      ? t.photoError
      : status === 0
        ? c.serverDown
        : status === 429
          ? t.busy
          : status === 422 && error instanceof ApiError
            ? (error.field("image") ?? error.field("hand") ?? error.message)
            : error.message;

  return (
    <div className="animate-scale-in flex flex-col items-center gap-space-sm rounded-xl bg-error-container/20 p-space-lg text-center" role="alert">
      <span className="material-symbols-outlined text-error text-3xl">{status === 0 ? "cloud_off" : status === 503 ? "bedtime" : "error"}</span>
      {title && <p className="font-title-md text-title-md text-on-surface font-semibold">{title}</p>}
      <p className="font-body-md text-body-md text-on-surface">{message}</p>
      {status !== 422 && !(error instanceof PhotoDecodeError) && (
        <button type="button" onClick={onRetry} className="tap-scale px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
          {t.tryAgain}
        </button>
      )}
    </div>
  );
}

export default function PalmistryPage() {
  const t = useT(palmistryText);
  const { lang } = useLanguage();
  const { seeker, loading: sessionLoading, setCredits } = useSession();
  const credits = useT(creditsText);
  const costs = useCreditCosts();
  const { chart } = useBirthProfile();

  const [hand, setHand] = useState<Hand>("right");
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<PalmResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<PalmReading[]>([]);
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const chartSummary = useMemo(() => {
    if (!chart) return null;
    const s = summarize(chart);
    return `Lagna ${s.lagna}, Moon sign ${s.moon_sign}, Sun sign ${s.sun_sign}, Moon nakshatra ${s.nakshatra}, current period ${s.mahadasha}-${s.antardasha}.`;
  }, [chart]);

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url);
  }, [photo]);

  useEffect(() => {
    if (!seeker) return;
    palmApi.history().then(setHistory).catch(() => setHistory([]));
  }, [seeker]);

  async function upload(blob: Blob) {
    setPhase("scanning");
    setResult(null);
    setError(null);
    try {
      const { result: next, credits: balance } = await palmApi.read(blob, hand, chartSummary);
      if (balance !== undefined) setCredits(balance);
      setResult(next);
      if (isReading(next)) setHistory((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 5));
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error(String(caught)));
    } finally {
      setPhase("done");
    }
  }

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const blob = await shrinkPhoto(file);
      setPhoto({ blob, url: URL.createObjectURL(blob) });
      await upload(blob);
    } catch (caught) {
      setPhase("done");
      setError(caught instanceof Error ? caught : new Error(String(caught)));
    }
  }

  function startOver() {
    setPhoto(null);
    setResult(null);
    setError(null);
    setPhase("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const scanning = phase === "scanning";
  const reading = isReading(result) ? result : null;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(DATE_LOCALE[lang], { day: "numeric", month: "short", year: "numeric" });

  const photoButtons = (
    <div className="grid grid-cols-2 gap-space-sm">
      <button
        type="button"
        disabled={scanning}
        onClick={() => cameraInput.current?.click()}
        className="sheen py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-space-xs shadow-[0_8px_24px_-4px_rgba(242,202,80,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-xl">photo_camera</span>
        {t.takePhoto}
      </button>
      <button
        type="button"
        disabled={scanning}
        onClick={() => galleryInput.current?.click()}
        className="py-3.5 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-title-md font-semibold flex items-center justify-center gap-space-xs shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-xl">photo_library</span>
        {t.choosePhoto}
      </button>
      {seeker && costs && costs.palm_reading > 0 && (
        <Link to="/credits" className="col-span-2 -mt-1 flex items-center justify-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
          {credits.palmUses(costs.palm_reading)} • {credits.balanceLabel}: <b className={seeker.credits < costs.palm_reading ? "text-error" : "text-primary"}>{seeker.credits}</b>
        </Link>
      )}
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
      <input ref={galleryInput} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </div>
  );

  return (
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24">
      <style>{`
        @keyframes palm-scan { 0% { top: 4%; } 50% { top: 94%; } 100% { top: 4%; } }
        .palm-scan-bar { animation: palm-scan 2.6s ease-in-out infinite; }
        @keyframes palm-trace { from { stroke-dashoffset: 360; } to { stroke-dashoffset: 0; } }
        .palm-trace { stroke-dasharray: 360; animation: palm-trace 1.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .palm-scan-bar, .palm-trace { animation: none; } }
      `}</style>
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl gap-space-lg">
        {/* Header */}
        <div className="animate-rise flex flex-col gap-space-xs mt-space-sm">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-secondary-container/40 self-start backdrop-blur-md">
            <span className="material-symbols-outlined text-primary text-sm animate-spin" style={{ animationDuration: "9s" }}>neurology</span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">{t.eyebrow}</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">{t.title}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.intro}</p>
        </div>

        <Scanner photo={photo?.url ?? null} phase={phase} result={result} hand={hand} />

        {!sessionLoading && !seeker ? (
          <div className="animate-rise flex flex-col items-center gap-space-sm rounded-xl bg-surface-container p-space-lg text-center shadow-md">
            <span className="material-symbols-outlined text-primary text-3xl animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>back_hand</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">{t.guestTitle}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{t.guestBody}</p>
            <Link to="/login?next=/palmistry" className="sheen tap-scale w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md text-center font-bold">
              {t.signIn}
            </Link>
          </div>
        ) : (
          <>
            {/* Hand choice and photo buttons */}
            {!reading && !scanning && (
              <section className="animate-rise [animation-delay:200ms] flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.handLabel}</span>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-surface-container" role="radiogroup" aria-label={t.handLabel}>
                    {(["left", "right"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={hand === option}
                        onClick={() => setHand(option)}
                        className={`tap-scale py-2 rounded-full font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${hand === option ? "bg-primary text-on-primary font-bold shadow" : "text-on-surface-variant"}`}
                      >
                        <span className="material-symbols-outlined text-base" style={option === "left" ? { transform: "scaleX(-1)" } : undefined}>back_hand</span>
                        {t.hands[option]}
                      </button>
                    ))}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{t.handHint}</span>
                </div>
                {photoButtons}
                <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm text-center">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  <span>{t.privacy}</span>
                </div>
              </section>
            )}

            {scanning && <ScanProgress />}
            {error && !scanning && <ErrorNotice error={error} onRetry={() => (photo ? void upload(photo.blob) : startOver())} />}

            <div ref={resultsRef} className="scroll-mt-20 flex flex-col gap-space-lg">
              {result?.status === "retake" && <RetakeCard retake={result} />}
              {reading && (
                <>
                  <ReadingView reading={reading} />
                  <button
                    type="button"
                    onClick={startOver}
                    className="group w-full py-3.5 rounded-xl bg-surface-container-high text-primary font-title-md text-title-md font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-xl transition-transform duration-500 ease-out-expo group-hover:-rotate-180">refresh</span>
                    {t.readAgain}
                  </button>
                </>
              )}
            </div>

            {/* Past readings */}
            {history.length > 0 && !scanning && (
              <Reveal as="section" className="flex flex-col gap-space-xs">
                <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.historyTitle}</h2>
                <ul className="flex flex-col gap-1.5" data-stagger="in" style={{ "--reveal-delay": "150ms", "--stagger-step": "60ms" } as React.CSSProperties}>
                  {history.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setError(null);
                          setHand(item.hand);
                          setResult(item);
                          setPhase("done");
                          window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                        }}
                        className={`tap-scale w-full flex items-center justify-between gap-space-sm px-space-md py-2.5 rounded-xl text-left transition-all ${reading?.id === item.id ? "bg-secondary-container/50" : "bg-surface-container"}`}
                      >
                        <span className="flex items-center gap-space-xs min-w-0">
                          <span className="material-symbols-outlined text-primary text-base" style={item.hand === "left" ? { transform: "scaleX(-1)" } : undefined}>back_hand</span>
                          <span className="font-body-sm text-body-sm text-on-surface truncate">{t.historyItem(t.hands[item.hand], formatDate(item.created_at))}</span>
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant text-base">chevron_right</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </>
        )}

        {/* Photo tips */}
        {!reading && (
          <Reveal as="section" className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary animate-twinkle">tips_and_updates</span>
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">{t.tipsTitle}</h2>
            </div>
            <Reveal as="ul" stagger step={80} className="flex flex-col gap-1.5">
              {t.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-space-xs font-body-md text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm mt-1">check</span>
                  {tip}
                </li>
              ))}
            </Reveal>
          </Reveal>
        )}
      </div>
    </main>
  );
}
