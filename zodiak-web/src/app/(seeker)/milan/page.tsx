export default function MilanPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full text-on-surface">
        {/* Subtle Celestial Ambiance Glow Backdrop */}
        <div className="relative w-full px-margin-mobile flex flex-col gap-space-md">
          {/* Top Context & Synthesis Title */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary mb-1">
              <span className="material-symbols-outlined text-sm text-primary">diversity_1</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">Vedic Matchmaking Synthesis</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight flex items-center justify-center gap-2">
              {"Kundli Milan "}
              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-0.5">
              Ashtakoota & Planetary Harmony analysis calibrated through precision Vedic algorithms.
            </p>
          </div>
          {/* Partner Synergy Bridge Card */}
          <div className="relative w-full rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-xl overflow-hidden">
            {/* Decorative Astral Ray SVG */}
            <svg className="absolute top-0 right-0 w-36 h-36 opacity-15 pointer-events-none text-primary" fill="none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.5" />
              <line stroke="currentColor" strokeWidth="0.5" x1="50" x2="50" y1="0" y2="100" />
              <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
              <line stroke="currentColor" strokeWidth="0.3" x1="15" x2="85" y1="15" y2="85" />
              <line stroke="currentColor" strokeWidth="0.3" x1="15" x2="85" y1="85" y2="15" />
            </svg>
            <div className="relative z-10 grid grid-cols-2 gap-3 items-center">
              {/* Partner 1 */}
              <div className="flex flex-col items-start gap-1 p-2 rounded-lg bg-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-base">female</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Bride</span>
                    <p className="font-title-md text-title-md text-on-surface truncate font-semibold">Ananya Sharma</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-col gap-0.5 text-on-surface-variant">
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">balance</span>
                    {" Libra Lagna"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Swati • Aries Moon</span>
                </div>
              </div>
              {/* Partner 2 */}
              <div className="flex flex-col items-start gap-1 p-2 rounded-lg bg-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">male</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Groom</span>
                    <p className="font-title-md text-title-md text-on-surface truncate font-semibold">Rohan Verma</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-col gap-0.5 text-on-surface-variant">
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">explore</span>
                    {" Sagit. Lagna"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">P. Ashadha • Leo Moon</span>
                </div>
              </div>
            </div>
            {/* Center Conjunction Node */}
            <div className="flex items-center justify-between mt-3 pt-2 text-on-surface-variant">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-sm">all_inclusive</span>
                <span className="font-label-sm text-label-sm tracking-wide">Trine Navamsha Link</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-0.5 rounded-full text-secondary">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                <span className="font-label-sm text-label-sm">Manglik Compatible</span>
              </div>
            </div>
          </div>
          {/* Overall Compatibility Guna Score Gauge */}
          <div className="relative w-full rounded-xl bg-surface-container/70 backdrop-blur-md p-space-lg flex flex-col items-center justify-center text-center shadow-lg">
            <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
              {/* Semi-circular SVG Gauge */}
              <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
                {/* Background track arc */}
                <circle cx="80" cy="80" fill="none" r="62" stroke="#272938" strokeDasharray="194.7 194.7" strokeDashoffset="0" strokeLinecap="round" strokeWidth="10" />
                {/* Active value arc (29/36 = ~80.5% => stroke-dashoffset: 194.7 * (1 - 0.805) = ~38) */}
                <circle cx="80" cy="80" fill="none" r="62" stroke="url(#goldGradient)" strokeDasharray="194.7 194.7" strokeDashoffset="38" strokeLinecap="round" strokeWidth="10" />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#D0BCFF" />
                    <stop offset="50%" stopColor="#F2CA50" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center Value Overlay */}
              <div className="absolute bottom-1 flex flex-col items-center">
                <div className="flex items-baseline">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">29</span>
                  <span className="font-title-md text-title-md text-on-surface-variant ml-1 font-normal">/ 36</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest -mt-1 font-semibold">Gunas</span>
              </div>
            </div>
            {/* Result Verdict Banner */}
            <div className="mt-2 flex flex-col items-center gap-1.5 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span className="font-label-md text-label-md font-semibold tracking-wide">Sublime Match • 80.5% Auspicious</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                Passes recommended 18-point threshold with exceptional intellectual, emotional, and planetary resonance.
              </p>
            </div>
            {/* Mini Indicator Grid */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 bg-surface-container-high/40 rounded-lg p-2.5">
              <div className="flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Mental</span>
                <span className="font-title-md text-title-md font-bold text-primary mt-0.5">4.5 / 5</span>
                <span className="font-label-sm text-label-sm text-secondary">Attuned</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Physical</span>
                <span className="font-title-md text-title-md font-bold text-primary mt-0.5">3.0 / 4</span>
                <span className="font-label-sm text-label-sm text-secondary">Balanced</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Destiny</span>
                <span className="font-title-md text-title-md font-bold text-primary mt-0.5">7.0 / 7</span>
                <span className="font-label-sm text-label-sm text-primary-fixed">Optimal</span>
              </div>
            </div>
          </div>
          {/* Verified Astrologer Capsule */}
          <div className="w-full p-space-sm px-space-md rounded-full bg-surface-container-high/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface font-semibold">Parashara Vedic Certified</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Chitrapaksha Ayanamsha</span>
          </div>
          {/* Detailed 8 Kootas Breakdown Accordion / List */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Ashtakoota Spectrum</h2>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">8 Facets</span>
            </div>
            {/* Koota List Items */}
            <div className="flex flex-col gap-2">
              {/* 1. Varna */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">psychology_alt</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Varna</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Ego & Work</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Mutual intellectual respect & status alignment</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">1 / 1</span>
                  <span className="font-label-sm text-label-sm text-secondary-fixed">Max</span>
                </div>
              </div>
              {/* 2. Vashya */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">balance</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Vashya</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Mutual Magnetism</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Equitable dynamic; naturally supportive balance</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">2 / 2</span>
                  <span className="font-label-sm text-label-sm text-secondary-fixed">Max</span>
                </div>
              </div>
              {/* 3. Tara */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">flare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Tara</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Destiny & Longevity</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Sampat Tara: Enhances abundance and endurance</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">3 / 3</span>
                  <span className="font-label-sm text-label-sm text-secondary-fixed">Max</span>
                </div>
              </div>
              {/* 4. Yoni */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">favorite</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Yoni</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Biological Affinity</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Buffalo & Monkey yoni; amicable physical warmth</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">3 / 4</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">High</span>
                </div>
              </div>
              {/* 5. Graha Maitri */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">handshake</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Graha Maitri</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Emotional Core</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Mars & Sun friendship; fierce mutual loyalty</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">4 / 5</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Strong</span>
                </div>
              </div>
              {/* 6. Gana */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">groups</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Gana</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Temperament</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Deva & Manushya blend; healthy shared habits</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">5 / 6</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Compatible</span>
                </div>
              </div>
              {/* 7. Bhakoot */}
              <div className="p-3 rounded-lg bg-surface-container/60 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">savings</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface">Bhakoot</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• Family & Growth</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">Navamsha 9/5 auspicious angle; financial synergy</p>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-title-md text-title-md text-primary font-bold">7 / 7</span>
                  <span className="font-label-sm text-label-sm text-secondary-fixed">Flawless</span>
                </div>
              </div>
              {/* 8. Nadi (With Remedy Indicator) */}
              <div className="p-3 rounded-lg bg-surface-container-high/90 backdrop-blur-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-base">vital_signs</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-title-md text-title-md text-on-surface">Nadi</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">• Genetic Lineage</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Antya & Madhya transit divergence</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end pl-2">
                    <span className="font-title-md text-title-md text-primary font-bold">4 / 8</span>
                    <span className="font-label-sm text-label-sm text-secondary">Mild Dosha</span>
                  </div>
                </div>
                {/* Remedy Sub-callout */}
                <div className="mt-1 p-2 rounded bg-surface-container-lowest/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <span className="material-symbols-outlined text-sm">spa</span>
                    <span className="font-body-sm text-body-sm">Vedic Remedy: Rudrabhishek & Gold Donation nullifies</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">Resolvable</span>
                </div>
              </div>
            </div>
          </div>
          {/* AI Astrologer Synthesis Card */}
          <div className="w-full rounded-xl bg-gradient-to-br from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-base">psychology</span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Zodiak Synthesizer</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary">Deep AI Insight</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              Rohan's Leo Moon complements Ananya's Aries Moon through a fiery trine connection, fostering deep instinctive trust and shared ambition. The mild Nadi divergence of 4 points presents no hereditary obstacle when harmonized through customary Vedic consecration rituals.
            </p>
            <div className="flex items-center gap-2 pt-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm text-primary">auto_fix_high</span>
              <span>Auspicious Wedding Mahurats: Nov 18, Dec 04, Dec 14 (2024)</span>
            </div>
          </div>
          {/* Astrologer Audio Guidance Preview Pill */}
          <div className="w-full p-3 rounded-xl bg-surface-container/70 backdrop-blur-md flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <button aria-label="Play Astrologer Note" className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center transition-transform active:scale-95 shadow" id="playAudioBtn">
                <span className="material-symbols-outlined text-xl" id="audioIcon">play_arrow</span>
              </button>
              <div>
                <span className="font-title-md text-title-md text-on-surface block font-medium">Pandit Raghavendra's Voice Note</span>
                {" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">2m 45s • Marriage Graha Balance Overview</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-lg">graphic_eq</span>
            </div>
          </div>
          {/* Action Section */}
          <div className="flex flex-col gap-3 pt-2 mb-2">
            {/* Primary Unlock Dossier CTA with INR Module */}
            <button className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold flex items-center justify-between shadow-lg active:scale-[0.99] transition-transform">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">description</span>
                <span>Download 28-Page Milan Dossier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-title-lg text-title-lg">₹99</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </button>
            {/* Secondary Consult Astrologer CTA */}
            <button className="w-full py-3 px-4 rounded-xl bg-surface-container-high/90 text-on-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow hover:bg-surface-bright transition-colors active:scale-[0.99]">
              <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
              <span>Book Dosha Parihara with Senior Pandit</span>
            </button>
            <p className="font-label-sm text-label-sm text-center text-on-surface-variant pb-1">
              Safe & Confidential • Consecrated under ancient Brihat Parashara Hora Shastra principles
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
