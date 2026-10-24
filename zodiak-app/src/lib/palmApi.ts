// AI palm reading: shrink the photo on the device, send it to the Laravel API, and get a structured reading back.
// The server never stores the photo; only the reading is saved to the seeker's account.

import { ApiError, request } from "./api";

export { ApiError };

export type Hand = "left" | "right";
export type PalmLineKey = "life" | "head" | "heart" | "fate";
export type PalmMountKey = "jupiter" | "saturn" | "sun" | "mercury" | "venus" | "moon" | "mars";
export type RetakeReason = "too_dark" | "blurry" | "not_a_palm" | "fingers_closed" | "hand_cut_off" | "unclear";

export type PalmLine = { present: boolean; look: string; meaning: string };

export type PalmReading = {
  id: number;
  status: "reading";
  hand: Hand;
  locale: string;
  summary: string;
  lines: Record<PalmLineKey, PalmLine>;
  mounts: { mount: PalmMountKey; strength: "strong" | "medium" | "soft"; meaning: string }[];
  tip: string;
  confidence: "low" | "moderate" | "high";
  created_at: string;
};

export type PalmRetake = {
  id: null;
  status: "retake";
  hand: Hand;
  retake_reason: RetakeReason;
  retake_tip: string;
};

export type PalmResult = PalmReading | PalmRetake;

const MAX_SIDE = 1600;

/** The photo could not be opened in the browser (for example a HEIC file on a desktop browser). */
export class PhotoDecodeError extends Error {}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new PhotoDecodeError("This photo could not be opened."));
    };
    image.src = url;
  });
}

/**
 * Downscale a photo to at most 1600px on its longest side and re-encode it as JPEG. This keeps uploads small on
 * mobile data and drops EXIF data such as GPS location. If the browser cannot decode the file (HEIC on some
 * browsers), the original file is returned and the server converts it instead.
 */
export async function shrinkPhoto(file: File): Promise<Blob> {
  let image: HTMLImageElement;
  try {
    image = await loadImage(file);
  } catch (error) {
    if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) return file;
    throw error;
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  return blob ?? file;
}

export const palmApi = {
  /** Upload a palm photo for an AI reading. Returns either a reading or a "please take another photo" result. */
  read: (photo: Blob, hand: Hand, chartSummary?: string | null): Promise<{ result: PalmResult; credits?: number }> => {
    const form = new FormData();
    const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : /hei[cf]/.test(photo.type) ? "heic" : "jpg";
    form.append("image", photo, `palm.${extension}`);
    form.append("hand", hand);
    if (chartSummary) form.append("chart_summary", chartSummary);
    return request<{ data: PalmResult; credits?: number }>("/palm-readings", { method: "POST", body: form }).then((r) => ({ result: r.data, credits: r.credits }));
  },

  /** The seeker's latest saved readings, newest first. */
  history: (): Promise<PalmReading[]> => request<{ data: PalmReading[] }>("/palm-readings").then((r) => r.data),
};
