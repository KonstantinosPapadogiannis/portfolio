import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { primaryNav } from "@/config/navigation";
import { NavLink } from "@/components/nav-link";
import { MobileNav } from "@/components/mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const items = primaryNav.map((item) => ({ ...item, label: t(item.key) }));

  return (
    <header className="relative">
      {/* Same frame as the section rules: the border runs 8px past the text
          column on desktop. */}
      <div className="mx-auto max-w-[1440px] px-[22px] md:px-10 lg:px-12">
        <div className="flex h-[62px] items-center justify-between border-b border-border md:h-20 lg:h-24 lg:px-2 lg:pt-1">
          {/* On phones the name grows with the screen and keeps about 22px
              clear of the 160px of controls beside it, from 15px up to 24px.
              The globe gives way below 360px. */}
          <Link
            href="/"
            className="-ml-px font-brand text-[length:clamp(15px,calc(12.37vw_-_27.96px),24px)] leading-none font-bold tracking-tight whitespace-nowrap text-ink lg:text-[30px]"
            aria-label={t("home")}
          >
            K. Papadogiannis
          </Link>

          <div className="flex items-center">
            {/* From 1024px. Below that the name and the Greek labels do not
                fit on one line, and the menu button takes over. */}
            <nav aria-label={t("primary")} className="hidden lg:block">
              <ul className="flex items-center gap-7 text-[15px] text-ink">
                {items.map((item) => (
                  <li key={item.key}>
                    <NavLink
                      item={item}
                      className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[color,text-decoration-color] duration-150 hover:text-steel hover:decoration-current"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1 md:gap-6 lg:ml-14">
              <LanguageSwitcher />
              {/* The 44px targets reach into the gutter so the last icon lines
                  up with the right edge of the text column. */}
              <div className="-mr-3 flex items-center">
                <ThemeToggle />
                {/* Remounted per locale so a language switch closes the menu. */}
                <MobileNav
                  key={locale}
                  items={items}
                  navLabel={t("primary")}
                  menuLabel={t("menu")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
