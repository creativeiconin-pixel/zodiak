export default function CheckoutPage() {
  return (
    <>
    <main className="flex-1 flex flex-col relative w-full pt-16 pb-safe bg-surface-container-lowest">
      <div className="flex flex-col w-full text-on-surface">
        {/* Atmospheric cosmic glow backdrop */}
        <div className="relative w-full px-margin-mobile pt-space-md pb-space-xl space-y-space-md">
          {/* Stepper & Headline Progress */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {" Step 2 of 2: Shipping & Payment"}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                {" Sacred Guarantee"}
              </span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-container via-primary to-secondary rounded-full w-full" />
            </div>
            <div className="pt-space-xs">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold">Sacred Checkout & Consecration Order</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Finalize your energized talisman and personalized Vedic planetary alignment.
              </p>
            </div>
          </div>
          {/* Human Astrologer Safeguard Banner (Escrow Guarantee) */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-space-sm relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-title-md text-title-md text-primary font-bold">Human Expert Approval Guarantee</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm uppercase tracking-wider">
                    Escrow Protection
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {"Your payment is held securely in escrow. An expert Vedic Pandit personally verifies your Kundli against this gemstone before the order is cast. If energetically unsuitable, you receive a "}
                  <span className="text-on-surface font-semibold">100% immediate refund</span>
                  .
                </p>
              </div>
            </div>
          </div>
          {/* Order Summary Card */}
          <div className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                {" Sanctified Gemstone Item"}
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded-full font-medium">Qty: 1</span>
            </div>
            {/* Item Preview Grid */}
            <div className="flex gap-space-sm items-center">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest shadow-inner">
                <img alt="Natural Ceylon Yellow Sapphire Ring" className="w-full h-full object-cover" src="/images/yellow-sapphire-ring.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/70 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold tracking-wider text-primary bg-surface-container-lowest/80 px-1 rounded">
                  18k Gold
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-title-md text-title-md text-on-surface truncate">Natural Ceylon Yellow Sapphire (Pukhraj) Ring</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">18k Hallmarked Yellow Gold • 4.25 Ratti (Natural Unheated)</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-title-lg text-title-lg text-primary font-bold">₹14,999</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through">₹16,499</span>
                </div>
              </div>
            </div>
            {/* Consecration & Muhurat Badges */}
            <div className="grid grid-cols-1 gap-space-xs pt-space-xs">
              <div className="flex items-center gap-2.5 bg-surface-container-low p-space-sm rounded-lg">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <div className="flex-1 min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface block font-medium">Free Vedic Consecration & Lab Certificate</span>
                  {" "}
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Includes IGI/GTL Gemological Certification (₹1,500 value)</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider shrink-0">Included</span>
              </div>
              <div className="flex items-center gap-2.5 bg-surface-container-low p-space-sm rounded-lg">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                <div className="flex-1 min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface block font-medium">Astrological Muhurat Energization</span>
                  {" "}
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {"Ritual slated for auspicious "}
                    <strong className="text-secondary">Guru Pushya Nakshatra (Oct 28)</strong>
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              </div>
            </div>
            {/* Cost Breakdown */}
            <div className="pt-space-xs space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>Gemstone & Setting Subtotal</span>
                <span className="text-on-surface font-medium">₹14,999</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prana Pratishtha Consecration</span>
                <span className="text-primary font-medium">FREE (Worth ₹1,500)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Specialized Insured Shipping</span>
                <span className="text-primary font-medium">FREE</span>
              </div>
              <div className="pt-space-xs flex justify-between items-center text-on-surface font-title-lg text-title-lg font-bold">
                <span>Total Order Value</span>
                <span className="text-primary">₹14,999</span>
              </div>
            </div>
          </div>
          {/* Delivery Address Form for Physical Items */}
          <div className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                {" Insured Delivery Details"}
              </span>
              <button className="font-label-md text-label-md text-primary hover:underline" type="button">Edit</button>
            </div>
            <form className="space-y-space-sm">
              <div className="grid grid-cols-1 gap-space-sm">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="name">Recipient Full Name</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-2.5 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" id="name" type="text" defaultValue="Ananya Sharma" />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">person</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="phone">Contact Number (For Courier OTP)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-2.5 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" id="phone" type="tel" defaultValue="+91 98765 43210" />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">call</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="addr1">Address Line 1</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-2.5 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" id="addr1" type="text" defaultValue="Flat 402, Celestial Heights, 12th Main" />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">home</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="city_state">City & Postal Code</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-2.5 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" id="city_state" type="text" defaultValue="Indiranagar, Bengaluru, Karnataka - 560038" />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">pin_drop</span>
                  </div>
                </div>
              </div>
              {/* Packaging notice */}
              <div className="rounded-lg bg-surface-container-low p-2.5 flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0">inventory_2</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  <span className="text-on-surface font-medium">Sacred Packaging:</span>
                  {" Discreet & insured velvet vault box with tamper-evident sacred lead seal."}
                </p>
              </div>
            </form>
          </div>
          {/* Pine Labs Payment Section */}
          <div className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">credit_card</span>
                {" Payment Gateway"}
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs text-primary">verified</span>
                {" Pine Labs Secure"}
              </span>
            </div>
            {/* Supported Payment Rails Visual Chips */}
            <div className="bg-surface-container-low rounded-lg p-space-sm space-y-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block">Supported Payment Channels</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">account_balance_wallet</span>
                  {" UPI Instant (GPay / PhonePe)"}
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">credit_card</span>
                  {" Cards (Visa, RuPay, MC)"}
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">account_balance</span>
                  {" NetBanking"}
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md font-semibold">
                  No-Cost EMI from ₹2,500/mo
                </span>
              </div>
            </div>
            {/* Call to Action Button */}
            <button className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-title-lg text-title-lg font-bold py-4 px-space-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2" type="button">
              <span className="material-symbols-outlined text-xl">lock</span>
              <span>Pay ₹14,999 with Pine Labs</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            {/* Trust Footnote & Security Badges */}
            <div className="flex flex-col items-center justify-center gap-1.5 pt-space-xs text-center">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">lock_clock</span>
                  {" 256-bit Bank Grade Encryption"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
                  {" PCI-DSS Certified"}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                By completing this payment, you authorize the Vedic Pandit council to access your astrological coordinates for personalized consecration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
