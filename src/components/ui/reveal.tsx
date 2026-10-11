"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Items that enter the viewport together fade in one after another, this
// far apart, up to four steps.
const STAGGER_MS = 80;
const MAX_STEPS = 4;

// One observer for every Reveal on the page. It is created when the first
// item starts waiting, stops watching each item once it is shown, and is
// disconnected and dropped when no item is left waiting, so a page that has
// been scrolled through keeps no observer at all.
let observer: IntersectionObserver | null = null;
const waiting = new Set<HTMLElement>();

function release(item: HTMLElement) {
  observer?.unobserve(item);
  waiting.delete(item);
  if (waiting.size === 0) {
    observer?.disconnect();
    observer = null;
  }
}

function show(entries: IntersectionObserverEntry[]) {
  const entering = entries
    .filter((entry) => entry.isIntersecting)
    .map((entry) => entry.target as HTMLElement)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  entering.forEach((item, step) => {
    item.style.transitionDelay = `${Math.min(step, MAX_STEPS) * STAGGER_MS}ms`;
    item.dataset.revealState = "shown";
    release(item);
  });
}

function watch(item: HTMLElement) {
  // A little above the bottom edge, so the movement is seen.
  observer ??= new IntersectionObserver(show, { rootMargin: "0px 0px -8% 0px" });
  item.dataset.revealState = "pending";
  waiting.add(item);
  observer.observe(item);
}

// Fades the [data-reveal] items inside it in as they scroll into view, once.
// The server renders everything visible. This only hides items that are
// still below the viewport when it runs, so nothing on screen disappears,
// and does nothing when the reader prefers reduced motion or the browser
// has no IntersectionObserver. Opacity and transform only: nothing moves
// in the layout. The styles are in globals.css.
//
// An item takes over the element's transition while it is shown, so it
// should be a block around a link or a button, never the control itself.
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (item) => item.getBoundingClientRect().top > window.innerHeight,
    );
    items.forEach(watch);

    return () => {
      // Never leave an item hidden with nothing left to show it.
      for (const item of items) {
        if (!waiting.has(item)) continue;
        release(item);
        delete item.dataset.revealState;
      }
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
