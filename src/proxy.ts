import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocalePrefix) {
    return handleI18nRouting(request);
  }

  // next-intl owns prefixed-locale canonicalization. The framework rewrite in
  // next.config.ts exclusively maps canonical, unprefixed English addresses
  // to the internal /en route. Avoiding a Proxy rewrite here also avoids the
  // Next.js bind-host regression that can leak it as a redirect loop.
  const headers = new Headers(request.headers);
  headers.set("x-next-intl-locale", routing.defaultLocale);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Keep the locale available to the global 404 for unknown Greek URLs
    // that contain a dot. The general matcher deliberately skips dotted
    // paths so public files bypass the proxy, but there are no localized
    // public files under /el.
    "/el/:path*",
  ],
};
