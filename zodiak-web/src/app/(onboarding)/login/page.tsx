export default function LoginPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full bg-surface-container-lowest">
      <div className="flex flex-col w-full relative px-margin-mobile pb-space-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-secondary-container/20 rounded-full blur-[80px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[90px] pointer-events-none -z-10" />
        {/* Cosmic Canvas Canvas/Particles (Dynamic) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-60" id="celestial-stars" />
        {/* Brand & Sacred Emblem Section */}
        <div className="flex flex-col items-center text-center mt-space-sm mb-space-lg">
          <div className="relative w-28 h-28 mb-space-sm flex items-center justify-center">
            {/* Ambient halo behind glyph */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <img alt="Zodiak Sacred Astrolabe Emblem" className="w-24 h-24 object-contain filter drop-shadow-[0_0_16px_rgba(242,202,80,0.35)] relative z-10" src="/images/zodiak-logo.jpg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-space-xs shadow-sm">
            <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-primary uppercase tracking-[0.18em]">Vedic Precision • AI Astrolabe</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 tracking-tight">Enter Your Cosmic Journey</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">
            Access your personalized Vedic birth chart and consecrated remedies.
          </p>
        </div>
        {/* Auth Card Component */}
        <div className="w-full bg-surface-container/70 backdrop-blur-xl rounded-xl p-space-md shadow-xl relative overflow-hidden">
          {/* Top gold foil hairline accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-container/60 to-transparent" />
          {/* Segmented Control (Phone / Email) */}
          <div className="relative p-1 bg-surface-container-lowest/80 rounded-lg flex items-center mb-space-md shadow-inner">
            <button className="flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all duration-300 bg-surface-container-high text-primary shadow-sm flex items-center justify-center gap-1.5" id="tab-phone" type="button">
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>Phone Number</span>
            </button>
            <button className="flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all duration-300 text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5" id="tab-email" type="button">
              <span className="material-symbols-outlined text-[16px]">alternate_email</span>
              <span>Email Address</span>
            </button>
          </div>
          {/* Form: Phone Method */}
          <div className="flex flex-col space-y-space-md transition-opacity duration-300" id="pane-phone">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                <span>Mobile Number</span>
                <span className="text-secondary font-body-sm normal-case lowercase text-[11px] opacity-80">Instant OTP login</span>
              </label>
              <div className="flex items-center gap-2">
                {/* Country Selector Dropdown Pill */}
                <div className="relative flex items-center bg-surface-container-lowest/90 rounded-lg px-2.5 py-3 shadow-inner">
                  <span className="text-base mr-1">🇮🇳</span>
                  <span className="font-title-md text-title-md text-on-surface">+91</span>
                  <span className="material-symbols-outlined text-outline text-[18px] ml-0.5">expand_more</span>
                </div>
                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <input className="w-full bg-surface-container-lowest/90 text-on-surface placeholder:text-outline/60 font-title-md text-title-md rounded-lg px-3.5 py-3 outline-none focus:ring-1 focus:ring-primary/60 transition-all shadow-inner" inputMode="numeric" maxLength={10} placeholder="98765 43210" type="tel" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">dialpad</span>
                </div>
              </div>
            </div>
            {/* Action Button */}
            <button className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2" type="button">
              <span>Send Celestial OTP</span>
              <span className="material-symbols-outlined text-[18px] font-bold">arrow_forward</span>
            </button>
          </div>
          {/* Form: Email Method (Hidden Initially) */}
          <div className="hidden flex-col space-y-space-md transition-opacity duration-300" id="pane-email">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input className="w-full bg-surface-container-lowest/90 text-on-surface placeholder:text-outline/60 font-body-md text-body-md rounded-lg pl-3.5 pr-10 py-3 outline-none focus:ring-1 focus:ring-primary/60 transition-all shadow-inner" placeholder="astral.seeker@vedic.com" type="email" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Secret Key (Password)</label>
                <a className="font-body-sm text-body-sm text-secondary hover:text-secondary-fixed transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <input className="w-full bg-surface-container-lowest/90 text-on-surface placeholder:text-outline/60 font-body-md text-body-md rounded-lg pl-3.5 pr-10 py-3 outline-none focus:ring-1 focus:ring-primary/60 transition-all shadow-inner" id="password-input" placeholder="••••••••••••" type="password" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface flex items-center" type="button">
                  <span className="material-symbols-outlined text-[20px]" id="password-icon">visibility</span>
                </button>
              </div>
            </div>
            {/* Action Button */}
            <button className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2" type="button">
              <span>Enter Kundli Vault</span>
              <span className="material-symbols-outlined text-[18px] font-bold">lock_open</span>
            </button>
          </div>
          {/* Divider */}
          <div className="flex items-center gap-3 my-space-md">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-outline-variant/50" />
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest text-[10px]">Or Align With</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-outline-variant/50" />
          </div>
          {/* Social Authentication Options */}
          <div className="flex flex-col gap-2.5">
            {/* Google Auth */}
            <button className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm group" type="button">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335" />
                <path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
                <path d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z" fill="#FBBC05" />
                <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z" fill="#34A853" />
              </svg>
              <span className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors">Continue with Google</span>
            </button>
            {/* Apple Auth */}
            <button className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm group" type="button">
              <svg className="w-4 h-4 fill-current text-on-surface group-hover:text-primary transition-colors" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.19-9.33-11.05-20.14-14.58-32.42-3.53-12.28-5.3-23.78-5.3-34.5 0-14.88 3.8-27.18 11.39-36.9 7.6-9.72 17.15-14.69 28.66-14.9 4.35 0 9.28 1.15 14.79 3.46 5.51 2.3 9.3 3.52 11.36 3.65 1.63-.25 5.68-1.57 12.16-3.95 6.47-2.38 11.66-3.41 15.56-3.1 11.45.86 20.76 5.3 27.93 13.32-9.97 6.08-14.83 14.49-14.58 25.23.25 8.46 3.42 15.56 9.5 21.32 6.09 5.76 13.34 9.17 21.75 10.23-2.17 6.52-4.67 13.1-7.51 19.74zM119.22 31.85c0-7.39 2.66-14.34 7.97-20.85 5.32-6.52 11.83-10.66 19.53-12.42.76 6.84-1.25 13.73-6.03 20.67-4.78 6.94-10.99 11.23-18.63 12.87-.76-.08-1.71-.17-2.84-.27z" />
              </svg>
              <span className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors">Continue with Apple</span>
            </button>
          </div>
        </div>
        {/* Sacred Trust & Encryption Capsule Badge */}
        <div className="mt-space-md flex flex-col items-center">
          <div className="w-full max-w-sm rounded-lg bg-surface-container-low/70 px-space-md py-space-sm flex items-center gap-3 shadow-sm backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">100% Private & Sanctified</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                Your celestial date, time, and coordinates are encrypted & never shared.
              </span>
            </div>
          </div>
          {/* Supplementary Astrological Footnote */}
          <div className="flex items-center gap-2 mt-space-md text-outline">
            <span className="material-symbols-outlined text-[14px]">bedtime</span>
            <span className="font-label-sm text-label-sm text-[11px] uppercase tracking-widest">Lahiri Ayanamsa • Parashara Systems</span>
            <span className="material-symbols-outlined text-[14px]">stars</span>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
