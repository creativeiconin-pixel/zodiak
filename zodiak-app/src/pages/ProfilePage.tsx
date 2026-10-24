import { Link, useNavigate } from "react-router-dom";
import { LanguagePicker } from "../components/LanguagePicker";
import { Reveal } from "../components/motion/Reveal";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { LANGUAGES, useLanguage, useT, type Lang } from "../i18n";
import { common } from "../i18n/common";
import { profileText } from "../i18n/pages/profile";
import { api, inr } from "../lib/api";
import { useBirthProfile } from "../lib/birthProfile";
import { useSession } from "../lib/session";
import { creditsText } from "../i18n/pages/credits";
import { useAsync } from "../lib/useAsync";

const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN", kn: "kn-IN" };

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function Orders() {
  const t = useT(profileText);
  const names = useT(common);
  const { data: orders, error, loading, reload } = useAsync(api.myOrders, [names]);
  if (loading) return <LoadingCard label={t.loadingOrders} />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!orders?.length) {
    return (
      <div className="animate-fade-in rounded-xl bg-surface-container p-space-md text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">{t.noOrders}</p>
        <Link to="/remedies" className="mt-1 inline-block font-label-md text-label-md text-primary font-semibold">{t.shop}</Link>
      </div>
    );
  }
  return (
    <Reveal as="ul" stagger className="flex flex-col gap-space-sm">
      {orders.map((order) => (
        <li key={order.reference}>
          <Link to={`/orders/${order.reference}`} className="group tap-scale flex items-center gap-space-sm rounded-xl bg-surface-container p-space-sm hover:bg-surface-container-high transition-colors">
            <img src={order.remedy?.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-title-md text-body-md text-on-surface font-semibold truncate">{order.remedy?.name}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">#{order.reference} • {inr(order.amount)}</p>
              <span className="font-label-sm text-label-sm text-primary">{names.orderStatus[order.status]}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">chevron_right</span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}

export default function ProfilePage() {
  const t = useT(profileText);
  const names = useT(common);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { seeker, loading, logout } = useSession();
  const credits = useT(creditsText);
  const { profile, chart } = useBirthProfile();

  const displayName = seeker?.name ?? profile?.name ?? "";

  return (
    <main className="flex-1 flex flex-col w-full pt-20 pb-28 px-margin-mobile gap-space-md">
      {/* Identity */}
      <div className="animate-rise flex items-center gap-space-md">
        <div className="animate-pop-in w-16 h-16 rounded-full bg-gradient-to-tr from-secondary-container to-primary-container flex items-center justify-center font-headline-md text-headline-md text-on-primary">
          {displayName ? initials(displayName) : <span className="material-symbols-outlined text-3xl">person</span>}
        </div>
        <div className="min-w-0">
          <h1 className="font-headline-md text-headline-md text-on-surface truncate">{displayName || t.guestTitle}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{seeker ? seeker.phone ?? seeker.email : t.guestBody}</p>
        </div>
      </div>
      {!loading && !seeker && (
        <Link to="/login?next=/profile" className="sheen tap-scale animate-rise [animation-delay:80ms] w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md text-center">{t.signIn}</Link>
      )}

      {/* Birth details */}
      <Reveal as="section" delay={100} className="rounded-xl bg-surface-container p-space-md space-y-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-title-md text-title-md text-on-surface">{t.birthDetails}</h2>
          <Link to="/birth-details" className="font-label-md text-label-md text-primary font-semibold">{profile ? t.edit : t.addDetails}</Link>
        </div>
        {profile && chart ? (
          <dl className="grid grid-cols-2 gap-space-sm" data-stagger="in" style={{ "--reveal-delay": "200ms", "--stagger-step": "50ms" } as React.CSSProperties}>
            {[
              [t.dob, new Date(`${profile.birth.date}T00:00`).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "long", year: "numeric" })],
              [t.time, profile.birth.time_unknown || !profile.birth.time ? t.timeUnknown : profile.birth.time],
              [t.place, profile.birth.place],
              [t.lagna, names.signs[chart.ascendant.sign]],
              [t.sun, names.signs[chart.planets.Sun.sign]],
              [t.moon, names.signs[chart.planets.Moon.sign]],
              [t.nakshatra, `${names.nakshatras[chart.planets.Moon.nakshatra]} • ${t.pada(chart.planets.Moon.pada)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-surface-container-low p-2.5">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</dt>
                <dd className="font-body-md text-body-md text-on-surface mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">{t.noDetails}</p>
        )}
      </Reveal>

      {/* Language */}
      <Reveal as="section" delay={160} className="flex items-center justify-between rounded-xl bg-surface-container p-space-md">
        <div>
          <h2 className="font-title-md text-title-md text-on-surface">{t.language}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{LANGUAGES.find((l) => l.code === lang)!.name}</p>
        </div>
        <LanguagePicker />
      </Reveal>

      {seeker && (
        <>
          <Link to="/credits" className="group tap-scale animate-fade-in flex items-center gap-space-sm rounded-xl bg-gradient-to-r from-secondary-container/60 to-surface-container p-space-md shadow-md">
            <span className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-title-md text-title-md text-on-surface">{credits.title}</span>
              <span className="block font-body-sm text-body-sm text-on-surface-variant">{credits.balanceLabel}: <b className={seeker.credits > 0 ? "text-primary" : "text-error"}>{seeker.credits}</b></span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold">{credits.addCredits}</span>
          </Link>
          <Reveal as="section" className="space-y-space-sm">
            <h2 className="font-title-md text-title-md text-on-surface">{t.orders}</h2>
            <Orders />
          </Reveal>
          <Link to="/ask" className="group tap-scale animate-fade-in flex items-center gap-space-sm rounded-xl bg-surface-container p-space-md hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">forum</span>
            <span className="flex-1">
              <span className="block font-title-md text-title-md text-on-surface">{t.chats}</span>
              <span className="block font-body-sm text-body-sm text-on-surface-variant">{t.chatsBody}</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">chevron_right</span>
          </Link>
          <button
            type="button"
            onClick={() => void logout().then(() => navigate("/"))}
            className="tap-scale w-full py-3 rounded-xl bg-surface-container text-error font-title-md text-title-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span> {t.signOut}
          </button>
        </>
      )}
    </main>
  );
}
