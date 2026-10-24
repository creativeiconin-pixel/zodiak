export default function HoroscopePage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl">
        {/* Subtle Celestial Ambient Aura */}
        <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-xl">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          {/* Header Section & User Zodiac Pill */}
          <div className="relative flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                {" Vedic Ephemeris Live"}
              </span>
              {/* Astrologer Verified Trust Pill */}
              <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-xs text-primary">verified</span>
                <span className="font-label-sm text-label-sm tracking-tight text-on-surface-variant font-medium">Verified by Pandit Shastri</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">Cosmic Transits</h1>
            </div>
            {/* Current Zodiac Badge Bar */}
            <div className="flex items-center gap-space-sm mt-1 bg-surface-container/70 rounded-lg p-2 backdrop-blur-md">
              <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-xl">balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">Libra (Tula Rashi)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Oct 24 Transit • Chitra Nakshatra (Pada 3)</span>
              </div>
              <button className="ml-auto w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" id="toggleSignModal">
                <span className="material-symbols-outlined text-base">swap_horiz</span>
              </button>
            </div>
          </div>
          {/* Astrolabe Emblem Visual */}
          <div className="relative mt-space-md w-full bg-surface-container-lowest/80 rounded-xl p-space-md flex items-center gap-space-md overflow-hidden">
            <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
              {/* Concentric Astrolabe Rings SVG */}
              <svg className="w-24 h-24 animate-[spin_60s_linear_infinite]" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" opacity="0.4" r="46" stroke="#99907c" strokeDasharray="2 3" strokeWidth="0.75" />
                <circle cx="50" cy="50" opacity="0.6" r="38" stroke="#d4af37" strokeWidth="0.8" />
                <circle cx="50" cy="50" opacity="0.5" r="30" stroke="#d0bcff" strokeDasharray="4 2" strokeWidth="0.5" />
                <line opacity="0.3" stroke="#d4af37" strokeWidth="0.5" x1="50" x2="50" y1="4" y2="96" />
                <line opacity="0.3" stroke="#d4af37" strokeWidth="0.5" x1="4" x2="96" y1="50" y2="50" />
                <path d="M 50 14 A 36 36 0 0 1 86 50" opacity="0.8" stroke="#f2ca50" strokeWidth="1.2" />
                {/* Star nodes */}
                <circle cx="50" cy="14" fill="#f2ca50" r="2" />
                <circle cx="86" cy="50" fill="#d0bcff" r="1.5" />
                <circle cx="26" cy="74" fill="#f2ca50" r="1.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="material-symbols-outlined text-primary text-2xl animate-pulse">flare</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0 pr-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Transit Influence</span>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mt-0.5">
                Venus transits your 2nd house of wealth while Moon in Aries heightens instinctual clarity. Perfect alignment for negotiating partnerships and creative endeavors.
              </p>
            </div>
          </div>
        </div>
        {/* Period Tabs (Segmented Controller) */}
        <div className="mt-space-md w-full bg-surface-container-high rounded-full p-1 flex items-center justify-between shadow-inner">
          <button className="period-btn flex-1 py-1.5 rounded-full font-label-lg text-label-lg font-semibold text-center transition-all duration-300 bg-primary text-on-primary shadow-md" data-period="daily">
            Daily
          </button>
          <button className="period-btn flex-1 py-1.5 rounded-full font-label-lg text-label-lg font-semibold text-center transition-all duration-300 text-on-surface-variant hover:text-on-surface" data-period="weekly">
            Weekly
          </button>
          <button className="period-btn flex-1 py-1.5 rounded-full font-label-lg text-label-lg font-semibold text-center transition-all duration-300 text-on-surface-variant hover:text-on-surface" data-period="monthly">
            Monthly
          </button>
        </div>
        {/* Astrological Mood & Numbers Matrix */}
        <div className="mt-space-md grid grid-cols-2 gap-gutter-mobile">
          {/* Mood Card */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-lg">psychology_alt</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">Cosmic Mood</span>
            </div>
            <div className="mt-2">
              <span className="font-title-md text-title-md text-on-surface font-semibold block leading-snug">Contemplative</span>
              {" "}
              <span className="font-body-sm text-body-sm text-primary font-medium">& Strategic</span>
            </div>
            <div className="mt-space-sm h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full" style={{ width: "78%" }} />
            </div>
          </div>
          {/* Muhurat Card */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">Shubh Muhurat</span>
            </div>
            <div className="mt-2">
              <span className="font-title-md text-title-md text-on-surface font-semibold block leading-snug">10:30 AM - 12:15 PM</span>
              {" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">Abhijit Kala</span>
            </div>
            <div className="mt-space-sm flex items-center gap-1 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span className="font-label-sm text-label-sm text-primary-fixed">Active Today</span>
            </div>
          </div>
          {/* Lucky Palette */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-1.5 text-tertiary">
              <span className="material-symbols-outlined text-lg">palette</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">Lucky Colours</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#f2ca50] shadow-sm" />
              <div className="w-4 h-4 rounded-full bg-[#f4a7bb] shadow-sm" />
              <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Gold & Rose</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">Elevates Venusian Grace</span>
          </div>
          {/* Lucky Numbers */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-1.5 text-primary-fixed">
              <span className="material-symbols-outlined text-lg">casino</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wide">Lucky Numbers</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-lg text-title-lg text-primary font-bold">
                6
              </span>
              <span className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-lg text-title-lg text-secondary font-bold">
                24
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">Root Harmony Sum: 6</span>
          </div>
        </div>
        {/* Focus Areas Section */}
        <div className="mt-space-lg flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Cosmic Focus Areas</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Real-Time Transit Weights</span>
          </div>
          {/* Focus Card 1: Love & Relations */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Love & Relations</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">4.5</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Passionate dialogue opens up unresolved intimacy. Single Libras feel an unexpected magnetic pull during evening hours.
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "90%" }} />
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">90% Alignment</span>
            </div>
          </div>
          {/* Focus Card 2: Career & Enterprise */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Career & Enterprise</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">4.8</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Jupiter's trine delivers recognition from superiors. Pitch bold visions before sunset for peak persuasive authority.
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "96%" }} />
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">96% Alignment</span>
            </div>
          </div>
          {/* Focus Card 3: Wealth & Money */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary-fixed">
                  <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Wealth & Money</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">3.8</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Steady influx, but defer major speculative trades until Rahu completes transit next Tuesday. Focus on capital preservation.
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-outline rounded-full" style={{ width: "76%" }} />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Cautionary</span>
            </div>
          </div>
          {/* Focus Card 4: Vitality & Health */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-lg">spa</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Vitality & Health</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">4.2</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              High mental stamina. Integrate pranayama or grounding walks to soothe nervous excitement and maintain digestive equilibrium.
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: "84%" }} />
              </div>
              <span className="font-label-sm text-label-sm text-secondary-fixed-dim font-semibold">84% Alignment</span>
            </div>
          </div>
        </div>
        {/* Recommended Action For Today Banner */}
        <div className="mt-space-lg relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-space-md shadow-lg">
          <div className="flex items-start gap-space-md">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-ping" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Recommended Remedy</span>
                <span className="text-xs text-on-surface-variant">• Today</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-bold mt-0.5">Strengthen Venusian Vibration</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Wear Rose Quartz or Gold ornament to strengthen Venusian vibration and enhance mutual attraction during today's key transit.
              </p>
              {/* CTA & Secondary Buttons */}
              <div className="mt-space-md flex items-center gap-space-sm">
                <button className="flex-1 py-2.5 px-space-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                  <span>Explore Gemstones</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <button className="w-10 h-10 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center active:scale-90 transition-transform">
                  <span className="material-symbols-outlined text-lg">bookmark_border</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Astrological Deep Dive Accordion / Expansion */}
        <div className="mt-space-md bg-surface-container rounded-xl p-space-md flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container-high transition-colors">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-xl">blur_on</span>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-semibold">Planetary Degree Matrix</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Venus at 14°22' Libra • Moon at 28°10' Aries</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </div>
      </div>
    </main>
    </>
  );
}
