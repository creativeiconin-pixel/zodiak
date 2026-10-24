export default function RemediesPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full text-on-surface">
        {/* Subtle Ambient Glow Orbs */}
        <div className="relative w-full px-margin-mobile flex flex-col gap-space-md">
          {/* Screen Title & Intro Context */}
          <div className="flex items-center justify-between pt-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-sm">temple_hindu</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">Vedic Sanctum</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">Sanctified Remedies Vault</h1>
            </div>
            <button aria-label={"Energy Filter & Info"} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors shadow-sm">
              <span className="material-symbols-outlined text-xl">token</span>
            </button>
          </div>
          {/* Astrological Personalization Aura Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container to-surface-container-high p-space-md shadow-md">
            {/* Astral Accent Aura */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-space-sm relative z-10">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 shadow-[0_0_12px_rgba(242,202,80,0.25)]">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold">Kundli Synced</span>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ananya Sharma</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface font-semibold tracking-tight mt-0.5">Tula Lagna & Jupiter Dasha Active</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  Saturn-Jupiter transition requires solar-intellect grounding. Remedies below are energized to pacify malefic transits.
                </p>
              </div>
            </div>
          </div>
          {/* Category Filter Pills (Horizontal Scrolling) */}
          <div className="flex items-center gap-space-xs overflow-x-auto py-1 -mx-margin-mobile px-margin-mobile no-scrollbar" id="category-pills">
            <button className="cat-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-sm shrink-0 transition-transform active:scale-95" data-cat="all">
              All
            </button>
            <button className="cat-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface shrink-0 transition-colors" data-cat="gemstones">
              Gemstones
            </button>
            <button className="cat-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface shrink-0 transition-colors" data-cat="rudraksha">
              Rudraksha
            </button>
            <button className="cat-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface shrink-0 transition-colors" data-cat="yantras">
              Yantras
            </button>
            <button className="cat-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface shrink-0 transition-colors" data-cat="kavach">
              Kavach
            </button>
          </div>
          {/* Product Listing Cards */}
          <div className="flex flex-col gap-space-lg pt-1">
            {/* Card 1: Ceylon Yellow Sapphire (Primary Match) */}
            <article className="flex flex-col rounded-xl bg-surface-container overflow-hidden shadow-xl group">
              {/* Visual Presentation */}
              <div className="relative w-full aspect-[4/3] bg-surface-container-high overflow-hidden">
                <img alt="Natural Ceylon Yellow Sapphire Ring resting on navy velvet" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/images/yellow-sapphire-ring.jpg" />
                {" "}
                {/* Astrological Match Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">98% Astrological Match</span>
                </div>
                {/* Planet Glyph Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface">
                  <span className="material-symbols-outlined text-sm text-secondary">explore</span>
                  <span className="font-label-sm text-label-sm tracking-wide">Brihaspati • Jupiter</span>
                </div>
              </div>
              {/* Details Container */}
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">Ratna Vidya Verified</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Origin: Ratnapura</span>
                  </div>
                  <h2 className="font-title-lg text-title-lg text-on-surface mt-1 leading-snug">Natural Ceylon Yellow Sapphire (Pukhraj) Ring</h2>
                </div>
                {/* Benefits Matrix */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">trending_up</span>
                    {" Career Breakthroughs"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">psychology_alt</span>
                    {" Spiritual Wisdom"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">child_care</span>
                    {" Progeny Blessing"}
                  </span>
                </div>
                {/* Consecration Guarantee Sub-tier */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-sm text-label-sm leading-tight text-on-surface">Govt Lab Certified + Vedic Pran-Pratishtha Consecration</span>
                </div>
                {/* Pricing & Checkout CTA */}
                <div className="flex items-center justify-between pt-space-xs mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-title-lg text-title-lg text-primary font-bold">₹14,999</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant line-through">₹18,500</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Inc. Pooja & Astrological Box</span>
                  </div>
                  <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
                    <span>Order Remedy</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
            {/* Card 2: 5 Mukhi Nepal Rudraksha Bracelet */}
            <article className="flex flex-col rounded-xl bg-surface-container overflow-hidden shadow-xl group">
              {/* Visual Presentation */}
              <div className="relative w-full aspect-[4/3] bg-surface-container-high overflow-hidden">
                <img alt="Authentic 5 Mukhi Nepal Rudraksha bracelet with gold capping on stone slab with dhoop smoke" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/images/rudraksha-bracelet.jpg" />
                {" "}
                {/* Top Healer Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-bold">Top Healer</span>
                </div>
                {/* Planet & Diety Glyph */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span>
                  <span className="font-label-sm text-label-sm tracking-wide">Lord Shiva & Jupiter</span>
                </div>
              </div>
              {/* Details Container */}
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">Devine Kavach</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Origin: Nepal Highlands</span>
                  </div>
                  <h2 className="font-title-lg text-title-lg text-on-surface mt-1 leading-snug">Authentic 5 Mukhi Nepal Rudraksha Bracelet</h2>
                </div>
                {/* Benefits Matrix */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-secondary">self_improvement</span>
                    {" Pacifies Mental Anxiety"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-secondary">monitor_heart</span>
                    {" Regulates Vital Energy"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-secondary">shield</span>
                    {" Aura Protection"}
                  </span>
                </div>
                {/* Temple Consecration Badge */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                    temple_buddhist
                  </span>
                  <span className="font-label-sm text-label-sm leading-tight text-on-surface">
                    Consecrated at Kashi Vishwanath Dham with personalized Sankalpa
                  </span>
                </div>
                {/* Pricing & Checkout CTA */}
                <div className="flex items-center justify-between pt-space-xs mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-title-lg text-title-lg text-primary font-bold">₹2,499</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Silver Plated</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Certificate of Origin included</span>
                  </div>
                  <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
                    <span>Order Remedy</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
            {/* Card 3: Zambian Natural Emerald (Panna) Ring */}
            <article className="flex flex-col rounded-xl bg-surface-container overflow-hidden shadow-xl group">
              {/* Visual Presentation */}
              <div className="relative w-full aspect-[4/3] bg-surface-container-high overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A vivid deep green octagonal Zambian natural emerald set in a sleek modern yellow gold ring band, resting on rich dark raw textured obsidian stone under studio cinematic lighting with subtle atmospheric starlight reflections" src="/images/emerald-ring.jpg" />
                {" "}
                {/* Planet Glyph Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">fitbit_push_ups</span>
                  <span className="font-label-sm text-label-sm tracking-wide">Budha • Mercury</span>
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Budhaditya Harmony</span>
                </div>
              </div>
              {/* Details Container */}
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">Flawless Clarity</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Zambia Myna Mine</span>
                  </div>
                  <h2 className="font-title-lg text-title-lg text-on-surface mt-1 leading-snug">Zambian Natural Emerald (Panna) Ring</h2>
                </div>
                {/* Benefits Matrix */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">lightbulb</span>
                    {" Intellectual Razor Sharpness"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">attach_money</span>
                    {" Commerce Growth"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-xs text-primary">record_voice_over</span>
                    {" Communication Mastery"}
                  </span>
                </div>
                {/* Consecration Guarantee Sub-tier */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-sm text-label-sm leading-tight text-on-surface">IGI / GIA Tested + Energized on Wednesday Sunrise Muhurat</span>
                </div>
                {/* Pricing & Checkout CTA */}
                <div className="flex items-center justify-between pt-space-xs mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-title-lg text-title-lg text-primary font-bold">₹9,800</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">3.25 Carat</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Custom Band Size Fitted</span>
                  </div>
                  <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
                    <span>Order Remedy</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
          {/* Sacred Consecration Process Story Box */}
          <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm mt-space-sm mb-2">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">hotel_class</span>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">The Zodiak Consecration Protocol</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="flex flex-col items-center bg-surface-container p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl mb-1">flare</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">1. Shubh Muhurat</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Aligned to Lagna</span>
              </div>
              <div className="flex flex-col items-center bg-surface-container p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-xl mb-1">psychology</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">2. 108 Japa</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Vedic Pandit Chanted</span>
              </div>
              <div className="flex flex-col items-center bg-surface-container p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed text-xl mb-1">lock</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">3. Sealed Aura</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Gangajal Sanctified</span>
              </div>
            </div>
          </div>
          {/* Trust Guarantee Editorial Footer */}
          <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container mb-space-md shadow-inner">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">shield_locked</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Vedic Authenticity Guarantee</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Every physical remedy is energized during an auspicious Shubh Muhurat and verified by senior Vedic Pandits before dispatch. Shipped with Gangajal consecration water and energized talisman cloth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
