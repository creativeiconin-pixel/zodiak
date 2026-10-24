export default function PalmistryPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl gap-space-lg">
        {/* Header Module (Editorial Vedic Astrolabe Presence) */}
        <div className="flex flex-col gap-space-xs mt-space-sm">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-secondary-container/40 self-start backdrop-blur-md">
            <span className="material-symbols-outlined text-primary text-sm animate-spin" style={{ animationDuration: "9s" }}>neurology</span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Samudrika Shastra AI</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">AI Chiromancy & Palm Reading</h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Computer vision biometric line tracing mapped to classical Vedic planetary mounts and karmic vectors.
          </p>
        </div>
        {/* Interactive Palm Viewfinder HUD Card */}
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-container-high/60 backdrop-blur-2xl shadow-xl flex flex-col">
          {/* Astrological Reticle Accents */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
            <span className="material-symbols-outlined text-primary text-xs">filter_center_focus</span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">Biometric HUD v4.2</span>
          </div>
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="font-label-sm text-label-sm text-on-surface font-medium">99.4% Match</span>
          </div>
          {/* Scanning Viewport Container */}
          <div className="relative w-full h-[370px] flex items-center justify-center overflow-hidden bg-surface-container-lowest">
            {/* Human Palm Photo */}
            <img className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700" data-alt="Close up high resolution photograph of an open human palm held flat against a dark cosmic indigo background, displaying clear detailed palmistry lines including life line, head line, heart line, and fate line with natural skin texture and soft ambient golden lighting." id="palmScanTarget" src="/images/palm-scan.jpg" />
            {/* Holographic Radial Depth Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/70 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/50 via-transparent to-surface-container-lowest/50 pointer-events-none" />
            {/* Biometric Vector Overlay SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none" viewBox="0 0 360 370">
              {/* Golden Coordinate Grid & Targeting Circles */}
              <circle cx="180" cy="185" r="140" stroke="#f2ca50" strokeDasharray="4 6" strokeOpacity="0.18" />
              <circle cx="180" cy="185" r="90" stroke="#d0bcff" strokeOpacity="0.15" />
              <circle cx="180" cy="185" r="30" stroke="#f2ca50" strokeOpacity="0.25" />
              {/* Line Tracings: Heart Line (Hridaya Rekha) */}
              <path className="transition-all duration-500 filter drop-shadow-[0_0_8px_rgba(242,202,80,0.8)]" d="M 85 145 C 130 135, 205 130, 260 170" id="svg-heart-line" stroke="#f2ca50" strokeDasharray="320" strokeDashoffset="0" strokeLinecap="round" strokeWidth="2.5" />
              {/* Line Tracings: Head Line (Mastik Rekha) */}
              <path className="transition-all duration-500 filter drop-shadow-[0_0_6px_rgba(208,188,255,0.8)]" d="M 95 190 C 150 180, 225 188, 280 230" id="svg-head-line" stroke="#d0bcff" strokeDasharray="300" strokeDashoffset="0" strokeLinecap="round" strokeWidth="2" />
              {/* Line Tracings: Life Line (Jeevan Rekha) */}
              <path className="transition-all duration-500 filter drop-shadow-[0_0_8px_rgba(242,202,80,0.8)]" d="M 98 190 C 130 220, 150 270, 160 330" id="svg-life-line" stroke="#f2ca50" strokeDasharray="350" strokeDashoffset="0" strokeLinecap="round" strokeWidth="2.5" />
              {/* Line Tracings: Fate Line (Bhagya Rekha) */}
              <path className="transition-all duration-500 filter drop-shadow-[0_0_7px_rgba(233,195,73,0.9)]" d="M 180 340 C 182 280, 185 200, 180 150" id="svg-fate-line" stroke="#e9c349" strokeDasharray="4 4" strokeLinecap="round" strokeWidth="2" />
              {/* Mount Anchors & Glyphs */}
              {/* Jupiter Mount (Index base) */}
              <circle cx="120" cy="130" fill="#3c0091" fillOpacity="0.45" r="14" stroke="#f2ca50" strokeWidth="1.2" />
              <text fill="#ffe088" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="120" y="134">♃</text>
              {/* Saturn Mount (Middle base) */}
              <circle cx="178" cy="120" fill="#272938" fillOpacity="0.5" r="12" stroke="#d0bcff" strokeWidth="1" />
              <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="178" y="124">♄</text>
              {/* Venus Mount (Thumb root) */}
              <circle cx="115" cy="265" fill="#571bc1" fillOpacity="0.4" r="18" stroke="#f2ca50" strokeWidth="1.2" />
              <text fill="#f2ca50" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="700" textAnchor="middle" x="115" y="270">♀</text>
              {/* Moon Mount (Ketu / Chandra) */}
              <circle cx="255" cy="285" fill="#323443" fillOpacity="0.5" r="16" stroke="#d0bcff" strokeWidth="1" />
              <text fill="#d0bcff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="255" y="290">☽</text>
              {/* HUD Corner Crosshairs */}
              <path d="M 20 40 L 20 20 L 40 20" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" />
              <path d="M 340 40 L 340 20 L 320 20" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" />
              <path d="M 20 330 L 20 350 L 40 350" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" />
              <path d="M 340 330 L 340 350 L 320 350" stroke="#f2ca50" strokeLinecap="round" strokeWidth="2" />
            </svg>
            {/* Dynamic Scanning Laser Bar */}
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-75 z-20 pointer-events-none transition-transform duration-100 ease-linear shadow-[0_0_12px_#f2ca50]" id="laserScanBar" style={{ top: "0", transform: "translateY(60px)" }} />
          </div>
          {/* Scanner Sub-Bar: Verification State & Interactive Toggles */}
          <div className="px-space-md py-space-sm bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Scan Complete • Left Hand (Passive)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Calibrated to Lahiri Ayanamsha</span>
              </div>
            </div>
            <button aria-label="Re-trace biometric lines" className="px-space-sm py-1 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all" id="toggleLaserBtn" type="button">
              <span className="material-symbols-outlined text-xs">refresh</span>
              {" Re-trace"}
            </button>
          </div>
        </div>
        {/* Planetary Mounts Vedic Affinity Pill Strip */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Vedic Mount Vibrations (Parvatas)
            </span>
            <span className="font-label-sm text-label-sm text-primary">2 Dominant</span>
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            {/* Mount of Jupiter */}
            <div className="p-space-md rounded-xl bg-surface-container-high/80 backdrop-blur-xl flex flex-col gap-1.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs text-secondary-fixed">♃</span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Guru Mount</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">94%</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Prominent elevation beneath index finger. Bestows innate executive leadership, ethical wisdom, and dharma alignment.
              </p>
            </div>
            {/* Mount of Venus */}
            <div className="p-space-md rounded-xl bg-surface-container-high/80 backdrop-blur-xl flex flex-col gap-1.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs text-secondary-fixed">♀</span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Shukra Mount</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">88%</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Supple fleshy base at thumb root. Strong magnetism for aesthetic refinement, luxury conveyance, and empathetic sensuality.
              </p>
            </div>
          </div>
        </div>
        {/* Deep Biometric Chiromancy Lines Breakdown */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Core Biometric Meridian Traces</span>
            <span className="material-symbols-outlined text-primary text-sm">timeline</span>
          </div>
          {/* 1. Life Line (Jeevan Rekha) */}
          <div className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Life Line (Jeevan Rekha)</h3>
                  <span className="font-label-sm text-label-sm text-primary">Vitality • Prana Matrix • Longevity</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary-fixed font-label-sm text-label-sm">High Vitality</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Deep, uninterrupted arc curving around the Mount of Venus. Indicates robust vitality, strong physical resilience, and a major geographic relocation in your mid-30s.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              <span>Peak Vitality Cycle: 34 - 58 Solar Cycles</span>
            </div>
          </div>
          {/* 2. Heart Line (Hridaya Rekha) */}
          <div className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed" />
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Heart Line (Hridaya Rekha)</h3>
                  <span className="font-label-sm text-label-sm text-secondary">Emotional Karma • Bhakti • Relationships</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary-fixed font-label-sm text-label-sm">Jupiterian Curve</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Curves gracefully toward the Mount of Jupiter. Signals unconditional devotion, intuitive empathy, and acute romantic discernment without toxic attachment.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs text-secondary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-xs">favorite</span>
              <span>Karmic Resonance: Deep soulful partnership, minimal turbulence</span>
            </div>
          </div>
          {/* 3. Head Line (Mastik Rekha) */}
          <div className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Head Line (Mastik Rekha)</h3>
                  <span className="font-label-sm text-label-sm text-tertiary">Buddhi • Cognitive Rigor • Mental Fortitude</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary-fixed font-label-sm text-label-sm">Forked Genius</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Straight with a subtle writer's fork extending toward Mount of Moon. Exceptional analytical rigor seamlessly merged with creative visionary intuition.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs text-tertiary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-xs">psychology</span>
              <span>Ideal Vocations: Algorithmic Architecture, Philosophy, Strategic Arts</span>
            </div>
          </div>
          {/* 4. Fate Line (Bhagya Rekha) */}
          <div className="p-space-md rounded-xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-space-xs shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed" />
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Fate Line (Bhagya Rekha)</h3>
                  <span className="font-label-sm text-label-sm text-primary">Dharma Path • Material Fortune • Saturn Axis</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-container/40 text-primary-fixed font-label-sm text-label-sm">Moon-Ascendant</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Originates cleanly from Mount of Moon and ascends uninterrupted toward Saturn. Indicates self-made wealth and breakthrough enterprise beginning age 28.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-xs">monetization_on</span>
              <span>Financial Inflection: Major unearned gain & equity maturity at age 37</span>
            </div>
          </div>
        </div>
        {/* Astrologer Vedic Trust Verification Capsule */}
        <div className="p-space-md rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container-high/60 to-surface-container flex items-center gap-space-md shadow-lg">
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-title-md text-title-md text-on-surface font-bold">Vedic Scholar Validation</span>
              <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
              Cross-referenced with Bhrigu Samhita line geometry. Calibrated against your natal D1 Lagna chart.
            </p>
          </div>
        </div>
        {/* Gemstone Recommendation Banner for Weaker Mounts */}
        <div className="p-space-md rounded-xl bg-surface-container-high/90 backdrop-blur-xl flex flex-col gap-space-sm shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-lg">diamond</span>
              <span className="font-title-md text-title-md text-on-surface font-semibold">Recommended Mount Remediation</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary-fixed">Budh (Mercury) Weak</span>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="w-16 h-16 rounded-lg bg-surface-container-lowest overflow-hidden shrink-0 flex items-center justify-center">
              <img className="w-full h-full object-cover" data-alt="Panna Natural Zambian Emerald gemstone set in authentic consecrated gold ring on black velvet esoteric altar with subtle astrological geometry illumination" src="/images/emerald-palmistry.jpg" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h4 className="font-title-md text-title-md text-on-surface truncate">Natural Zambian Emerald (Panna)</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Strengthens the recessed Mercury mount. Awakens mercantile acumen, vocal charm, and mental swiftness.
              </p>
              <span className="font-title-lg text-title-lg text-primary font-bold mt-1">
                {"\u20b95,499 "}
                <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">inc. Vedic consecration</span>
              </span>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs transition-all active:scale-[0.99] shadow-md" type="button">
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            {" Get Consecrated Gemstone for Mercury"}
          </button>
        </div>
        {/* Primary Bottom Call-To-Action Operations */}
        <div className="flex flex-col gap-space-sm pt-space-xs">
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold tracking-wide flex items-center justify-center gap-space-sm shadow-[0_8px_24px_-4px_rgba(242,202,80,0.4)] transition-all active:scale-[0.98]" type="button">
            <span className="material-symbols-outlined text-xl">bookmark_added</span>
            {" Save Palm Scan to Kundli Profile"}
          </button>
          <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>Encrypted biometric telemetry stored securely in your private vault</span>
          </div>
        </div>
      </div>
      {/* Micro-Interactivity: Animated HUD Laser Scanner */}
    </main>
    </>
  );
}
