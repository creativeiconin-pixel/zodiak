export default function BirthDetailsPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full bg-surface-container-lowest">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl">
        {/* Subtle Celestial Astrolabe Header Motif */}
        <div className="relative w-full flex flex-col items-center pt-space-md pb-space-sm overflow-hidden">
          {/* Ambient Gold/Violet Glow */}
          <div className="absolute -top-12 w-48 h-48 rounded-full bg-secondary-container/25 blur-3xl pointer-events-none" />
          <div className="absolute top-2 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          {/* Stylized Astronomical Coordinate Ring */}
          <div className="relative w-16 h-16 mb-space-sm flex items-center justify-center">
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" opacity="0.6" r="46" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.8" />
              <circle cx="50" cy="50" opacity="0.4" r="38" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" opacity="0.85" r="28" stroke="currentColor" strokeWidth="1.2" />
              <line opacity="0.5" stroke="currentColor" strokeWidth="0.6" x1="50" x2="50" y1="4" y2="96" />
              <line opacity="0.5" stroke="currentColor" strokeWidth="0.6" x1="4" x2="96" y1="50" y2="50" />
              <circle cx="50" cy="12" fill="currentColor" r="2" />
              <circle cx="50" cy="88" fill="currentColor" r="2" />
              <circle cx="12" cy="50" fill="currentColor" r="2" />
              <circle cx="88" cy="50" fill="currentColor" r="2" />
              <path d="M50 32 L53 47 L68 50 L53 53 L50 68 L47 53 L32 50 L47 47 Z" fill="currentColor" />
            </svg>
          </div>
          {/* Stepper & Badges */}
          <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-space-xs">
            <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-primary uppercase tracking-widest">Step 1 of 2 : Celestial Coordinates</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center tracking-tight">Calculate Your Birth Chart</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center max-w-xs mt-1">
            Vedic precision anchored by algorithmic planetary ephemeris
          </p>
        </div>
        {/* Informational Vedic Trust Banner */}
        <div className="w-full mt-space-sm p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md relative overflow-hidden flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-primary font-semibold">Exact Astrometric Requirement</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              Vedic astrology requires exact time and location for precise Lagna (Ascendant) and planetary degrees.
            </p>
          </div>
        </div>
        {/* Form Fields Container */}
        <div className="w-full mt-space-md flex flex-col gap-space-md">
          {/* Field 1: Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="fullName">
              <span>Full Name</span>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Required</span>
            </label>
            <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">account_circle</span>
              <input className="w-full py-3.5 pl-11 pr-4 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none rounded-xl" id="fullName" placeholder="e.g. Ananya Sharma" type="text" defaultValue="Ananya Sharma" />
            </div>
          </div>
          {/* Field 2: Gender Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
              <span>Gender at Birth</span>
              <span className="font-label-sm text-on-surface-variant">Influences Dasha Interpretations</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-surface-container-low" id="genderGroup">
              <button className="gender-btn active py-2.5 px-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all bg-primary-container text-on-primary font-semibold shadow-sm" data-gender="female" type="button">
                <span className="material-symbols-outlined text-[16px]">female</span>
                <span>Female</span>
              </button>
              <button className="gender-btn py-2.5 px-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all text-on-surface-variant hover:text-on-surface bg-transparent" data-gender="male" type="button">
                <span className="material-symbols-outlined text-[16px]">male</span>
                <span>Male</span>
              </button>
              <button className="gender-btn py-2.5 px-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all text-on-surface-variant hover:text-on-surface bg-transparent" data-gender="other" type="button">
                <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
                <span className="truncate">Other</span>
              </button>
            </div>
          </div>
          {/* Field 3: Date of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="dobInput">Date of Birth</label>
              <span className="font-label-sm text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                {" Gregorian (Solar)"}
              </span>
            </div>
            <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">event</span>
              <input className="w-full py-3.5 pl-11 pr-11 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl" id="dobInput" type="text" defaultValue="14 October 1996" />
              <button className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" type="button">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </button>
            </div>
            {/* Mini Solar Nakshatra Preview Micro-card */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container-high/40">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Tithi & Nakshatra Calculation</span>
              <span className="font-label-sm text-primary font-medium tracking-wide">Swati Nakshatra (Libra)</span>
            </div>
          </div>
          {/* Field 4: Time of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="timeInput">Time of Birth</label>
              <span className="font-label-sm text-on-surface-variant">Local Standard Time (LST)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container transition-all">
                <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">schedule</span>
                <input className="w-full py-3.5 pl-11 pr-4 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl font-mono tracking-wider" id="timeInput" type="text" defaultValue="08:42" />
              </div>
              {/* AM/PM Segmented Pill */}
              <div className="flex items-center p-1 rounded-xl bg-surface-container-low shrink-0 h-full" id="ampmGroup">
                <button className="ampm-btn px-3.5 py-2.5 rounded-lg font-label-md text-label-md font-semibold transition-all bg-primary-container text-on-primary shadow-sm" data-ampm="AM" type="button">
                  AM
                </button>
                <button className="ampm-btn px-3.5 py-2.5 rounded-lg font-label-md text-label-md font-medium transition-all text-on-surface-variant hover:text-on-surface bg-transparent" data-ampm="PM" type="button">
                  PM
                </button>
              </div>
            </div>
            {/* Time Unknown Checkbox with Prashna Kundli Tooltip trigger */}
            <div className="mt-1 flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low/50 transition-colors cursor-pointer" id="unknownTimeToggle">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-surface-container-high shrink-0 mt-0.5" id="checkboxBox">
                <span className="material-symbols-outlined text-primary text-[16px] hidden" id="checkboxIcon">check</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-body-sm text-body-sm text-on-surface font-medium select-none">I do not know my exact birth time</span>
                  <button className="text-secondary hover:text-primary transition-colors flex items-center" id="prashnaInfoBtn" title="Learn about Horary Astrology" type="button">
                    <span className="material-symbols-outlined text-[15px]">help</span>
                  </button>
                </div>
                {/* Expandable Prashna Tooltip / Note */}
                <p className="font-body-sm text-body-sm text-on-surface-variant hidden mt-1.5 leading-snug p-2.5 rounded-lg bg-surface-container-high/80" id="prashnaTooltip">
                  <strong className="text-secondary font-semibold">Prashna Kundli (Horary):</strong>
                  {" When birth time is unknown, our algorithm utilizes the exact instant of query transmission to map planetary energies for your remedies."}
                </p>
              </div>
            </div>
          </div>
          {/* Field 5: Place of Birth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="placeInput">Place of Birth</label>
              <span className="font-label-sm text-on-surface-variant">Geo-Coordinates</span>
            </div>
            <div className="relative flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container transition-all">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px] pointer-events-none">location_on</span>
              <input className="w-full py-3.5 pl-11 pr-10 bg-transparent font-body-md text-body-md text-on-surface outline-none rounded-xl" id="placeInput" placeholder="City, State, Country" type="text" defaultValue="Bengaluru, Karnataka, India" />
              <span className="material-symbols-outlined absolute right-3 text-secondary text-[18px]">gps_fixed</span>
            </div>
            {/* Coordinates pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/40">
              <span className="material-symbols-outlined text-outline text-[14px]">explore</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">12.9716° N, 77.5946° E</span>
              <span className="ml-auto font-label-sm text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {" Ephemeris Locked"}
              </span>
            </div>
          </div>
        </div>
        {/* Astrological Chart Preview Card (Micro Sensory Delight) */}
        <div className="w-full mt-space-md p-space-md rounded-xl bg-gradient-to-br from-surface-container to-surface-container-low flex items-center gap-space-md shadow-lg">
          <div className="relative w-14 h-14 rounded-lg bg-surface-container-lowest shrink-0 flex items-center justify-center p-1">
            {/* Miniature Vedic Diamond Chart Graphic */}
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 40 40">
              <rect height="36" opacity="0.6" stroke="currentColor" strokeWidth="0.8" width="36" x="2" y="2" />
              <line opacity="0.4" stroke="currentColor" strokeWidth="0.8" x1="2" x2="38" y1="2" y2="38" />
              <line opacity="0.4" stroke="currentColor" strokeWidth="0.8" x1="38" x2="2" y1="2" y2="38" />
              <polygon opacity="0.9" points="20,2 38,20 20,38 2,20" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="20" cy="20" fill="currentColor" r="2.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm uppercase text-secondary font-semibold tracking-wider">Ayanamsa: Lahiri (Chitra Paksha)</span>
            </div>
            <p className="font-title-md text-title-md text-on-surface truncate mt-0.5">Vedic D-1 & D-9 Navamsha</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Configured for sidereal planetary longitudes</p>
          </div>
        </div>
        {/* Bottom CTA: Primary Radiant Gold Button */}
        <div className="w-full mt-space-lg flex flex-col gap-space-sm">
          <button className="relative w-full py-4 px-space-md rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden" id="submitChartBtn" type="button">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span>Generate Vedic Chart & Kundli</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          {/* Reassurance Footer */}
          <div className="flex items-center justify-center gap-2 pt-2 text-center">
            <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
            <p className="font-body-sm text-body-sm text-outline">Data stored securely under ISO/IEC privacy standards.</p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
