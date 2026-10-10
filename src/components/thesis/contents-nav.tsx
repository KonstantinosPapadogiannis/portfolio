"use client";

import { useEffect, useState } from "react";
import { eyebrowClass } from "@/components/ui/eyebrow";

type ContentsItem = {
  id: string;
  number: string;
  label: string;
};

// The contents of a case study, beside the text from 1280px. The section
// whose top has passed 30% of the viewport is marked as current; at the end
// of the page it is the last one. Phones and tablets get no contents list:
// the sections follow each other with their numbers.
export function ContentsNav({ label, items }: { label: string; items: ContentsItem[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const atEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let next: string | null = null;
      for (const { id } of items) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) {
          next = id;
        }
      }
      if (atEnd && next) {
        next = items[items.length - 1].id;
      }
      setCurrent(next);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <nav aria-labelledby="contents-label" className="sticky top-8">
      <p id="contents-label" className={`${eyebrowClass} text-muted`}>
        {label}
      </p>
      <ol className="mt-4 border-l border-border">
        {items.map(({ id, number, label: itemLabel }) => {
          const isCurrent = id === current;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={`-ml-px flex gap-3 border-l py-[5px] pl-4 text-[13px] leading-5 transition-colors duration-150 ${
                  isCurrent ? "border-steel text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <span aria-hidden="true" className="w-4 shrink-0 font-mono text-[11px]">
                  {number}
                </span>
                <span>{itemLabel}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
