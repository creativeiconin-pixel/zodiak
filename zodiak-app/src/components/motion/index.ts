/**
 * Zodiak motion kit. CSS-driven (keyframes in tailwind.config.ts + src/index.css), transform/opacity
 * only, and fully disabled under prefers-reduced-motion.
 *
 * Utility classes you can use directly: animate-rise, animate-fade-in, animate-scale-in, animate-pop-in,
 * animate-sheet-up, animate-slide-in-left, animate-grow-x (origin-left), animate-grow-y, animate-icon-bounce,
 * animate-twinkle, animate-float, animate-glow, animate-pulse-ring, animate-wave, animate-spin-slow,
 * tap-scale (press feedback), hover-lift, sheen (button light sweep), shimmer, draw-stroke (SVG, pathLength="1"),
 * motion-decor (hidden for reduced motion and print). Stagger delays: style={{ animationDelay: `${i * 70}ms` }}.
 */
export { Reveal, useReveal, type RevealVariant } from "./Reveal";
export { PageTransition } from "./PageTransition";
export { Starfield } from "./Starfield";
export { CountUp } from "./CountUp";
export { Skeleton } from "./Skeleton";
export { TypingDots } from "./TypingDots";
export { PulseRing } from "./PulseRing";
export { useReducedMotion, prefersReducedMotion } from "./useReducedMotion";
