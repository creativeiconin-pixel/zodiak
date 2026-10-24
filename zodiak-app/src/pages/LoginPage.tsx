import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguagePicker } from "../components/LanguagePicker";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { loginText } from "../i18n/pages/login";
import { api, ApiError, type Seeker } from "../lib/api";
import { syncGuestProfile } from "../lib/birthProfile";
import { useSession } from "../lib/session";
import { useAsync } from "../lib/useAsync";
import { Reveal } from "../components/motion/Reveal";

const inputClass =
  "w-full bg-surface-container-lowest/80 rounded-lg py-3.5 px-4 font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary";

export default function LoginPage() {
  const t = useT(loginText);
  const names = useT(common);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setSeeker } = useSession();
  // New visitors most often need an account; "Log in" buttons pass ?mode=login
  const wantsSignup = params.get("mode") !== "login";
  const { data: appConfig } = useAsync(api.appConfig);
  const phoneAvailable = appConfig?.phone_login ?? true;
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [devCode, setDevCode] = useState<string>();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(wantsSignup);
  const [noAccount, setNoAccount] = useState(false);
  const bonus = appConfig?.signup_bonus ?? 0;
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const fullPhone = `+91 ${phone.replace(/\D/g, "")}`;

  // Without SMS or demo OTP, phone sign-in can't work: open straight on email sign-up
  useEffect(() => {
    if (appConfig && !appConfig.phone_login) {
      setMethod("email");
      setRegistering(true);
    }
  }, [appConfig]);

  async function finish(seeker: Seeker) {
    const synced = await syncGuestProfile(seeker).catch(() => seeker);
    setSeeker({ ...synced, welcomeCredits: seeker.welcomeCredits });
    navigate(params.get("next") ?? (synced.birth ? "/" : "/birth-details"), { replace: true });
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(undefined);
    try {
      await action();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 0 ? names.serverDown : (Object.values(err.errors)[0]?.[0] ?? err.message));
      } else {
        setError(names.serverDown);
      }
    } finally {
      setBusy(false);
    }
  }

  function chooseMode(signup: boolean) {
    setRegistering(signup);
    setError(undefined);
    setNoAccount(false);
    setCodeSent(false);
    setCode("");
  }

  function sendCode(event?: FormEvent) {
    event?.preventDefault();
    if (registering && method === "phone" && !name.trim()) return setError(t.nameNeeded);
    if (phone.replace(/\D/g, "").length !== 10) return setError(t.badPhone);
    void run(async () => {
      const response = await api.requestOtp(fullPhone);
      setDevCode(response.debug_code);
      if (response.debug_code) setCode(response.debug_code); // OTP is made and filled in for them: one tap to finish
      setCodeSent(true);
    });
  }

  function verify(event: FormEvent) {
    event.preventDefault();
    setNoAccount(false);
    void run(async () => {
      try {
        await finish(await api.verifyOtp(fullPhone, code, registering ? name.trim() : undefined, registering ? "signup" : "login"));
      } catch (err) {
        // Logging in with a number that has no account: offer to sign up instead
        if (!registering && err instanceof ApiError && err.field("phone")) setNoAccount(true);
        throw err;
      }
    });
  }

  function emailSubmit(event: FormEvent) {
    event.preventDefault();
    void run(async () => finish(registering ? await api.register(name.trim(), email, password) : await api.login(email, password)));
  }

  const tab = (active: boolean) =>
    `flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-1.5 ${
      active ? "bg-surface-container-high text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
    }`;

  const primaryButton =
    "sheen w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-[0_0_24px_rgba(242,202,80,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60";

  return (
    <main className="flex-1 flex flex-col relative w-full">
      <div className="flex flex-col w-full relative px-margin-mobile pb-space-xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-secondary-container/20 rounded-full blur-[80px] pointer-events-none -z-10 animate-fade-in [animation-duration:1200ms]" />
        <div className="flex justify-end pt-space-sm">
          <LanguagePicker />
        </div>
        {/* Brand & Emblem */}
        <div className="flex flex-col items-center text-center mb-space-lg" data-stagger="in">
          <div className="relative w-24 h-24 mb-space-sm flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-glow" />
            <img alt="Zodiak" className="w-20 h-20 rounded-xl object-cover drop-shadow-[0_0_16px_rgba(242,202,80,0.35)] relative z-10 animate-float" src="/images/zodiak-logo.jpg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-space-xs shadow-sm">
            <span className="material-symbols-outlined text-primary text-[14px] animate-twinkle" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-[0.18em]">{t.badge}</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 tracking-tight">{t.title}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[300px]">{t.subtitle}</p>
        </div>
        {/* Auth Card */}
        <div className="animate-rise [animation-delay:300ms] w-full bg-surface-container/70 backdrop-blur-xl rounded-xl p-space-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-container/60 to-transparent" />
          {/* New or returning: the first choice on the page */}
          <div className="grid grid-cols-2 gap-2 mb-space-sm" role="group">
            {[true, false].map((isNew) => (
              <button
                key={String(isNew)}
                type="button"
                aria-pressed={registering === isNew}
                onClick={() => chooseMode(isNew)}
                className={`tap-scale py-3 rounded-lg font-title-md text-title-md font-bold flex items-center justify-center gap-1.5 transition-colors ${registering === isNew ? "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-md" : "bg-surface-container-lowest/80 text-on-surface-variant"}`}
              >
                <span className="material-symbols-outlined text-[20px]">{isNew ? "person_add" : "login"}</span>
                {isNew ? t.modeSignup : t.modeLogin}
              </button>
            ))}
          </div>
          {registering && bonus > 0 ? (
            <p key="offer" className="animate-scale-in mb-space-md flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-2.5 font-label-lg text-label-lg text-primary font-semibold">
              <span className="material-symbols-outlined text-xl animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
              {t.offer(bonus)}
            </p>
          ) : (
            <p key="lead" className="animate-fade-in mb-space-md font-body-sm text-body-sm text-on-surface-variant text-center">{registering ? t.signupLead : t.loginLead}</p>
          )}
          <div className="relative p-1 bg-surface-container-lowest/80 rounded-lg flex items-center mb-space-md shadow-inner" role="tablist">
            {phoneAvailable && (
              <button type="button" role="tab" aria-selected={method === "phone"} className={tab(method === "phone")} onClick={() => { setMethod("phone"); setError(undefined); }}>
                <span className="material-symbols-outlined text-[16px]">smartphone</span> {t.phoneTab}
              </button>
            )}
            <button type="button" role="tab" aria-selected={method === "email"} className={tab(method === "email")} onClick={() => { setMethod("email"); setError(undefined); }}>
              <span className="material-symbols-outlined text-[16px]">alternate_email</span> {t.emailTab}
            </button>
          </div>

          {method === "phone" && !codeSent && (
            <form className="animate-rise flex flex-col gap-space-md" onSubmit={sendCode} noValidate>
              {registering && (
                <div className="animate-rise flex flex-col gap-1.5">
                  <label htmlFor="otpName" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.nameLabel}</label>
                  <input id="otpName" className={inputClass} type="text" autoComplete="name" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                  <span>{t.mobile}</span>
                  <span className="text-secondary normal-case tracking-normal font-medium">{t.otpHint}</span>
                </label>
                <div className="flex gap-space-sm">
                  <span aria-label={t.country} className="shrink-0 whitespace-nowrap flex items-center gap-1 px-3 rounded-lg bg-surface-container-lowest/80 font-title-md text-title-md text-on-surface">🇮🇳 +91</span>
                  <input id="phone" className={inputClass} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={11} placeholder={t.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={busy} className={primaryButton}>
                {busy ? t.sending : t.getOtp} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          )}

          {method === "phone" && codeSent && (
            <form className="animate-rise flex flex-col gap-space-md" onSubmit={verify} noValidate>
              <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>{t.codeSentTo(fullPhone)}</span>
                <button type="button" className="text-primary font-semibold" onClick={() => { setCodeSent(false); setCode(""); setDevCode(undefined); }}>{t.changeNumber}</button>
              </div>
              {devCode && (
                <p className="animate-scale-in flex items-start gap-2 rounded-lg bg-secondary-container/30 px-3 py-2 font-label-md text-label-md text-on-surface" role="status">
                  <span className="material-symbols-outlined text-primary text-lg">key</span> {t.otpReady(devCode)}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="otp" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.codeLabel}</label>
                <input id="otp" className={`${inputClass} text-center tracking-[0.5em] font-mono`} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
              </div>
              <button type="submit" disabled={busy || code.length !== 6} className={primaryButton}>
                {busy ? t.verifying : registering ? t.verifySignup : t.verifyLogin} <span className="material-symbols-outlined">lock_open</span>
              </button>
              <button type="button" className="font-label-md text-label-md text-primary" onClick={() => sendCode()}>{t.resend}</button>
            </form>
          )}

          {method === "email" && (
            <form className="animate-rise flex flex-col gap-space-md" onSubmit={emailSubmit} noValidate>
              {registering && (
                <div className="animate-rise flex flex-col gap-1.5">
                  <label htmlFor="regName" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.nameLabel}</label>
                  <input id="regName" className={inputClass} type="text" autoComplete="name" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.email}</label>
                <input id="email" className={inputClass} type="email" autoComplete="email" placeholder="ananya@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.password}</label>
                <div className="relative">
                  <input id="password" className={`${inputClass} pr-12`} type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" aria-label={t.password} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" onClick={() => setShowPassword(!showPassword)}>
                    <span key={showPassword ? "hide" : "show"} className="material-symbols-outlined animate-pop-in">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <button type="submit" disabled={busy} className={primaryButton}>
                {registering ? t.createAccount : t.signInEmail} <span className="material-symbols-outlined">lock_open</span>
              </button>
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                {registering ? t.haveAccount : t.newHere}{" "}
                <button type="button" className="text-primary font-semibold" onClick={() => { setRegistering(!registering); setError(undefined); }}>
                  {registering ? t.signInInstead : t.signUp}
                </button>
              </p>
            </form>
          )}

          {error && (
            <div className="animate-scale-in mt-space-sm rounded-lg bg-error-container/20 p-2.5 font-body-sm text-body-sm text-error" role="alert">
              {error}
              {noAccount && (
                <button type="button" onClick={() => chooseMode(true)} className="tap-scale mt-2 w-full py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold">
                  {t.signupInstead}{bonus > 0 ? ` • +${bonus}` : ""}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-space-sm my-space-md">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{t.orWith}</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>
          <div className="flex flex-col gap-space-sm">
            {[t.google, t.apple].map((label, index) => (
              <button key={label} type="button" onClick={() => setError(t.socialSoon)} className="tap-scale w-full py-3 rounded-lg bg-surface-container-high text-on-surface font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined">{index === 0 ? "g_mobiledata" : "phone_iphone"}</span> {label}
              </button>
            ))}
          </div>
        </div>
        {/* Privacy capsule */}
        <Reveal className="mt-space-md flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">verified_user</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">{t.privacyTitle}</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.privacyBody}</p>
          </div>
        </Reveal>
        <p className="mt-space-md text-center font-label-sm text-label-sm text-outline uppercase tracking-wider">{t.footer}</p>
      </div>
    </main>
  );
}
