export default function KundliPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl space-y-space-lg">
        {/* Kundli Header Card & Seeker Identity */}
        <section className="relative rounded-xl overflow-hidden bg-surface-container-high/60 backdrop-blur-xl p-space-lg shadow-xl shadow-secondary-container/10">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest/80 text-primary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">Vedic Precision • Lahiri Ayanamsha</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button aria-label="Bookmark Chart" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors" id="save-kundli-btn">
                  <span className="material-symbols-outlined text-lg">bookmark_border</span>
                </button>
                <button aria-label="Share Chart" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors" id="share-kundli-btn">
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
              </div>
            </div>
            <div className="pt-1">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">Ananya Sharma’s Kundli</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span className="">Born 14 Oct 1996 • 06:42 AM</span>
                <span className="">•</span>
                <span className="">New Delhi, IN</span>
              </p>
            </div>
            {/* Astrological Key Trio Pill row */}
            <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/70">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Ascendant</span>
                <span className="font-title-md text-title-md text-primary font-bold">Tula (Libra)</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Lagna 14°22'</span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/70">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nakshatra</span>
                <span className="font-title-md text-title-md text-tertiary font-bold">Swati</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Pada 3 • Rahu</span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/70">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Moon Sign</span>
                <span className="font-title-md text-title-md text-primary font-bold">Mesha (Aries)</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Chandra 02°11'</span>
              </div>
            </div>
          </div>
        </section>
        {/* Interactive Vedic Kundli Chart (North Indian Diamond Layout) */}
        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">blur_on</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Lagna Kundli (D1)</h2>
            </div>
            {/* Chart System Selector Switcher */}
            <div className="inline-flex p-1 rounded-full bg-surface-container">
              <button className="px-3 py-1 rounded-full text-on-primary bg-primary font-label-sm text-label-sm font-semibold transition-all shadow-sm">
                North
              </button>
              <button className="px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-all">South</button>
            </div>
          </div>
          {/* North Indian Sacred Geometry SVG Kundli Chart */}
          <div className="relative w-full aspect-square rounded-xl bg-surface-container-high/80 p-3 shadow-2xl shadow-surface-container-lowest flex items-center justify-center overflow-hidden">
            {/* Ambient subtle background celestial glyph */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-primary/20 blur-2xl" />
            </div>
            <svg className="w-full h-full max-w-[360px] drop-shadow-md select-none" viewBox="0 0 400 400">
              <defs>
                <radialGradient cx="50%" cy="50%" id="centralGlow" r="50%">
                  <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#101221" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Outer Boundary Square */}
              <rect fill="#14172a" fillOpacity="0.8" height="380" stroke="#d4af37" strokeOpacity="0.6" strokeWidth="1.8" width="380" x="10" y="10" />
              <rect fill="none" height="372" stroke="#d0bcff" strokeDasharray="3,3" strokeOpacity="0.25" strokeWidth="0.75" width="372" x="14" y="14" />
              {/* Main Diagonals creating the traditional Vedic North geometry */}
              <line stroke="#d4af37" strokeOpacity="0.5" strokeWidth="1.2" x1="10" x2="390" y1="10" y2="390" />
              <line stroke="#d4af37" strokeOpacity="0.5" strokeWidth="1.2" x1="390" x2="10" y1="10" y2="390" />
              {/* Center Inverted Diamond (Houses 1, 4, 7, 10 - Kendra Sthanas) */}
              <polygon fill="#1b1e36" fillOpacity="0.85" points="200,10 390,200 200,390 10,200" stroke="#f2ca50" strokeWidth="1.5" />
              {/* Central lagna sacred point subtle circle */}
              <circle cx="200" cy="200" fill="url(#centralGlow)" r="42" stroke="#d4af37" strokeDasharray="2,2" strokeOpacity="0.7" strokeWidth="0.8" />
              <circle cx="200" cy="200" fill="#f2ca50" r="3" />
              {/* House Numbers (Roman / Devanagari numerals) */}
              {/* House 1 (Top Center Diamond) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="200" y="85">I • 7</text>
              <g transform="translate(200, 125)">
                <text fill="#f2ca50" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700" textAnchor="middle">Su • 28°</text>
                <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" y="16">Me 04° (R)</text>
              </g>
              {/* House 2 (Top Left Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="125" y="45">II • 8</text>
              <text fill="#e1e1f5" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" textAnchor="middle" x="110" y="75">Ve 19°</text>
              {/* House 3 (Left Top Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="50" y="115">III • 9</text>
              <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="65" y="145">Ju 12°</text>
              {/* House 4 (Left Center Diamond) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="95" y="200">IV • 10</text>
              <g transform="translate(130, 202)">
                <text fill="#ffb4ab" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700" textAnchor="middle">Ma 18°</text>
                <text fill="#f2ca50" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" textAnchor="middle" y="14">Exalted</text>
              </g>
              {/* House 5 (Left Bottom Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="50" y="295">V • 11</text>
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="70" y="265">—</text>
              {/* House 6 (Bottom Left Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="125" y="365">VI • 12</text>
              <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" textAnchor="middle" x="115" y="335">Ke 24°</text>
              {/* House 7 (Bottom Center Diamond) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="200" y="325">
                VII • 1
              </text>
              <g transform="translate(200, 265)">
                <text fill="#f2ca50" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700" textAnchor="middle">Mo 02°</text>
                <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" textAnchor="middle" y="14">Swati • P3</text>
              </g>
              {/* House 8 (Bottom Right Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="275" y="365">VIII • 2</text>
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="285" y="335">—</text>
              {/* House 9 (Right Bottom Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="350" y="295">IX • 3</text>
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="330" y="265">—</text>
              {/* House 10 (Right Center Diamond) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="305" y="200">X • 4</text>
              <g transform="translate(270, 202)">
                <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700" textAnchor="middle">Sa 08°</text>
                <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" textAnchor="middle" y="14">Pushya</text>
              </g>
              {/* House 11 (Right Top Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="350" y="115">XI • 5</text>
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="330" y="145">—</text>
              {/* House 12 (Top Right Triangle) */}
              <text fill="#99907c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" textAnchor="middle" x="275" y="45">XII • 6</text>
              <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" textAnchor="middle" x="285" y="75">Ra 24°</text>
            </svg>
          </div>
          {/* Chart Quick Legend / Navigation Hint */}
          <div className="flex items-center justify-between px-space-xs text-on-surface-variant">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {" Kendra (1,4,7,10)"}
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {" Trikona (1,5,9)"}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary">Tap house to inspect</span>
          </div>
        </section>
        {/* Sun, Moon & Ascendant Deep Dive Trio */}
        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Cosmic Trinity (Lagna • Surya • Chandra)</h2>
          </div>
          <div className="grid grid-cols-1 gap-space-sm">
            {/* Lagna / Ascendant Card */}
            <div className="p-space-md rounded-xl bg-surface-container/70 shadow-lg relative overflow-hidden flex flex-col space-y-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-secondary-container/40 text-secondary-fixed flex items-center justify-center font-bold text-sm">
                    ASC
                  </span>
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Libra Lagna (Tula)</h3>
                    <p className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">Soul Vessel • House 1</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">
                  Venus Ruled
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Naturally seeks harmony, diplomatic balance, and visual refinement. You radiate an effortless charisma and instinctual fairness, though major crossroads may tempt you toward over-deliberation.
              </p>
            </div>
            {/* Chandra / Moon Card */}
            <div className="p-space-md rounded-xl bg-surface-container/70 shadow-lg relative overflow-hidden flex flex-col space-y-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                  </span>
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Aries Moon (Mesha)</h3>
                    <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider">Mind & Emotion • House 7</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">Mars Ruled</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Emotional initiator with quick instincts, raw vitality, and courage. Your inner child acts with decisive clarity, balancing the cerebral diplomacies of your Libra ascendant.
              </p>
            </div>
            {/* Surya / Sun Card */}
            <div className="p-space-md rounded-xl bg-surface-container/70 shadow-lg relative overflow-hidden flex flex-col space-y-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-surface-tint/20 text-surface-tint flex items-center justify-center font-bold text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>sunny</span>
                  </span>
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Virgo Sun (Kanya)</h3>
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Ego & Destiny • House 12</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  Mercury Ruled
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Endowed with analytical precision, profound discernment, and service-oriented consciousness. Finds transcendent order in chaos through rigorous self-refinement.
              </p>
            </div>
          </div>
        </section>
        {/* AI Astrologer Synthesis Capsule */}
        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">hourglass_empty</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Vimshottari Dasha Cycles</h2>
            </div>
            <div className="inline-flex p-1 rounded-full bg-surface-container text-xs">
              <button className="px-2.5 py-1 rounded-full text-on-primary bg-primary font-label-sm text-label-sm font-semibold transition-all shadow-sm" id="dasha-active-toggle">
                Active Period
              </button>
              <button className="px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-all" id="dasha-full-toggle">
                120-Yr Macro
              </button>
            </div>
          </div>
          {/* Primary Mahadasha Hero Capsule */}
          <div className="relative rounded-xl p-space-md bg-gradient-to-br from-surface-container-high via-surface-container to-secondary-container/30 shadow-xl overflow-hidden flex flex-col space-y-space-sm border border-primary/20">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shadow-md shrink-0">
                  <span className="material-symbols-outlined text-2xl">temple_buddhist</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Guru Mahadasha</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-bold uppercase tracking-wider">Active 16-Yr</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Jupiter Ruler • Nov 2018 – Nov 2034</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider block">Vitality</span>
                {" "}
                <span className="font-title-md text-title-md text-primary font-bold">86% Auspicious</span>
              </div>
            </div>
            {/* Mahadasha Cycle Progress Gauge */}
            <div className="relative z-10 pt-1 flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label-sm">
                <span className="text-on-surface-variant">
                  {"Cycle Elapsed: "}
                  <strong className="text-primary font-semibold">6y 1m (38%)</strong>
                </span>
                <span className="text-secondary-fixed-dim">9y 11m Remaining</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden p-0.5 border border-surface-container-highest/60">
                <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary" style={{ width: "38%" }} />
              </div>
            </div>
          </div>
          {/* Hierarchical Drill-Down Accordion / Level 1: Current Antardasha Breakdown */}
          <div className="rounded-xl bg-surface-container/70 shadow-lg p-space-md flex flex-col space-y-space-sm border border-secondary-container/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">Sub-Cycle • Level 1 Antardasha</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold shadow-sm">CURRENT PERIOD</span>
            </div>
            {/* Current Antardasha Identity Card */}
            <div className="p-3 rounded-lg bg-surface-container-high/80 flex flex-col space-y-2 border border-primary/25">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-secondary-container/50 text-secondary-fixed flex items-center justify-center font-bold text-xs">
                    <span className="material-symbols-outlined text-base">north</span>
                  </span>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold">Jupiter - Rahu (Guru-Rahu)</h4>
                    <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Jul 2023 – Dec 2025 (2 Years 4 Months)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-xs text-secondary font-medium">12th House Axis</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Stimulates deep karmic realignment, foreign connections, and unconventional ventures. Rahu induces ambition while Jupiter anchors wisdom, navigating the sacred Guru-Chandal shadow axis.
              </p>
            </div>
            {/* Antardasha Horizontal Timeline Segment Pills */}
            <div className="flex flex-col space-y-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant/80 uppercase tracking-wider">Mahadasha Sequence Flow</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-surface-container-lowest/80 text-left border border-surface-container-highest/40 flex flex-col opacity-60">
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Guru-Guru</span>
                  <span className="font-title-sm text-xs font-semibold text-on-surface">Completed</span>
                  <span className="text-[10px] text-outline mt-0.5">2018–2021</span>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-left border border-primary/50 flex flex-col">
                  <span className="font-label-sm text-[10px] text-primary font-bold">Guru-Rahu</span>
                  <span className="font-title-sm text-xs font-bold text-primary">Active Now</span>
                  <span className="text-[10px] text-primary-fixed-dim mt-0.5">2023–2025</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest/80 text-left border border-surface-container-highest/40 flex flex-col">
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Guru-Shani</span>
                  <span className="font-title-sm text-xs font-semibold text-on-surface">Upcoming</span>
                  <span className="text-[10px] text-secondary-fixed-dim mt-0.5">2025–2028</span>
                </div>
              </div>
            </div>
            {/* Level 2: Pratyantardasha (Sub-Sub Period) Micro-Timeline */}
            <div className="mt-2 pt-space-xs border-t border-surface-container-highest/40 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-fixed">
                  Level 2 • Pratyantardasha Micro-Transit
                </span>
                <span className="font-label-sm text-xs text-outline">Under Rahu Antar</span>
              </div>
              <div className="space-y-1.5">
                {/* Active Pratyantardasha */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60 border-l-2 border-primary text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">radio_button_checked</span>
                    <div>
                      <strong className="text-primary font-semibold">Mercury (Budh) Pratyantar</strong>
                      <p className="text-[11px] text-on-surface-variant">Oct 2024 – Feb 2025 • Favorable contracts & mental agility</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary">CURRENT</span>
                </div>
                {/* Upcoming Pratyantardasha 1 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest/60 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-sm">radio_button_unchecked</span>
                    <div>
                      <span className="text-on-surface font-medium">Ketu Pratyantar</span>
                      <p className="text-[11px] text-on-surface-variant/80">Feb 2025 – Apr 2025 • Introspective spiritual retreat</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-outline">Next</span>
                </div>
                {/* Upcoming Pratyantardasha 2 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest/60 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-sm">radio_button_unchecked</span>
                    <div>
                      <span className="text-on-surface font-medium">Venus (Shukra) Pratyantar</span>
                      <p className="text-[11px] text-on-surface-variant/80">Apr 2025 – Sep 2025 • Creative expansion & harmony</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-outline">Upcoming</span>
                </div>
              </div>
            </div>
            {/* Karmic Influence & Remedial Alignment Box */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-surface-container-highest/80 via-surface-container-high to-secondary-container/20 border border-primary/20 flex flex-col space-y-1.5">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">shield_with_heart</span>
                <span className="">Karmic Remedy & Alignment</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {"To balance the high friction between Devaguru Jupiter and shadow Rahu, recite the "}
                <strong className="text-primary">Brihaspati Gayatri Mantra</strong>
                {" on Thursdays and energize the throat chakra with pure unheated "}
                <strong className="text-primary">Yellow Sapphire (Pukhraj)</strong>
                {" or yellow topaz."}
              </p>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-secondary-fixed flex items-center gap-1 font-label-sm">
                  <span className="material-symbols-outlined text-sm">spa</span>
                  {" 108 Japa cycles recommended"}
                </span>
                <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline font-label-sm">
                  <span className="">Explore Certified Gems</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Planetary Positions Data Table */}
        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">table_chart</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Graha Positions</h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">9 Vedic Planets</span>
          </div>
          {/* Dense Responsive Table Container */}
          <div className="w-full overflow-x-auto rounded-xl bg-surface-container/60 shadow-md">
            <table className="w-full text-left border-collapse min-w-[340px]">
              <thead>
                <tr className="bg-surface-container-highest/60 text-on-surface-variant">
                  <th className="py-2.5 px-3 font-label-sm text-label-sm font-bold uppercase tracking-wider">Graha</th>
                  <th className="py-2.5 px-2 font-label-sm text-label-sm font-bold uppercase tracking-wider">Sign</th>
                  <th className="py-2.5 px-2 font-label-sm text-label-sm font-bold uppercase tracking-wider">Deg</th>
                  <th className="py-2.5 px-2 font-label-sm text-label-sm font-bold uppercase tracking-wider">Nakshatra</th>
                  <th className="py-2.5 px-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/20 font-body-sm text-body-sm">
                {/* Sun */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">sunny</span>
                    {" Surya (Su)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Virgo</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">28°14'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Chitra</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">Neutral</span>
                  </td>
                </tr>
                {/* Moon */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">bedtime</span>
                    {" Chandra (Mo)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Aries</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">02°11'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Ashwini</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">Friendly</span>
                  </td>
                </tr>
                {/* Mars */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-error flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">shield</span>
                    {" Mangal (Ma)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Capricorn</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">18°42'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Shravana</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-highest text-primary">Exalted (Uchha)</span>
                  </td>
                </tr>
                {/* Mercury */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">psychology</span>
                    {" Budh (Me)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Virgo</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">04°05'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Uttara Phalguni</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-container/40 text-secondary">Retro (Vakri)</span>
                  </td>
                </tr>
                {/* Jupiter */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">temple_buddhist</span>
                    {" Guru (Ju)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Sagittarius</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">12°38'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Moola</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary-fixed">Own House</span>
                  </td>
                </tr>
                {/* Venus */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-tertiary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">diamond</span>
                    {" Shukra (Ve)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Scorpio</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">19°10'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Jyeshtha</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">Neutral</span>
                  </td>
                </tr>
                {/* Saturn */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">hourglass_top</span>
                    {" Shani (Sa)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Cancer</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">08°55'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Pushya</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">Enemy Sign</span>
                  </td>
                </tr>
                {/* Rahu */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-secondary-fixed-dim flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">north</span>
                    {" Rahu (Ra)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Virgo</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">24°19'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Chitra</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">Shadow Node</span>
                  </td>
                </tr>
                {/* Ketu */}
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-secondary-fixed-dim flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">south</span>
                    {" Ketu (Ke)"}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface">Pisces</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">24°19'</td>
                  <td className="py-2.5 px-2 text-on-surface-variant">Revati</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">Moksha Node</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* Editorial Visual Inspiration: Astrolabe Emblem Graphic Card */}
        <section className="relative rounded-xl overflow-hidden bg-surface-container-high/40 p-space-md shadow-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-lowest">
              <img className="w-full h-full object-cover" data-alt="A sacred brass astrolabe emblem engraved with delicate zodiac constellations and celestial star charts on dark velvet black obsidian background with golden mystical starlight illumination, luxury esoteric editorial photography" src="/images/astrolabe-emblem.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Vedic Consecration</span>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">Calculated with Astrolabe Rigor</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Charts are mapped utilizing real-time Swiss Ephemeris data cross-checked by certified Varanasi pandits.
              </p>
            </div>
          </div>
        </section>
        {/* Action CTA Banners (Commercial Conversion Modules) */}
        <section className="flex flex-col space-y-space-md pt-space-xs">
          {/* CTA 1: 45-Page Kundli PDF (₹49) */}
          <div className="relative rounded-xl p-space-md bg-surface-container-high/90 shadow-xl overflow-hidden flex flex-col space-y-space-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  {" Instant Digital Download"}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">45-Page Detailed Kundli Dossier</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Complete Sade Sati analysis, 120-year Vimshottari Mahadasha timeline & personalized gemstone remedy matrix.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">₹49</span>
                {" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant ml-1 line-through">₹249</span>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5" id="unlock-pdf-btn">
                <span className="">Unlock Full PDF</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
          {/* CTA 2: Luxury Hard-Bound Printed Kundli (₹299) */}
          <div className="relative rounded-xl p-space-md bg-gradient-to-br from-surface-container-highest via-surface-container-high to-secondary-container/40 shadow-2xl overflow-hidden flex flex-col space-y-space-sm">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                ✦ Collector's Heirloom Edition
              </span>
              <span className="font-label-sm text-label-sm text-secondary-fixed">Free Consecration</span>
            </div>
            <div className="flex gap-space-sm items-center">
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest shadow-md">
                <img className="w-full h-full object-cover" data-alt="A luxury hardcover astrological book in deep midnight blue leather with opulent 24k gold foil embossed celestial geometry and sacred yantra on cover, nestled inside a plush velvet presentation gift box with gold ribbon" src="/images/hardbound-kundli.jpg" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Hard-Bound Velvet Box Edition</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Hand-stitched in gold-embossed midnight velvet with personalized calligraphy and energized yantra card.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">₹299</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant line-through">₹899</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Includes pan-India insured shipping</span>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold shadow-lg hover:bg-surface-container transition-all flex items-center gap-1.5 active:scale-95" id="order-luxury-btn">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
                <span className="">Order Luxury Copy</span>
              </button>
            </div>
          </div>
        </section>
        {/* Toast Notification Container for Micro-delight */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 transition-opacity duration-300 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-2xl flex items-center gap-2" id="toast-delight">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span id="toast-message" className="">Chart link copied to clipboard!</span>
        </div>
      </div>
    </main>
    </>
  );
}
