// Section divider. On desktop the reference draws rules 8px wider than the
// text column on each side (48–1392 at 1440); on smaller screens they match
// the column.
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto w-full max-w-[1440px] px-[22px] md:px-10 lg:px-12 ${className}`}
    >
      <div className="h-px bg-border" />
    </div>
  );
}
