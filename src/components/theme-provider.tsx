"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useLayoutEffect, type ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeAttributeGuard />
      {children}
    </NextThemesProvider>
  );
}

// A language switch replaces the [locale] root layout, and React clears every
// attribute on <html> while swapping it, data-theme included. next-themes
// restores the attribute in a passive effect, after the browser has already
// painted one frame in the light theme. Setting it in a layout effect runs
// before that paint.
//
// The router also keeps the other language's layout and brings it back with
// the theme its provider had when it was hidden; next-themes only listens for
// storage changes made in other tabs. The stored theme is the one chosen last,
// so it wins, and a stale provider is handed it.
//
// On an ordinary toggle this sets the value next-themes applies in the same
// task, before any style recalculation, so its transition suppression still
// covers the switch.
function ThemeAttributeGuard() {
  const { resolvedTheme, setTheme } = useTheme();

  useLayoutEffect(() => {
    let storedTheme: string | null = null;
    try {
      storedTheme = localStorage.getItem("theme");
    } catch {
      // Storage can be unavailable in restrictive browser modes.
    }

    const activeTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : resolvedTheme === "dark"
          ? "dark"
          : "light";
    const root = document.documentElement;

    if (resolvedTheme !== activeTheme) {
      setTheme(activeTheme);
    }

    root.setAttribute("data-theme", activeTheme);
    root.style.colorScheme = activeTheme;
  });

  return null;
}
