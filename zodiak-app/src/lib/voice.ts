// Voice notes for the WhatsApp-style chat: record audio with a live waveform. The server writes down the words
// (Gemini); only when it can't does the browser's own speech recognition try. AI replies are read aloud with
// the device's built-in voices when no recorded voice reply is available.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "../i18n";

export const SPEECH_LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };

/** Recognition locale: Hinglish speakers talk in Hindi, which hi-IN transcribes best (in Devanagari). */
const RECOGNITION_LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "hi-IN", kn: "kn-IN" };

const WAVEFORM_BARS = 40;
const MAX_RECORDING_MS = 120_000;

type RecognitionResultList = ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: RecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

function recognitionConstructor(): (new () => Recognition) | undefined {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const canRecord = () => typeof window !== "undefined" && "MediaRecorder" in window && Boolean(navigator.mediaDevices?.getUserMedia);
export const canTranscribe = () => typeof window !== "undefined" && Boolean(recognitionConstructor());

function pickMimeType(): string | undefined {
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
}

/** Squash the per-frame loudness samples into a fixed number of bars between 0 and 1. */
function toWaveform(levels: number[]): number[] {
  if (levels.length === 0) return Array(WAVEFORM_BARS).fill(0.1);
  const size = levels.length / WAVEFORM_BARS;
  const bars = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
    const slice = levels.slice(Math.floor(i * size), Math.max(Math.floor((i + 1) * size), Math.floor(i * size) + 1));
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
  const peak = Math.max(...bars, 0.01);
  return bars.map((bar) => Math.round(Math.max(0.08, bar / peak) * 100) / 100);
}

export type VoiceNote = { blob: Blob; durationMs: number; waveform: number[]; transcript: string };

type RecordingSession = {
  recorder: MediaRecorder;
  stream: MediaStream;
  audioContext: AudioContext;
  recognition?: Recognition;
  chunks: Blob[];
  levels: number[];
  transcript: string[];
  interim: string;
  startedAt: number;
  timer: number;
  cancelled: boolean;
  resolve?: (note: VoiceNote | null) => void;
};
export type RecorderError = "denied" | "unsupported";

/**
 * @param browserTranscript Also run the browser's speech recognition while recording. Off when the server can
 *   transcribe: on many phones recognition fights the recorder for the microphone.
 */
export function useVoiceRecorder(lang: Lang, browserTranscript = true) {
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [liveLevels, setLiveLevels] = useState<number[]>([]);
  const [error, setError] = useState<RecorderError>();
  const session = useRef<RecordingSession | undefined>(undefined);

  const cleanup = useCallback(() => {
    const s = session.current;
    if (!s) return;
    window.clearInterval(s.timer);
    s.stream.getTracks().forEach((track) => track.stop());
    void s.audioContext.close();
    s.recognition?.abort();
    session.current = undefined;
    setRecording(false);
    setLiveLevels([]);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    if (!canRecord()) return setError("unsupported");
    setError(undefined);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      return setError("denied");
    }

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);

    const Recognition = browserTranscript ? recognitionConstructor() : undefined;
    const recognition = Recognition ? new Recognition() : undefined;

    const s: RecordingSession = {
      recorder, stream, audioContext, recognition, chunks: [], levels: [], transcript: [], interim: "", startedAt: performance.now(), timer: 0, cancelled: false,
    };
    session.current = s;

    recorder.ondataavailable = (event) => event.data.size > 0 && s.chunks.push(event.data);
    recorder.onstop = () => {
      const durationMs = Math.round(performance.now() - s.startedAt);
      const note: VoiceNote = {
        blob: new Blob(s.chunks, { type: recorder.mimeType || "audio/webm" }),
        durationMs,
        waveform: toWaveform(s.levels),
        transcript: [...s.transcript, s.interim].join(" ").replace(/\s+/g, " ").trim(),
      };
      const resolve = s.resolve;
      const cancelled = s.cancelled;
      cleanup();
      resolve?.(cancelled ? null : note);
    };

    if (recognition) {
      recognition.lang = RECOGNITION_LOCALE[lang];
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const finals: string[] = [];
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) finals.push(result[0].transcript);
          else interim += result[0].transcript;
        }
        s.transcript = finals;
        s.interim = interim;
      };
      recognition.onerror = () => undefined;
      try {
        recognition.start();
      } catch {
        s.recognition = undefined;
      }
    }

    s.timer = window.setInterval(() => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += ((sample - 128) / 128) ** 2;
      const level = Math.min(1, Math.sqrt(sum / samples.length) * 4);
      s.levels.push(level);
      setLiveLevels((prev) => [...prev.slice(-29), level]);
      const elapsed = performance.now() - s.startedAt;
      setElapsedMs(elapsed);
      if (elapsed >= MAX_RECORDING_MS && recorder.state === "recording") recorder.stop();
    }, 100);

    recorder.start(250);
    setElapsedMs(0);
    setRecording(true);
  }, [cleanup, lang, browserTranscript]);

  /** Stop and return the finished note (null if it was cancelled). */
  const stop = useCallback(() => {
    const s = session.current;
    if (!s) return Promise.resolve(null);
    return new Promise<VoiceNote | null>((resolve) => {
      s.resolve = resolve;
      s.recognition?.stop();
      // Give speech recognition a moment to deliver its last words before the recorder closes
      window.setTimeout(() => s.recorder.state !== "inactive" && s.recorder.stop(), 600);
    });
  }, []);

  const cancel = useCallback(() => {
    const s = session.current;
    if (!s) return;
    s.cancelled = true;
    if (s.recorder.state !== "inactive") s.recorder.stop();
    else cleanup();
  }, [cleanup]);

  return { recording, elapsedMs, liveLevels, error, start, stop, cancel };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Whether this device has a voice for the language, so AI replies can be spoken. */
export function voiceFor(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!("speechSynthesis" in window)) return undefined;
  const locale = SPEECH_LOCALE[lang];
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.replace("_", "-") === locale) ?? voices.find((v) => v.lang.startsWith(locale.slice(0, 2)));
}

/** Rough speaking time for progress bars when the browser gives no word timings. */
export function estimateSpeechMs(text: string, rate: number): number {
  return (text.length / 14) * 1000 / rate;
}
