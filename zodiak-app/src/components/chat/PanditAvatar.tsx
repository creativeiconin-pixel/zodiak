import { useId } from "react";

// Rudraksha beads along the neckline, from shoulder to shoulder
const BEADS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  return { x: 45 + 30 * t, y: 93 + 13 * Math.sin(Math.PI * t) };
});

const STARS: [number, number, number][] = [
  [16, 22, 1.2], [28, 12, 0.8], [100, 18, 1.1], [108, 38, 0.7], [12, 52, 0.7], [94, 8, 0.6], [20, 80, 0.6], [106, 70, 0.8],
];

/**
 * Pandit Jii's face: a kind, smiling family pandit with a white beard, tilak, saffron shawl and rudraksha mala,
 * set against the night sky with a soft golden zodiac halo. Drawn as SVG so it stays sharp at any size.
 */
export function PanditAvatar({ className = "w-10 h-10", title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 120 120" className={`shrink-0 rounded-full ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id={`${id}-sky`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3b2d63" />
          <stop offset="100%" stopColor="#120b24" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#f2ca50" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f2ca50" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7b487" />
          <stop offset="100%" stopColor="#c98a5c" />
        </linearGradient>
        <linearGradient id={`${id}-shawl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffa53a" />
          <stop offset="100%" stopColor="#d4561a" />
        </linearGradient>
        <linearGradient id={`${id}-beard`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddd6cc" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>

      <g clipPath={ref("clip")}>
        {/* Night sky with a few gold stars */}
        <rect width="120" height="120" fill={ref("sky")} />
        {STARS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#f2ca50" opacity="0.8" />
        ))}

        {/* Golden zodiac halo */}
        <circle cx="60" cy="54" r="46" fill={ref("halo")} />
        <circle cx="60" cy="54" r="40" fill="none" stroke="#f2ca50" strokeOpacity="0.45" strokeWidth="0.8" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={60 + 40 * Math.cos(angle)} cy={54 + 40 * Math.sin(angle)} r="1.3" fill="#f2ca50" opacity="0.7" />;
        })}

        {/* Saffron shawl over a cream kurta */}
        <path d="M10 120 C12 101 32 92 47 90 L73 90 C88 92 108 101 110 120 Z" fill={ref("shawl")} />
        <path d="M47 90 L60 106 L73 90 Z" fill="#f6ecd9" />
        <path d="M28 99 C38 104 45 112 47 120" fill="none" stroke="#b9450f" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M92 99 C82 104 75 112 73 120" fill="none" stroke="#b9450f" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />

        {/* Ears and face */}
        <ellipse cx="41" cy="59" rx="3.6" ry="6" fill="#d39567" />
        <ellipse cx="79" cy="59" rx="3.6" ry="6" fill="#d39567" />
        <ellipse cx="60" cy="56" rx="19" ry="22.5" fill={ref("skin")} />
        {/* Soft shine on the head */}
        <ellipse cx="54" cy="40" rx="7" ry="3.5" fill="#fff" opacity="0.18" />

        {/* White hair at the sides */}
        <path d="M41.5 52 C39 46 42 41 45 40 C44 44 44 48 45 52 Z" fill="#f3efe8" />
        <path d="M78.5 52 C81 46 78 41 75 40 C76 44 76 48 75 52 Z" fill="#f3efe8" />

        {/* Tilak: three lines of sandalwood with a red dot */}
        <g stroke="#fff6e6" strokeWidth="1.3" strokeLinecap="round">
          <line x1="52" y1="38.5" x2="68" y2="38.5" />
          <line x1="51" y1="41.3" x2="69" y2="41.3" />
          <line x1="52" y1="44.1" x2="68" y2="44.1" />
        </g>
        <circle cx="60" cy="41.3" r="1.9" fill="#d62f2f" />

        {/* Kind, smiling eyes and white eyebrows */}
        <path d="M47.5 50 Q52 47.2 56.5 49.4" fill="none" stroke="#f3efe8" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M63.5 49.4 Q68 47.2 72.5 50" fill="none" stroke="#f3efe8" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M49 57 Q52.5 53.8 56 57" fill="none" stroke="#3b2416" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M64 57 Q67.5 53.8 71 57" fill="none" stroke="#3b2416" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="48.5" cy="63" r="3" fill="#e8806f" opacity="0.35" />
        <circle cx="71.5" cy="63" r="3" fill="#e8806f" opacity="0.35" />
        <path d="M60 57.5 Q58 63.5 59.6 65.2 Q61.6 65.6 62.4 64.4" fill="none" stroke="#a8693f" strokeWidth="1.2" strokeLinecap="round" />

        {/* White beard and moustache */}
        <path d="M41 60 C41 80 50 95 60 97 C70 95 79 80 79 60 C76 70 70 74.5 60 74.5 C50 74.5 44 70 41 60 Z" fill={ref("beard")} />
        <path d="M60 97 C57 92 57 86 60 82 C63 86 63 92 60 97 Z" fill="#cfc7bb" opacity="0.5" />
        <path d="M47.5 70.5 C51.5 66 56.5 66 60 68.5 C63.5 66 68.5 66 72.5 70.5 C68.5 73.5 63.5 72.5 60 71.3 C56.5 72.5 51.5 73.5 47.5 70.5 Z" fill="#fff" />
        <path d="M56.5 75.2 Q60 77.6 63.5 75.2" fill="none" stroke="#b5574a" strokeWidth="1.4" strokeLinecap="round" />

        {/* Rudraksha mala */}
        {BEADS.map(({ x, y }) => (
          <g key={x}>
            <circle cx={x} cy={y} r="2" fill="#7a3f1f" />
            <circle cx={x - 0.6} cy={y - 0.6} r="0.6" fill="#c98a5c" />
          </g>
        ))}
      </g>
    </svg>
  );
}
