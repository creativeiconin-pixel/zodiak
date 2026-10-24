export default function OrderStatusPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl">
        {/* Subtle Ambient Glow Orbs */}
        <div className="relative w-full overflow-hidden">
          {/* Order Summary Pill Header */}
          <div className="flex items-center justify-between mt-space-sm mb-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-base">receipt_long</span>
              </span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block">Reference ID</span>
                {" "}
                <span className="font-title-md text-title-md text-on-surface font-semibold tracking-wide">#ZK-89241</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">In Verification</span>
            </div>
          </div>
          {/* Gemstone Item Card (Smoked Obsidian Glassmorphism) */}
          <div className="relative rounded-xl p-space-md bg-surface-container/80 backdrop-blur-xl shadow-xl overflow-hidden mb-space-lg">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-space-md relative z-10">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-md bg-surface-container-highest">
                <img className="w-full h-full object-cover" data-alt="Exquisite macro shot of a certified Ceylon Yellow Sapphire gemstone set in a handcrafted pure gold Vedic astrology ring, resting on dark textured volcanic obsidian with warm ethereal starlight reflections and subtle divine gold glow." src="/images/yellow-sapphire-order.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1.5 font-label-sm text-label-sm text-primary font-bold">4.25 Ratti</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">Vedic Sanctified Grade</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold leading-snug truncate">Natural Ceylon Yellow Sapphire Ring</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-1">Pukhraj • 18K Solid Satvik Gold • D1 Jupiter Benefic</p>
                <div className="flex items-baseline gap-space-xs mt-2">
                  <span className="font-title-md text-title-md font-bold text-primary">₹48,500</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">incl. Pran-Pratishtha</span>
                </div>
              </div>
            </div>
          </div>
          {/* Active Vedic Consecration Progress Timeline */}
          <div className="rounded-xl p-space-md bg-surface-container/60 backdrop-blur-xl shadow-xl mb-space-lg">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">timeline</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Consecration Journey</h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Step 2 of 5</span>
            </div>
            {/* Vertical Stepper List */}
            <div className="relative pl-6 space-y-space-lg">
              {/* Vertical Continuous Track Line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-surface-container-highest" />
              <div className="absolute left-2.5 top-3 h-16 w-0.5 bg-gradient-to-b from-primary via-secondary to-secondary-container" />
              {/* Milestone 1: Paid (Completed) */}
              <div className="relative flex items-start gap-space-md">
                <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-on-primary text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-medium">Payment Confirmed</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Oct 24, 11:30 AM</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Securely authorized via Pine Labs Gateway. Transit vault assigned.</p>
                </div>
              </div>
              {/* Milestone 2: Expert Review (Active Glowing State) */}
              <div className="relative flex items-start gap-space-md p-space-sm -mx-space-sm rounded-lg bg-surface-container-high/70 shadow-[0_0_24px_rgba(87,27,193,0.35)]">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center shadow-[0_0_12px_rgba(208,188,255,0.8)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-primary font-semibold flex items-center gap-1">
                      {"Awaiting Expert Approval "}
                      <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">In Progress</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-relaxed">
                    Pandit Vidyadhar Shastri is reviewing your natal D1 & D9 charts against this gemstone’s vibrational matrix.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    <span className="font-label-sm text-label-sm font-medium">Est. Completion: Today, 4:00 PM</span>
                  </div>
                </div>
              </div>
              {/* Milestone 3: Consecration (Upcoming) */}
              <div className="relative flex items-start gap-space-md opacity-60">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-medium">Approved & Consecrated</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Stage 3</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Energized through Vedic Pran-Pratishtha during auspicious Guru Muhurat.
                  </p>
                </div>
              </div>
              {/* Milestone 4: Shipped (Upcoming) */}
              <div className="relative flex items-start gap-space-md opacity-60">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-medium">Secured Dispatch</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Stage 4</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Handed to insured tamper-proof courier with live encrypted GPS tracking.
                  </p>
                </div>
              </div>
              {/* Milestone 5: Delivered (Upcoming) */}
              <div className="relative flex items-start gap-space-md opacity-60">
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-medium">Sacred Delivery</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Stage 5</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Arrival in sanctified silk vault box with energized copper yantra card.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Detailed Status Focus: Expert Pandit Review Card */}
          <div className="rounded-xl p-space-md bg-surface-container/70 backdrop-blur-xl shadow-xl mb-space-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">psychology_alt</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Astrological Audit Active</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="font-label-sm text-label-sm font-semibold">100% Assurance</span>
              </div>
            </div>
            {/* Pandit Profile Snippet */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest/70 mb-space-md">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high shadow-inner">
                <img className="w-full h-full object-cover" data-alt="Dignified portrait of revered senior Vedic Astrologer Pandit Vidyadhar Shastri wearing ceremonial saffron attire with sacred tilak, gentle wise expression, soft temple library lighting in background." src="/images/pandit-vidyadhar.jpg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-title-md text-title-md text-on-surface font-semibold truncate">Pandit Vidyadhar Shastri</span>
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant block truncate">Senior Jyotish Acharya • 28+ Yrs Tradition</span>
                {" "}
                <span className="font-label-sm text-label-sm text-secondary font-medium block mt-0.5">Kashi Jyotish Parishad Certified</span>
              </div>
            </div>
            {/* Chart Compatibility Guarantee Clause */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/50 flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-lg mt-0.5 shrink-0">shield</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {"If your chart reveals any planetary conflict or negative Dasha resonance with Jupiter (Guru), our Pandit will recommend a harmonious alternative or issue an "}
                <span className="text-on-surface font-semibold">instant 100% full refund</span>
                {" before physical mounting."}
              </p>
            </div>
            {/* Micro Interactive Chart Check Preview */}
            <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">auto_graph</span>
                <span className="font-label-sm text-label-sm">Analyzing: Kundli #K-40192 (Guru Dasha Active)</span>
              </div>
              <button className="font-label-sm text-label-sm text-primary font-bold hover:underline flex items-center gap-0.5" id="view-chart-details-btn">
                {"View Audit "}
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
          {/* Sacred Temple Coordinator Banner */}
          <div className="rounded-xl p-space-md bg-gradient-to-br from-secondary-container/40 via-surface-container to-surface-container-high shadow-lg mb-space-lg flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shrink-0 shadow-md">
                <span className="material-symbols-outlined text-xl">self_improvement</span>
              </div>
              <div className="min-w-0">
                <span className="font-title-md text-title-md text-on-surface font-semibold block truncate">Consecration Sankalpa</span>
                {" "}
                <span className="font-body-sm text-body-sm text-on-surface-variant block truncate">Registered under: Rahul M. Sharma, Gotra: Kashyapa</span>
              </div>
            </div>
            <button className="shrink-0 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-transform" id="coordinator-chat-btn">
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              {" Temple Desk"}
            </button>
          </div>
          {/* Action Center */}
          <div className="flex flex-col gap-space-sm">
            <button className="w-full h-13 py-3 px-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-title-md text-title-md font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-md active:scale-[0.99]" id="download-invoice-btn">
              <span className="material-symbols-outlined text-primary text-xl">download</span>
              {" Download Consecration Invoice"}
            </button>
            <div className="grid grid-cols-2 gap-space-sm">
              <a className="h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm" href="#">
                <span className="material-symbols-outlined text-base">support_agent</span>
                {" Need Help?"}
              </a>
              <a className="h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 transition-transform shadow-md active:scale-95" href="#">
                <span className="material-symbols-outlined text-base">home</span>
                {" Back to Home"}
              </a>
            </div>
          </div>
        </div>
        {/* Interactive Modal / Drawer for Chart Audit Details (Hidden by Default) */}
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md hidden flex-col justify-end p-margin-mobile" id="chart-audit-drawer">
          <div className="w-full bg-surface-container-high rounded-2xl p-space-lg shadow-2xl relative">
            <div className="w-10 h-1 bg-outline/40 rounded-full mx-auto mb-space-md" />
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Vedic Compatibility</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Gemstone Harmonic Alignment</h4>
              </div>
              <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant" id="close-drawer-btn">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-space-sm mb-space-lg">
              <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container">
                <span className="font-body-md text-body-md text-on-surface-variant">Primary Planetary Lord</span>
                <span className="font-title-md text-title-md text-primary font-semibold">Brihaspati (Jupiter)</span>
              </div>
              <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container">
                <span className="font-body-md text-body-md text-on-surface-variant">Ascendant / Lagna</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Dhanu (Sagittarius)</span>
              </div>
              <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container">
                <span className="font-body-md text-body-md text-on-surface-variant">Suggested Finger</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Index (Tarjani)</span>
              </div>
              <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container">
                <span className="font-body-md text-body-md text-on-surface-variant">Pran-Pratishtha Muhurat</span>
                <span className="font-title-md text-title-md text-secondary font-semibold">Thursday, Shukla Paksha</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold shadow-lg" id="acknowledge-btn">
              Understood • Continue Review
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
