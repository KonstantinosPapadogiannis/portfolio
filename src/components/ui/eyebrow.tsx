import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type EyebrowProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

// Small tracked label above a section or a block. IBM Plex Mono in English,
// Inter in Greek (font-label follows the lang attribute). Greek is written in
// sentence case in the dictionaries; uppercase here drops the tonos.
export const eyebrowClass =
  "font-label text-[11px] leading-4 font-normal uppercase tracking-[0.08em]";

export function Eyebrow<T extends ElementType = "p">({
  as,
  children,
  className = "",
  ...rest
}: EyebrowProps<T>) {
  const Tag = as ?? "p";
  return (
    <Tag className={`${eyebrowClass} text-muted ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
