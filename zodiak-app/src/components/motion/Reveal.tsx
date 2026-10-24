import { createElement, useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

export type RevealVariant = "up" | "fade" | "scale" | "left";

type RevealOptions = {
  /** "self" animates the element itself, "children" staggers its direct children (up to 12 steps). */
  mode?: "self" | "children";
  /** Extra start delay in ms. */
  delay?: number;
  /** Delay between staggered children in ms (mode "children"). */
  step?: number;
};

/**
 * Hooks an element into the scroll reveal system without adding a wrapper.
 * Elements already on screen animate in immediately; elements below the fold wait for
 * IntersectionObserver. Content stays visible when IO is missing, motion is reduced, or
 * when printing (the hidden state only exists after JS runs and only off-screen).
 *
 * ```tsx
 * const ref = useReveal<HTMLUListElement>({ mode: "children" });
 * return <ul ref={ref}>...</ul>;
 * ```
 */
export function useReveal<T extends HTMLElement>({ mode = "self", delay = 0, step }: RevealOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const attr = mode === "children" ? "stagger" : "reveal";
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    if (step) el.style.setProperty("--stagger-step", `${step}ms`);
    const show = () => {
      el.dataset[attr] = "in";
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show();
      return;
    }
    el.dataset[attr] = "out";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    const onPrint = () => {
      show();
      observer.disconnect();
    };
    window.addEventListener("beforeprint", onPrint);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", onPrint);
    };
    // Runs once per mount: reveal is a one-shot entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

type RevealTag = "div" | "section" | "article" | "ul" | "ol" | "li" | "header" | "footer" | "aside" | "figure" | "p" | "span" | "nav";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  /** Entrance style: rise up (default), fade, scale or slide from the left. */
  variant?: RevealVariant;
  /** Delay in ms before the entrance starts. */
  delay?: number;
  /** Stagger the direct children instead of animating this element as one block. */
  stagger?: boolean;
  /** Gap between staggered children in ms (default 70). */
  step?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Scroll-triggered entrance. Renders `as` (default div) and animates it, or its children
 * with `stagger`, the first time it enters the viewport.
 *
 * ```tsx
 * <Reveal as="section" className="space-y-2">...</Reveal>
 * <Reveal stagger className="grid grid-cols-2 gap-3">{cards}</Reveal>
 * <Reveal variant="scale" delay={120}>...</Reveal>
 * ```
 */
export function Reveal({ as = "div", variant = "up", delay, stagger = false, step, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>({ mode: stagger ? "children" : "self", delay, step });
  return createElement(as, { ...rest, ref, "data-variant": variant === "up" ? undefined : variant }, children);
}
