"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import { ContrastIcon } from "@/components/icons";

const subscribe = () => () => {};

// One icon for both themes, so the server and the first client render agree
// without waiting for the stored theme. The button is a toggle for the dark
// theme: its pressed state is set once hydrated, when the stored theme is
// known, and left out of the server render for the same reason.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <IconButton
      aria-label={t("toggle")}
      aria-pressed={hydrated ? resolvedTheme === "dark" : undefined}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <ContrastIcon size={18} />
    </IconButton>
  );
}
