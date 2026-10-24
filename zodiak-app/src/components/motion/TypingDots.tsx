/**
 * Three bouncing dots ("someone is typing"). Inherits text colour; pass a label for screen readers.
 *
 * ```tsx
 * <TypingDots className="text-primary" label={t.thinking} />
 * ```
 */
export function TypingDots({ className = "", label }: { className?: string; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role={label ? "status" : undefined} aria-label={label}>
      {[0, 160, 320].map((delay) => (
        <span key={delay} aria-hidden className="w-1.5 h-1.5 rounded-full bg-current animate-typing-dot" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}
