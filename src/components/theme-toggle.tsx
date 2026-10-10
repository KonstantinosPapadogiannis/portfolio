"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import { ContrastIcon } from "@/components/icons";

// One icon for both themes, so the server and the first client render agree
// without waiting for the stored theme.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <IconButton
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <ContrastIcon size={18} />
    </IconButton>
  );
}
