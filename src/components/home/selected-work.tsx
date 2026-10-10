import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { SectionLabel } from "@/components/home/section-label";
import { ThesisArchitecture } from "@/components/home/thesis-architecture";
import { sectionIds } from "@/config/navigation";
import { getPathname } from "@/i18n/navigation";
import { br, nb } from "@/lib/rich-text";

const tags = ["Hyperledger Fabric", "Go", "React / TypeScript", "Web Crypto API"];

// The flagship project: the bachelor's thesis, with its architecture beside
// the description on desktop and below it on smaller screens.
export function SelectedWork() {
  const t = useTranslations("thesis");
  const tWork = useTranslations("work");
  const locale = useLocale();

  return (
    <section id={sectionIds.work} aria-labelledby="work-heading">
      <Container className="pt-[51px] pb-14 lg:pb-[52px]">
        <SectionLabel id="work-heading" parts={[tWork("label")]} />

        <article
          aria-labelledby="thesis-title"
          className="mt-[30px] lg:mt-[29px] lg:grid lg:grid-cols-[minmax(0,634fr)_minmax(0,638fr)] lg:gap-x-14"
        >
          <div>
            {/* Upper case on phones and sentence case on desktop, as in the
                reference. */}
            <p className="flex flex-wrap items-baseline gap-x-[18px] font-label text-[11px] leading-5 text-muted uppercase lg:normal-case">
              <span className="text-[13px] text-ink lg:mr-2.5 lg:text-[15px]">01</span>{" "}
              <span className="text-ink lg:text-[13px]">{t("kind")}</span>{" "}
              <span>2026</span>{" "}
              <span>
                <span className="sr-only">{t("grade")} </span>
                10/10
              </span>
            </p>

            <h3
              id="thesis-title"
              className="mt-[27px] max-w-[440px] text-[27px] leading-[33px] font-semibold tracking-[-0.02em] text-ink sm:max-w-[560px] md:max-w-[620px] md:text-[32px] md:leading-[40px] lg:mt-[33px] lg:max-w-[460px] lg:text-[36px] lg:leading-[44px]"
            >
              {t.rich("title", { br })}
            </h3>

            <p className="mt-5 max-w-[600px] text-[15px] leading-6 text-muted md:text-[16px] md:leading-[25px]">
              {t("body")}
            </p>

            <ul aria-label={t("tagsLabel")} className="mt-6 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  lang="en"
                  className="flex h-[26px] items-center border border-border px-2 font-mono text-[11px] text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <TextLink
              href={getPathname({ href: "/work/thesis", locale })}
              internal
              className="mt-10 text-[14px] text-ink hover:text-steel md:text-[15px] lg:mt-12"
            >
              {t("cta")}
            </TextLink>
          </div>

          <div className="mt-12 lg:mt-0">
            <ThesisArchitecture />

            <dl className="mt-6 grid gap-y-6">
              {(["privateData", "testing"] as const).map((key) => (
                <div key={key}>
                  <dt className="font-label text-[10px] leading-4 tracking-[0.06em] text-ink uppercase">
                    {t(`facts.${key}.label`)}
                  </dt>
                  <dd className="mt-2 text-[13px] leading-5 text-pretty text-muted">
                    {t.rich(`facts.${key}.value`, { nb })}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      </Container>
    </section>
  );
}
