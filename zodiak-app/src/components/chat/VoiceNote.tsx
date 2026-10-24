import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "../../i18n";
import { stopSharedAudio, useSharedAudio } from "../../lib/audioPlayer";
import { estimateSpeechMs, formatDuration, SPEECH_LOCALE, voiceFor } from "../../lib/voice";
import { PulseRing } from "../motion/PulseRing";

const SPEEDS = [1, 1.5, 2] as const;

/** Only one voice note plays at a time, like WhatsApp. */
let stopCurrent: (() => void) | null = null;
function claimPlayback(stop: () => void) {
  if (stopCurrent && stopCurrent !== stop) stopCurrent();
  stopCurrent = stop;
}

export function Waveform({ bars, progress, tone }: { bars: number[]; progress: number; tone: "outgoing" | "incoming" }) {
  const played = tone === "outgoing" ? "bg-primary" : "bg-secondary";
  return (
    <div className="flex items-center gap-[2px] h-8 w-full shrink-0 min-w-0 overflow-hidden" aria-hidden>
      {bars.map((bar, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full transition-colors duration-300 animate-grow-y ${i / bars.length < progress ? played : "bg-on-surface-variant/40"}`}
          style={{ height: `${Math.max(12, bar * 100)}%`, animationDuration: "500ms", animationDelay: `${i * 12}ms` }}
        />
      ))}
    </div>
  );
}

type Labels = { play: string; pause: string; speed: string };

function Controls({ playing, onToggle, progress, bars, durationMs, speed, onSpeed, tone, labels, avatar, needsTap = false }: {
  playing: boolean; onToggle: () => void; progress: number; bars: number[]; durationMs: number; speed: number; onSpeed: () => void;
  tone: "outgoing" | "incoming"; labels: Labels; avatar?: React.ReactNode; needsTap?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 min-w-[230px]">
      {avatar && (
        <span className="relative shrink-0 rounded-full">
          {playing && <PulseRing className="bg-secondary/40" />}
          <span className="relative block">{avatar}</span>
        </span>
      )}
      <button type="button" onClick={onToggle} aria-label={playing ? labels.pause : labels.play} className={`tap-scale relative w-9 h-9 shrink-0 rounded-full flex items-center justify-center hover:text-primary transition-colors ${needsTap ? "text-primary bg-primary/15" : "text-on-surface"}`}>
        {/* The phone blocked auto-play: pulse until the seeker taps */}
        {needsTap && <PulseRing className="bg-primary/40" />}
        <span key={playing ? "pause" : "play"} className="material-symbols-outlined text-[30px] animate-pop-in" style={{ fontVariationSettings: "'FILL' 1" }}>{playing ? "pause" : "play_arrow"}</span>
      </button>
      <div className="flex flex-col flex-1 min-w-0">
        <Waveform bars={bars} progress={progress} tone={tone} />
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>{formatDuration(playing || progress > 0 ? durationMs * progress : durationMs)}</span>
          {(playing || progress > 0) && (
            <button key={speed} type="button" onClick={onSpeed} aria-label={labels.speed} className="animate-pop-in tap-scale px-1.5 rounded-full bg-surface-container-highest text-on-surface">{speed}×</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** A recorded voice note played from the server: the seeker's own (outgoing) or an AI voice reply (incoming). */
export function AudioNote({ url, durationMs, waveform, labels, tone = "outgoing", autoPlay = false, avatar }: {
  url: string; durationMs: number; waveform: number[]; labels: Labels; tone?: "outgoing" | "incoming"; autoPlay?: boolean; avatar?: React.ReactNode;
}) {
  const [speedIndex, setSpeedIndex] = useState(0);
  const player = useSharedAudio(url, url, durationMs, () => claimPlayback(stopSharedAudio));
  const bars = waveform.length ? waveform : Array(40).fill(0.3);

  useEffect(() => {
    // Works on phones because the shared player was unlocked by the tap that sent the question
    if (autoPlay) void player.play(SPEEDS[speedIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cycleSpeed() {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    player.setRate(SPEEDS[next]);
  }

  return (
    <Controls
      playing={player.playing}
      onToggle={() => (player.playing ? player.pause() : void player.play(SPEEDS[speedIndex]))}
      progress={player.progress}
      bars={bars}
      durationMs={durationMs}
      speed={SPEEDS[speedIndex]}
      onSpeed={cycleSpeed}
      tone={tone}
      labels={labels}
      avatar={avatar}
      needsTap={player.blocked && !player.playing}
    />
  );
}

/** Deterministic bar heights so a spoken reply always draws the same waveform. */
function barsFromText(text: string): number[] {
  let seed = 0;
  for (const char of text) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  return Array.from({ length: 40 }, () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return 0.25 + ((seed >>> 16) % 1000) / 1333;
  });
}

/** An AI reply delivered as a voice note, spoken with the device's voice for the chosen language. */
export function SpokenNote({ text, lang, labels, autoPlay = false, onUnavailable }: { text: string; lang: Lang; labels: Labels; autoPlay?: boolean; onUnavailable?: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const bars = useMemo(() => barsFromText(text), [text]);
  const durationMs = estimateSpeechMs(text, 1);

  function stop() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.clearInterval(timer.current);
    setPlaying(false);
    setProgress(0);
  }

  function play(rate = SPEEDS[speedIndex]) {
    const voice = voiceFor(lang);
    if (!voice) return onUnavailable?.();
    claimPlayback(stop);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = SPEECH_LOCALE[lang];
    utterance.rate = rate;
    const startedAt = performance.now();
    const expected = estimateSpeechMs(text, rate);
    utterance.onboundary = (event) => setProgress(Math.min(0.99, event.charIndex / text.length));
    utterance.onend = () => stop();
    utterance.onerror = () => stop();
    // Fallback progress for voices that send no word boundaries
    timer.current = window.setInterval(() => setProgress((p) => Math.max(p, Math.min(0.99, (performance.now() - startedAt) / expected))), 200);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }

  useEffect(() => {
    if (!autoPlay) return;
    // Voices load asynchronously on first use
    const timeout = window.setTimeout(() => play(), 300);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playingRef = useRef(false);
  playingRef.current = playing;
  useEffect(
    () => () => {
      if (playingRef.current) window.speechSynthesis.cancel();
      window.clearInterval(timer.current);
    },
    [],
  );

  function cycleSpeed() {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    if (playing) play(SPEEDS[next]);
  }

  const avatar = (
    <div className="relative w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-secondary-container via-surface-container to-primary-container flex items-center justify-center">
      <span className="material-symbols-outlined text-on-primary text-lg">psychology</span>
      <span className="material-symbols-outlined absolute -bottom-0.5 -right-0.5 text-[14px] text-secondary bg-surface-container rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
    </div>
  );

  return (
    <Controls playing={playing} onToggle={() => (playing ? stop() : play())} progress={progress} bars={bars} durationMs={durationMs} speed={SPEEDS[speedIndex]} onSpeed={cycleSpeed} tone="incoming" labels={labels} avatar={avatar} />
  );
}
