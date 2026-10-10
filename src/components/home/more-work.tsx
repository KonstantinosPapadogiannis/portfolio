import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/icons";
import { SectionLabel } from "@/components/home/section-label";
import { nb } from "@/lib/rich-text";
import { additionalWork, moreWork, technologies, type ProjectEntry } from "@/config/work";

const br = () => (
  <>
    {" "}
    <br className="max-lg:hidden" />
  </>
);

// Three columns on desktop, as in the reference: text starts at each column
// edge and a hairline runs 36px to the left of the second and third.
const columns = "lg:grid lg:grid-cols-3";
const column =
  "relative lg:pr-9 lg:not-first:before:absolute lg:not-first:before:inset-y-0 lg:not-first:before:-left-9 lg:not-first:before:w-px lg:not-first:before:bg-border";

function ProjectMeta({
  project,
  name,
  kind,
}: {
  project: ProjectEntry;
  name: string;
  kind: string;
}) {
  return (
    <>
      {/* "02 / ERGOHUB / 2025" on phones, three aligned columns on desktop. */}
      <p className="flex items-baseline font-label text-[11px] leading-4 uppercase">
        <span className="font-mono text-[11px] text-ink lg:w-9 lg:text-[13px]">
          {project.number}
        </span>{" "}
        <span aria-hidden="true" className="px-2 text-muted lg:hidden">
          /
        </span>
        <span className="font-medium tracking-[0.04em] text-ink lg:min-w-[108px] lg:pr-4">
          {name}
        </span>{" "}
        <span aria-hidden="true" className="px-2 text-muted lg:hidden">
          /
        </span>
        <span className="text-muted">{project.year}</span>
      </p>
      <p className="mt-2 font-label text-[11px] leading-4 text-muted lg:mt-[15px]">{kind}</p>
    </>
  );
}

export function MoreWork() {
  const t = useTranslations("projects");

  return (
    <section aria-labelledby="more-work-heading">
      <Container className="pt-[51px] pb-14 lg:pb-16">
        <SectionLabel id="more-work-heading" parts={[t("moreLabel")]} />

        <ul className={`mt-[30px] lg:mt-[42px] ${columns}`}>
          {moreWork.map((project) => (
            <li
              key={project.key}
              className={`${column} border-t border-border py-7 first:border-t-0 first:pt-0 lg:border-t-0 lg:py-0`}
            >
              <article aria-labelledby={`project-${project.key}`}>
                <ProjectMeta
                  project={project}
                  name={t(`${project.key}.name`)}
                  kind={t(`${project.key}.kind`)}
                />
                <h3
                  id={`project-${project.key}`}
                  className="mt-5 text-[22px] leading-[27px] font-semibold tracking-[-0.015em] text-ink lg:mt-[35px] lg:text-[26px] lg:leading-[32px]"
                >
                  {t.rich(`${project.key}.title`, { br })}
                </h3>
                <p className="mt-3 max-w-[370px] text-[14px] leading-[22px] text-muted lg:mt-[18px]">
                  {t.rich(`${project.key}.body`, { nb })}
                </p>
                {project.key === "cuda" && (
                  <p className="mt-3 text-[13px] leading-5">
                    {/* Screen readers get the result as one sentence; the
                        figures and the arrow are its visual form. Only the
                        figures are in Plex Mono, which has no Greek. */}
                    <span className="sr-only">
                      {t("cuda.summary", {
                        before: t("cuda.before"),
                        after: t("cuda.after"),
                        speedup: t("cuda.speedup"),
                      })}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex flex-wrap items-center gap-x-3 gap-y-1"
                    >
                      <span className="flex items-center gap-1.5 text-ink">
                        <span className="font-mono">{t("cuda.before")}</span>
                        <ArrowRightIcon size={12} className="text-muted" />
                        <span className="font-mono">{t("cuda.after")}</span>
                      </span>
                      <span className="text-muted">{t("cuda.speedup")}</span>
                    </span>
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>

        {/* Secondary projects: same grid, smaller titles, no column rules. */}
        <div className="mt-12 border-t border-border pt-8 lg:mt-16">
          <Eyebrow as="h3">{t("additionalLabel")}</Eyebrow>
          <ul className={`mt-6 grid gap-y-8 md:grid-cols-2 md:gap-x-10 lg:mt-8 lg:gap-x-0 ${columns}`}>
            {additionalWork.map((project) => (
              <li key={project.key} className="lg:pr-9">
                <article aria-labelledby={`project-${project.key}`}>
                  <ProjectMeta
                    project={project}
                    name={t(`${project.key}.name`)}
                    kind={t(`${project.key}.kind`)}
                  />
                  <h4
                    id={`project-${project.key}`}
                    className="mt-4 max-w-[370px] text-[18px] leading-6 font-medium tracking-[-0.01em] text-ink lg:mt-5 lg:text-[19px] lg:leading-[26px]"
                  >
                    {t(`${project.key}.title`)}
                  </h4>
                  <p className="mt-2.5 max-w-[370px] text-[14px] leading-[22px] text-muted">
                    {t.rich(`${project.key}.body`, { nb })}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function Technologies() {
  const t = useTranslations("technologies");

  return (
    <section aria-labelledby="technologies-heading">
      <Container className="pt-[51px] pb-16 lg:pb-20">
        {/* Tools actually used; the fields explored are under Interests. */}
        <SectionLabel id="technologies-heading" parts={[t("label"), t("labelDetail")]} />
        <div className={`mt-[30px] grid gap-y-7 md:grid-cols-2 md:gap-x-10 lg:mt-[42px] lg:gap-x-0 lg:gap-y-10 ${columns}`}>
          {technologies.map((group) => (
            <div key={group.key} className="lg:pr-9">
              <h3 className="font-label text-[11px] leading-4 tracking-[0.08em] text-ink uppercase">
                {t(group.key)}
              </h3>
              {/* Lines break between items, never inside "Web Crypto API". */}
              <p className="mt-2.5 max-w-[370px] text-[15px] leading-6 text-muted">
                {group.items.map((item, index) => (
                  <Fragment key={item}>
                    {index > 0 && ", "}
                    <span className="whitespace-nowrap">{item}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
