"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Items that enter the viewport together fade in one after another, this
// far apart, up to four steps.
const STAGGER_MS = 80;
const MAX_STEPS = 4;

// Fades the [data-reveal] items inside it in as they scroll into view, once.
// The server renders everything visible. This only hides items that are
// still below the viewport when it runs, so nothing on screen disappears,
// and does nothing when the reader prefers reduced motion or the browser
// has no IntersectionObserver. Opacity and transform only: nothing moves
// in the layout. The styles are in globals.css.
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (item) => item.getBoundingClientRect().top > window.innerHeight,
    );
    if (items.length === 0) return;

    let pending = items.length;
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        entering.forEach((item, step) => {
          item.style.transitionDelay = `${Math.min(step, MAX_STEPS) * STAGGER_MS}ms`;
          item.dataset.revealState = "shown";
          observer.unobserve(item);
        });

        pending -= entering.length;
        if (pending === 0) observer.disconnect();
      },
      // A little above the bottom edge, so the movement is seen.
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const item of items) {
      item.dataset.revealState = "pending";
      observer.observe(item);
    }

    return () => {
      observer.disconnect();
      // Never leave an item hidden with nothing left to show it.
      for (const item of items) {
        if (item.dataset.revealState === "pending") delete item.dataset.revealState;
      }
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
