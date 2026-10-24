import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

type CountUpProps = {
  /** Final number to land on. */
  value: number;
  /** Animation length in ms (default 900). */
  duration?: number;
  /** Decimal places shown while counting and at the end (default 0). */
  decimals?: number;
  /** Optional formatter, e.g. (n) => `${n}%` or a locale formatter. */
  format?: (n: number) => string;
  className?: string;
};

/**
 * Counts from 0 up to `value` (ease-out) the first time it scrolls into view. Re-animates from the
 * previous number when `value` changes. Shows the final value straight away for reduced motion.
 * Screen readers get the final value through aria-label.
 *
 * ```tsx
 * <CountUp value={28} /> / 36
 * <CountUp value={elapsed} format={(n) => `${n}%`} />
 * ```
 */
export function CountUp({ value, duration = 900, decimals = 0, format, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fromRef = useRef(0);
  const [shown, setShown] = useState(() => (prefersReducedMotion() || typeof IntersectionObserver === "undefined" ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setShown(value);
      fromRef.current = value;
      return;
    }
    let frame = 0;
    const start = (from: number) => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(p < 1 ? from + (value - from) * eased : value);
        if (p < 1) frame = requestAnimationFrame(tick);
        else fromRef.current = value;
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        start(fromRef.current);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  // While counting, round to `decimals`; the final frame shows the exact value (e.g. 25.5 with decimals 0)
  const current = shown === value ? value : Number(shown.toFixed(decimals));
  const text = format ? format(current) : current.toFixed(decimals);
  const finalText = format ? format(value) : value.toFixed(decimals);
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} aria-label={finalText}>
      <span aria-hidden>{text}</span>
    </span>
  );
}
