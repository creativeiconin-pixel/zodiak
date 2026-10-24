import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LanguagePicker } from "../components/LanguagePicker";
import { LANGUAGES, useT } from "../i18n";
import { landingText } from "../i18n/pages/landing";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";

/** Where each feature lives in the app, and the screenshot that shows it. */
const FEATURE_LINKS = {
  kundli: { to: "/kundli", image: "/landing/kundli.jpg", icon: "flare" },
  ask: { to: "/ask", image: "/landing/ask.jpg", icon: "psychology" },
  horoscope: { to: "/horoscope", image: "/landing/horoscope.jpg", icon: "wb_twilight" },
  milan: { to: "/milan", image: "/landing/milan.jpg", icon: "favorite" },
  palm: { to: "/palmistry", image: "/landing/palm.jpg", icon: "front_hand" },
  store: { to: "/remedies", image: "/landing/store.jpg", icon: "storefront" },
} as const;

const HERO_SCREENS = ["/landing/home.jpg", "/landing/ask.jpg", "/landing/kundli.jpg"];
const HERO_INTERVAL_MS = 4000;

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };

/** A phone's top strip with the camera notch, so the notch never covers the app screenshot. */
function StatusBar() {
  return (
    <div className="h-7 flex items-center justify-center bg-surface-container-lowest" aria-hidden>
      <span className="w-20 h-[18px] rounded-full bg-black" />
    </div>
  );
}

function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative rounded-[2.75rem] border-[10px] border-surface-container-highest bg-surface-container-lowest shadow-[0_30px_80px_-20px_rgba(87,27,193,0.55),0_0_0_1px_rgba(242,202,80,0.15)] overflow-hidden ${className}`}>
      <StatusBar />
      <img src={src} alt={alt} loading="lazy" className="block w-full aspect-[390/844] object-cover object-top" />
    </div>
  );
}

function HeroPhone({ alt }: { alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % HERO_SCREENS.length), HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative w-[300px]">
      <div className="relative rounded-[2.75rem] border-[10px] border-surface-container-highest bg-surface-container-lowest shadow-[0_30px_80px_-20px_rgba(87,27,193,0.6),0_0_0_1px_rgba(242,202,80,0.2)] overflow-hidden">
        <StatusBar />
        <div className="relative aspect-[390/844]">
          {HERO_SCREENS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === index ? alt : ""}
              aria-hidden={i !== index}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2" role="tablist">
        {HERO_SCREENS.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1} / ${HERO_SCREENS.length}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-on-surface-variant/40 hover:bg-on-surface-variant"}`}
          />
        ))}
      </div>
    </div>
  );
}

function QrCard({ title, body }: { title: string; body: string }) {
  const [qr, setQr] = useState<string>();
  const url = window.location.origin;

  useEffect(() => {
    let alive = true;
    // Loaded on demand so the QR library stays out of the main bundle
    import("qrcode")
      .then((mod) => (mod.default ?? mod).toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: 320, color: { dark: "#0b0d1b", light: "#ffffff" } }))
      .then((data) => alive && setQr(data))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface-container/80 backdrop-blur-xl p-4 shadow-xl ring-1 ring-primary/20">
      <div className="w-28 h-28 shrink-0 rounded-xl bg-white p-1.5">
        {qr ? <img src={qr} alt={`QR: ${url}`} className="w-full h-full [image-rendering:pixelated]" /> : <div className="w-full h-full rounded-lg bg-neutral-200 animate-pulse" />}
      </div>
      <div className="min-w-0">
        <p className="font-title-md text-title-md text-on-surface">{title}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{body}</p>
        <p className="mt-2 font-label-md text-label-md text-primary break-all">{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, body, id }: { eyebrow: string; title: string; body?: string; id?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">{eyebrow}</span>
      <h2 id={id} className="mt-4 font-headline-lg text-headline-lg text-on-surface tracking-tight">{title}</h2>
      {body && <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant">{body}</p>}
    </div>
  );
}

export default function LandingPage() {
  const t = useT(landingText);
  const { data: config } = useAsync(api.appConfig);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  // Chrome and Edge on computers can install the web app too
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);

  const navLinks: [string, string][] = [
    ["#features", t.nav.features],
    ["#how", t.nav.how],
    ["#languages", t.nav.languages],
    ["#faq", t.nav.faq],
  ];

  return (
    <div className="min-h-screen w-full bg-surface-container-lowest text-on-surface overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(59,45,84,0.35)]">
        <div className="max-w-6xl mx-auto h-18 py-3 px-8 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/zodiak-logo.jpg" alt="" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-headline-md text-headline-md tracking-wider text-primary font-bold">ZODIAK</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Sections">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="px-3 py-2 rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguagePicker />
            <Link to="/home" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-[0_0_24px_rgba(242,202,80,0.3)] hover:brightness-110 transition">
              {t.openApp}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div className="absolute -top-40 left-1/3 w-[36rem] h-[36rem] bg-secondary-container/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-8 pt-16 pb-24 grid grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/90 text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                {t.badge}
              </span>
              <h1 className="mt-6 font-display-lg text-[64px] leading-[1.05] tracking-tight text-on-surface">
                {t.heroTitle}
                <span className="block italic text-primary">{t.heroAccent}</span>
              </h1>
              <p className="mt-6 max-w-xl font-body-lg text-[18px] leading-8 text-on-surface-variant">{t.heroBody}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/home" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-[0_0_28px_rgba(242,202,80,0.35)] hover:brightness-110 transition">
                  <span className="material-symbols-outlined">computer</span> {t.ctaComputer}
                </Link>
                <a href="#install" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-surface-container-high text-on-surface font-title-md text-title-md hover:bg-surface-container-highest transition">
                  <span className="material-symbols-outlined text-secondary">smartphone</span> {t.ctaPhone}
                </a>
                {installEvent && (
                  <button type="button" onClick={() => void installEvent.prompt().then(() => setInstallEvent(null))} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-primary font-title-md text-title-md hover:bg-surface-container transition">
                    <span className="material-symbols-outlined">install_desktop</span> {t.installComputer}
                  </button>
                )}
              </div>
              {config && config.signup_bonus > 0 && (
                <p className="mt-4 font-body-md text-body-md text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">toll</span> {t.freeCredits(config.signup_bonus)}
                </p>
              )}
              <div className="mt-10 max-w-md">
                <QrCard title={t.qrTitle} body={t.qrBody} />
              </div>
            </div>
            <div className="relative flex justify-center">
              <HeroPhone alt={t.features[0].title} />
              <span className="absolute top-[43%] -left-14 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-container-high/95 shadow-xl font-label-lg text-label-lg text-on-surface ring-1 ring-secondary/30">
                <span className="material-symbols-outlined text-secondary">graphic_eq</span> {t.chipVoice}
              </span>
              <span className="absolute top-[36%] -right-16 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-container-high/95 shadow-xl font-label-lg text-label-lg text-on-surface ring-1 ring-primary/30">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> {t.chipPandit}
              </span>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-surface-container-high/60 bg-surface-container-low/50">
          <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-4 gap-6">
            {t.trust.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </span>
                <div>
                  <p className="font-title-md text-title-md text-on-surface">{item.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-8 py-24 scroll-mt-20" aria-labelledby="features-title">
          <SectionHeading id="features-title" eyebrow={t.featuresEyebrow} title={t.featuresTitle} body={t.featuresBody} />
          <div className="space-y-24">
            {t.features.map((feature, index) => {
              const link = FEATURE_LINKS[feature.key];
              return (
                <article key={feature.key} className={`grid grid-cols-2 gap-16 items-center ${index % 2 ? "[&>*:first-child]:order-2" : ""}`}>
                  <div className="flex justify-center">
                    <PhoneFrame src={link.image} alt={feature.title} className="w-[270px]" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 font-label-md text-label-md text-primary uppercase tracking-widest">
                      <span className="material-symbols-outlined text-lg">{link.icon}</span> {feature.eyebrow}
                    </span>
                    <h3 className="mt-3 font-headline-lg text-headline-lg text-on-surface tracking-tight">{feature.title}</h3>
                    <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant">{feature.body}</p>
                    <ul className="mt-6 space-y-3">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 font-body-lg text-body-lg text-on-surface">
                          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link to={link.to} className="mt-7 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition">
                      {t.tryIt} <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-surface-container-low/60 py-24 scroll-mt-20" aria-labelledby="how-title">
          <div className="max-w-6xl mx-auto px-8">
            <SectionHeading id="how-title" eyebrow={t.howEyebrow} title={t.howTitle} />
            <ol className="grid grid-cols-3 gap-6">
              {t.steps.map((step, index) => (
                <li key={step.title} className="relative rounded-2xl bg-surface-container p-8 shadow-lg">
                  <span className="absolute top-6 right-6 font-display-lg text-[56px] leading-none text-on-surface-variant/15">{index + 1}</span>
                  <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-container to-primary-container text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </span>
                  <h3 className="mt-6 font-headline-sm text-headline-sm text-on-surface">{step.title}</h3>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Languages */}
        <section id="languages" className="max-w-6xl mx-auto px-8 py-24 scroll-mt-20" aria-labelledby="languages-title">
          <SectionHeading id="languages-title" eyebrow={t.langEyebrow} title={t.langTitle} body={t.langBody} />
          <div className="grid grid-cols-4 gap-5">
            {LANGUAGES.map((language) => (
              <div key={language.code} lang={language.htmlLang} className="rounded-2xl bg-surface-container p-6 shadow-lg ring-1 ring-surface-container-highest">
                <p className="font-headline-md text-headline-md text-primary">{language.name}</p>
                <div className="mt-4 rounded-2xl rounded-tl-sm bg-surface-container-high p-4">
                  <p className="font-body-md text-body-md text-on-surface">{t.langSamples[language.code]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Install on a phone */}
        <section id="install" className="relative py-24 scroll-mt-20 overflow-hidden" aria-labelledby="install-title">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/30 via-surface-container-lowest to-surface-container-lowest pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-8 grid grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">{t.installEyebrow}</span>
              <h2 id="install-title" className="mt-4 font-headline-lg text-headline-lg text-on-surface tracking-tight">{t.installTitle}</h2>
              <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant">{t.installBody}</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ["android", t.android, t.androidSteps],
                  ["phone_iphone", t.iphone, t.iphoneSteps],
                ].map(([icon, title, steps]) => (
                  <div key={title} className="rounded-2xl bg-surface-container p-5">
                    <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                    <p className="mt-2 font-title-md text-title-md text-on-surface">{title}</p>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{steps}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 font-body-md text-body-md text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined">wifi_off</span> {t.noStore}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <QrCard title={t.qrTitle} body={t.qrBody} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto px-8 py-24 scroll-mt-20" aria-labelledby="faq-title">
          <SectionHeading id="faq-title" eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className="space-y-3">
            {t.faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-surface-container p-5 open:ring-1 open:ring-primary/30">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-title-md text-title-md text-on-surface">
                  {faq.q}
                  <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final call to action */}
        <section className="max-w-6xl mx-auto px-8 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-container/60 via-surface-container to-surface-container-high p-12 text-center shadow-2xl">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <h2 className="relative font-headline-lg text-headline-lg text-on-surface tracking-tight">{t.finalTitle}</h2>
            <p className="relative mt-2 font-body-lg text-body-lg text-on-surface-variant">{t.finalBody}</p>
            <div className="relative mt-8 flex justify-center gap-3">
              <Link to="/home" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-[0_0_28px_rgba(242,202,80,0.35)] hover:brightness-110 transition">
                <span className="material-symbols-outlined">auto_awesome</span> {t.ctaComputer}
              </Link>
              <a href="#install" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-surface-container-lowest/60 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest transition">
                <span className="material-symbols-outlined text-secondary">smartphone</span> {t.ctaPhone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-container-high/60">
        <div className="max-w-6xl mx-auto px-8 py-10 flex items-start justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <img src="/images/zodiak-logo.jpg" alt="" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-headline-sm text-headline-sm tracking-wider text-primary font-bold">ZODIAK</span>
            </div>
            <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">{t.disclaimer}</p>
          </div>
          <div className="text-right font-body-sm text-body-sm text-on-surface-variant">
            <p>{t.madeIn}</p>
            <p className="mt-1">© {new Date().getFullYear()} Zodiak</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
