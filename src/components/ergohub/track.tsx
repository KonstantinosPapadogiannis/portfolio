import type { ReactNode } from "react";

// Steps in order on a line, each marked by a small steel square. In a wide
// container (52rem and up) the steps sit side by side and the line runs
// across their tops; in a narrow one they stack and the line runs down
// their left edge. The line leaves each step for the next, so the last step
// has none. An ordered list, so the order is read out as well as drawn.
//
// Class names are written out in full so that Tailwind finds them.
const columnClass = {
  4: "@min-[52rem]:grid-cols-4",
  5: "@min-[52rem]:grid-cols-5",
} as const;

export type TrackStep = {
  key: string;
  name: ReactNode;
  body: ReactNode;
};

export function Track({
  steps,
  label,
  className = "",
}: {
  steps: readonly TrackStep[];
  label?: string;
  className?: string;
}) {
  return (
    <ol
      aria-label={label}
      className={`grid ${columnClass[steps.length as 4 | 5]} ${className}`}
    >
      {steps.map(({ key, name, body }) => (
        <li
          key={key}
          className="relative pb-5 pl-6 before:absolute before:top-[7px] before:-bottom-[7px] before:left-[3px] before:border-l before:border-steel/55 last:pb-0 last:before:hidden @min-[52rem]:pt-5 @min-[52rem]:pr-5 @min-[52rem]:pb-0 @min-[52rem]:pl-0 @min-[52rem]:before:top-[3px] @min-[52rem]:before:right-0 @min-[52rem]:before:bottom-auto @min-[52rem]:before:left-0 @min-[52rem]:before:border-t @min-[52rem]:before:border-l-0"
        >
          <span
            aria-hidden="true"
            className="absolute top-[7px] left-0 size-[7px] bg-steel @min-[52rem]:top-0"
          />
          <p className="text-[14px] leading-5 font-medium text-ink">{name}</p>
          <p className="mt-1 text-[13px] leading-5 text-pretty text-muted">{body}</p>
        </li>
      ))}
    </ol>
  );
}
