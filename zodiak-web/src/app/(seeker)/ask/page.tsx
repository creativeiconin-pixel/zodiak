export default function AskPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface-container-lowest">
      <div className="flex flex-col w-full relative px-margin-mobile space-y-space-md">
        {/* Ambient Cosmic Nebular Glow */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-64 bg-secondary-container/20 blur-[90px] rounded-full -z-10" />
        {/* AI Astrologer Status Banner */}
        <div className="w-full bg-surface-container/70 backdrop-blur-xl rounded-xl p-space-sm flex items-center justify-between shadow-md">
          <div className="flex items-center gap-space-sm">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container/40">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_#f2ca50] animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary relative" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-md text-title-md text-on-surface truncate">Zodiak Sentient Astrologer</span>
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="flex items-center gap-1 text-secondary text-label-sm font-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                <span>Vedic Ephemeris Connected</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high/80 px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-xs text-primary">auto_graph</span>
            <span>D1/D9 Live</span>
          </div>
        </div>
        {/* Problem Category Quick-Pills */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5 -mx-margin-mobile px-margin-mobile flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-sm">workspace_premium</span>
            <span>Career & Wealth</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">favorite</span>
            <span>Marriage & Love</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">vital_signs</span>
            <span>Health & Vitality</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">hourglass_top</span>
            <span>Dasha Timing</span>
          </button>
        </div>
        {/* Chat History Feed */}
        <div className="flex flex-col space-y-space-md w-full pt-1">
          {/* User Message */}
          <div className="flex flex-col items-end self-end max-w-[85%] space-y-1">
            <div className="bg-surface-container-high text-on-surface rounded-2xl rounded-tr-sm p-3.5 shadow-md">
              <p className="font-body-md text-body-md leading-relaxed">
                I have been facing recurring delays in my promotion and feel an intense restlessness at work since August. Is this due to my current Dasha?
              </p>
            </div>
            <div className="flex items-center gap-1 pr-1 font-label-sm text-label-sm text-outline">
              <span>09:42 PM</span>
              <span className="material-symbols-outlined text-xs text-primary">done_all</span>
            </div>
          </div>
          {/* AI Astrologer Response */}
          <div className="flex items-start gap-space-xs self-start max-w-[96%] w-full">
            {/* Astrologer Avatar Glyph */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary-container via-surface-container to-primary-container flex items-center justify-center shrink-0 shadow-sm mt-1">
              <span className="material-symbols-outlined text-on-primary text-base">psychology</span>
            </div>
            <div className="flex flex-col space-y-space-sm w-full min-w-0">
              {/* Text Bubble */}
              <div className="bg-surface-container/90 backdrop-blur-xl text-on-surface rounded-2xl rounded-tl-sm p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Ephemeris Reading</span>
                  <span className="font-label-sm text-label-sm text-outline">Just now</span>
                </div>
                <p className="font-body-md text-body-md leading-relaxed">
                  {"Namaste Ananya. Looking at your chart, you entered your "}
                  <strong className="text-primary font-semibold">Rahu Antardasha</strong>
                  {" under "}
                  <strong className="text-primary font-semibold">Jupiter Mahadasha</strong>
                  {" in late July. Rahu sits in your 12th house in Virgo, which naturally stirs mental anxiety and illusions of stagnation."}
                </p>
                <p className="font-body-md text-body-md leading-relaxed">
                  {"However, Jupiter's benefic 9th aspect on your 10th house of career promises a major elevation by "}
                  <strong className="text-secondary font-semibold">February 2025</strong>
                  .
                </p>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {"To neutralize Rahu's erratic pull and channel Jupiter's wisdom, your primary recommended remedial measure is wearing an energized "}
                  <strong className="text-primary font-semibold">Yellow Sapphire (Pukhraj)</strong>
                  .
                </p>
              </div>
              {/* Remedial Prescription Interactive Card */}
              <div className="w-full bg-surface-container-high/90 backdrop-blur-2xl rounded-xl p-3.5 shadow-xl space-y-3">
                {/* Card Header & Pandit Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">flare</span>
                    {" Prescribed Planetary Remedy"}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/60 text-primary-fixed">
                    <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-sm text-label-sm uppercase">Verified by Vedic Pandit</span>
                  </div>
                </div>
                {/* Product Details Row */}
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-md bg-surface-container-lowest">
                    <img className="w-full h-full object-cover" data-alt="Exquisite macro shot of a certified Ceylon Yellow Sapphire (Pukhraj) gemstone set in an engraved yellow gold ring on dark midnight blue velvet fabric, brilliant cushion cut facet reflections, radiant warm yellow glow with microscopic Vedic gold engravings" src="/images/yellow-sapphire-chat.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 to-transparent" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <h4 className="font-title-md text-title-md text-on-surface truncate">Natural Ceylon Yellow Sapphire</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-xs text-secondary">wb_sunny</span>
                      {" Devaguru Brihaspati (Jupiter)"}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-title-lg text-title-lg text-primary font-bold">₹14,999</span>
                      <span className="font-label-sm text-label-sm text-outline">inc. consecration</span>
                    </div>
                  </div>
                </div>
                {/* Vedic Consecration Specs */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-surface-container-lowest/60 text-on-surface-variant font-label-sm text-label-sm">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-xs text-primary">schedule</span>
                    <span>Muhurta: Guru Pushya</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-xs text-secondary">temple_hindu</span>
                    <span>108 Mantra Jaap</span>
                  </div>
                </div>
                {/* Interactive Action Button */}
                <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform" id="openRemedyDetails">
                  <span>View Remedy & Consecration Details</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
              {/* Astrological Follow-up Prompts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm active:scale-95 transition-transform flex items-center gap-1">
                  <span>When should I wear it?</span>
                  <span className="material-symbols-outlined text-xs text-primary">north_east</span>
                </button>
                <button className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm active:scale-95 transition-transform flex items-center gap-1">
                  <span>Any substitute mantra?</span>
                  <span className="material-symbols-outlined text-xs text-primary">north_east</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Input Bar (Interactive Sticky Anchor) */}
        <div className="sticky bottom-2 z-20 w-full pt-2">
          <div className="bg-surface-container/95 backdrop-blur-2xl rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
            <button aria-label="Add Kundli Document or Chart" className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface active:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </button>
            <div className="flex-1 flex items-center bg-surface-container-lowest/80 rounded-xl px-3 py-1.5 min-w-0">
              <input className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none" id="chatInput" placeholder="Ask Brihaspati AI about your chart..." type="text" />
              <button aria-label="Voice input" className="text-on-surface-variant hover:text-primary transition-colors p-1">
                <span className="material-symbols-outlined text-xl">mic</span>
              </button>
            </div>
            <button aria-label="Send message" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0" id="sendChatBtn">
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
