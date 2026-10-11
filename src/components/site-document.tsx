import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import type { AppLocale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLink } from "@/components/ui/skip-link";
import { interGreek } from "@/config/fonts";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

// The message namespaces used by client components: the language switcher,
// the theme toggle and the project gallery.
const clientNamespaces = ["language", "theme", "gallery"] as const;

function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]) {
  return Object.fromEntries(keys.map((key) => [key, object[key]])) as Pick<T, K>;
}

// The document every page shares: the locale layout renders it around the
// routes, and the global 404 around the not-found message.
export async function SiteDocument({
  locale,
  children,
}: {
  locale: AppLocale;
  children: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const messages = await getMessages({ locale });
  preload(interGreek, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html
      lang={locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      {/* The footer's "Back to top" link targets the body. On a page shorter
          than the window (the résumé, a 404) the footer still ends at the
          bottom edge. */}
      <body id="top" className="flex min-h-svh flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Only what client components translate goes to the browser; the
              rest of the text is rendered on the server. */}
          <NextIntlClientProvider messages={pick(messages, clientNamespaces)}>
            <SkipLink label={t("skipToContent")} />
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
