import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

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
