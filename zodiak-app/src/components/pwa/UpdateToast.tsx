import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useT } from "../../i18n";
import { pwaText } from "../../i18n/pages/pwa";

const HOURLY = 60 * 60 * 1000;
/** An update found this soon after opening the app is applied at once, before the person starts using it. */
const LAUNCH_WINDOW_MS = 8000;
const launchedAt = Date.now();

/**
 * Registers the service worker (production builds only; the dev server has it off)
 * and shows "New version ready — Refresh" when a newer app is waiting.
 */
export function UpdateToast() {
  const t = useT(pwaText);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      // Phones keep the app open for days: look for a new version every hour and whenever the app is reopened
      window.setInterval(() => void registration.update(), HOURLY);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") void registration.update();
      });
    },
  });

  useEffect(() => {
    if (needRefresh && Date.now() - launchedAt < LAUNCH_WINDOW_MS) void updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-[60] px-margin-mobile pointer-events-none">
      <div
        role="alert"
        className="pointer-events-auto max-w-screen-sm mx-auto flex items-center gap-3 rounded-2xl bg-surface-container-high ring-1 ring-primary/40 p-3 pl-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
      >
        <span className="material-symbols-outlined text-primary" aria-hidden="true">auto_awesome</span>
        <p className="flex-1 font-label-md text-label-md text-on-surface">{t.updateReady}</p>
        <button
          type="button"
          onClick={() => void updateServiceWorker(true)}
          className="shrink-0 min-h-[40px] px-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md font-bold"
        >
          {t.refresh}
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          aria-label={t.close}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
  );
}
