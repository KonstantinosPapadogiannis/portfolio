"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { IconButton } from "@/components/ui/icon-button";

export type GallerySlide = {
  id: string;
  // Names the slide in the indicator buttons and the announcement.
  title: string;
  content: ReactNode;
};

// Swipes shorter than this, or more vertical than horizontal, are left to
// the page.
const swipeThreshold = 48;

const pad = (value: number) => String(value).padStart(2, "0");

// A set of related visuals inside a case study, one at a time. Nothing moves
// on its own: the slide changes only through the buttons, the arrow keys
// while a control has focus, or a horizontal swipe on a touch screen. The
// slides share one grid cell, so the gallery is as tall as its tallest slide
// and does not jump between them. Hidden slides are inert. Essential content
// must also be in the text around the gallery.
export function ProjectGallery({
  id,
  title,
  slides,
}: {
  id: string;
  title: string;
  slides: GallerySlide[];
}) {
  const t = useTranslations("gallery");
  const [index, setIndex] = useState(0);
  // The live region stays empty until the reader changes the slide.
  const [changed, setChanged] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const indicators = useRef<(HTMLButtonElement | null)[]>([]);
  const total = slides.length;
  const slidesId = `${id}-slides`;

  const show = (next: number) => {
    const target = (next + total) % total;
    setIndex(target);
    setChanged(true);
    return target;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const target = show(index + (event.key === "ArrowRight" ? 1 : -1));
    // From an indicator, focus follows the slide, as in a tab list.
    if (event.target instanceof HTMLElement && event.target.dataset.indicator !== undefined) {
      indicators.current[target]?.focus();
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipe.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy)) {
      show(index + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <section
      aria-roledescription={t("carousel")}
      aria-labelledby={`${id}-title`}
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 id={`${id}-title`} className={`${eyebrowClass} min-w-0 text-muted`}>
          {title}
        </h3>
        <div className="-mr-[12px] flex shrink-0 items-center">
          <span
            aria-hidden="true"
            className="mr-2 font-mono text-[0.75rem] leading-4 whitespace-nowrap text-muted"
          >
            {pad(index + 1)} / {pad(total)}
          </span>
          <IconButton
            aria-label={t("previous")}
            aria-controls={slidesId}
            onClick={() => show(index - 1)}
          >
            <ArrowRightIcon className="rotate-180" />
          </IconButton>
          <IconButton aria-label={t("next")} aria-controls={slidesId} onClick={() => show(index + 1)}>
            <ArrowRightIcon />
          </IconButton>
        </div>
      </div>

      <div
        id={slidesId}
        className="mt-2 grid touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription={t("slide")}
              aria-label={t("slideLabel", { current: i + 1, total })}
              inert={!active}
              className={`[grid-area:1/1] transition-[opacity,visibility] duration-200 ${
                active ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              {slide.content}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-1">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <button
              key={slide.id}
              ref={(node) => {
                indicators.current[i] = node;
              }}
              type="button"
              data-indicator=""
              aria-label={t("goTo", { number: i + 1, title: slide.title })}
              aria-current={active ? "true" : undefined}
              aria-controls={slidesId}
              onClick={() => show(i)}
              className="group flex h-6 w-10 items-center"
            >
              <span
                className={`h-0.5 w-full transition-colors duration-150 ${
                  active ? "bg-ink" : "bg-border group-hover:bg-muted"
                }`}
              />
            </button>
          );
        })}
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {changed
          ? t("announcement", { current: index + 1, total, title: slides[index].title })
          : ""}
      </p>
    </section>
  );
}
