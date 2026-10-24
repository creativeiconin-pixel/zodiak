import { useMemo } from "react";
import { api, type BirthDetails, type Seeker } from "./api";
import { computeChart, summarize, type Chart } from "./astro";
import { BIRTH_PROFILE_KEY } from "./personalData";
import { useSession } from "./session";

export type BirthProfile = { name: string; gender: Seeker["gender"]; birth: BirthDetails };

const STORAGE_KEY = BIRTH_PROFILE_KEY;

function readLocal(): BirthProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BirthProfile) : null;
  } catch {
    return null;
  }
}

function writeLocal(profile: BirthProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable (private mode); the in-memory session still works for this visit.
  }
}

/** The active birth profile: the signed-in seeker's saved details, else their local draft. Guests get none. */
export function useBirthProfile(): { profile: BirthProfile | null; chart: Chart | null; loading: boolean } {
  const { seeker, loading } = useSession();
  const profile = useMemo<BirthProfile | null>(() => {
    if (seeker?.birth) return { name: seeker.name, gender: seeker.gender, birth: seeker.birth };
    // Details are for signed-in members only; a signed-in person without saved details may still have a draft
    return seeker ? readLocal() : null;
  }, [seeker]);
  const chart = useMemo(() => (profile ? computeChart(profile.birth) : null), [profile]);
  return { profile, chart, loading };
}

/** Persist birth details locally, and to the seeker's account when signed in. Returns the updated seeker, if any. */
export async function saveBirthProfile(profile: BirthProfile, signedIn: boolean): Promise<Seeker | null> {
  writeLocal(profile);
  if (!signedIn) return null;
  return api.saveBirthDetails({ ...profile, chart: summarize(computeChart(profile.birth)) });
}

/** After sign-in, push a guest's locally saved chart to their account if the account has none yet. */
export async function syncGuestProfile(seeker: Seeker): Promise<Seeker> {
  const local = readLocal();
  if (seeker.birth || !local) return seeker;
  return api.saveBirthDetails({ ...local, chart: summarize(computeChart(local.birth)) });
}
