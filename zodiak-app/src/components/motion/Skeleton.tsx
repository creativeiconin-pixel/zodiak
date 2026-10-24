/**
 * Shimmering placeholder block for loading states. Size it with classes.
 *
 * ```tsx
 * <Skeleton className="h-4 w-2/3" />
 * <Skeleton className="h-32 w-full rounded-xl" />
 * ```
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`shimmer rounded-md bg-surface-container-high/70 ${className}`} />;
}
