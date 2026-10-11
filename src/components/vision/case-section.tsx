import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { visionSectionNumber, type VisionSectionId } from "@/components/vision/outline";
import { nb } from "@/lib/rich-text";

// One numbered section of the computer vision case study, set as the CUDA
// ones are. The number repeats the one in the contents list, so it is not
// read out; the heading names the section. The section fades in as one
// block when it scrolls into view (Reveal around the sections).
export function VisionSection({ id, children }: { id: VisionSectionId; children: ReactNode }) {
  const t = useTranslations("visionPage.sections");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-reveal
      className="border-t border-border pt-12 pb-14 first:border-t-0 md:pt-16 md:pb-20"
    >
      <p aria-hidden="true" className="font-mono text-[0.75rem] leading-4 text-muted">
        {visionSectionNumber(id)}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-3 max-w-[820px] text-[1.625rem] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink md:text-[2rem] md:leading-[2.375rem]"
      >
        {t.rich(`${id}.title`, { nb })}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
