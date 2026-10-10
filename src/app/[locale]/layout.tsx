import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPathname } from "@/i18n/navigation";
import { openGraphLocales, routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLink } from "@/components/ui/skip-link";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "home" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const name = tSite("name");
  const home = getPathname({ href: "/", locale });

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: name,
    title: {
      default: `${name} — ${t("title")}`,
      template: `%s — ${name}`,
    },
    description: t("description"),
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: home,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((target) => [
            target,
            getPathname({ href: "/", locale: target }),
          ]),
        ),
        "x-default": getPathname({ href: "/", locale: routing.defaultLocale }),
      },
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      url: home,
      siteName: name,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      {/* The footer's "Back to top" link targets the body. */}
      <body id="top">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <SkipLink label={t("skipToContent")} />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
