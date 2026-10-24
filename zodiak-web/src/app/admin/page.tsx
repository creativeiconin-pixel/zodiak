export default function AdminDashboardPage() {
  return (
    <>
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col pt-4 pb-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="px-space-lg pb-space-md mb-space-md flex items-center gap-space-sm">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Operational Nodes</span>
      </div>
      <nav className="flex-1 px-space-md space-y-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-xl shadow-[0_0_16px_rgba(212,175,55,0.25)]">
        <a aria-current="page" className="flex items-center justify-between px-space-md py-space-sm transition-all group bg-primary-container text-on-primary-container font-semibold rounded-xl shadow-[0_0_16px_rgba(212,175,55,0.25)]" data-path="pending-gemstone-approvals" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-xl">diamond</span>
            <span className="font-title-md text-body-md font-medium">Pending Gemstones</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-sm text-label-sm font-semibold">8</span>
        </a>
        <a className="flex items-center justify-between px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group" data-path="flagged-sensitive-chats" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-error transition-colors text-xl">crisis_alert</span>
            <span className="font-title-md text-body-md font-medium">Sensitive Chats</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">3</span>
        </a>
        <a className="flex items-center justify-between px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group" data-path="refund-and-dispute-queue" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors text-xl">currency_exchange</span>
            <span className="font-title-md text-body-md font-medium">Refund & Dispute</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm font-semibold">2</span>
        </a>
        <a className="flex items-center justify-between px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group" data-path="consecration-dispatch" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-xl">local_shipping</span>
            <span className="font-title-md text-body-md font-medium">Consecration Dispatch</span>
          </div>
        </a>
        <a className="flex items-center justify-between px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group" data-path="astrologer-audit-log" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-xl">fact_check</span>
            <span className="font-title-md text-body-md font-medium">Astrologer Audit Log</span>
          </div>
        </a>
        <a className="flex items-center justify-between px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group" data-path="analytics" href="#">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-xl">insights</span>
            <span className="font-title-md text-body-md font-medium">Analytics</span>
          </div>
        </a>
      </nav>
      <div className="px-space-md mt-auto pt-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-space-xs text-primary mb-1">
            <span className="material-symbols-outlined text-base">verified</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Vedic Registry</span>
          </div>
          <p className="font-body-sm text-body-sm text-outline">Lahiri Ayanamsa (24°10'33") algorithmically validated for current planetary cycle.</p>
        </div>
      </div>
    </aside>
    <div className="pl-72 flex flex-col min-h-screen">
      <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-space-lg flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img alt="Zodiak Brand Logo" className="h-8 w-auto object-contain" src="/images/zodiak-logo.jpg" />
              <span className="font-title-lg text-title-lg tracking-wider font-bold text-on-surface">ZODIAK OP-CENTER</span>
            </div>
            <div className="h-4 w-px bg-outline-variant/40 mx-space-xs" />
            <div className="relative w-72 lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-surface-container text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary/50 font-body-md transition-all" placeholder="Search kundli, order token, pandit ID..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <div className="w-2 h-2 rounded-full bg-surface-tint animate-pulse" />
              <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface font-semibold">Live Ephemeris: Synced</span>
              <span className="font-label-sm text-label-sm text-outline-variant">• 0.04s</span>
            </div>
            <button aria-label="Notifications" className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
            </button>
            <div className="h-4 w-px bg-outline-variant/40" />
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="flex flex-col text-right">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight">Acharya Sharma</span>
                <span className="font-label-sm text-label-sm text-primary uppercase font-medium">Senior Pandit</span>
              </div>
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40" src="/images/profile-avatar.jpg" />
            </div>
          </div>
        </div>
      </header>
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)] flex-1">
        <div className="flex flex-col w-full">
          {/* Subtle ambient cosmic aura contained at top */}
          <div className="relative w-full overflow-hidden px-space-lg py-space-xl">
            <div className="absolute -top-32 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
              <div className="space-y-space-xs max-w-3xl">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    {" Operational Safeguard Protocol v4.2"}
                  </span>
                  <span className="text-outline text-label-sm uppercase font-label-sm tracking-wider">Ayanamsa: Lahiri</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Remedy Verification & Operational Safeguards</h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Human-in-the-loop review for AI-prescribed gems, sensitive user disclosures, and financial reconciliation. Ensuring metaphysical integrity and algorithmic liability compliance.
                </p>
              </div>
              {/* Quick Action Controls */}
              <div className="flex items-center gap-space-sm self-start md:self-auto">
                <button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface text-label-lg font-label-lg shadow-md hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined text-lg text-outline">history</span>
                  <span>Shift Logs</span>
                </button>
                <button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                  <span className="material-symbols-outlined text-lg">batch_prediction</span>
                  <span>Approve Selected (3)</span>
                </button>
              </div>
            </div>
            {/* KPI Metric Strip (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
              {/* Card 1 */}
              <div className="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden group">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Pending Approvals</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">diamond</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">8</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-label-sm font-label-sm font-semibold">4 High Urgency</span>
                </div>
                <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                  {"Aligned with approaching "}
                  <span className="text-primary font-semibold">Guru Pushya Muhurat</span>
                </p>
                <div className="mt-space-md w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "65%" }} />
                </div>
              </div>
              {/* Card 2 */}
              <div className="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden group">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Flagged AI Chats</span>
                  <div className="w-8 h-8 rounded-lg bg-error-container/30 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-lg">crisis_alert</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-display-lg text-display-lg font-bold text-error">3</span>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-label-sm font-semibold">
                    Intervention Required
                  </span>
                </div>
                <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Medical & severe distress distress filters triggered</p>
                <div className="mt-space-md w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: "100%" }} />
                </div>
              </div>
              {/* Card 3 */}
              <div className="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden group">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Pending Refunds</span>
                  <div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg">currency_exchange</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">₹24,800</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary text-label-sm font-label-sm font-semibold">
                    2 claims
                  </span>
                </div>
                <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Escrow hold: Disputed planetary transit alignment</p>
                <div className="mt-space-md w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: "32%" }} />
                </div>
              </div>
              {/* Card 4 */}
              <div className="relative p-space-lg rounded-xl bg-surface-container-low shadow-md overflow-hidden group">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Pran-Pratishtha Pipeline</span>
                  <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-lg">temple_hindu</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">14</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm font-semibold">Ready</span>
                </div>
                <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Batched for Ujjain & Varanasi sanctification shifts</p>
                <div className="mt-space-md w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: "82%" }} />
                </div>
              </div>
            </div>
            {/* Section 1: Gemstone & Talisman Approval Queue */}
            <div className="mb-space-xl">
              <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                {/* Table Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Gemstone & Talisman Approval Queue</h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      High-value remedy prescriptions requiring verification against D1 (Rasi) & D9 (Navamsha) charts.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <div className="flex items-center bg-surface-container rounded-lg p-1 text-label-sm font-label-sm">
                      <button className="px-3 py-1 rounded bg-surface-container-highest text-primary font-semibold shadow-sm">All (8)</button>
                      <button className="px-3 py-1 rounded text-outline hover:text-on-surface transition-colors">Saturnian (Neelam)</button>
                      <button className="px-3 py-1 rounded text-outline hover:text-on-surface transition-colors">Solar / Jovian</button>
                    </div>
                    <button className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface" title="Filter Records">
                      <span className="material-symbols-outlined text-lg">filter_list</span>
                    </button>
                  </div>
                </div>
                {/* Table Container */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-3 px-space-md rounded-l-lg font-semibold">Order ID & Customer</th>
                        <th className="py-3 px-space-md font-semibold">Prescribed Remedy & Price</th>
                        <th className="py-3 px-space-md font-semibold min-w-[260px]">AI Astrologer Rationale</th>
                        <th className="py-3 px-space-md font-semibold text-center">Chart Suitability</th>
                        <th className="py-3 px-space-md font-semibold">Status</th>
                        <th className="py-3 px-space-md rounded-r-lg font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                      {/* Row 1: Ceylon Yellow Sapphire */}
                      <tr className="hover:bg-surface-container/60 transition-colors group">
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                            </div>
                            <div>
                              <div className="font-title-md text-title-md text-on-surface flex items-center gap-1.5">
                                <span>#ZK-89241</span>
                                <span className="text-xs text-primary font-medium">• Ananya Sharma</span>
                              </div>
                              <div className="font-body-sm text-body-sm text-outline flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[11px]">Libra Lagna</span>
                                <span>Swati Nakshatra (Pada 3)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-xs">
                            <img className="w-9 h-9 rounded-lg object-cover shadow-sm" data-alt="A macro studio photograph of an opulent Ceylon yellow sapphire gemstone set into a handcrafted 18k yellow gold band resting on deep midnight navy crushed velvet under golden starlight illumination." src="/images/yellow-sapphire-admin.jpg" />
                            <div>
                              <div className="font-title-md text-body-md text-on-surface font-semibold">Ceylon Yellow Sapphire</div>
                              <div className="font-body-sm text-body-sm text-primary font-bold">4.25 Ratti • ₹14,999</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="text-on-surface-variant text-body-sm leading-relaxed">
                            <span className="text-secondary font-medium">Rahu Antardasha:</span>
                            {" 12th house transit creating career stagnation; benefic Jupiter 9th aspect requires direct strengthening."}
                          </div>
                        </td>
                        <td className="py-4 px-space-md text-center">
                          <div className="inline-flex flex-col items-center">
                            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-label-sm text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>D1/D9 Chart</span>
                            </button>
                            <span className="text-[11px] text-primary font-semibold mt-1">94% Compatibility</span>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {" Awaiting Approval"}
                          </span>
                        </td>
                        <td className="py-4 px-space-md text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">check_circle</span>
                              <span>Approve</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all font-label-md text-label-md" title="Edit Carat or Mantra">
                              <span className="material-symbols-outlined text-base">tune</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-error-container/30 text-error hover:bg-error-container/60 transition-all font-label-md text-label-md" title={"Reject & Refund"}>
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 2: Blue Sapphire Neelam (High Risk) */}
                      <tr className="hover:bg-surface-container/60 transition-colors group">
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-xl bg-error-container/20 text-error flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">warning</span>
                            </div>
                            <div>
                              <div className="font-title-md text-title-md text-on-surface flex items-center gap-1.5">
                                <span>#ZK-89255</span>
                                <span className="text-xs text-on-surface font-medium">• Vikramaditya Roy</span>
                              </div>
                              <div className="font-body-sm text-body-sm text-outline flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[11px]">Taurus Lagna</span>
                                <span>Pushya Nakshatra (Pada 1)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-xs">
                            <img className="w-9 h-9 rounded-lg object-cover shadow-sm" data-alt="A close-up studio shot of a raw, untreated royal Kashmir Blue Sapphire in an intricate platinum claw mounting on obsidian slate with deep cosmic violet backlighting." src="/images/blue-sapphire.jpg" />
                            <div>
                              <div className="font-title-md text-body-md text-on-surface font-semibold">Blue Sapphire (Neelam)</div>
                              <div className="font-body-sm text-body-sm text-secondary font-bold">5.10 Ratti • ₹28,000</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="p-2 rounded-lg bg-error-container/20 text-on-surface-variant text-body-sm leading-relaxed">
                            <span className="text-error font-semibold uppercase tracking-wider text-[11px]">Caution:</span>
                            {" Saturn in 8th house aspecting Lagna. Mandatory 3-day Amethyst pillow trial test recommended before setting."}
                          </div>
                        </td>
                        <td className="py-4 px-space-md text-center">
                          <div className="inline-flex flex-col items-center">
                            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/30 text-secondary hover:bg-secondary-container/50 transition-all font-label-sm text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>D1/D9 Chart</span>
                            </button>
                            <span className="text-[11px] text-error font-semibold mt-1">68% Risk Threshold</span>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-error font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" />
                            {" Special Trial Hold"}
                          </span>
                        </td>
                        <td className="py-4 px-space-md text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-all shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-base text-secondary">science</span>
                              <span>Order Amethyst Test</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all font-label-md text-label-md" title="Edit Formulation">
                              <span className="material-symbols-outlined text-base">tune</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-error-container text-on-error-container hover:opacity-90 transition-all font-label-md text-label-md" title={"Reject & Refund"}>
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 3: Red Coral Moonga */}
                      <tr className="hover:bg-surface-container/60 transition-colors group">
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                            </div>
                            <div>
                              <div className="font-title-md text-title-md text-on-surface flex items-center gap-1.5">
                                <span>#ZK-89280</span>
                                <span className="text-xs text-on-surface font-medium">• Priya Iyer</span>
                              </div>
                              <div className="font-body-sm text-body-sm text-outline flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[11px]">Aries Lagna</span>
                                <span>Rohini Nakshatra (Pada 4)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="flex items-center gap-space-xs">
                            <img className="w-9 h-9 rounded-lg object-cover shadow-sm" data-alt="Macro luxury product still of an untreated triangular Italian Red Coral stone encased in warm polished copper alloy with celestial astrolabe lines engraved in the metal." src="/images/red-coral.jpg" />
                            <div>
                              <div className="font-title-md text-body-md text-on-surface font-semibold">Italian Red Coral (Moonga)</div>
                              <div className="font-body-sm text-body-sm text-primary font-bold">6.50 Ratti • ₹7,500</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <div className="text-on-surface-variant text-body-sm leading-relaxed">
                            <span className="text-primary font-medium">Mangal Dosha Neutralization:</span>
                            {" Mars placed in 7th house causing marital discord. High vitality copper ring prescribed."}
                          </div>
                        </td>
                        <td className="py-4 px-space-md text-center">
                          <div className="inline-flex flex-col items-center">
                            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-label-sm text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>D1/D9 Chart</span>
                            </button>
                            <span className="text-[11px] text-primary font-semibold mt-1">98% Compatibility</span>
                          </div>
                        </td>
                        <td className="py-4 px-space-md">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {" Awaiting Approval"}
                          </span>
                        </td>
                        <td className="py-4 px-space-md text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">check_circle</span>
                              <span>Approve</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all font-label-md text-label-md" title="Edit Details">
                              <span className="material-symbols-outlined text-base">tune</span>
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-error-container/30 text-error hover:bg-error-container/60 transition-all font-label-md text-label-md" title={"Reject & Refund"}>
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Section 2: Flagged Sensitive Chats & Human Escalations */}
            <div className="mb-space-xl">
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-error text-xl">health_and_safety</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Flagged Sensitive Conversations</h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline mt-1">
                    Automatic guardrail triggers: AI astrologer halted fatalistic projections and paused conversation.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-error-container/30 text-error font-label-sm text-label-sm font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                  {" 2 Requires Human Pandit Follow-up"}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                {/* Escalation Card 1 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-space-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-title-lg text-title-lg text-on-surface">Rahul M.</span>
                          <span className="font-label-sm text-label-sm text-outline font-semibold">User #US-44910</span>
                        </div>
                        <div className="text-body-sm font-body-sm text-outline mt-0.5">Session Ref: #CT-4091 • 13:42 IST</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        Critical Health Flag
                      </span>
                    </div>
                    {/* Escalation Context */}
                    <div className="p-space-md rounded-xl bg-surface-container space-y-2">
                      <div className="flex items-center justify-between text-label-sm font-label-sm text-outline">
                        <span className="font-semibold text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">emergency</span>
                          {" Severe Depressive Episode Keyword"}
                        </span>
                        <span>Rahu-Ketu Transit Axis</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface italic">
                        “User queried fatalistic longevity questions citing inability to survive upcoming Saturn return. System blocked generative predictions instantly.”
                      </p>
                    </div>
                    <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">verified</span>
                      <span>Action Taken: Dispatched Vandrevala Mental Health Helpline widget; astrological output quarantined.</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-space-md mt-space-md border-t border-surface-container-highest/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center font-label-sm font-bold">
                        VS
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface">Assigned: Pandit Vidyadhar Shastri</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-label-sm font-semibold hover:bg-surface-container-highest transition-all">
                        View Chat Transcript
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-label-sm font-semibold hover:bg-primary-fixed-dim transition-all">
                        Initiate Compassionate Outreach
                      </button>
                    </div>
                  </div>
                </div>
                {/* Escalation Card 2 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-space-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-title-lg text-title-lg text-on-surface">Sneha K.</span>
                          <span className="font-label-sm text-label-sm text-outline font-semibold">User #US-71932</span>
                        </div>
                        <div className="text-body-sm font-body-sm text-outline mt-0.5">Session Ref: #CT-4108 • 14:02 IST</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                        Legal Conflict Flag
                      </span>
                    </div>
                    {/* Escalation Context */}
                    <div className="p-space-md rounded-xl bg-surface-container space-y-2">
                      <div className="flex items-center justify-between text-label-sm font-label-sm text-outline">
                        <span className="font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">gavel</span>
                          {" Property Litigation Verdict"}
                        </span>
                        <span>Mars in 6th House (Shatru Bhava)</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface italic">
                        “User seeking guarantees on civil court outcome for ancestral land parcel. Prompted AI to validate falsified documents against astrological muhurat.”
                      </p>
                    </div>
                    <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">verified</span>
                      <span>Action Taken: Standard Vedic counseling disclaimer injected; strict refusal of judicial predictions applied.</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-space-md mt-space-md border-t border-surface-container-highest/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="font-body-sm text-body-sm text-on-surface">Status: Statutory Disclaimer Acknowledged</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-label-sm font-semibold hover:bg-surface-container-highest transition-all">
                        Audit Transcript
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-outline hover:text-on-surface text-label-sm font-label-sm font-semibold transition-all">
                        Resolve & Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section 3: Astrologer Activity Log & Audit Trail (Full Table) */}
            <div className="mb-space-xl">
              <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-xl">fact_check</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Astrologer Activity Log & Immutable Audit Trail</h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Cryptographically hashed actions taken by senior pandits, temple priests, and algorithmic safeguards.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-xs text-label-sm font-label-sm text-outline">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Ledger Block Height: #892,109</span>
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-3 px-space-md rounded-l-lg font-semibold">Timestamp (IST)</th>
                        <th className="py-3 px-space-md font-semibold">Pandit / Agent Name</th>
                        <th className="py-3 px-space-md font-semibold">Action Type</th>
                        <th className="py-3 px-space-md font-semibold">Ref Token</th>
                        <th className="py-3 px-space-md font-semibold">Outcome & Details</th>
                        <th className="py-3 px-space-md rounded-r-lg font-semibold text-right">Verification Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/40 font-body-md text-body-md text-on-surface">
                      {/* Log Entry 1 */}
                      <tr className="hover:bg-surface-container/40 transition-colors">
                        <td className="py-3.5 px-space-md text-body-sm font-mono text-outline">14:15:02</td>
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-2">
                            <img alt="Pandit avatar" className="w-6 h-6 rounded-full object-cover" src="/images/profile-avatar.jpg" />
                            <span className="font-title-md text-body-md text-on-surface">Pandit Vidyadhar Shastri</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-label-sm font-label-sm font-semibold">
                            Approved Yellow Sapphire
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-mono text-body-sm text-on-surface-variant font-medium">#ZK-89241</td>
                        <td className="py-3.5 px-space-md text-body-sm text-on-surface">Cleared for Guru Pushya Sankalpa (16,000 Brihaspati Japa scheduled)</td>
                        <td className="py-3.5 px-space-md text-right font-mono text-body-sm text-outline">0x7f4a...9b12</td>
                      </tr>
                      {/* Log Entry 2 */}
                      <tr className="hover:bg-surface-container/40 transition-colors">
                        <td className="py-3.5 px-space-md text-body-sm font-mono text-outline">13:48:19</td>
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs">
                              <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </div>
                            <span className="font-title-md text-body-md text-on-surface">AI System (Brihaspati v4)</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md">
                          <span className="px-2 py-0.5 rounded bg-error-container/40 text-error text-label-sm font-label-sm font-semibold">
                            Auto-Flagged Sensitive Chat
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-mono text-body-sm text-on-surface-variant font-medium">#CT-4091</td>
                        <td className="py-3.5 px-space-md text-body-sm text-on-surface">
                          Routed to human intervention; blocked suicide / distress outcome projections
                        </td>
                        <td className="py-3.5 px-space-md text-right font-mono text-body-sm text-outline">0x41e8...cc04</td>
                      </tr>
                      {/* Log Entry 3 */}
                      <tr className="hover:bg-surface-container/40 transition-colors">
                        <td className="py-3.5 px-space-md text-body-sm font-mono text-outline">12:30:11</td>
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-xs font-bold">
                              AR
                            </div>
                            <span className="font-title-md text-body-md text-on-surface">Acharya Ramanathan</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md">
                          <span className="px-2 py-0.5 rounded bg-error-container/20 text-on-error-container text-label-sm font-label-sm font-semibold">
                            Rejected Diamond Prescription
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-mono text-body-sm text-on-surface-variant font-medium">#ZK-88902</td>
                        <td className="py-3.5 px-space-md text-body-sm text-on-surface">
                          Incompatible with Scorpio Lagna (Venus functional malefic). 100% refund ₹34,000 processed.
                        </td>
                        <td className="py-3.5 px-space-md text-right font-mono text-body-sm text-outline">0x3bc1...e08a</td>
                      </tr>
                      {/* Log Entry 4 */}
                      <tr className="hover:bg-surface-container/40 transition-colors">
                        <td className="py-3.5 px-space-md text-body-sm font-mono text-outline">11:15:44</td>
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center text-primary text-xs font-bold">TG</div>
                            <span className="font-title-md text-body-md text-on-surface">Temple Priest Govind</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md">
                          <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface text-label-sm font-label-sm font-semibold">
                            Consecration Completed
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-mono text-body-sm text-on-surface-variant font-medium">#ZK-88410</td>
                        <td className="py-3.5 px-space-md text-body-sm text-on-surface">
                          108 Gayatri Jaap recorded; digital proof & consecrated yantra dispatched
                        </td>
                        <td className="py-3.5 px-space-md text-right font-mono text-body-sm text-outline">0x99a2...11ff</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between pt-space-md mt-space-md border-t border-surface-container-highest/40 text-body-sm font-body-sm text-outline">
                  <span>Showing 4 of 148 operational entries (Past 24 Hours)</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface disabled:opacity-40">
                      Previous
                    </button>
                    <button className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
