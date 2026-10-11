import type { ComponentPropsWithoutRef, ReactNode } from "react";
import NextLink from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";

type Arrow = "right" | "left" | "up-right" | "none";

const arrowMotion: Record<Exclude<Arrow, "none">, string> = {
  right: "group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5",
  // The right arrow turned round; rotate and translate compose.
  left: "rotate-180 group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5",
  "up-right":
    "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5",
};

// A label with an optional arrow. On hover, and on keyboard focus beside the
// focus ring, the underline fades in and the arrow moves 2px in its
// direction; nothing else animates.
export const textLinkClass =
  "group inline-flex items-center gap-1.5 underline decoration-transparent decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-150 hover:decoration-current focus-visible:decoration-current";

export function LinkArrow({ arrow, size = 14 }: { arrow: Arrow; size?: number }) {
  if (arrow === "none") return null;
  const Icon = arrow === "up-right" ? ArrowUpRightIcon : ArrowRightIcon;
  return (
    <Icon
      size={size}
      className={`shrink-0 transition-transform duration-150 ${arrowMotion[arrow]}`}
    />
  );
}

type TextLinkProps = {
  href: string;
  arrow?: Arrow;
  children: ReactNode;
  className?: string;
  // Same-site page navigations go through the Next.js router.
  internal?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

export function TextLink({
  href,
  arrow = "right",
  children,
  className = "",
  internal = false,
  ...rest
}: TextLinkProps) {
  const classes = `${textLinkClass} ${className}`;
  const content =
    arrow === "left" ? (
      <>
        <LinkArrow arrow={arrow} />
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        <LinkArrow arrow={arrow} />
      </>
    );

  if (internal) {
    return (
      <NextLink href={href} prefetch={false} className={classes} {...rest}>
        {content}
      </NextLink>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  );
}
