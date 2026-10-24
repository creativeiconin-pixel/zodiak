import { Link } from "react-router-dom";
import { useT } from "../i18n";
import { profileText } from "../i18n/pages/profile";
import { useHomeHref } from "../lib/useDesktopLanding";

export default function NotFoundPage() {
  const homeHref = useHomeHref();
  const t = useT(profileText);
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-space-sm px-margin-mobile pt-16 pb-24 text-center">
      <span className="material-symbols-outlined text-primary text-5xl animate-float">travel_explore</span>
      <h1 className="animate-rise [animation-delay:80ms] font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{t.notFoundTitle}</h1>
      <p className="animate-rise [animation-delay:160ms] font-body-md text-body-md text-on-surface-variant max-w-xs">{t.notFoundBody}</p>
      <Link to={homeHref} className="sheen tap-scale animate-rise [animation-delay:240ms] mt-space-sm px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg">{t.goHome}</Link>
    </main>
  );
}
