// The slash between the parts of a label, as in "About / Background". The
// glyph comes from the separator-slash rule in globals.css, which gives it a
// comma as its alternative text, so the label is read "About, Background"
// and copied as "About Background". The space after the glyph is real text,
// set in Plex Mono so that it has the same width in both languages. In an
// 11px label tracked 0.08em it is 7.5px wide, so the default padding brings
// both sides of the glyph to 8px. Its line height is kept to the font size,
// so the mono metrics never make a Greek label's line taller.
export function Separator({ className = "pl-2 pr-[0.5px]" }: { className?: string }) {
  return (
    <span className={`separator-slash ${className}`}>
      <span className="font-mono leading-none">{" "}</span>
    </span>
  );
}
