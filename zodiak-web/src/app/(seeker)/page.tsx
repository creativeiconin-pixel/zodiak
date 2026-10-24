export default function HomePage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full text-on-surface">
        {/* Hero Section */}
        <section className="relative px-margin-mobile pt-space-md pb-space-xl overflow-hidden flex flex-col items-center text-center">
          {/* Ambient Celestial Radial Glows */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-56 h-56 bg-primary-container/20 rounded-full blur-2xl pointer-events-none" />
          {/* Vedic Astrologer Verified Trust Pill */}
          <div className="relative z-10 inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-surface-container-high/90 shadow-md backdrop-blur-md mb-space-md">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase text-primary font-semibold">Vedic Precision • AI Powered</span>
            <span className="w-1 h-1 rounded-full bg-primary/60" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Est. 2024</span>
          </div>
          {/* Brand Emblem Illustration Inspired by Astrolabe */}
          <div className="relative z-10 w-44 h-44 mb-space-md flex items-center justify-center">
            {/* Outer Concentric Rotating Ring (SVG) */}
            <svg className="absolute inset-0 w-full h-full text-primary/40 animate-[spin_60s_linear_infinite]" fill="none" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="95" stroke="currentColor" strokeDasharray="3 3" strokeWidth="0.75" />
              <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0.75" />
              {/* Cardinal Marks */}
              <line stroke="currentColor" strokeWidth="1.5" x1="100" x2="100" y1="5" y2="15" />
              <line stroke="currentColor" strokeWidth="1.5" x1="100" x2="100" y1="185" y2="195" />
              <line stroke="currentColor" strokeWidth="1.5" x1="5" x2="15" y1="100" y2="100" />
              <line stroke="currentColor" strokeWidth="1.5" x1="185" x2="195" y1="100" y2="100" />
              {/* Star Markers */}
              <circle cx="100" cy="20" fill="#f2ca50" r="1.5" />
              <circle cx="160" cy="50" fill="#f2ca50" r="1.5" />
              <circle cx="180" cy="100" fill="#f2ca50" r="1.5" />
              <circle cx="150" cy="160" fill="#d0bcff" r="1.2" />
              <circle cx="40" cy="150" fill="#f2ca50" r="1.5" />
              <circle cx="20" cy="100" fill="#d0bcff" r="1.2" />
              <circle cx="50" cy="40" fill="#f2ca50" r="1.5" />
            </svg>
            {/* Inner Sacred Mandala & Sun Rays */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-surface-container-high/90 via-surface-container/80 to-surface-container-high/90 shadow-[0_0_28px_rgba(242,202,80,0.22)] backdrop-blur-md flex items-center justify-center">
              {/* Celestial Starburst Icon */}
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>flare</span>
                <span className="material-symbols-outlined text-secondary absolute -top-2 -right-2 text-xl">auto_awesome</span>
                <span className="material-symbols-outlined text-primary absolute -bottom-1 -left-2 text-base">brightness_empty</span>
              </div>
            </div>
          </div>
          {/* Tagline & Heading */}
          <h1 className="relative z-10 font-headline-lg-mobile text-headline-lg-mobile font-semibold text-on-surface tracking-tight max-w-xs">
            {"Your AI Astrologer. "}
            <br />
            <span className="text-primary italic font-headline-lg-mobile">Remedies You Can Trust.</span>
          </h1>
          <p className="relative z-10 mt-space-sm text-body-md font-body-md text-on-surface-variant max-w-sm">
            Vedic mathematical rigor merged with sentient AI synthesis. Decode your Dasha transits, unlock sanctified gemstone remedies, and navigate destiny with unshakable clarity.
          </p>
          {/* CTAs */}
          <div className="relative z-10 w-full mt-space-lg flex flex-col gap-space-sm max-w-xs">
            <button className="w-full min-h-[48px] py-3 px-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md shadow-[0_0_24px_rgba(242,202,80,0.35)] active:scale-[0.98] transition-transform flex items-center justify-center gap-space-xs">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <span>Get Your Free Birth Chart</span>
            </button>
            <button className="w-full min-h-[44px] py-2.5 px-6 rounded-full bg-surface-container-high/90 text-on-surface font-title-md text-title-md shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-lg">cyclone</span>
              <span>Explore Vedic Remedies</span>
              <span className="text-on-surface-variant text-sm">✦</span>
            </button>
          </div>
          {/* Micro Social Proof */}
          <div className="relative z-10 mt-space-md flex items-center gap-space-xs text-on-surface-variant">
            <div className="flex text-primary">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface font-semibold">4.9/5</span>
            <span className="text-outline text-xs">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Over 140,000+ charts analyzed</span>
          </div>
        </section>
        {/* Feature Grid (6 Cards Bento Layout) */}
        <section className="px-margin-mobile py-space-md flex flex-col gap-space-md">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase">Sacred Pillars</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">Comprehensive Metaphysical Suite</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">From cosmic telemetry to consecrated physical talismans.</p>
          </div>
          <div className="grid grid-cols-1 gap-space-sm">
            {/* Feature 1: Free Birth Chart */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">all_inclusive</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Instant Vedic Math
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">1. Free Birth Chart (Lagna Kundli)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Precision planetary positions calculated down to the arc-second using authentic Lahiri Ayanamsha. Unveils your Rising sign, Moon Nakshatra, and current Mahadasha ruler.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold cursor-pointer">
                <span>Calculate Your Lagna</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 2: High-Res Kundli & Hard Copy */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">menu_book</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-semibold">
                  Dossier + Hard Copy
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">2. Master Kundli Dossier</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                In-depth 45-page exhaustive report mapping Shodashvarga (D1 to D60), Sade Sati timing, and career peaks. Available as instant high-resolution PDF or royal gold-gilded physical book delivered to your doorstep.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-secondary font-label-md text-label-md font-semibold cursor-pointer">
                <span>Preview Dossier Index</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 3: Kundli Milan */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">favorite</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Ashtakoota 36 Guna
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">3. Kundli Milan & Relationship Synthesis</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Deep matrimonial compatibility evaluating Nadi dosha, Bhakoot, Gana, and planetary friendship. Synthesized through neural empathy models with actionable dosha mitigations.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold cursor-pointer">
                <span>Run Compatibility Match</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 4: Palm Reading */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">front_hand</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-semibold">
                  Vision AI Scanner
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">4. AI Palmistry & Chiromancy</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Scan your palms via phone lens. Computer vision maps the Mount of Jupiter, Heart line, Life curve, and Simian patterns, correlating biometric markers with your astrological houses.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-tertiary font-label-md text-label-md font-semibold cursor-pointer">
                <span>Scan Palm via Camera</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 5: Personalized Transits */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">calendar_month</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Gochar Tracking
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">5. Daily, Weekly & Monthly Transits</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Zero generic sun-sign horoscopes. Tailored micro-transits calculating Jupiter, Saturn, Rahu-Ketu shifts relative specifically to your birth Ascendant and natal Moon.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold cursor-pointer">
                <span>View Today's Gochar</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 6: Gemstone & Remedies */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">diamond</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-semibold">
                  100% Consecrated
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-sm">6. Certified Gemstones & Rudraksha</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Lab-certified, untreated ratnas (Yellow Sapphire, Blue Sapphire, Emerald) and energized Nepal Rudraksha beads. Consecrated with authentic Vedic Pran-Pratishtha rituals by senior priests.
              </p>
              <div className="mt-space-sm flex items-center gap-space-xs text-secondary font-label-md text-label-md font-semibold cursor-pointer">
                <span>Browse Consecrated Vault</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>
        {/* Visual Showcase / Craftsmanship Break */}
        <section className="px-margin-mobile py-space-sm">
          <div className="rounded-xl overflow-hidden bg-surface-container-high relative shadow-lg">
            <img className="w-full h-48 object-cover opacity-85" data-alt="A luxurious dark astrolabe and Vedic golden chart manuscript resting on black velvet with consecrated deep blue sapphire gemstone and glowing amber incense smoke, moody nocturnal esoteric photography" src="/images/astrolabe-manuscript.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent p-space-md flex flex-col justify-end">
              <div className="inline-flex items-center gap-1.5 text-primary mb-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Sanctified & Hand-Bound</span>
              </div>
              <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">Tradition Preserved in Tangible Form</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Every physical talisman and printed ledger is consecrated under an auspicious Shubh Muhurat.
              </p>
            </div>
          </div>
        </section>
        {/* Sleek Pricing Strip */}
        <section className="px-margin-mobile py-space-lg flex flex-col">
          <div className="text-center mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Transparent Offerings</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">Begin Your Cosmic Journey</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">From complimentary foundations to heirloom printed editions.</p>
          </div>
          {/* Horizontal Swipeable Pricing Strip */}
          <div className="flex gap-space-sm overflow-x-auto pb-space-sm snap-x snap-mandatory">
            {/* Tier 1: Free */}
            <div className="snap-center shrink-0 w-64 rounded-xl bg-surface-container/95 p-space-md flex flex-col justify-between shadow-md">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Digital Base</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase">Basic</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-xs">Instant Birth Chart</h3>
                <div className="mt-space-md flex items-baseline gap-1">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">₹0</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ free forever</span>
                </div>
                <ul className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Lagna & Navamsha (D9) Chart</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Vimshottari Dasha Overview</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Instant AI Summary Snapshot</span>
                  </li>
                </ul>
              </div>
              <button className="mt-space-lg w-full py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg active:scale-95 transition-transform">
                Generate Free
              </button>
            </div>
            {/* Tier 2: Kundli PDF Dossier */}
            <div className="snap-center shrink-0 w-64 rounded-xl bg-surface-container/95 p-space-md flex flex-col justify-between shadow-md">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Deep Dive</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-[10px] font-bold uppercase">Popular</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-xs">45-Page Kundli PDF</h3>
                <div className="mt-space-md flex items-baseline gap-1">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">₹49</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-outline">₹299</span>
                </div>
                <ul className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Full Shodashvarga (16 Divisional Charts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>5-Year Year-by-Year Predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Dosha Diagnosis (Mangal, Kaal Sarp)</span>
                  </li>
                </ul>
              </div>
              <button className="mt-space-lg w-full py-2.5 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg active:scale-95 transition-transform">
                Unlock Dossier
              </button>
            </div>
            {/* Tier 3: Kundli Milan Match */}
            <div className="snap-center shrink-0 w-64 rounded-xl bg-surface-container/95 p-space-md flex flex-col justify-between shadow-md">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Matchmaking</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase">Couple</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-xs">Kundli Milan Dossier</h3>
                <div className="mt-space-md flex items-baseline gap-1">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">₹99</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-outline">₹499</span>
                </div>
                <ul className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Complete 36-Guna Breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Nadi & Bhakoot In-Depth Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>AI Psychological Compatibility Map</span>
                  </li>
                </ul>
              </div>
              <button className="mt-space-lg w-full py-2.5 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg active:scale-95 transition-transform">
                Analyze Match
              </button>
            </div>
            {/* Tier 4: Hard Copy Kundli (Featured) */}
            <div className="snap-center shrink-0 w-64 rounded-xl bg-surface-container-high p-space-md flex flex-col justify-between shadow-xl shadow-primary-container/10">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Collector Edition</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase">Best Value</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-space-xs">Hard Copy Bound Book</h3>
                <div className="mt-space-md flex items-baseline gap-1">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">₹299</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-outline">₹999</span>
                </div>
                <p className="font-label-sm text-label-sm text-secondary mt-0.5">Free doorstep delivery across India</p>
                <ul className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Gold-foiled Hardbound Velvet Book</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Full 60+ Page Life Horoscope</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>Keepsake Cosmic Preservation Box</span>
                  </li>
                </ul>
              </div>
              <button className="mt-space-lg w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-95 transition-transform">
                Order Hard Copy
              </button>
            </div>
          </div>
        </section>
        {/* Trust & Human Verification Section */}
        <section className="px-margin-mobile py-space-md">
          <div className="relative overflow-hidden rounded-xl bg-surface-container/90 p-space-md shadow-md">
            {/* Watermark Vedic Symbol Background */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 text-primary pointer-events-none">
              <svg fill="currentColor" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2" />
                <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex items-center gap-space-sm mb-space-sm">
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Dual Review Architecture</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Human Expert Verification</h3>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {"Every personalized gemstone recommendation, Rudraksha combination, and remedial yantra is critically reviewed by a "}
              <strong className="text-on-surface">Vedic Pandit with 15+ years experience</strong>
              {" before your dispatch is confirmed. Computational precision meets authentic parampara."}
            </p>
            {/* Trust Badges Row */}
            <div className="grid grid-cols-3 gap-space-xs mt-space-md pt-space-sm bg-surface-container-high/50 p-space-sm rounded-lg">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-primary text-xl">workspace_premium</span>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">100% Certified</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Govt. Lab Tested</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-xl">self_improvement</span>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">Pran-Pratishtha</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Vedic Chants</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">Insured Transit</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Tamper Proof</span>
              </div>
            </div>
          </div>
        </section>
        {/* Testimonials Carousel */}
        <section className="px-margin-mobile py-space-md flex flex-col">
          <div className="flex items-center justify-between mb-space-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Voices of Seekers</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Real Life Transformations</h2>
            </div>
            <div className="flex gap-1 text-primary">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-label-md text-label-md font-bold text-on-surface self-center">4.92</span>
            </div>
          </div>
          <div className="flex gap-space-sm overflow-x-auto pb-space-sm snap-x">
            {/* Testimonial 1 */}
            <div className="snap-start shrink-0 w-72 rounded-xl bg-surface-container/90 p-space-md shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface italic">
                  “The hard copy Kundli arrived in a magnificent velvet box. But more than the aesthetics, the Rahu Mahadasha career transit predictions were accurate down to the exact month.”
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm pt-space-xs">
                <img className="w-9 h-9 rounded-full object-cover" data-alt="Close up portrait photo of an Indian woman professional smiling warmly against a soft twilight city background, subtle natural lighting" src="/images/testimonial-ananya.jpg" />
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">Dr. Ananya Sharma</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Bangalore • Verified Kundli Order</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="snap-start shrink-0 w-72 rounded-xl bg-surface-container/90 p-space-md shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface italic">
                  “I was skeptical of online matchmaking until Zodiak highlighted our exact emotional friction points through Bhakoot dosha and offered realistic remedy rituals that brought genuine calm.”
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm pt-space-xs">
                <img className="w-9 h-9 rounded-full object-cover" data-alt="Portrait of an Indian man in his early thirties with spectacles and a calm thoughtful expression, warm subtle ambient glow" src="/images/testimonial-vikram.jpg" />
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">Vikramaditya Iyer</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Mumbai • Kundli Milan Dossier</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Interactive FAQ Accordion */}
        <section className="px-margin-mobile py-space-md mb-space-md">
          <div className="text-center mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Clarity & Assurance</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-space-xs" id="faq-accordion">
            {/* Item 1 */}
            <div className="rounded-xl bg-surface-container/90 overflow-hidden transition-all duration-300">
              <button aria-expanded="false" className="w-full p-space-md text-left flex justify-between items-center gap-2 faq-toggle">
                <span className="font-title-md text-title-md text-on-surface font-semibold">How does AI combine with Vedic astrology?</span>
                <span className="material-symbols-outlined text-primary text-xl transition-transform duration-200">expand_more</span>
              </button>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant hidden faq-content">
                Zodiak calculates celestial ephemerides using high-precision astronomical algorithms (Lahiri Ayanamsha) identical to traditional panchangs. Our AI models then synthesize cross-transits, Ashtakvarga scores, and Dasha interactions into contextualized, readable prose without human calculation error.
              </div>
            </div>
            {/* Item 2 */}
            <div className="rounded-xl bg-surface-container/90 overflow-hidden transition-all duration-300">
              <button aria-expanded="false" className="w-full p-space-md text-left flex justify-between items-center gap-2 faq-toggle">
                <span className="font-title-md text-title-md text-on-surface font-semibold">What is in the ₹299 Hard Copy Kundli?</span>
                <span className="material-symbols-outlined text-primary text-xl transition-transform duration-200">expand_more</span>
              </button>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant hidden faq-content">
                The physical Kundli is a 60+ page archival-grade gold-foil embossed book. It contains your natal Lagna, Navamsha, Chalit charts, full Dasha timelines up to 100 years, personalized Sade Sati analysis, and customized remedy remedies housed inside an elegant celestial keepsake box.
              </div>
            </div>
            {/* Item 3 */}
            <div className="rounded-xl bg-surface-container/90 overflow-hidden transition-all duration-300">
              <button aria-expanded="false" className="w-full p-space-md text-left flex justify-between items-center gap-2 faq-toggle">
                <span className="font-title-md text-title-md text-on-surface font-semibold">Are the gemstone recommendations safe to wear?</span>
                <span className="material-symbols-outlined text-primary text-xl transition-transform duration-200">expand_more</span>
              </button>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant hidden faq-content">
                Yes. Unlike automated algorithms that recommend stones solely by Moon sign, our Vedic Pandits examine your Trikona rulers, Maraka planets, and current transits before endorsing any gemstone. We will never suggest a stone that amplifies malefic lord energies.
              </div>
            </div>
            {/* Item 4 */}
            <div className="rounded-xl bg-surface-container/90 overflow-hidden transition-all duration-300">
              <button aria-expanded="false" className="w-full p-space-md text-left flex justify-between items-center gap-2 faq-toggle">
                <span className="font-title-md text-title-md text-on-surface font-semibold">How accurate is the Palmistry scanner?</span>
                <span className="material-symbols-outlined text-primary text-xl transition-transform duration-200">expand_more</span>
              </button>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant hidden faq-content">
                Our vision models identify the primary life, head, heart, and fate lines with over 94% spatial fidelity under clear lighting. It overlays your palm mounts with your Kundli planetary strengths to reveal harmonious correlations between palmistry and horoscopy.
              </div>
            </div>
          </div>
        </section>
        {/* Final Sticky CTA Strip / Banner */}
        <section className="px-margin-mobile pb-space-lg">
          <div className="rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-high p-space-lg text-center relative overflow-hidden shadow-xl">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-space-xs animate-bounce">stars</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Unveil Your Blueprint Today</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-1 mb-space-md">
                Join thousands who have discovered their true planetary alignment. Generates in 15 seconds.
              </p>
              <button className="w-full max-w-xs py-3 px-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-semibold shadow-[0_0_24px_rgba(242,202,80,0.4)] active:scale-[0.98] transition-transform">
                Calculate Free Birth Chart
              </button>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">lock</span>
                {" No payment or card details required"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
