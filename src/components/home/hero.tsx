import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { Separator } from "@/components/ui/separator";
import { SystemsMotif } from "@/components/home/systems-motif";
import { sectionIds } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { br } from "@/lib/rich-text";

// The 1440 reference on a 12-column grid: copy in columns 1–7, the motif
// centred in columns 8–11 and vertically on the headline. The copy flows at
// its natural height, so a longer Greek headline pushes the paragraph down
// instead of running into it. The first screen comes in once as it is
// painted: the label and the headline, then the text and the links, then
// the motif (data-enter in globals.css).
export function Hero() {
  const t = useTranslations("hero");

  return (
    <Container
      as="section"
      aria-labelledby="hero-heading"
      className="pt-[33px] pb-[60px] md:pt-12 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-14 lg:pb-[51px]"
    >
      {/* Set tighter than the other labels, as in the reference. The gap
          is 8px on each side of the slash, 12px from md; the padding on the
          right makes up the rest of the space after it. */}
      <p
        data-enter="1"
        className="font-label text-[10px] leading-4 tracking-[0.02em] text-muted uppercase md:text-[11px] lg:col-span-12"
      >
        {t("name")}
        <Separator className="pr-[1.8px] pl-2 md:pr-[5.2px] md:pl-3" />
        {t("location")}
      </p>

      <h1
        id="hero-heading"
        data-enter="1"
        className="mt-[30px] text-[40px] leading-[43px] font-semibold tracking-[-0.025em] text-ink sm:text-[52px] sm:leading-[56px] md:mt-10 lg:col-span-7 lg:row-start-2 lg:mt-[39px] lg:max-w-[730px] lg:text-[68px] lg:leading-[72px]"
      >
        {t.rich("headline", { br })}
      </h1>

      <p
        data-enter="2"
        className="mt-5 max-w-[660px] text-[15px] leading-[23px] text-muted md:mt-6 md:text-[18px] md:leading-[30px] lg:col-span-7 lg:row-start-3"
      >
        {t("intro")}
      </p>

      <div
        data-enter="2"
        className="mt-8 flex flex-wrap items-center gap-x-[26px] gap-y-5 md:mt-10 lg:col-span-7 lg:row-start-4"
      >
        <Button href={`#${sectionIds.work}`} className="min-w-[142px] md:min-w-[154px]">
          {t("selectedWork")}
        </Button>
        <div className="flex items-center gap-x-6 text-[15px] text-ink md:gap-x-8">
          <TextLink
            href={siteConfig.resumePdf}
            arrow="up-right"
            hrefLang="en"
            className="py-2 hover:text-steel"
          >
            {t("resume")}
            <span className="sr-only">{t("resumeNote")}</span>
          </TextLink>
          <TextLink
            href={siteConfig.github}
            arrow="up-right"
            rel="me"
            className="py-2 hover:text-steel"
          >
            GitHub
          </TextLink>
          <TextLink
            href={siteConfig.linkedin}
            arrow="up-right"
            rel="me"
            className="py-2 hover:text-steel"
          >
            LinkedIn
          </TextLink>
        </div>
      </div>

      {/* Decorative: an abstract topology, not a diagram of a real system. */}
      <div
        aria-hidden="true"
        data-enter="3"
        className="relative mt-11 lg:col-span-4 lg:col-start-8 lg:row-start-2 lg:mt-[39px] lg:self-center"
      >
        <SystemsMotif className="mx-auto block w-[178px] lg:w-[300px]" />
        <p
          className={`${eyebrowClass} absolute top-full left-0 mt-12 hidden text-muted lg:block`}
        >
          {t("motifCaption")}
        </p>
      </div>
    </Container>
  );
}
