// The Home page hero: a slowly turning ring of the 12 zodiac signs with planets circling a glowing sun.
// Pure CSS animation; everything holds still when the phone asks for reduced motion.
import { useReducedMotion } from "./useReducedMotion";

/** Zodiac glyphs with U+FE0E so phones draw them as text, not coloured emoji. */
const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((glyph) => `${glyph}︎`);

/** Orbits from the sun outwards: ring size (inset %), planet colour and size, time for one lap, direction. */
const ORBITS = [
  { inset: "34%", color: "#d0bcff", size: 6, seconds: 7, reverse: false, label: "Mercury" },
  { inset: "26%", color: "#e8e6f0", size: 8, seconds: 11, reverse: true, label: "Moon" },
  { inset: "18%", color: "#ff8a7a", size: 7, seconds: 16, reverse: false, label: "Mars" },
  { inset: "10%", color: "#f2ca50", size: 10, seconds: 24, reverse: true, label: "Jupiter" },
];

const STARS: [number, number, number][] = [
  [8, 18, 0], [88, 12, 1.2], [94, 62, 0.6], [12, 80, 1.8], [50, 2, 2.4], [70, 92, 0.9], [26, 6, 1.5], [96, 36, 2.1],
];

export function ZodiacWheel({ className = "w-56 h-56" }: { className?: string }) {
  const still = useReducedMotion();
  return (
    <div className={`relative ${className}`} aria-hidden>
      {/* Twinkling stars around the wheel */}
      {STARS.map(([x, y, delay]) => (
        <span
          key={`${x}-${y}`}
          className="absolute w-1 h-1 rounded-full bg-primary animate-twinkle motion-reduce:animate-none"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
        />
      ))}

      {/* Outer ring of the 12 signs, turning slowly */}
      <div className="absolute inset-0 animate-[spin_90s_linear_infinite] motion-reduce:animate-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(242,202,80,0.35)" strokeWidth="0.75" />
          <circle cx="100" cy="100" r="79" fill="none" stroke="rgba(242,202,80,0.25)" strokeWidth="0.5" strokeDasharray="2 3" />
          {SIGNS.map((glyph, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const tick = ((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <g key={glyph}>
                <text x={100 + 88 * Math.cos(angle)} y={100 + 88 * Math.sin(angle)} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f2ca50" opacity="0.85">
                  {glyph}
                </text>
                <line x1={100 + 79 * Math.cos(tick)} y1={100 + 79 * Math.sin(tick)} x2={100 + 97 * Math.cos(tick)} y2={100 + 97 * Math.sin(tick)} stroke="rgba(242,202,80,0.3)" strokeWidth="0.6" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Planet orbits: each ring turns at its own speed and carries one planet */}
      {ORBITS.map((orbit) => (
        <div
          key={orbit.label}
          className="absolute rounded-full border border-primary/15 motion-reduce:animate-none"
          style={{ inset: orbit.inset, animation: still ? "none" : `spin ${orbit.seconds}s linear infinite${orbit.reverse ? " reverse" : ""}` }}
        >
          <span
            className="absolute left-1/2 rounded-full"
            style={{
              width: orbit.size,
              height: orbit.size,
              top: -orbit.size / 2,
              marginLeft: -orbit.size / 2,
              background: orbit.color,
              boxShadow: `0 0 ${orbit.size + 4}px ${orbit.color}`,
            }}
          />
        </div>
      ))}

      {/* Saturn with its ring, drifting on the slowest outer path */}
      <div className="absolute inset-[3%] animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute left-1/2 top-[90%] -ml-2 w-4 h-4 flex items-center justify-center">
          <span className="absolute w-5 h-1.5 rounded-full border border-[#e9c46a]/80 rotate-[-20deg]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e9c46a] shadow-[0_0_8px_#e9c46a]" />
        </span>
      </div>

      {/* The sun at the centre */}
      <div className="absolute inset-[40%] flex items-center justify-center">
        <span className="absolute -inset-3 rounded-full bg-primary/25 blur-md animate-glow motion-reduce:animate-none" />
        <span className="absolute -inset-1.5 animate-[spin_20s_linear_infinite] motion-reduce:animate-none">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={20 + 15 * Math.cos(a)} y1={20 + 15 * Math.sin(a)} x2={20 + 19 * Math.cos(a)} y2={20 + 19 * Math.sin(a)} stroke="#f2ca50" strokeWidth="1.4" strokeLinecap="round" />;
            })}
          </svg>
        </span>
        <span className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff4c2,#f2ca50_45%,#d4a017)] shadow-[0_0_24px_rgba(242,202,80,0.8)]" />
      </div>
    </div>
  );
}
