import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError, setSignedOutHandler, type Seeker } from "./api";
import { clearPersonalData } from "./personalData";

type Session = {
  seeker: Seeker | null;
  loading: boolean;
  setSeeker: (seeker: Seeker | null) => void;
  /** Update the shown balance after an answer, a palm reading or a recharge. */
  setCredits: (credits: number) => void;
  /** Free credits just given on sign-up, shown once as a celebration. */
  welcomeCredits: number | null;
  dismissWelcome: () => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [seeker, setSeekerState] = useState<Seeker | null>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeCredits, setWelcomeCredits] = useState<number | null>(null);

  const setSeeker = useCallback((next: Seeker | null) => {
    if (next?.welcomeCredits) setWelcomeCredits(next.welcomeCredits);
    setSeekerState(next);
  }, []);

  const setCredits = useCallback((credits: number) => {
    setSeekerState((current) => (current ? { ...current, credits } : current));
  }, []);

  const dismissWelcome = useCallback(() => setWelcomeCredits(null), []);

  const refresh = useCallback(async () => {
    try {
      setSeekerState(await api.me());
    } catch (error) {
      // 401 simply means "signed out"; anything else (server down) also leaves the app usable as a guest
      if (!(error instanceof ApiError)) throw error;
      setSeekerState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => undefined);
    clearPersonalData();
    setSeekerState(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setSignedOutHandler(() => setSeekerState(null));
    return () => setSignedOutHandler(() => undefined);
  }, []);

  return <SessionContext.Provider value={{ seeker, loading, setSeeker, setCredits, welcomeCredits, dismissWelcome, refresh, logout }}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <SessionProvider>");
  return session;
}
