import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/home/section-label";

const themes = ["systems", "protocols", "security", "ai", "markets"] as const;

// Fields followed and studied, as distinct from the tools listed under
// Technologies. Kept quieter than About: a short lead in the first column
// and the themes as ruled rows across the other two, the name aligned to
// the second column and the description to the third, as in the project
// grid below. Not a sequence, so not numbered.
export function Interests() {
  const t = useTranslations("interests");

  return (
    <section aria-labelledby="interests-heading">
      <Container className="pt-[51px] pb-14 lg:grid lg:grid-cols-3 lg:pb-16">
        <SectionLabel id="interests-heading" parts={[t("label")]} className="lg:col-span-3" />

        <div className="mt-[30px] lg:mt-[42px] lg:pr-14">
          <p className="max-w-[440px] text-[24px] leading-[30px] font-semibold tracking-[-0.015em] text-ink md:text-[28px] md:leading-[34px]">
            {t("lead")}
          </p>
          <div className="mt-4 max-w-[560px] space-y-3 text-[15px] leading-[23px] text-muted md:mt-5 md:text-[16px] md:leading-[26px] lg:max-w-[380px]">
            <p>{t("intro")}</p>
            <p>{t("open")}</p>
          </div>
        </div>

        <ul className="mt-9 lg:col-span-2 lg:mt-[42px]">
          {themes.map((key) => (
            <li
              key={key}
              className="border-t border-border pt-4 pb-5 last:pb-0 lg:grid lg:grid-cols-2 lg:pt-5 lg:pb-6"
            >
              <h3 className="max-w-[370px] text-[17px] leading-6 font-medium tracking-[-0.01em] text-ink lg:pr-9 lg:text-[18px] lg:leading-[26px]">
                {t(`themes.${key}.name`)}
              </h3>
              <p className="mt-1.5 max-w-[560px] text-[15px] leading-6 text-muted lg:mt-px lg:max-w-none lg:pr-9">
                {t(`themes.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
