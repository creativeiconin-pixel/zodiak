import { useT } from "../i18n";
import { common } from "../i18n/common";
import { ApiError } from "../lib/api";

export function LoadingCard({ label }: { label?: string }) {
  const t = useT(common);
  return (
    <div className="shimmer animate-fade-in flex items-center justify-center gap-space-sm rounded-xl bg-surface-container p-space-lg text-on-surface-variant" role="status">
      <span className="relative flex w-7 h-7 items-center justify-center">
        <span aria-hidden className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
        <span aria-hidden className="material-symbols-outlined text-primary text-sm animate-twinkle" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
      </span>
      <span className="font-body-md text-body-md">{label ?? t.loading}</span>
    </div>
  );
}

export function ErrorCard({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  const t = useT(common);
  const offline = error instanceof ApiError && error.status === 0;
  return (
    <div className="animate-scale-in flex flex-col items-center gap-space-sm rounded-xl bg-error-container/20 p-space-lg text-center" role="alert">
      <span className="material-symbols-outlined text-error text-3xl">{offline ? "cloud_off" : "error"}</span>
      <p className="font-body-md text-body-md text-on-surface">{offline ? t.serverDown : error.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="tap-scale px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
          {t.tryAgain}
        </button>
      )}
    </div>
  );
}
