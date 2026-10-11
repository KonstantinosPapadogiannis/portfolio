import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/home/section-label";

const themes = ["systems", "protocols", "security", "ai", "markets"] as const;

// Fields followed and studied, as distinct from the tools listed under
// Technologies. Kept quieter than About: a short lead in the first column
// and the themes as ruled rows across the other two, the name aligned to
// the second column and the description to the third, as in the project
// grid below. Not a sequence, so not numbered. The label, the lead and the
// list of themes each come in as one block as they scroll into view.
export function Interests() {
  const t = useTranslations("interests");

  return (
    <section aria-labelledby="interests-heading">
      <Reveal>
        <Container className="pt-[51px] pb-14 lg:grid lg:grid-cols-3 lg:pb-16">
          <SectionLabel
            id="interests-heading"
            parts={[t("label")]}
            className="lg:col-span-3"
            data-reveal
          />

          <div data-reveal className="mt-[30px] lg:mt-[42px] lg:pr-14">
            <p className="max-w-[440px] text-[1.5rem] leading-[1.875rem] font-semibold tracking-[-0.015em] text-ink md:text-[1.75rem] md:leading-[2.125rem]">
              {t("lead")}
            </p>
            <div className="mt-4 max-w-[560px] space-y-3 text-[0.9375rem] leading-[1.4375rem] text-muted md:mt-5 md:text-[1rem] md:leading-[1.625rem] lg:max-w-[380px]">
              <p>{t("intro")}</p>
              <p>{t("open")}</p>
            </div>
          </div>

          <ul data-reveal className="mt-9 lg:col-span-2 lg:mt-[42px]">
            {themes.map((key) => (
              <li
                key={key}
                className="border-t border-border pt-4 pb-5 last:pb-0 lg:grid lg:grid-cols-2 lg:pt-5 lg:pb-6"
              >
                <h3 className="max-w-[370px] text-[1.0625rem] leading-6 font-medium tracking-[-0.01em] text-ink lg:pr-9 lg:text-[1.125rem] lg:leading-[1.625rem]">
                  {t(`themes.${key}.name`)}
                </h3>
                <p className="mt-1.5 max-w-[560px] text-[0.9375rem] leading-6 text-muted lg:mt-px lg:max-w-none lg:pr-9">
                  {t(`themes.${key}.body`)}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Reveal>
    </section>
  );
}
