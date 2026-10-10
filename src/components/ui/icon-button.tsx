import type { ComponentPropsWithRef, ReactNode } from "react";

type IconButtonProps = {
  children: ReactNode;
  "aria-label": string;
  className?: string;
} & Omit<ComponentPropsWithRef<"button">, "children" | "aria-label">;

export function IconButton({
  children,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-transparent text-ink transition-colors duration-150 hover:border-border hover:bg-steel/10 active:bg-steel/15 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
