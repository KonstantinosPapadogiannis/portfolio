import type { ComponentType } from "react";
import { sectionIds } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { LinkArrow, textLinkClass } from "@/components/ui/text-link";
import { GitHubIcon, LinkedInIcon, OrcidIdIcon } from "@/components/icons";

// Underline for a label inside a larger link, so it runs under the words and
// not under the icon beside them.
const labelUnderline =
  "underline decoration-transparent decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-150 group-hover:decoration-current";

type ProfileLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

const profiles: ProfileLink[] = [
  { label: "GitHub", href: siteConfig.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: siteConfig.linkedin, Icon: LinkedInIcon },
  { label: `ORCID ${siteConfig.orcidId}`, href: siteConfig.orcid, Icon: OrcidIdIcon },
];

export function Footer() {
  return (
    // Focus outlines switch to a light ring on the navy band.
    <footer
      id={sectionIds.contact}
      className="bg-footer text-footer-text [--focus-ring:var(--footer-focus)]"
    >
      <Container className="py-4 lg:py-5">
        <ul
          aria-label="Professional profiles and contact"
          className="grid grid-cols-2 items-center gap-x-4 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[auto_auto_auto_minmax(0,auto)] lg:justify-between lg:gap-x-6"
        >
          {profiles.map(({ label, href, Icon }, index) => (
            <li
              key={href}
              className={index === 2 ? "col-span-2 flex min-w-0 md:col-span-1" : "flex"}
            >
              <a
                href={href}
                rel="me"
                className={`${textLinkClass} group inline-flex min-h-11 max-w-full min-w-0 items-center gap-2.5 text-[0.8125rem] leading-5 wrap-anywhere text-footer-ink min-[360px]:text-[0.875rem] md:text-[0.9375rem] lg:min-h-8`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex items-center gap-1">
                  <span className={labelUnderline}>{label}</span>
                  <LinkArrow arrow="up-right" size={13} />
                </span>
              </a>
            </li>
          ))}
          <li className="col-span-2 flex min-w-0 md:col-span-1 md:justify-self-end">
            <a
              href={`mailto:${siteConfig.email}`}
              className={`${textLinkClass} inline-flex min-h-11 max-w-full min-w-0 items-center text-[0.8125rem] leading-5 wrap-anywhere text-footer-ink min-[360px]:text-[0.875rem] md:text-[0.9375rem] lg:min-h-8`}
            >
              {siteConfig.email}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
