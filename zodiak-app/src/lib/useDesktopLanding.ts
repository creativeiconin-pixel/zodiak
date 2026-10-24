import { useEffect, useState } from "react";

const DESKTOP = "(min-width: 1024px)";

function isInstalledApp() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function shouldShowLanding() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP).matches && !isInstalledApp();
}

/**
 * On a wide screen in a normal browser tab, "/" is the marketing landing page and the app's own home moves to
 * "/home". Phones, tablets and the installed app always open straight into the app.
 */
export function useDesktopLanding(): boolean {
  const [desktop, setDesktop] = useState(shouldShowLanding);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setDesktop(shouldShowLanding());
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}

/** Where in-app "home" links go: the app's Home, which lives at /home whenever "/" is the desktop landing. */
export function useHomeHref(): string {
  return useDesktopLanding() ? "/home" : "/";
}
