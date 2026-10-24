import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PulseRing } from "../motion/PulseRing";
import { useT } from "../../i18n";
import { common } from "../../i18n/common";
import { upiText } from "../../i18n/pages/upi";
import { ApiError, api, inr, type Order, type UpiDetails } from "../../lib/api";

const UTR_LENGTH = 12;

/** Anything paid by UPI QR with a UTR check: a store order or a credit recharge. */
export type UpiPayable = {
  reference: string;
  amount: number;
  payment_status: string;
  payment_utr: string | null;
  payment_note: string | null;
  upi?: UpiDetails;
};

type PayProps<T extends UpiPayable> = {
  payable: T;
  onUpdate: (next: T) => void;
  submit: (utr: string) => Promise<T>;
  purpose: "order" | "recharge";
};

/** True when the order still needs the seeker to pay by UPI QR or wait for our team to check the UTR. */
export function needsUpiStep(order: Order) {
  return order.payment_method === "upi" && ["awaiting_payment", "failed", "verification_pending"].includes(order.payment_status);
}

/** Phones (and tablets) can open a UPI app straight from a upi:// link; desktops cannot. */
function canOpenUpiApp() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Older browsers / insecure origins: fall back to a hidden textarea
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const t = useT(upiText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => copyText(value).then(setCopied)}
      className={`tap-scale shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-colors ${copied ? "bg-primary text-on-primary" : "bg-surface-container-highest text-primary"}`}
      aria-label={`${t.copy} ${label}`}
    >
      <span className={`material-symbols-outlined text-sm ${copied ? "animate-pop-in" : ""}`}>{copied ? "check" : "content_copy"}</span>
      <span aria-live="polite">{copied ? t.copied : t.copy}</span>
    </button>
  );
}

/** Check the typed UTR: spaces are fine, anything else must be digits, and exactly 12 of them. */
function utrProblem(raw: string, t: (typeof upiText)["en"], strict: boolean) {
  const digits = raw.replace(/\s+/g, "");
  if (/\D/.test(digits)) return t.utrOnlyDigits;
  if (digits.length > UTR_LENGTH) return t.utrTooLong;
  if (strict && digits.length < UTR_LENGTH) return t.utrTooShort;
  return undefined;
}

function UtrForm<T extends UpiPayable>({ submit, onUpdate, onCancel }: { submit: (utr: string) => Promise<T>; onUpdate: (next: T) => void; onCancel?: () => void }) {
  const t = useT(upiText);
  const names = useT(common);
  const [utr, setUtr] = useState("");
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const digits = utr.replace(/\s+/g, "");
  const problem = serverError ?? utrProblem(utr, t, tried);

  async function send(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    setServerError(undefined);
    if (utrProblem(utr, t, true)) return;
    setSubmitting(true);
    try {
      onUpdate(await submit(digits));
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 0);
      setServerError(apiError.status === 0 ? names.serverDown : (apiError.field("utr") ?? apiError.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={send} noValidate className="space-y-2">
      <label htmlFor="utr" className="block font-label-md text-label-md text-on-surface">{t.utrLabel}</label>
      <div className="relative">
        <input
          id="utr"
          name="utr"
          inputMode="numeric"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={20}
          placeholder={t.utrPlaceholder}
          value={utr}
          onChange={(e) => {
            setUtr(e.target.value);
            setServerError(undefined);
          }}
          className={`peer w-full bg-surface-container-low text-on-surface font-title-md text-title-md tracking-[0.2em] rounded-lg py-3 pl-10 pr-20 placeholder:text-on-surface-variant/50 placeholder:tracking-[0.2em] focus:outline-none focus:ring-1 shadow-inner transition-shadow duration-300 ${problem ? "ring-1 ring-error focus:ring-error" : "focus:ring-primary"}`}
          aria-invalid={Boolean(problem)}
          aria-describedby="utr-help"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg transition-[color,transform] duration-300 ease-out-expo peer-focus:text-primary peer-focus:scale-110">tag</span>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm tabular-nums ${digits.length === UTR_LENGTH && !problem ? "text-primary font-bold" : "text-on-surface-variant"}`}>
          {t.utrCount(digits.replace(/\D/g, "").length)}
        </span>
      </div>
      <p id="utr-help" className={`font-body-sm text-body-sm ${problem ? "text-error animate-rise" : "text-on-surface-variant"}`} role={problem ? "alert" : undefined}>
        {problem ?? t.utrHelp}
      </p>
      <button
        type="submit"
        disabled={submitting}
        className="sheen tap-scale w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-title-md text-title-md font-bold py-3.5 px-space-md shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <span className={`material-symbols-outlined text-xl ${submitting ? "animate-spin" : ""}`}>{submitting ? "progress_activity" : "send"}</span>
        <span>{submitting ? t.submitting : t.submit}</span>
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="tap-scale w-full py-2 font-label-md text-label-md text-on-surface-variant">
          {t.cancel}
        </button>
      )}
    </form>
  );
}

/** "We got your UTR, our team is checking it" while the payment waits for a manual match. */
function VerificationPending<T extends UpiPayable>({ payable: order, onUpdate, submit }: PayProps<T>) {
  const t = useT(upiText);
  const [fixing, setFixing] = useState(false);
  const last4 = (order.payment_utr ?? "").slice(-4);

  return (
    <section className="animate-scale-in rounded-xl p-space-md bg-surface-container/80 backdrop-blur-xl shadow-xl mb-space-lg relative overflow-hidden" role="status" aria-live="polite">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none animate-glow" />
      <div className="flex items-start gap-space-sm relative z-10">
        <div className="relative w-12 h-12 shrink-0 rounded-full bg-secondary-container flex items-center justify-center shadow-md">
          <PulseRing className="bg-secondary/40" />
          <span className="material-symbols-outlined relative text-on-secondary-container text-2xl animate-float" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
          <span className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow animate-pop-in [animation-delay:350ms]">
            <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-title-md text-title-md text-on-surface font-semibold">{t.pendingTitle}</p>
          {last4 && (
            <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high font-label-md text-label-md text-primary tracking-wider tabular-nums">
              <span className="material-symbols-outlined text-sm">receipt</span> {t.pendingUtr(last4)}
            </span>
          )}
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">{t.pendingBody}</p>
          <p className="font-label-sm text-label-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm animate-spin [animation-duration:3s]">autorenew</span> {t.pendingAuto}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-space-sm pt-space-sm">
        {fixing ? (
          <div className="animate-rise">
            <UtrForm submit={submit} onUpdate={(next: T) => { setFixing(false); onUpdate(next); }} onCancel={() => setFixing(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setFixing(true)} className="tap-scale font-label-md text-label-md text-primary font-semibold inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">edit</span> {t.fixUtr}
          </button>
        )}
      </div>
    </section>
  );
}

/** Pay-by-QR card: QR code, payee details, simple steps and the UTR form (also used again after a rejected UTR). */
function PayByQr<T extends UpiPayable>({ payable: order, onUpdate, submit, purpose }: PayProps<T>) {
  const t = useT(upiText);
  const upi = order.upi;
  const amount = inr(upi?.amount ?? order.amount);
  const [qr, setQr] = useState<string>();
  const openApp = useMemo(canOpenUpiApp, []);

  useEffect(() => {
    if (!upi?.link) return;
    let alive = true;
    // Loaded on demand so the QR library stays out of the main bundle
    import("qrcode")
      .then((mod) => (mod.default ?? mod).toDataURL(upi.link, { errorCorrectionLevel: "M", margin: 2, width: 512, color: { dark: "#000000", light: "#ffffff" } }))
      .then((url) => alive && setQr(url))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [upi?.link]);

  return (
    <section className="animate-rise rounded-xl p-space-md bg-surface-container/80 backdrop-blur-xl shadow-xl mb-space-lg relative overflow-hidden" aria-labelledby="upi-title">
      <div className="absolute -left-12 -top-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none animate-glow" />
      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-space-sm">
        <div className="flex items-start gap-space-xs min-w-0">
          <span className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">qr_code_2</span>
          </span>
          <div className="min-w-0">
            <h3 id="upi-title" className="font-title-lg text-title-lg text-on-surface font-semibold leading-tight">{t.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{purpose === "recharge" ? t.rechargeSubtitle(amount) : t.subtitle(amount)}</p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-primary font-label-sm text-label-sm font-semibold">
          <span className="material-symbols-outlined text-xs">bolt</span> {t.badge}
        </span>
      </div>

      {/* Rejected UTR: gentle notice with the team's reason */}
      {order.payment_note && (
        <div className="relative z-10 mt-space-md rounded-lg p-space-sm bg-error-container/25 flex items-start gap-space-sm animate-scale-in" role="alert">
          <span className="material-symbols-outlined text-error text-xl shrink-0">error</span>
          <div className="min-w-0">
            <p className="font-title-md text-title-md text-on-surface font-semibold">{t.rejectedTitle}</p>
            <p className="font-body-sm text-body-sm text-on-surface mt-0.5">{t.rejectedReason(order.payment_note)}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{t.rejectedHelp}</p>
          </div>
        </div>
      )}

      {upi && (
        <>
          {/* QR: dark modules on white with a quiet zone so any phone camera can read it */}
          <div className="relative z-10 mt-space-md flex flex-col items-center">
            <div className="relative rounded-2xl bg-white p-3 shadow-[0_0_32px_rgba(233,195,73,0.25)] animate-scale-in [animation-delay:150ms]">
              {qr ? (
                <img src={qr} alt={t.qrAlt(amount)} width={220} height={220} className="block w-[220px] h-[220px] [image-rendering:pixelated]" />
              ) : (
                <div className="w-[220px] h-[220px] rounded-lg bg-neutral-200 shimmer" aria-hidden />
              )}
            </div>
            <p className="mt-space-sm font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">qr_code_scanner</span> {t.scanHint}
            </p>
            <p className="mt-1 font-headline-sm text-headline-sm text-primary font-bold tabular-nums">{amount}</p>
            <div className={`mt-space-sm w-full grid grid-cols-1 gap-space-xs`}>
              {openApp && (
                <a href={upi.link} className="sheen tap-scale relative overflow-hidden h-12 rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span> {t.openApp}
                </a>
              )}
              {qr && (
                <a href={qr} download={`zodiak-upi-${order.reference}.png`} className="tap-scale h-11 rounded-xl bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-base text-primary">download</span> {t.downloadQr}
                </a>
              )}
            </div>
          </div>

          {/* Payee details */}
          <dl className="relative z-10 mt-space-md rounded-lg bg-surface-container-lowest/70 divide-y divide-outline-variant/30">
            <div className="flex items-center justify-between gap-space-sm px-space-sm py-2.5">
              <dt className="font-body-sm text-body-sm text-on-surface-variant">{t.payTo}</dt>
              <dd className="font-title-md text-title-md text-on-surface font-semibold text-right truncate">{upi.payee_name}</dd>
            </div>
            <div className="flex items-center justify-between gap-space-sm px-space-sm py-2.5">
              <div className="min-w-0">
                <dt className="font-body-sm text-body-sm text-on-surface-variant">{t.upiId}</dt>
                <dd className="font-title-md text-title-md text-on-surface font-semibold break-all">{upi.upi_id}</dd>
              </div>
              <CopyButton value={upi.upi_id} label={t.upiId} />
            </div>
            <div className="flex items-center justify-between gap-space-sm px-space-sm py-2.5">
              <dt className="font-body-sm text-body-sm text-on-surface-variant">{t.amount}</dt>
              <dd className="font-title-md text-title-md text-primary font-bold tabular-nums">{amount}</dd>
            </div>
            <div className="flex items-center justify-between gap-space-sm px-space-sm py-2.5">
              <div className="min-w-0">
                <dt className="font-body-sm text-body-sm text-on-surface-variant">{purpose === "recharge" ? t.rechargeNo : t.orderNo}</dt>
                <dd className="font-title-md text-title-md text-on-surface font-semibold tracking-wide">#{order.reference}</dd>
              </div>
              <CopyButton value={upi.note} label={purpose === "recharge" ? t.rechargeNo : t.orderNo} />
            </div>
          </dl>

          {/* Steps */}
          <div className="relative z-10 mt-space-md">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-space-xs">{t.stepsTitle}</p>
            <ol className="space-y-2">
              {t.steps(amount).map((step, index) => (purpose === "recharge" && index === 1 ? t.rechargeStep(amount) : step)).map((text, index) => (
                <li key={index} className="animate-slide-in-left flex items-start gap-space-sm" style={{ animationDelay: `${250 + index * 90}ms` }}>
                  <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-label-md text-label-md font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                  <span className="font-body-sm text-body-sm text-on-surface leading-relaxed pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {/* UTR form */}
      <div className="relative z-10 mt-space-md pt-space-sm">
        <UtrForm submit={submit} onUpdate={onUpdate} />
      </div>
      <p className="relative z-10 mt-space-sm font-label-sm text-label-sm text-on-surface-variant flex items-start gap-1">
        <span className="material-symbols-outlined text-sm text-primary shrink-0">lock</span> {t.safety}
      </p>
    </section>
  );
}

/** UPI QR payment step: pay + send the UTR, then wait while our team checks it. Works for orders and credit recharges. */
export function UpiPayFlow<T extends UpiPayable>(props: PayProps<T>) {
  if (props.payable.payment_status === "verification_pending") return <VerificationPending {...props} />;
  return <PayByQr {...props} />;
}

/** UPI QR payment step on the order page. */
export function UpiPayment({ order, onUpdate }: { order: Order; onUpdate: (order: Order) => void }) {
  return <UpiPayFlow payable={order} onUpdate={onUpdate} submit={(utr) => api.submitPaymentProof(order.reference, utr)} purpose="order" />;
}
