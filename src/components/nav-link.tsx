import type { ComponentPropsWithoutRef } from "react";
import { useLocale } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import type { NavItem } from "@/config/navigation";

type NavLinkProps = { item: NavItem } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href"
>;

export function NavLink({ item, ...rest }: NavLinkProps) {
  const locale = useLocale();

  if ("section" in item) {
    // A plain anchor on purpose. On the homepage the browser performs a
    // native fragment navigation: it scrolls the section into view and moves
    // the keyboard focus starting point there. The Next.js router only
    // scrolls, leaving keyboard users at the top of the page.
    const href = `${getPathname({ href: "/", locale })}#${item.section}`;
    return <a href={href} {...rest} />;
  }

  return <Link href={item.pathname} {...rest} />;
}
