// One shared <audio> element plays every voice note. Phones only allow sound after a tap, and an element that has
// played once during a tap may play again later on its own. So we "unlock" this element while the seeker taps the
// mic or send button, and the AI's voice reply can then start by itself when it arrives seconds later.
import { useCallback, useState, useSyncExternalStore } from "react";

/** A tiny silent WAV used to unlock the element. */
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

let element: HTMLAudioElement | null = null;
let unlocked = false;
let ownerId: string | null = null;
let version = 0;
const listeners = new Set<() => void>();

function notify() {
  version++;
  listeners.forEach((listener) => listener());
}

function audio(): HTMLAudioElement {
  if (!element) {
    element = new Audio();
    element.preload = "auto";
    element.setAttribute("playsinline", "");
    for (const event of ["play", "pause", "ended", "timeupdate", "loadedmetadata", "error"]) element.addEventListener(event, notify);
  }
  return element;
}

/** Call synchronously inside a tap handler (mic, send). Safe to call often. */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  const el = audio();
  if (!unlocked && el.paused) {
    el.src = SILENT_WAV;
    el.play().then(() => el.pause()).catch(() => undefined);
    unlocked = true;
  }
  // iPhones also need one tap-started utterance before the built-in voices may speak later
  if ("speechSynthesis" in window && !window.speechSynthesis.speaking) {
    const primer = new SpeechSynthesisUtterance(" ");
    primer.volume = 0;
    window.speechSynthesis.speak(primer);
  }
}

/** Stops whatever the shared element is playing. */
export function stopSharedAudio() {
  element?.pause();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Playback state for one voice note on the shared element.
 *
 * @param id A stable id for the note (its URL works).
 * @param fallbackMs Duration to use while the browser does not know it yet (Chrome reports Infinity for fresh recordings).
 */
export function useSharedAudio(id: string, url: string, fallbackMs: number, onClaim: () => void) {
  useSyncExternalStore(subscribe, () => version);
  const [blocked, setBlocked] = useState(false);
  const el = element;
  const isOwner = ownerId === id && el !== null;
  const playing = isOwner && !el.paused && !el.ended;
  const duration = isOwner && Number.isFinite(el.duration) && el.duration > 0 ? el.duration : fallbackMs / 1000;
  const progress = isOwner && !el.ended ? Math.min(1, el.currentTime / Math.max(duration, 0.1)) : 0;

  const play = useCallback(
    (rate: number) => {
      const player = audio();
      onClaim();
      if (ownerId !== id) {
        player.src = url;
        ownerId = id;
      }
      player.playbackRate = rate;
      return player
        .play()
        .then(() => setBlocked(false))
        .catch(() => setBlocked(true));
    },
    [id, url, onClaim],
  );

  const pause = useCallback(() => {
    if (ownerId === id) element?.pause();
  }, [id]);

  const setRate = useCallback(
    (rate: number) => {
      if (ownerId === id && element) element.playbackRate = rate;
    },
    [id],
  );

  return { playing, progress, blocked, play, pause, setRate };
}
