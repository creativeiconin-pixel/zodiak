import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PanditAvatar } from "../components/chat/PanditAvatar";
import { AudioNote, SpokenNote } from "../components/chat/VoiceNote";
import { CreditChip } from "../components/credits/CreditChip";
import { NoCreditsCard } from "../components/credits/NoCreditsCard";
import { LanguagePicker } from "../components/LanguagePicker";
import { PulseRing } from "../components/motion/PulseRing";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useLanguage, useT, type Lang } from "../i18n";
import { common } from "../i18n/common";
import { askText } from "../i18n/pages/ask";
import { creditsText } from "../i18n/pages/credits";
import { api, ApiError, inr, type ChatAnswer, type ChatEntry } from "../lib/api";
import { activePeriod, chartPayload } from "../lib/astro";
import { useBirthProfile } from "../lib/birthProfile";
import { useCreditCosts } from "../lib/credits";
import { useSession } from "../lib/session";
import { useAsync } from "../lib/useAsync";
import { unlockAudio } from "../lib/audioPlayer";
import { canRecord, canTranscribe, formatDuration, useVoiceRecorder } from "../lib/voice";
import { useHomeHref } from "../lib/useDesktopLanding";

const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };
const VOICE_PREF_KEY = "zodiak.voiceReplies";

type LocalEntry = ChatEntry & { localAudioUrl?: string; answeredVoice?: boolean };

function readVoicePref(): boolean {
  try {
    return localStorage.getItem(VOICE_PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Text to speak for an AI answer: the answer and the practical step. */
const spokenText = (answer: ChatAnswer) => [answer.short_answer, answer.practical_step].filter(Boolean).join(" ");

function AnswerContent({ answer }: { answer: ChatAnswer }) {
  const t = useT(askText);
  if (answer.kind === "care") {
    return (
      <div className="space-y-2" role="alert">
        <span className="font-title-md text-title-md text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> {t.careTitle}
        </span>
        <p className="font-body-md text-body-md leading-relaxed">{answer.short_answer}</p>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{answer.practical_step}</p>
        <a href="tel:14416" className="tap-scale w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-base">call</span> {t.callHelpline}
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      <p className="font-body-md text-body-md leading-relaxed">{answer.short_answer}</p>
      {answer.chart_points.length > 0 && (
        <div className="space-y-1.5" data-stagger="in" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{t.whatChartShows}</span>
          {answer.chart_points.map((point) => (
            <div key={point.placement} className="rounded-lg bg-surface-container-lowest/60 p-2">
              <span className="font-label-md text-label-md text-primary font-semibold">{point.placement}</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{point.meaning}</p>
            </div>
          ))}
        </div>
      )}
      {answer.practical_step && (
        <div className="rounded-lg bg-secondary-container/25 p-2">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{t.practicalStep}</span>
          <p className="font-body-md text-body-md mt-0.5">{answer.practical_step}</p>
        </div>
      )}
      {answer.kind === "reading" && (
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          {t.confidence}: <span className="text-primary">{t.confidenceLevels[answer.confidence]}</span>
        </p>
      )}
    </div>
  );
}

function RemedyCard({ entry }: { entry: ChatEntry }) {
  const t = useT(askText);
  const remedy = entry.remedy!;
  return (
    <Link to={`/checkout/${remedy.slug}`} className="group tap-scale animate-rise [animation-delay:350ms] mt-2 flex items-center gap-3 rounded-lg bg-surface-container-lowest/70 p-2 hover:bg-surface-container-lowest transition-colors">
      <img className="w-14 h-14 rounded-md object-cover" alt={remedy.image_alt} src={remedy.image} />
      <div className="flex-1 min-w-0">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-primary">flare</span> {t.remedyTitle}
        </span>
        <p className="font-title-md text-body-md text-on-surface font-semibold truncate">{remedy.name}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{inr(remedy.price)} • {t.panditChecked}</p>
      </div>
      <span className="material-symbols-outlined text-primary transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">chevron_right</span>
    </Link>
  );
}

/** What the Pandit team's check means for this answer: a held or removed product, or a sent report. */
function ReviewNotice({ entry }: { entry: ChatEntry }) {
  const t = useT(askText);
  const review = entry.review;
  if (!review) return null;
  const message = review.remedy_on_hold ? t.remedyOnHold : review.status === "removed" ? t.remedyRemoved : review.status === "pending" && review.reported ? t.reportSent : null;
  if (!message && !review.note) return null;
  return (
    <div className="mt-2 rounded-lg bg-surface-container-lowest/70 p-2 space-y-1 animate-rise" role="status">
      {message && (
        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-start gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">{review.status === "removed" ? "do_not_disturb_on" : "hourglass_top"}</span>
          {message}
        </p>
      )}
      {review.note && (
        <p className="font-body-sm text-body-sm text-on-surface">
          <span className="font-semibold">{t.panditNote}:</span> {review.note}
        </p>
      )}
    </div>
  );
}

/** Lets the seeker send an answer to the Pandit team, with an optional reason. */
function ReportAnswer({ entry, onReported }: { entry: ChatEntry; onReported: (entry: ChatEntry) => void }) {
  const t = useT(askText);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (entry.review?.status === "pending" && entry.review.reported) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setFailed(false);
    try {
      onReported(await api.reportAnswer(entry.id, reason.trim()));
      setOpen(false);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="tap-scale mt-1 px-1 font-label-sm text-label-sm text-on-surface-variant hover:text-error flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">flag</span> {t.report}
      </button>
    );
  }
  return (
    <form onSubmit={(event) => void submit(event)} className="mt-2 space-y-1.5 animate-rise">
      <label className="block font-label-md text-label-md text-on-surface" htmlFor={`report-${entry.id}`}>{t.reportTitle}</label>
      <textarea
        id={`report-${entry.id}`}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={500}
        rows={2}
        placeholder={t.reportPlaceholder}
        className="w-full rounded-lg bg-surface-container-lowest p-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {failed && <p className="font-body-sm text-body-sm text-error" role="alert">{t.reportFailed}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="tap-scale px-3 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant">{t.reportCancel}</button>
        <button type="submit" disabled={sending} className="tap-scale px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60">{t.reportSend}</button>
      </div>
    </form>
  );
}

function Bubble({ outgoing, time, children }: { outgoing: boolean; time: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-end gap-1.5 ${outgoing ? "justify-end" : "justify-start"}`}>
      {!outgoing && <PanditAvatar className="w-8 h-8 mb-0.5 shadow-md animate-pop-in" />}
      <div
        className={`relative max-w-[85%] px-2.5 pt-2 pb-1.5 shadow-md text-on-surface animate-pop-in ${
          outgoing ? "bg-secondary-container/70 rounded-2xl rounded-tr-sm origin-top-right" : "bg-surface-container-high rounded-2xl rounded-tl-sm origin-top-left"
        }`}
      >
        {children}
        <div className="flex items-center justify-end gap-1 mt-0.5 font-label-sm text-label-sm text-on-surface-variant/80">
          <span>{time}</span>
          {outgoing && <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>}
        </div>
      </div>
    </div>
  );
}

export default function AskPage() {
  const homeHref = useHomeHref();
  const t = useT(askText);
  const names = useT(common);
  const { lang } = useLanguage();
  const { seeker, loading: sessionLoading, setCredits } = useSession();
  const c = useT(creditsText);
  const costs = useCreditCosts();
  const { data: appConfig } = useAsync(api.appConfig);
  const serverTranscribes = appConfig?.voice_transcription ?? false;
  const [noCredits, setNoCredits] = useState<{ cost: number }>();
  const { profile, chart } = useBirthProfile();
  const [entries, setEntries] = useState<LocalEntry[]>([]);
  const [historyError, setHistoryError] = useState<Error>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string>();
  const [voiceReplies, setVoiceReplies] = useState(readVoicePref);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [autoPlayId, setAutoPlayId] = useState<number>();
  const recorder = useVoiceRecorder(lang, !serverTranscribes);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!seeker) return;
    setHistoryLoading(true);
    api.askHistory()
      .then((list) => setEntries(list.map((entry, i) => ({ ...entry, answeredVoice: entry.role === "assistant" && Boolean(list[i - 1]?.audio) }))))
      .catch(setHistoryError)
      .finally(() => setHistoryLoading(false));
  }, [seeker]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, sending]);

  useEffect(() => {
    if (recorder.error) setNotice(recorder.error === "denied" ? t.micDenied : t.recordUnsupported);
  }, [recorder.error, t]);

  function toggleVoiceReplies() {
    const next = !voiceReplies;
    setVoiceReplies(next);
    try {
      localStorage.setItem(VOICE_PREF_KEY, next ? "on" : "off");
    } catch {
      // preference simply won't persist
    }
  }

  async function send(question: string, voice?: { blob: Blob; durationMs: number; waveform: number[] }) {
    const message = question.trim();
    // A voice note may arrive without words: the server writes them down
    if ((!message && !voice) || sending) return;
    setSending(true);
    setNotice(undefined);
    setNoCredits(undefined);
    setDraft("");
    const localAudioUrl = voice ? URL.createObjectURL(voice.blob) : undefined;
    const optimistic: LocalEntry = {
      id: -Date.now(), role: "user", text: message || null, answer: null, is_flagged: false, review: null, created_at: new Date().toISOString(), localAudioUrl,
      audio: voice ? { url: localAudioUrl!, duration_ms: voice.durationMs, waveform: voice.waveform } : null,
    };
    setEntries((list) => [...list, optimistic]);
    try {
      const { question: saved, data: reply, credits } = await api.ask(message, chart ? chartPayload(chart, !profile?.birth.time_unknown) : null, voice);
      if (typeof credits === "number") setCredits(credits);
      setEntries((list) => [...list.filter((e) => e.id !== optimistic.id), { ...saved, localAudioUrl }, { ...reply, answeredVoice: Boolean(voice) }]);
      if (voice && voiceReplies) setAutoPlayId(reply.id);
    } catch (error) {
      if (error instanceof ApiError && error.noCredits) {
        setNoCredits({ cost: Number(error.body.cost) || 1 });
        if (typeof error.body.credits === "number") setCredits(error.body.credits);
      } else {
        setNotice(error instanceof ApiError && error.status !== 0 ? (error.field("audio") ?? error.message) : names.serverDown);
      }
      setEntries((list) => list.filter((e) => e.id !== optimistic.id));
      if (!voice) setDraft(message);
    } finally {
      setSending(false);
    }
  }

  /** Tap on the mic: unlock audio for the coming voice reply, then record (or say why we can't). */
  function startRecording() {
    unlockAudio();
    if (!window.isSecureContext) return setNotice(t.needsHttps);
    if (!canRecord()) return setNotice(t.recordUnsupported);
    void recorder.start();
  }

  async function finishRecording() {
    unlockAudio();
    const note = await recorder.stop();
    if (!note) return;
    if (!note.transcript && !serverTranscribes) {
      setNotice(canTranscribe() ? t.noWordsHeard : t.transcriptUnsupported);
      return;
    }
    await send(note.transcript, note);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    unlockAudio();
    void send(draft);
  }

  const time = (iso: string) => new Date(iso).toLocaleTimeString(LOCALES[lang], { hour: "numeric", minute: "2-digit" });
  const status = recorder.recording ? t.recordingStatus : sending ? t.typing : t.online;
  const lastAssistant = [...entries].reverse().find((e) => e.role === "assistant");

  return (
    <div className="fixed inset-x-0 top-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex flex-col w-full max-w-screen-sm mx-auto bg-surface-container-lowest">
      {/* Chat header */}
      <header className="pt-safe bg-surface-container-low shadow-[0_12px_32px_-8px_rgba(59,45,84,0.35)] z-10">
        <div className="h-16 px-2 flex items-center gap-2">
          <Link to={homeHref} aria-label={t.back} className="tap-scale w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="relative w-10 h-10 shrink-0">
            <PanditAvatar className="w-10 h-10 ring-2 ring-primary/40" title={t.title} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5">
              {(sending || recorder.recording) && <PulseRing className="bg-primary/60" rings={1} />}
              <span className="absolute inset-0 rounded-full bg-primary ring-2 ring-surface-container-low" />
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="font-title-md text-title-md text-on-surface truncate">{t.title}</h1>
            <span key={status} className={`animate-fade-in font-label-sm text-label-sm truncate ${sending || recorder.recording ? "text-primary" : "text-on-surface-variant"}`} aria-live="polite">{status}</span>
          </div>
          <CreditChip />
          <button type="button" onClick={toggleVoiceReplies} aria-pressed={voiceReplies} aria-label={t.voiceReplies} title={t.voiceReplies} className={`tap-scale w-10 h-10 rounded-full flex items-center justify-center transition-colors ${voiceReplies ? "text-primary" : "text-on-surface-variant"}`}>
            <span key={voiceReplies ? "on" : "off"} className="material-symbols-outlined animate-icon-bounce">{voiceReplies ? "volume_up" : "volume_off"}</span>
          </button>
          <LanguagePicker compact />
        </div>
      </header>

      {/* Chat body with a starry wallpaper */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
        style={{
          backgroundImage:
            "radial-gradient(rgba(242,202,80,0.08) 1px, transparent 1.5px), radial-gradient(rgba(208,188,255,0.06) 1px, transparent 1.5px)",
          backgroundSize: "28px 28px, 46px 46px",
          backgroundPosition: "0 0, 14px 20px",
        }}
      >
        {!sessionLoading && !seeker ? (
          <div className="animate-scale-in mt-10 rounded-xl bg-surface-container p-space-lg text-center space-y-space-sm">
            <PanditAvatar className="w-20 h-20 mx-auto ring-4 ring-primary/30 shadow-xl animate-float" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{t.signInTitle}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{t.signInBody}</p>
            <Link to="/login?next=/ask" className="sheen tap-scale inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg">
              {t.signInCta} <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-center animate-fade-in">
              <span className="px-3 py-1 rounded-lg bg-surface-container/90 text-on-surface-variant font-label-sm text-label-sm text-center max-w-[90%]">
                {chart ? (
                  t.chartLoaded(names.signs[chart.ascendant.sign], names.signs[chart.planets.Moon.sign], names.planets[activePeriod(chart.mahadashas).lord])
                ) : (
                  <>
                    {t.noChart} <Link to="/birth-details" className="text-primary font-semibold">{t.makeChart}</Link>
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-center">
              <span className="px-3 py-0.5 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">{t.today}</span>
            </div>
            {historyLoading && <LoadingCard label={t.loadingHistory} />}
            {historyError && <ErrorCard error={historyError} />}
            {!historyLoading && entries.length === 0 && (
              <Bubble outgoing={false} time={time(new Date().toISOString())}>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{t.tryAsking}</span>
                <div className="mt-1.5 flex flex-col gap-1.5" data-stagger="in" style={{ "--reveal-delay": "250ms", "--stagger-step": "60ms" } as React.CSSProperties}>
                  {[...t.topics.map((topic) => topic.question), ...t.suggestions].slice(0, 5).map((suggestion) => (
                    <button key={suggestion} onClick={() => void send(suggestion)} className="tap-scale text-left px-2.5 py-2 rounded-lg bg-surface-container-lowest/60 font-body-md text-body-md hover:bg-surface-container-lowest transition-colors flex items-center justify-between gap-2">
                      {suggestion}
                      <span className="material-symbols-outlined text-sm text-primary">north_east</span>
                    </button>
                  ))}
                </div>
              </Bubble>
            )}
            {entries.map((entry) => {
              if (entry.role === "user") {
                return (
                  <Bubble key={entry.id} outgoing time={time(entry.created_at)}>
                    {entry.audio ? (
                      <>
                        <AudioNote url={entry.localAudioUrl ?? entry.audio.url} durationMs={entry.audio.duration_ms} waveform={entry.audio.waveform} labels={t} />
                        {entry.text && <p className="mt-1 px-1 font-body-sm text-body-sm text-on-surface-variant italic">“{entry.text}”</p>}
                      </>
                    ) : (
                      <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                    )}
                  </Bubble>
                );
              }
              const answer = entry.answer!;
              const asVoice = (Boolean(entry.audio) || entry.answeredVoice) && voiceReplies && answer.kind !== "care";
              const showText = !asVoice || expanded[entry.id];
              return (
                <div key={entry.id} className="space-y-1.5">
                  <Bubble outgoing={false} time={time(entry.created_at)}>
                    {asVoice && (
                      <>
                        {entry.audio ? (
                          // Real ElevenLabs voice reply from the server
                          <AudioNote
                            url={entry.audio.url}
                            durationMs={entry.audio.duration_ms}
                            waveform={entry.audio.waveform}
                            labels={t}
                            tone="incoming"
                            autoPlay={entry.id === autoPlayId}
                            avatar={<PanditAvatar className="w-10 h-10" />}
                          />
                        ) : (
                          // No ElevenLabs set up: speak with the phone's own voice
                          <SpokenNote
                            text={spokenText(answer)}
                            lang={lang}
                            labels={t}
                            autoPlay={entry.id === autoPlayId}
                            onUnavailable={() => {
                              setNotice(t.voiceUnavailable);
                              setExpanded((e) => ({ ...e, [entry.id]: true }));
                            }}
                          />
                        )}
                        <button type="button" onClick={() => setExpanded((e) => ({ ...e, [entry.id]: !e[entry.id] }))} className="tap-scale mt-1 px-1 font-label-md text-label-md text-primary">
                          {expanded[entry.id] ? t.hideText : t.showText}
                        </button>
                      </>
                    )}
                    {showText && (
                      <div className={asVoice ? "mt-2 pt-2 border-t border-surface-container-highest animate-rise" : ""}>
                        <AnswerContent answer={answer} />
                      </div>
                    )}
                    {entry.remedy && <RemedyCard entry={entry} />}
                    <ReviewNotice entry={entry} />
                    {answer.kind !== "care" && (
                      <ReportAnswer entry={entry} onReported={(updated) => setEntries((list) => list.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)))} />
                    )}
                  </Bubble>
                  {entry === lastAssistant && !sending && answer.follow_ups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1" data-stagger="in" style={{ "--reveal-delay": "300ms", "--stagger-step": "60ms" } as React.CSSProperties}>
                      {answer.follow_ups.map((question) => (
                        <button key={question} onClick={() => void send(question)} className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm active:scale-95 transition-transform flex items-center gap-1">
                          {question}
                          <span className="material-symbols-outlined text-xs text-primary">north_east</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {sending && (
              <div className="flex items-end gap-1.5 justify-start" role="status" aria-label={t.thinking}>
                <PanditAvatar className="w-8 h-8 mb-0.5 shadow-md animate-pop-in" />
                <div className="animate-pop-in origin-top-left bg-surface-container-high rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                  {[0, 160, 320].map((delay) => (
                    <span key={delay} className="w-2 h-2 rounded-full bg-on-surface-variant animate-typing-dot" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <p className="pt-2 font-label-sm text-label-sm text-outline text-center px-space-md">{t.disclaimer}</p>
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Composer */}
      {seeker && (
        <div className="pb-safe bg-surface-container-lowest">
          {noCredits && (
            <div className="mx-2 mt-2">
              <NoCreditsCard cost={noCredits.cost} />
            </div>
          )}
          {notice && (
            <div className="animate-rise mx-2 mt-2 flex items-start gap-2 rounded-lg bg-error-container/25 px-3 py-2 text-on-surface" role="alert">
              <span className="material-symbols-outlined text-error text-lg">info</span>
              <p className="flex-1 font-body-sm text-body-sm">{notice}</p>
              <button type="button" onClick={() => setNotice(undefined)} aria-label={names.close} className="text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}
          {recorder.recording ? (
            <div className="animate-fade-in flex items-center gap-2 p-2">
              <button type="button" onClick={recorder.cancel} aria-label={t.cancelRecording} className="tap-scale animate-pop-in w-11 h-11 rounded-full flex items-center justify-center text-error">
                <span className="material-symbols-outlined">delete</span>
              </button>
              <div className="animate-scale-in origin-right flex-1 flex items-center gap-2 h-11 px-3 rounded-full bg-surface-container">
                <span className="relative w-2.5 h-2.5 shrink-0">
                  <PulseRing className="bg-error/50" rings={1} />
                  <span className="absolute inset-0 rounded-full bg-error animate-pulse" />
                </span>
                <span className="font-label-md text-label-md text-on-surface tabular-nums">{formatDuration(recorder.elapsedMs)}</span>
                <div className="flex-1 flex items-center justify-end gap-[2px] h-6 overflow-hidden" aria-hidden>
                  {recorder.liveLevels.map((level, i) => (
                    <span key={i} className="w-[3px] h-full rounded-full bg-primary transition-transform duration-150 ease-out" style={{ transform: `scaleY(${Math.max(0.1, level)})` }} />
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => void finishRecording()} aria-label={t.sendVoice} className="tap-scale animate-pop-in relative w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg">
                <PulseRing className="bg-primary/40" />
                <span className="material-symbols-outlined relative">send</span>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="animate-fade-in flex items-end gap-2 p-2">
              <div className="flex-1 flex items-center bg-surface-container rounded-3xl px-4 min-h-[44px] ring-primary/40 transition-shadow duration-300 focus-within:ring-1">
                <label htmlFor="chatInput" className="sr-only">{t.placeholder}</label>
                <input
                  id="chatInput"
                  className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none py-2.5"
                  placeholder={t.placeholder}
                  type="text"
                  maxLength={1000}
                  autoComplete="off"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </div>
              {draft.trim() ? (
                <button type="submit" aria-label={t.send} disabled={sending || !draft.trim()} className="animate-pop-in w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50">
                  <span className="material-symbols-outlined">send</span>
                </button>
              ) : (
                <button type="button" onClick={startRecording} disabled={sending} aria-label={t.record} className="animate-pop-in w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </button>
              )}
            </form>
          )}
          {costs && costs.question > 0 && !recorder.recording && (
            <p className="-mt-1 pb-1.5 px-4 font-label-sm text-label-sm text-outline text-center">
              {c.costHint(costs.question)} • {c.balanceLabel}: <span className={seeker.credits < costs.question ? "text-error font-bold" : "text-primary font-bold"}>{seeker.credits}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
