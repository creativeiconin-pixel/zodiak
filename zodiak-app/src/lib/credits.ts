// What Pandit Jii answers and palm readings cost, loaded once per session for the credit hints.
import { useEffect, useState } from "react";
import { api, type Wallet } from "./api";
import { useSession } from "./session";

// Costs only change when the team edits them, so one load per account is enough
const cache = new Map<number, Promise<Wallet>>();

export function useCreditCosts(): Wallet["costs"] | undefined {
  const { seeker } = useSession();
  const [costs, setCosts] = useState<Wallet["costs"]>();

  useEffect(() => {
    if (!seeker) return;
    let alive = true;
    const id = seeker.id;
    if (!cache.has(id)) {
      cache.set(id, api.wallet().catch((error) => {
        cache.delete(id);
        throw error;
      }));
    }
    cache.get(id)!.then((wallet) => alive && setCosts(wallet.costs)).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [seeker?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return costs;
}
