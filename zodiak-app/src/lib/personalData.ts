// Things a person types on this phone (their birth details, a Milan partner). Cleared on sign-out so the
// next person who uses the phone never sees them, and they can never be copied into someone else's account.
export const BIRTH_PROFILE_KEY = "zodiak.birthProfile";
export const MILAN_PARTNER_KEY = "zodiak.milan.partner";

export function clearPersonalData() {
  try {
    localStorage.removeItem(BIRTH_PROFILE_KEY);
    localStorage.removeItem(MILAN_PARTNER_KEY);
  } catch {
    // storage unavailable: nothing was saved
  }
}
