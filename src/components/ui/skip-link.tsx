type SkipLinkProps = {
  label: string;
};

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-[3px] focus-visible:bg-navy focus-visible:px-4 focus-visible:py-2 focus-visible:text-on-navy"
    >
      {label}
    </a>
  );
}
