/**
 * Expanding ring(s) that radiate from behind an element (recording, live, "you are here").
 * Put it inside a `relative` parent; it fills the parent and sits behind siblings (-z-0 + pointer-events none).
 * Hidden when the user prefers reduced motion.
 *
 * ```tsx
 * <button className="relative ..."><PulseRing className="bg-error/40" />...</button>
 * ```
 */
export function PulseRing({ className = "bg-primary/40", rings = 2 }: { className?: string; rings?: number }) {
  return (
    <span aria-hidden className="motion-decor pointer-events-none absolute inset-0">
      {Array.from({ length: rings }, (_, i) => (
        <span key={i} className={`absolute inset-0 rounded-full animate-pulse-ring ${className}`} style={{ animationDelay: `${i * 0.8}s` }} />
      ))}
    </span>
  );
}
