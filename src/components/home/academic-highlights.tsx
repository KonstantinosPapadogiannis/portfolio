import { useFormatter, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/home/section-label";
import { academicHighlights } from "@/config/education";

// Two columns of eight courses: the first two groups, then the other two.
const highlightColumns = [academicHighlights.slice(0, 2), academicHighlights.slice(2)];

// Courses grouped by field, not a transcript: the course leads, its grade
// follows in small mono. A short note in the first column of the grid, the
// groups in two columns across the other two, so the record reads as a
// table rather than as another story. The average and the thesis grade stay
// with the degree in About. The label, the note and each group come in as
// blocks as they scroll into view; the courses inside a group do not.
export function AcademicHighlights() {
  const t = useTranslations("academic");
  const format = useFormatter();

  return (
    <section id="academic" aria-labelledby="academic-heading">
      <Reveal>
        <Container className="pt-[51px] pb-14 lg:grid lg:grid-cols-3 lg:pb-16">
          <SectionLabel
            id="academic-heading"
            parts={[t("label")]}
            className="lg:col-span-3"
            data-reveal
          />

          <p
            data-reveal
            className="mt-[30px] max-w-[440px] text-[0.9375rem] leading-[1.4375rem] text-muted md:text-[1rem] md:leading-[1.625rem] lg:mt-[42px] lg:max-w-[300px] lg:pr-14"
          >
            {t("lead")}
          </p>

          <div className="mt-2 md:grid md:grid-cols-2 md:gap-x-10 lg:col-span-2 lg:mt-[42px] lg:gap-x-0">
            {highlightColumns.map((groups, column) => (
              <div key={column} className="lg:pr-9">
                {groups.map((group) => (
                  <div key={group.key} data-reveal className="mt-6 lg:first:mt-0">
                    <h3 className="text-[0.9375rem] leading-[1.375rem] font-medium text-ink">
                      {t(`groups.${group.key}`)}
                    </h3>
                    <ul className="mt-2">
                      {group.courses.map((course) => (
                        <li
                          key={course.key}
                          className="flex items-baseline justify-between gap-4 border-t border-border py-[5px] text-[0.875rem] leading-[1.375rem] text-ink"
                        >
                          {/* A word longer than the line, with much larger
                              text, breaks rather than pushing the mark out. */}
                          <span className="min-w-0 wrap-break-word">{t(`courses.${course.key}`)}</span>
                          {/* The mark takes two digits' width, so the slashes
                              line up down the column. */}
                          <span className="shrink-0 font-mono text-[0.75rem] text-muted">
                            <span className="inline-block min-w-[2ch] text-end">
                              {format.number(course.grade)}
                            </span>
                            {" / 10"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
