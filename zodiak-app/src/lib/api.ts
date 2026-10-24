// Thin client for the Laravel API (zodiak-dashboard). Requests go through the Vite proxy, so the session
// cookie is first-party and Sanctum's SPA authentication works without CORS.

export type Accent = "primary" | "secondary";
export type IconLabel = { icon: string; label: string };

export type Remedy = {
  slug: string;
  name: string;
  category: "gemstones" | "rudraksha" | "yantras" | "kavach" | "books";
  tagline: string;
  origin: string;
  image: string;
  image_alt: string;
  accent: Accent;
  badge: IconLabel | null;
  planet: IconLabel;
  benefits: IconLabel[];
  assurance: IconLabel;
  price: number;
  compare_at_price: number | null;
  price_detail: string | null;
  price_note: string;
  specification: string;
};

export type OrderStatus = "payment_pending" | "payment_failed" | "awaiting_approval" | "trial_hold" | "approved" | "consecrated" | "shipped" | "delivered" | "rejected";

export type Order = {
  reference: string;
  status: OrderStatus;
  status_label: string;
  journey_step: number;
  payment_status: "awaiting_payment" | "verification_pending" | "failed" | "escrow_held" | "captured" | "refund_pending" | "refunded";
  payment_method: "upi" | "pinelabs" | "sandbox" | null;
  /** The 12-digit UPI reference number the seeker sent as proof of payment. */
  payment_utr: string | null;
  /** Why the team could not match the payment (shown after a rejected UTR). */
  payment_note: string | null;
  payment_submitted_at: string | null;
  /** UPI QR details; present only while a UPI order still needs paying. */
  upi?: UpiDetails;
  amount: number;
  specification: string;
  customer_name: string;
  gotra: string | null;
  lagna: string | null;
  nakshatra: string | null;
  muhurat: string | null;
  chart_compatibility: number | null;
  reviewer?: { name: string; title: string | null } | null;
  reviewed_at: string | null;
  consecrated_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  remedy?: Remedy;
};

export type UpiDetails = { upi_id: string; payee_name: string; amount: number; note: string; link: string };

export type BirthDetails = {
  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm, local civil time at the birthplace
  time_unknown: boolean;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA zone, e.g. Asia/Kolkata
};

export type Seeker = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  gender: "female" | "male" | "other" | null;
  birth: BirthDetails | null;
  chart: ChartSummary | null;
  /** Credits left for Pandit Jii answers and palm readings. */
  credits: number;
  /** Set only on the response that created the account: the free credits just given. */
  welcomeCredits?: number;
};

export type CreditPack = { id: string; credits: number; price: number };
export type CreditReason = "signup_bonus" | "question" | "palm_reading" | "refund" | "recharge" | "admin";
export type CreditEntry = { id: number; amount: number; balance_after: number; reason: CreditReason; created_at: string };

/** A credit pack bought by UPI QR; uses the same payment fields as an order so the QR screen works for both. */
export type CreditRecharge = {
  reference: string;
  credits: number;
  amount: number;
  status: "awaiting_payment" | "verification_pending" | "credited" | "rejected";
  payment_status: "awaiting_payment" | "verification_pending" | "failed" | "captured";
  payment_utr: string | null;
  payment_note: string | null;
  payment_submitted_at: string | null;
  upi?: UpiDetails;
  created_at: string;
};

export type Wallet = {
  balance: number;
  costs: { question: number; palm_reading: number };
  signup_bonus: number;
  packs: CreditPack[];
  recharge_available: boolean;
  open_recharges: CreditRecharge[];
  history: CreditEntry[];
};

/** The headline facts of a computed chart, stored server-side for orders and the AI astrologer. */
export type ChartSummary = {
  lagna: string;
  moon_sign: string;
  sun_sign: string;
  nakshatra: string;
  mahadasha: string;
  antardasha: string;
};

export type ChatAnswer = {
  kind: "reading" | "care" | "notice";
  short_answer: string;
  chart_points: { placement: string; meaning: string }[];
  practical_step: string;
  confidence: "low" | "moderate" | "high";
  remedy_slug: string;
  follow_ups: string[];
};

export type ChatEntry = {
  id: number;
  role: "user" | "assistant";
  text: string | null;
  audio: { url: string; duration_ms: number; waveform: number[] } | null;
  answer: ChatAnswer | null;
  remedy?: Remedy | null;
  is_flagged: boolean;
  /** Pandit team check of an AI answer: a held product suggestion, or a chat the seeker reported. */
  review: ChatReview | null;
  created_at: string;
};

export type ChatReview = {
  status: "pending" | "approved" | "removed" | null;
  remedy_on_hold: boolean;
  reported: boolean;
  note: string | null;
};

/** Chart facts sent with each question, in English, for the AI astrologer. */
export type ChartPayload = {
  ascendant: string;
  moon_nakshatra: string;
  mahadasha: string;
  antardasha: string;
  antardasha_until: string;
  birth_time_known: boolean;
  planets: { name: string; sign: string; degree: number; house: number; nakshatra: string; retrograde: boolean; dignity: string }[];
};

export type CheckoutPayload = {
  remedy: string;
  customer_name: string;
  customer_phone: string;
  address_line: string;
  city_postal: string;
  lagna?: string | null;
  nakshatra?: string | null;
  gotra?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string[]> = {},
    public body: Record<string, unknown> = {},
  ) {
    super(message);
  }

  /** 402 from Pandit Jii or the palm reader: not enough credits left. */
  get noCredits(): boolean {
    return this.status === 402 && this.body.code === "no_credits";
  }

  /** First validation message for a field, if any. */
  field(name: string): string | undefined {
    return this.errors[name]?.[0];
  }
}

function xsrfToken(): string | undefined {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

let csrfPrimed = false;
let apiLanguage = "en";
let onSignedOut: (() => void) | undefined;

/** Called by the SessionProvider: the server said "not signed in" while the app thought the person was. */
export function setSignedOutHandler(handler: () => void) {
  onSignedOut = handler;
}

/** Called by the LanguageProvider so the API returns remedy text and AI replies in the chosen language. */
export function setApiLanguage(lang: string) {
  apiLanguage = lang;
}

async function primeCsrf() {
  if (csrfPrimed && xsrfToken()) return;
  await fetch("/sanctum/csrf-cookie", { credentials: "include" });
  csrfPrimed = true;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  if (method !== "GET") await primeCsrf();

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Locale", apiLanguage);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = xsrfToken();
  if (token) headers.set("X-XSRF-TOKEN", token);

  let response: Response;
  try {
    response = await fetch(`/api/v1${path}`, { ...init, headers, credentials: "include" });
  } catch {
    throw new ApiError("Cannot reach the Zodiak server. Is the Laravel API running?", 0);
  }

  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 419) csrfPrimed = false;
    // An expired or lost session: show the log-in screen instead of a raw "Unauthenticated." message
    if (response.status === 401 && !path.startsWith("/auth/")) onSignedOut?.();
    throw new ApiError(body.message ?? `Request failed (${response.status})`, response.status, body.errors, body);
  }
  return body as T;
}

const json = (data: unknown) => JSON.stringify(data);

export type AppConfig = {
  payments: "upi" | "pinelabs" | "sandbox";
  payments_environment: string | null;
  ai: boolean;
  voice_replies: boolean;
  /** The server can write down the words of a voice note, so the phone doesn't have to. */
  voice_transcription: boolean;
  phone_login: boolean;
  /** Free credits a new account gets. */
  signup_bonus: number;
};

type AuthResponse = { data: Seeker; welcome_credits?: number };
const withWelcome = (r: AuthResponse): Seeker => ({ ...r.data, welcomeCredits: r.welcome_credits });
type AskResponse = { question: ChatEntry; data: ChatEntry; credits: number };

export const api = {
  appConfig: () => request<{ data: AppConfig }>("/app-config").then((r) => r.data),
  me: () => request<{ data: Seeker }>("/me").then((r) => r.data),
  requestOtp: (phone: string) => request<{ message: string; debug_code?: string }>("/auth/otp", { method: "POST", body: json({ phone }) }),
  verifyOtp: (phone: string, code: string, name?: string, intent?: "signup" | "login") =>
    request<AuthResponse>("/auth/otp/verify", { method: "POST", body: json({ phone, code, name, intent }) }).then(withWelcome),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: json({ name, email, password }) }).then(withWelcome),
  login: (email: string, password: string) =>
    request<{ data: Seeker }>("/auth/login", { method: "POST", body: json({ email, password }) }).then((r) => r.data),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  saveBirthDetails: (payload: { name: string; gender: Seeker["gender"]; birth: BirthDetails; chart: ChartSummary }) =>
    request<{ data: Seeker }>("/me/birth-details", { method: "PUT", body: json(payload) }).then((r) => r.data),
  askHistory: () => request<{ data: ChatEntry[] }>("/ask").then((r) => r.data),
  /**
   * Ask a question by text, or as a voice note sent as multipart form data. A voice note's message is the on-device
   * transcript when the phone made one; otherwise it is empty and the server writes the words down.
   */
  ask: (message: string, chart: ChartPayload | null, voice?: { blob: Blob; durationMs: number; waveform: number[] }) => {
    if (!voice) return request<AskResponse>("/ask", { method: "POST", body: json({ message, chart }) });
    const form = new FormData();
    form.append("message", message);
    if (chart) form.append("chart", JSON.stringify(chart));
    const extension = voice.blob.type.includes("mp4") ? "m4a" : voice.blob.type.includes("ogg") ? "ogg" : "webm";
    form.append("audio", voice.blob, `voice-note.${extension}`);
    form.append("audio_duration_ms", String(voice.durationMs));
    form.append("waveform", JSON.stringify(voice.waveform));
    return request<AskResponse>("/ask", { method: "POST", body: form });
  },
  /** Report a Pandit Jii answer; the Pandit team checks it and its product suggestion. */
  reportAnswer: (id: number, reason: string) =>
    request<{ data: ChatEntry }>(`/ask/messages/${id}/report`, { method: "POST", body: json({ reason }) }).then((r) => r.data),
  myOrders: () => request<{ data: Order[] }>("/me/orders").then((r) => r.data),
  remedies: () => request<{ data: Remedy[] }>("/remedies").then((r) => r.data),
  remedy: (slug: string) => request<{ data: Remedy }>(`/remedies/${slug}`).then((r) => r.data),
  /** Place an order. `checkoutUrl` is set when Pine Labs is configured: send the browser there to pay. */
  placeOrder: (payload: CheckoutPayload) =>
    request<{ data: Order; checkout_url: string | null }>("/orders", { method: "POST", body: json(payload) }).then((r) => ({ order: r.data, checkoutUrl: r.checkout_url })),
  order: (reference: string) => request<{ data: Order }>(`/orders/${reference}`).then((r) => r.data),
  /** Send the UPI reference number (UTR) after paying by QR; the team then checks it against the bank statement. */
  submitPaymentProof: (reference: string, utr: string) =>
    request<{ data: Order }>(`/orders/${reference}/payment-proof`, { method: "POST", body: json({ utr }) }).then((r) => r.data),
  wallet: () => request<{ data: Wallet }>("/credits").then((r) => r.data),
  /** Start buying a credit pack; the answer carries the UPI QR details. */
  startRecharge: (pack: string) => request<{ data: CreditRecharge }>("/credit-recharges", { method: "POST", body: json({ pack }) }).then((r) => r.data),
  recharge: (reference: string) => request<{ data: CreditRecharge }>(`/credit-recharges/${reference}`).then((r) => r.data),
  submitRechargeProof: (reference: string, utr: string) =>
    request<{ data: CreditRecharge }>(`/credit-recharges/${reference}/payment-proof`, { method: "POST", body: json({ utr }) }).then((r) => r.data),
};

export const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
