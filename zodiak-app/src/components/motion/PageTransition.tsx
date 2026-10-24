import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Soft cross-fade whenever the route path changes. Wrap an `<Outlet />` with it.
 * Uses opacity only (no transform) so fixed headers/bars inside pages never jump, and it does
 * not remount the page (the animation is restarted with the Web Animations API).
 *
 * ```tsx
 * <PageTransition className="flex-1 flex flex-col"><Outlet /></PageTransition>
 * ```
 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof el.animate !== "function") return;
    const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    return () => animation.cancel();
  }, [pathname]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
