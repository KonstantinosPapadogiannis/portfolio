import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cudaSectionNumber, type CudaSectionId } from "@/components/cuda/outline";

// One numbered section of the CUDA case study, set as the OpenStack ones
// are. The number repeats the one in the contents list, so it is not read
// out; the heading names the section. The section fades in as one block
// when it scrolls into view (Reveal around the sections).
export function CudaSection({ id, children }: { id: CudaSectionId; children: ReactNode }) {
  const t = useTranslations("cudaPage.sections");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-reveal
      className="border-t border-border pt-12 pb-14 first:border-t-0 md:pt-16 md:pb-20"
    >
      <p aria-hidden="true" className="font-mono text-[12px] leading-4 text-muted">
        {cudaSectionNumber(id)}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-3 max-w-[820px] text-[26px] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink md:text-[32px] md:leading-[38px]"
      >
        {t(`${id}.title`)}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
