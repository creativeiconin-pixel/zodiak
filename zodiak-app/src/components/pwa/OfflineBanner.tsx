import { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { pwaText } from "../../i18n/pages/pwa";

/** Thin bar at the very top while there is no internet, and a short "back online" note after. */
export function OfflineBanner() {
  const t = useT(pwaText);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const goOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setJustReconnected(false), 3000);
    };
    const goOffline = () => {
      window.clearTimeout(timer);
      setOnline(false);
      setJustReconnected(false);
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.clearTimeout(timer);
    };
  }, []);

  if (online && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 inset-x-0 z-[60] pt-[env(safe-area-inset-top)] text-center font-label-sm text-label-sm ${
        online ? "bg-primary text-on-primary" : "bg-error-container text-on-error-container"
      }`}
    >
      <div className="flex items-center justify-center gap-1.5 px-margin-mobile py-1">
        <span className="material-symbols-outlined text-base" aria-hidden="true">{online ? "wifi" : "wifi_off"}</span>
        <span>{online ? t.backOnline : t.offline}</span>
      </div>
    </div>
  );
}
