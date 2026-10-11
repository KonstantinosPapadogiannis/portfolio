import type { ComponentType } from "react";
import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { primaryNav, sectionIds } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { LinkArrow, textLinkClass } from "@/components/ui/text-link";
import { NavLink } from "@/components/nav-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ArrowUpIcon, GitHubIcon, LinkedInIcon, OrcidIdIcon } from "@/components/icons";
import { br } from "@/lib/rich-text";

// Prerendered pages are reused for a while, so the year is cached for a day
// rather than read from the clock on every request.
async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const labelClass = "font-label text-[0.625rem] leading-4 tracking-[0.08em] text-footer-muted uppercase";
const linkClass = `${textLinkClass} text-footer-ink`;

// Below 1024px every link is a 44px touch target; the text keeps its size and
// sits in the middle. From 1024px links take the height of their line.
const targetClass = "min-h-11 lg:min-h-0";

// A label and its links. On phones the label sits above them; from 768px it
// takes a column of its own, and all three labels share that column. The
// column is narrower from 1024 to 1279px, where the four Greek links only
// just fit beside it.
const rowClass =
  "md:grid md:grid-cols-[7rem_minmax(0,1fr)] md:items-baseline lg:max-xl:grid-cols-[6rem_minmax(0,1fr)]";

// Underline for a label inside a larger link, so it runs under the words and
// not under the icon beside them.
const labelUnderline =
  "underline decoration-transparent decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-150 group-hover:decoration-current";

type ProfileLink = {
  key: "github" | "linkedin" | "orcid";
  href: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

// rel="me": profiles of the same person. The address under Contact is the
// only mail link.
const profiles: ProfileLink[] = [
  { key: "github", href: siteConfig.github, Icon: GitHubIcon },
  { key: "linkedin", href: siteConfig.linkedin, Icon: LinkedInIcon },
  { key: "orcid", href: siteConfig.orcid, Icon: OrcidIdIcon },
];

// Two parts above one rule. The name and its line on the left; on the right,
// from 1024px, a column of labelled rows starting where the right column of
// the work section starts. Below the rule, the colophon and the controls.
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = await getYear();

  return (
    // Focus outlines switch to a light ring on the navy band.
    <footer className="bg-footer text-footer-text [--focus-ring:var(--footer-focus)]">
      <Container className="pt-10 pb-4 md:pt-12 md:pb-5 lg:pt-14 lg:pb-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,634fr)_minmax(0,638fr)] lg:items-baseline lg:gap-x-14">
          <div>
            {/* One word per line below 480px, where the name no longer fits
                on one line at this size. With a larger default text size on
                a phone, the size stops at 11vw, where the longer word still
                fits the column. */}
            <p className="font-brand text-[length:min(1.75rem,11vw)] leading-[1.05] font-bold tracking-tight text-footer-ink max-[30rem]:w-min md:text-[1.875rem]">
              {siteConfig.name}
            </p>
            <p className="mt-4 text-[1rem] leading-6 text-balance text-footer-text lg:text-[1.125rem] lg:leading-[1.6875rem]">
              {t.rich("tagline", { br })}
            </p>
            <p className="mt-3 font-label text-[0.6875rem] leading-4 text-footer-muted">
              {t("location")}
            </p>
          </div>

          <div className="mt-7 grid gap-y-3 md:mt-6 md:gap-y-0 lg:mt-0 lg:gap-y-3">
            <nav aria-labelledby="footer-navigate" className={rowClass}>
              <h2 id="footer-navigate" className={labelClass}>
                {t("navigate")}
              </h2>
              <ul className="flex flex-wrap gap-x-5 text-[0.9375rem] leading-[1.625rem]">
                {primaryNav.map((item) => (
                  <li key={item.key}>
                    <NavLink item={item} className={`${linkClass} ${targetClass}`}>
                      {tNav(item.key)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={rowClass}>
              {/* Centred on the row: the links start with an icon, which
                  has no baseline to line up with. */}
              <h2 id="footer-elsewhere" className={`${labelClass} md:self-center`}>
                {t("elsewhere")}
              </h2>
              {/* The same gap as the links above, so the three profiles fit
                  one line from 390px phones up, and beside the narrower label
                  column at 1024px. */}
              <ul
                aria-labelledby="footer-elsewhere"
                className="flex flex-wrap gap-x-5 text-[0.9375rem] leading-[1.625rem]"
              >
                {profiles.map(({ key, href, Icon }) => (
                  <li key={key} className="flex">
                    {/* ORCID is also named with the iD itself, which the
                        visible label leaves out. */}
                    <a
                      href={href}
                      rel="me"
                      aria-label={
                        key === "orcid" ? t("orcidLabel", { id: siteConfig.orcidId }) : undefined
                      }
                      className={`group inline-flex items-center gap-2.5 text-footer-ink ${targetClass}`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="flex items-center gap-1">
                        <span className={labelUnderline}>{t(key)}</span>
                        <LinkArrow arrow="up-right" size={13} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <section id={sectionIds.contact} aria-labelledby="contact-heading" className={rowClass}>
              <h2 id="contact-heading" className={labelClass}>
                {t("contact")}
              </h2>
              <div>
                {/* 13px on the narrowest phones, where the address only just
                    fits; it breaks rather than overflow if it ever does not. */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className={`${linkClass} ${targetClass} text-[0.8125rem] leading-[1.625rem] wrap-anywhere min-[360px]:text-[0.875rem] md:text-[0.9375rem]`}
                >
                  {siteConfig.email}
                </a>
                <p className="text-[0.875rem] leading-[1.375rem] text-balance text-footer-soft">
                  {t("availability")}
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-y-1 border-t border-footer-rule pt-4 font-label text-[0.625rem] leading-4 text-footer-muted md:mt-10 md:flex-row md:items-center md:justify-between md:gap-x-8 md:pt-3 lg:mt-12 lg:pt-4">
          <p>© {year}</p>
          <div className="flex items-center justify-between gap-x-8 md:justify-end">
            <LanguageSwitcher tone="footer" showIcon={false} />
            <a
              href="#top"
              className={`${textLinkClass} min-h-11 font-sans text-[0.6875rem] text-footer-ink lg:min-h-6`}
            >
              <span>{t("backToTop")}</span>
              <ArrowUpIcon
                size={11}
                className="transition-transform duration-150 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
