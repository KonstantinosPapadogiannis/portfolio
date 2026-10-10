import { Fragment, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Separator } from "@/components/ui/separator";

// A section heading set as a small label. Parts are joined by a slash, as in
// "About / Background", which is read as a comma.
export function SectionLabel({
  id,
  parts,
  className = "",
}: {
  id: string;
  parts: ReactNode[];
  className?: string;
}) {
  return (
    <Eyebrow as="h2" id={id} className={className}>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator />}
          {part}
        </Fragment>
      ))}
    </Eyebrow>
  );
}
