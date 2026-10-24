import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useT } from "../../i18n";
import { clockText } from "../../i18n/pages/clock";

type Props = {
  id?: string;
  /** 24-hour "HH:mm", or "" when not set. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const SIZE = 264;
const CENTER = SIZE / 2;
const RADIUS = 100;
const pad = (n: number) => String(n).padStart(2, "0");

function split(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour12: 12, minute: 0, pm: false };
  const h = Number(match[1]);
  return { hour12: h % 12 || 12, minute: Number(match[2]), pm: h >= 12 };
}

function join(hour12: number, minute: number, pm: boolean) {
  const h = (hour12 % 12) + (pm ? 12 : 0);
  return `${pad(h)}:${pad(minute)}`;
}

/** "06:42 AM" style label for a 24-hour value. */
export function formatTime12(value: string) {
  const { hour12, minute, pm } = split(value);
  return `${pad(hour12)}:${pad(minute)} ${pm ? "PM" : "AM"}`;
}

/** A field that opens a clock face to pick a time: tap/drag the hour, then the minute, then AM or PM. */
export function ClockTimePicker({ id, value, onChange, disabled, className = "" }: Props) {
  const t = useT(clockText);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [draft, setDraft] = useState(split(value));
  const dragging = useRef(false);
  const dial = useRef<SVGSVGElement>(null);

  function show() {
    setDraft(split(value || "06:00"));
    setMode("hour");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(event: PointerEvent<SVGSVGElement>) {
    const rect = dial.current!.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    // 0° at 12 o'clock, clockwise
    const angle = (Math.atan2(x, -y) * 180) / Math.PI + 360;
    if (mode === "hour") {
      const hour = Math.round(angle / 30) % 12 || 12;
      setDraft((d) => ({ ...d, hour12: hour }));
    } else {
      const minute = Math.round(angle / 6) % 60;
      setDraft((d) => ({ ...d, minute }));
    }
  }

  function onDialKey(event: KeyboardEvent<SVGSVGElement>) {
    const step = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    setDraft((d) => (mode === "hour" ? { ...d, hour12: ((d.hour12 - 1 + step + 12) % 12) + 1 } : { ...d, minute: (d.minute + step + 60) % 60 }));
  }

  const selected = mode === "hour" ? draft.hour12 : draft.minute;
  const handAngle = mode === "hour" ? (draft.hour12 % 12) * 30 : draft.minute * 6;
  const handX = CENTER + RADIUS * Math.sin((handAngle * Math.PI) / 180);
  const handY = CENTER - RADIUS * Math.cos((handAngle * Math.PI) / 180);
  const marks = mode === "hour" ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={show}
        aria-haspopup="dialog"
        className={`tap-scale w-full flex items-center gap-3 py-3.5 pl-3.5 pr-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-left transition-colors disabled:opacity-40 ${className}`}
      >
        <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
        <span className={`flex-1 font-body-md text-body-md ${value ? "text-on-surface font-mono tracking-wider text-title-md" : "text-outline"}`}>
          {value ? formatTime12(value) : t.placeholder}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{value ? "edit" : "chevron_right"}</span>
      </button>

      {open &&
        createPortal(
          <div className="animate-fade-in fixed inset-0 z-[70] bg-surface-container-lowest/80 backdrop-blur-md flex flex-col justify-end" role="dialog" aria-modal="true" aria-labelledby="clock-title" onClick={() => setOpen(false)}>
            <div className="animate-sheet-up w-full max-w-screen-sm mx-auto max-h-[100dvh] overflow-y-auto overscroll-contain bg-surface-container-high rounded-t-2xl px-space-lg pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 bg-outline/40 rounded-full mx-auto mb-2" />
              <h2 id="clock-title" className="font-headline-sm text-headline-sm text-on-surface text-center">{t.title}</h2>

              {/* Digital readout: tap hour or minute to switch what the dial sets */}
              <div className="mt-2 [@media(min-height:700px)]:mt-space-md flex items-center justify-center gap-3">
                <div className="flex items-center font-mono text-[36px] [@media(min-height:700px)]:text-[44px] leading-none">
                  {(["hour", "minute"] as const).map((part, i) => (
                    <span key={part} className="flex items-center">
                      {i === 1 && <span className="text-on-surface-variant px-1">:</span>}
                      <button
                        type="button"
                        onClick={() => setMode(part)}
                        aria-pressed={mode === part}
                        aria-label={part === "hour" ? t.hour : t.minute}
                        className={`px-2 py-1 rounded-lg transition-colors ${mode === part ? "bg-primary/15 text-primary" : "text-on-surface hover:bg-surface-container"}`}
                      >
                        {pad(part === "hour" ? draft.hour12 : draft.minute)}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1" role="group">
                  {[false, true].map((pm) => (
                    <button
                      key={String(pm)}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, pm }))}
                      aria-pressed={draft.pm === pm}
                      className={`px-3 py-1 rounded-lg text-left transition-colors ${draft.pm === pm ? "bg-primary-container text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      <span className="block font-label-lg text-label-lg">{pm ? t.pm : t.am}</span>
                      <span className="block text-[10px] leading-tight opacity-80">{pm ? t.pmHint : t.amHint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock face */}
              <svg
                ref={dial}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="block mx-auto mt-3 aspect-square w-[min(100%,264px,calc(100dvh-330px))] min-w-[180px] touch-none select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full"
                role="slider"
                tabIndex={0}
                aria-label={mode === "hour" ? t.hour : t.minute}
                aria-valuemin={mode === "hour" ? 1 : 0}
                aria-valuemax={mode === "hour" ? 12 : 59}
                aria-valuenow={selected}
                onKeyDown={onDialKey}
                onPointerDown={(e) => {
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  pick(e);
                }}
                onPointerMove={(e) => dragging.current && pick(e)}
                onPointerUp={() => {
                  dragging.current = false;
                  if (mode === "hour") setMode("minute");
                }}
              >
                <circle cx={CENTER} cy={CENTER} r={CENTER - 4} className="fill-surface-container-lowest stroke-primary/30" strokeWidth="1" />
                {mode === "minute" &&
                  Array.from({ length: 60 }, (_, i) => i).filter((i) => i % 5).map((i) => (
                    <circle key={i} cx={CENTER + RADIUS * Math.sin((i * 6 * Math.PI) / 180)} cy={CENTER - RADIUS * Math.cos((i * 6 * Math.PI) / 180)} r="1.5" className="fill-outline/50" />
                  ))}
                <line x1={CENTER} y1={CENTER} x2={handX} y2={handY} className="stroke-primary transition-all duration-150" strokeWidth="2" />
                <circle cx={CENTER} cy={CENTER} r="4" className="fill-primary" />
                <circle cx={handX} cy={handY} r="20" className="fill-primary transition-all duration-150" />
                {marks.map((mark, i) => {
                  const angle = i * 30 + (mode === "hour" ? 30 : 0);
                  const x = CENTER + RADIUS * Math.sin((angle * Math.PI) / 180);
                  const y = CENTER - RADIUS * Math.cos((angle * Math.PI) / 180);
                  const isSelected = mark === selected;
                  return (
                    <text key={mark} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight={isSelected ? 700 : 500} className={`pointer-events-none ${isSelected ? "fill-on-primary" : "fill-on-surface"}`}>
                      {mode === "hour" ? mark : pad(mark)}
                    </text>
                  );
                })}
              </svg>
              <p className="mt-1.5 text-center font-body-sm text-body-sm text-on-surface-variant">{t.hint}</p>

              <div className="mt-3 grid grid-cols-2 gap-space-sm">
                <button type="button" onClick={() => setOpen(false)} className="tap-scale py-3 rounded-xl bg-surface-container text-on-surface font-title-md text-title-md">
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(join(draft.hour12, draft.minute, draft.pm));
                    setOpen(false);
                  }}
                  className="tap-scale py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-bold"
                >
                  {t.ok}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
