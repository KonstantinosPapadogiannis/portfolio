import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { openstackSectionNumber, type OpenstackSectionId } from "@/components/openstack/outline";

// One numbered section of the OpenStack case study, set as the ErgoHub and
// thesis sections are. The number repeats the one in the contents list, so
// it is not read out; the heading names the section. The section fades in
// as one block when it scrolls into view (Reveal around the sections).
export function OpenstackSection({
  id,
  children,
}: {
  id: OpenstackSectionId;
  children: ReactNode;
}) {
  const t = useTranslations("openstackPage.sections");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-reveal
      className="border-t border-border pt-12 pb-14 first:border-t-0 md:pt-16 md:pb-20"
    >
      <p aria-hidden="true" className="font-mono text-[0.75rem] leading-4 text-muted">
        {openstackSectionNumber(id)}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-3 max-w-[820px] text-[1.625rem] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink md:text-[2rem] md:leading-[2.375rem]"
      >
        {t(`${id}.title`)}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
