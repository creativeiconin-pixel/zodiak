import type { Chart, Planet } from "../../lib/astro";

type DiagramProps = {
  chart: Chart;
  short: Record<Planet, string>;
  selectedHouse: number | null;
  onSelectHouse: (house: number) => void;
  houseLabel: (n: number) => string;
  ascLabel: string;
};

const ORDER: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function planetsInHouse(chart: Chart, house: number): Planet[] {
  return ORDER.filter((p) => chart.planets[p].house === house);
}

// North Indian diamond: houses are fixed, the Lagna sign sits in house 1 (top centre).
const NORTH_HOUSES: { points: string; label: [number, number]; sign: [number, number] }[] = [
  { points: "200,0 300,100 200,200 100,100", label: [200, 95], sign: [200, 180] },
  { points: "0,0 200,0 100,100", label: [100, 38], sign: [100, 85] },
  { points: "0,0 100,100 0,200", label: [38, 100], sign: [85, 100] },
  { points: "0,200 100,100 200,200 100,300", label: [100, 195], sign: [180, 200] },
  { points: "0,200 100,300 0,400", label: [38, 300], sign: [85, 300] },
  { points: "0,400 100,300 200,400", label: [100, 365], sign: [100, 318] },
  { points: "200,400 100,300 200,200 300,300", label: [200, 305], sign: [200, 222] },
  { points: "200,400 300,300 400,400", label: [300, 365], sign: [300, 318] },
  { points: "400,400 300,300 400,200", label: [362, 300], sign: [315, 300] },
  { points: "400,200 300,300 200,200 300,100", label: [300, 195], sign: [220, 200] },
  { points: "400,200 300,100 400,0", label: [362, 100], sign: [315, 100] },
  { points: "400,0 300,100 200,0", label: [300, 38], sign: [300, 85] },
];

function PlanetLabels({ x, y, planets, short, delay = 0 }: { x: number; y: number; planets: Planet[]; short: Record<Planet, string>; delay?: number }) {
  const rows = [planets.slice(0, 3), planets.slice(3, 6)].filter((r) => r.length);
  return (
    <>
      {rows.map((row, r) => (
        <text key={r} x={x} y={y + r * 20 - (rows.length - 1) * 10} textAnchor="middle" dominantBaseline="middle" className="fill-on-surface animate-fade-in" style={{ animationDelay: `${delay + r * 80}ms`, animationDuration: "600ms" }} fontSize="15" fontWeight="600">
          {row.map((p, i) => (
            <tspan key={p} className={p === "Moon" || p === "Sun" ? "fill-primary" : p === "Rahu" || p === "Ketu" ? "fill-secondary" : undefined} dx={i ? 4 : 0}>
              {short[p]}
            </tspan>
          ))}
        </text>
      ))}
    </>
  );
}

export function NorthIndianChart({ chart, short, selectedHouse, onSelectHouse, houseLabel, ascLabel }: DiagramProps) {
  return (
    <svg viewBox="-2 -2 404 404" className="w-full h-auto" role="group">
      {NORTH_HOUSES.map((house, index) => {
        const number = index + 1;
        const sign = ((chart.ascendant.sign + index) % 12) + 1;
        const selected = selectedHouse === number;
        return (
          <g key={number} role="button" tabIndex={0} aria-label={houseLabel(number)} aria-pressed={selected} onClick={() => onSelectHouse(number)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectHouse(number)} className="cursor-pointer focus:outline-none">
            <polygon points={house.points} pathLength={1} style={{ "--draw-delay": `${index * 60}ms` } as React.CSSProperties} className={`draw-stroke stroke-primary/50 transition-colors duration-300 ${selected ? "fill-primary/15" : number === 1 ? "fill-secondary-container/25 hover:fill-surface-container-high" : "fill-transparent hover:fill-surface-container-high"}`} strokeWidth="1.2" />
            {selected && <polygon points={house.points} className="motion-decor fill-primary/20 pointer-events-none animate-twinkle [animation-duration:1.8s]" />}
            <text x={house.sign[0]} y={house.sign[1]} textAnchor="middle" dominantBaseline="middle" className="fill-on-surface-variant animate-fade-in" style={{ animationDelay: `${300 + index * 40}ms` }} fontSize="12">{sign}</text>
            {number === 1 && <text x="200" y="42" textAnchor="middle" className="fill-primary animate-fade-in [animation-delay:500ms]" fontSize="12" fontWeight="700">{ascLabel}</text>}
            <PlanetLabels x={house.label[0]} y={house.label[1]} planets={planetsInHouse(chart, number)} short={short} delay={600 + index * 50} />
          </g>
        );
      })}
    </svg>
  );
}

// South Indian grid: signs are fixed (Pisces top-left), the Lagna is marked.
const SOUTH_CELLS: [number, number][] = [
  [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0],
];

export function SouthIndianChart({ chart, short, selectedHouse, onSelectHouse, houseLabel, ascLabel, signNames }: DiagramProps & { signNames: string[] }) {
  return (
    <svg viewBox="-2 -2 404 404" className="w-full h-auto" role="group">
      {SOUTH_CELLS.map(([col, row], sign) => {
        const house = ((sign - chart.ascendant.sign + 12) % 12) + 1;
        const selected = selectedHouse === house;
        const x = col * 100;
        const y = row * 100;
        return (
          <g key={sign} role="button" tabIndex={0} aria-label={houseLabel(house)} aria-pressed={selected} onClick={() => onSelectHouse(house)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectHouse(house)} className="cursor-pointer focus:outline-none">
            <rect x={x} y={y} width="100" height="100" pathLength={1} style={{ "--draw-delay": `${sign * 50}ms` } as React.CSSProperties} className={`draw-stroke stroke-primary/50 transition-colors duration-300 ${selected ? "fill-primary/15" : house === 1 ? "fill-secondary-container/25 hover:fill-surface-container-high" : "fill-transparent hover:fill-surface-container-high"}`} strokeWidth="1.2" />
            {selected && <rect x={x} y={y} width="100" height="100" className="motion-decor fill-primary/20 pointer-events-none animate-twinkle [animation-duration:1.8s]" />}
            {house === 1 && <line x1={x} y1={y + 22} x2={x + 22} y2={y} pathLength={1} className="draw-stroke stroke-primary [--draw-delay:700ms]" strokeWidth="1.5" />}
            <text x={x + 50} y={y + 16} textAnchor="middle" className="fill-on-surface-variant animate-fade-in" style={{ animationDelay: `${300 + sign * 40}ms` }} fontSize="11">{signNames[sign]}</text>
            {house === 1 && <text x={x + 50} y={y + 88} textAnchor="middle" className="fill-primary animate-fade-in [animation-delay:500ms]" fontSize="11" fontWeight="700">{ascLabel}</text>}
            <PlanetLabels x={x + 50} y={y + 52} planets={planetsInHouse(chart, house)} short={short} delay={600 + sign * 50} />
          </g>
        );
      })}
      <rect x="100" y="100" width="200" height="200" className="fill-surface-container-lowest/40 stroke-primary/30" strokeWidth="1" />
    </svg>
  );
}
