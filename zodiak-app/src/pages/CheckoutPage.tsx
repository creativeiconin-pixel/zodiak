import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackHeader } from "../components/BackHeader";
import { Reveal } from "../components/motion/Reveal";
import { ErrorCard, LoadingCard } from "../components/StatusMessage";
import { useT } from "../i18n";
import { common } from "../i18n/common";
import { checkoutText } from "../i18n/pages/checkout";
import { api, ApiError, inr } from "../lib/api";
import { useBirthProfile } from "../lib/birthProfile";
import { useSession } from "../lib/session";
import { useAsync } from "../lib/useAsync";


type DeliveryForm = { customer_name: string; customer_phone: string; address_line: string; city_postal: string };

const FIELDS: { key: keyof DeliveryForm; icon: string; type: string; autoComplete: string }[] = [
  { key: "customer_name", icon: "person", type: "text", autoComplete: "name" },
  { key: "customer_phone", icon: "call", type: "tel", autoComplete: "tel" },
  { key: "address_line", icon: "home", type: "text", autoComplete: "address-line1" },
  { key: "city_postal", icon: "pin_drop", type: "text", autoComplete: "address-level2" },
];

export default function CheckoutPage() {
  const t = useT(checkoutText);
  const names = useT(common);
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { seeker } = useSession();
  const { chart } = useBirthProfile();
  const { data: remedy, error: loadError, loading, reload } = useAsync(() => api.remedy(slug), [slug, names]);
  const [form, setForm] = useState<DeliveryForm>({ customer_name: "", customer_phone: "", address_line: "", city_postal: "" });
  const [submitError, setSubmitError] = useState<ApiError>();
  const [submitting, setSubmitting] = useState(false);
  const { data: appConfig } = useAsync(api.appConfig);
  // UPI QR: the order page shows the QR and asks for the UTR; Pine Labs uses its hosted page; otherwise sandbox
  const upi = appConfig?.payments === "upi";
  const sandbox = !upi && appConfig?.payments !== "pinelabs";

  useEffect(() => {
    if (seeker) setForm((f) => ({ ...f, customer_name: f.customer_name || seeker.name, customer_phone: f.customer_phone || (seeker.phone ?? "") }));
  }, [seeker]);

  async function placeOrder(event: FormEvent) {
    event.preventDefault();
    if (!remedy) return;
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      // Lagna and nakshatra go to the pandit in English, the Op-Center's working language
      const { order, checkoutUrl } = await api.placeOrder({
        remedy: remedy.slug,
        ...form,
        lagna: chart ? `${common.en.signs[chart.ascendant.sign]} Lagna` : null,
        nakshatra: chart ? `${common.en.nakshatras[chart.planets.Moon.nakshatra]} Nakshatra (Pada ${chart.planets.Moon.pada})` : null,
      });
      // With Pine Labs configured, pay on its hosted page; it sends the browser back to the order page afterwards
      if (checkoutUrl) return window.location.assign(checkoutUrl);
      navigate(`/orders/${order.reference}`, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error : new ApiError(String(error), 0));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || loadError || !remedy) {
    return (
      <>
        <BackHeader title={t.header} />
        <main className="flex-1 w-full max-w-screen-sm mx-auto pt-20 pb-24 px-margin-mobile">
          {loadError ? <ErrorCard error={loadError} onRetry={reload} /> : <LoadingCard label={t.loading} />}
        </main>
      </>
    );
  }

  const fieldError = (key: keyof DeliveryForm) => submitError?.field(key);

  return (
    <>
      <BackHeader title={t.header} />
      <main className="flex-1 flex flex-col relative w-full max-w-screen-sm mx-auto pt-16 pb-24 bg-surface-container-lowest">
        <div className="relative w-full px-margin-mobile pt-space-md pb-space-xl space-y-space-md text-on-surface">
          {/* Stepper & Headline Progress */}
          <div className="animate-rise flex flex-col gap-space-xs">
            <div className="flex items-center justify-between gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> {t.step}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-sm text-primary">verified_user</span> {t.promise}
              </span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-container via-primary to-secondary rounded-full w-full origin-left animate-grow-x" />
            </div>
            <div className="pt-space-xs">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold">{t.title}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          {/* Human Astrologer Safeguard Banner (Escrow Guarantee) */}
          <div className="animate-rise [animation-delay:90ms] relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-glow" />
            <div className="flex items-start gap-space-sm relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-title-md text-title-md text-primary font-bold">{t.escrowTitle}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm uppercase tracking-wider">{t.escrowBadge}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {t.escrowBody}
                  <span className="text-on-surface font-semibold">{t.escrowBold}</span>.
                </p>
              </div>
            </div>
          </div>
          {/* Order Summary Card */}
          <Reveal delay={180} className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl animate-twinkle">auto_awesome</span> {t.itemTitle}
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded-full font-medium">{t.qty}</span>
            </div>
            <div className="flex gap-space-sm items-center">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest shadow-inner">
                <img alt={remedy.image_alt} className="w-full h-full object-cover animate-scale-in [animation-delay:300ms]" src={remedy.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/70 via-transparent to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-title-md text-title-md text-on-surface line-clamp-2">{remedy.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{remedy.specification}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-title-lg text-title-lg text-primary font-bold">{inr(remedy.price)}</span>
                  {remedy.compare_at_price && <span className="font-body-sm text-body-sm text-on-surface-variant line-through">{inr(remedy.compare_at_price)}</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-space-xs pt-space-xs">
              <div className="flex items-center gap-2.5 bg-surface-container-low p-space-sm rounded-lg">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <div className="flex-1 min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface block font-medium">{t.certTitle}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{t.certBody}</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider shrink-0">{t.included}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-surface-container-low p-space-sm rounded-lg">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                <div className="flex-1 min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface block font-medium">{t.muhuratTitle}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{t.muhuratBody(remedy.planet.label.split(" • ").pop() ?? "")}</span>
                </div>
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              </div>
            </div>
            <dl className="pt-space-xs space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between items-center"><dt>{t.subtotal}</dt><dd className="text-on-surface font-medium">{inr(remedy.price)}</dd></div>
              <div className="flex justify-between items-center"><dt>{t.pooja}</dt><dd className="text-primary font-medium">{t.poojaFree}</dd></div>
              <div className="flex justify-between items-center"><dt>{t.shipping}</dt><dd className="text-primary font-medium">{t.free}</dd></div>
              <div className="pt-space-xs flex justify-between items-center text-on-surface font-title-lg text-title-lg font-bold"><dt>{t.total}</dt><dd className="text-primary">{inr(remedy.price)}</dd></div>
            </dl>
          </Reveal>
          {/* Delivery Address Form */}
          <Reveal className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span> {t.deliveryTitle}
            </span>
            <form id="checkout-form" className="space-y-space-sm" onSubmit={placeOrder} noValidate>
              <div className="grid grid-cols-1 gap-space-sm">
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor={field.key}>{t.fields[field.key]}</label>
                    <div className="relative">
                      <input
                        className={`peer w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-2.5 px-3 pl-10 focus:outline-none focus:ring-1 shadow-inner transition-shadow duration-300 ${fieldError(field.key) ? "ring-1 ring-error focus:ring-error" : "focus:ring-primary"}`}
                        id={field.key}
                        name={field.key}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        required
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        aria-invalid={Boolean(fieldError(field.key))}
                        aria-describedby={fieldError(field.key) ? `${field.key}-error` : undefined}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base transition-[color,transform] duration-300 ease-out-expo peer-focus:text-primary peer-focus:scale-110">{field.icon}</span>
                    </div>
                    {fieldError(field.key) && <p id={`${field.key}-error`} className="animate-rise mt-1 font-body-sm text-body-sm text-error">{fieldError(field.key)}</p>}
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-surface-container-low p-2.5 flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0">inventory_2</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  <span className="text-on-surface font-medium">{t.packingLabel}</span> {t.packingBody}
                </p>
              </div>
            </form>
          </Reveal>
          {/* Payment Section: UPI QR or Pine Labs */}
          <Reveal className="rounded-xl bg-surface-container p-space-md space-y-space-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">{upi ? "qr_code_2" : "credit_card"}</span> {t.paymentTitle}
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs text-primary">verified</span> {upi ? t.upiBadge : t.pineLabs}
              </span>
            </div>
            {upi ? (
              <div className="bg-surface-container-low rounded-lg p-space-sm flex items-start gap-2.5">
                <span className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl animate-twinkle">qr_code_scanner</span>
                </span>
                <div className="min-w-0">
                  <p className="font-body-md text-body-md text-on-surface font-medium">{t.upiMethods}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.upiNext}</p>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-lg p-space-sm space-y-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block">{t.methodsLabel}</span>
                <div className="flex flex-wrap items-center gap-2" data-stagger="in" style={{ "--reveal-delay": "200ms", "--stagger-step": "60ms" } as React.CSSProperties}>
                  {[
                    ["account_balance_wallet", "text-primary", t.upi],
                    ["credit_card", "text-secondary", t.cards],
                    ["account_balance", "text-primary", t.netbanking],
                  ].map(([icon, tone, label]) => (
                    <span key={label} className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
                      <span className={`material-symbols-outlined text-sm ${tone}`}>{icon}</span> {label}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md font-semibold">{t.emi}</span>
                </div>
              </div>
            )}
            {submitError && !Object.keys(submitError.errors).length && (
              <p className="animate-scale-in rounded-lg bg-error-container/20 p-2.5 font-body-sm text-body-sm text-error" role="alert">
                {submitError.status === 0 ? names.serverDown : submitError.message}
              </p>
            )}
            <button form="checkout-form" disabled={submitting} type="submit" className="sheen w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-title-lg text-title-lg font-bold py-4 px-space-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              <span className={`material-symbols-outlined text-xl ${submitting ? "animate-spin" : ""}`}>{submitting ? "progress_activity" : "lock"}</span>
              <span>{submitting ? (upi ? t.preparingUpi : t.paying) : upi ? t.payUpi(inr(remedy.price)) : t.pay(inr(remedy.price))}</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            {sandbox && <p className="text-center font-label-sm text-label-sm text-secondary uppercase tracking-wider">{t.sandbox}</p>}
            <div className="flex flex-col items-center justify-center gap-1.5 pt-space-xs text-center">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-primary">lock_clock</span> {t.secure}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-primary">verified_user</span> {upi ? t.upiChecked : t.pci}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{t.consent}</p>
            </div>
          </Reveal>
        </div>
      </main>
    </>
  );
}
