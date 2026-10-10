import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

// The 1440 reference: 56px gutters around a 1328px content column on
// desktop, 22px on a 390px phone. Wider screens keep the 1440 frame centred.
export function Container<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: ContainerProps<T>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={`mx-auto w-full max-w-[1440px] px-[22px] md:px-10 lg:px-14 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
