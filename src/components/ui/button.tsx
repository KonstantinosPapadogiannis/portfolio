import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "text";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-1.5 text-[15px] font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "h-11 rounded-[3px] px-6 bg-navy text-on-navy hover:bg-navy-hover active:bg-navy-active",
  secondary:
    "h-11 rounded-[3px] px-6 border border-border text-ink bg-transparent hover:bg-steel/10 active:bg-steel/15",
  text: "text-ink hover:text-steel underline-offset-4 hover:underline",
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as Omit<
      ButtonAsAnchor,
      keyof ButtonBaseProps
    >;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
