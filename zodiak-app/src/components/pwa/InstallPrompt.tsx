import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useT } from "../../i18n";
import { pwaText } from "../../i18n/pages/pwa";

const DISMISS_KEY = "zodiak.installDismissed";
/** How far down the Home page someone scrolls before the card slides up. */
const SHOW_AFTER_PX = 240;
/** Android browsers without an install button get the "⋮ menu" hint after this wait. */
const ANDROID_HINT_DELAY_MS = 3000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // storage blocked: the card simply comes back next visit
  }
}

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Phones (and small touch tablets) only; never desktops or laptops. */
function isPhone(): boolean {
  return /android|iphone|ipod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && Math.min(window.screen.width, window.screen.height) < 768);
}

function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const iOS = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return iOS && /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua);
}

/**
 * Small gold card that slides up above the bottom nav while someone scrolls the Home page on a phone:
 * the browser's install button, or the iPhone "Share → Add to Home Screen" / Android "⋮ menu" hint.
 */
export function InstallPrompt() {
  const t = useT(pwaText);
  // The phone Home page lives at "/" (and "/home" once the desktop landing page takes "/")
  const onHome = ["/", "/home"].includes(useLocation().pathname);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [androidHint, setAndroidHint] = useState(false);
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isStandalone() || !isPhone()) return;
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      rememberDismissed();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    setIosHint(isIosSafari());
    const androidTimer = isAndroid() ? window.setTimeout(() => setAndroidHint(true), ANDROID_HINT_DELAY_MS) : undefined;
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(androidTimer);
    };
  }, []);

  useEffect(() => {
    if (!onHome) return setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  function dismiss() {
    setDismissed(true);
    rememberDismissed();
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") rememberDismissed();
  }

  if (!onHome || dismissed || (!deferred && !iosHint && !androidHint)) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 px-margin-mobile pointer-events-none">
      <div
        role="region"
        aria-label={deferred ? t.installTitle : t.iosTitle}
        aria-hidden={!scrolled}
        className={`max-w-screen-sm mx-auto flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary p-3 shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-[transform,opacity] duration-500 ease-out-expo ${
          scrolled ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-[140%] opacity-0"
        }`}
      >
        <img src="/icons/icon-192.png" alt="" className="w-11 h-11 rounded-xl shrink-0 ring-1 ring-on-primary/20" />
        <div className="flex-1 min-w-0">
          <p className="font-label-md text-label-md font-bold leading-tight">{deferred ? t.installTitle : t.iosTitle}</p>
          <p className="font-body-sm text-body-sm leading-snug opacity-80">
            {deferred ? (
              t.installBody
            ) : iosHint ? (
              <>
                <span className="material-symbols-outlined align-middle text-base mr-1" aria-hidden="true">ios_share</span>
                {t.iosHint}
              </>
            ) : (
              t.androidHint
            )}
          </p>
        </div>
        {deferred && (
          <button
            type="button"
            onClick={() => void install()}
            tabIndex={scrolled ? 0 : -1}
            className="shrink-0 min-h-[40px] px-4 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold"
          >
            {t.install}
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          tabIndex={scrolled ? 0 : -1}
          aria-label={t.close}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-on-primary/10"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
  );
}
