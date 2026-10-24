/** Tiny repeating star dots drawn with radial gradients (no images, no JS). */
const LAYERS = [
  {
    size: 256,
    image:
      "radial-gradient(1px 1px at 24px 40px, #fff 50%, transparent 51%), radial-gradient(1px 1px at 140px 96px, #f2ca50 50%, transparent 51%), radial-gradient(1.4px 1.4px at 210px 18px, #e1e1f5 50%, transparent 51%), radial-gradient(1px 1px at 80px 190px, #d0bcff 50%, transparent 51%), radial-gradient(1px 1px at 196px 220px, #fff 50%, transparent 51%)",
    className: "opacity-60 animate-twinkle",
    style: { animationDuration: "5s" },
  },
  {
    size: 256,
    image:
      "radial-gradient(1.6px 1.6px at 60px 120px, #f2ca50 50%, transparent 51%), radial-gradient(1px 1px at 180px 160px, #e1e1f5 50%, transparent 51%), radial-gradient(1.2px 1.2px at 230px 70px, #d0bcff 50%, transparent 51%), radial-gradient(1px 1px at 110px 236px, #fff 50%, transparent 51%)",
    className: "opacity-40 animate-twinkle",
    style: { animationDuration: "7s", animationDelay: "-3s" },
  },
];

/**
 * Slowly drifting, twinkling star layer for the celestial background. Decorative only
 * (aria-hidden, pointer-events none) and hidden for reduced motion / print.
 * `fixed` (default) covers the viewport behind the page; pass `fixed={false}` to fill a
 * positioned parent instead (e.g. a hero card).
 *
 * ```tsx
 * <Starfield />                                   // in a layout, behind everything
 * <div className="relative overflow-hidden"><Starfield fixed={false} />...</div>
 * ```
 */
export function Starfield({ fixed = true, className = "" }: { fixed?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`motion-decor pointer-events-none overflow-hidden ${fixed ? "fixed inset-0 -z-10" : "absolute inset-0"} ${className}`}>
      {LAYERS.map((layer, i) => (
        <div key={i} className={`absolute inset-x-0 top-0 h-[calc(100%+256px)] ${i === 0 ? "animate-drift" : ""}`} style={i === 1 ? { animation: "drift 140s linear infinite" } : undefined}>
          <div className={`absolute inset-0 ${layer.className}`} style={{ ...layer.style, backgroundImage: layer.image, backgroundSize: `${layer.size}px ${layer.size}px` }} />
        </div>
      ))}
    </div>
  );
}
