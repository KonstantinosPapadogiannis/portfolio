// Abstract topology from the hero of the reference: an outer ring of eight
// nodes, four inner relay nodes, two hexagonal services and a layered store
// at the centre. Decorative only; it does not depict the thesis system.
// Drawn on a 300-unit grid centred on the origin.

const outerRadius = 142.5;
const cardinal = [
  [0, -outerRadius],
  [outerRadius, 0],
  [0, outerRadius],
  [-outerRadius, 0],
] as const;
const diagonal = [
  [-100.5, -100.5],
  [100.5, -100.5],
  [100.5, 100.5],
  [-100.5, 100.5],
] as const;
const relay = [
  [-49, -49],
  [49, -49],
  [49, 49],
  [-49, 49],
] as const;

function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

export function SystemsMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-150 -150 300 300"
      // Strokes keep their width when the motif is drawn smaller on phones.
      className={`[&_*]:[vector-effect:non-scaling-stroke] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeWidth="1">
        <circle r={outerRadius} className="stroke-steel/25" />
        <circle r="103" className="stroke-steel/20" strokeDasharray="2 6" />

        {/* Inner ring through the relay nodes and the two services. */}
        <path
          d="M-75 0 L-49 -49 L-15.6 -61.7 M15.6 -61.7 L49 -49 L75 0 L49 49 L15.6 61.7 M-15.6 61.7 L-49 49 L-75 0"
          className="stroke-steel/25"
        />

        {/* Spokes. */}
        <path d="M0 -142.5 V-88.7 M0 88.7 V142.5" className="stroke-steel/30" />
        <path
          d="M-142.5 0 H-75 M75 0 H142.5 M-100.5 -100.5 L-49 -49 M100.5 -100.5 L49 -49 M100.5 100.5 L49 49 M-100.5 100.5 L-49 49"
          className="stroke-steel/55"
        />
      </g>

      <g fill="none" strokeWidth="1.5" strokeLinejoin="round" className="stroke-diagram">
        <polygon points={hexagon(0, -70.7, 18)} />
        <polygon points={hexagon(0, 70.7, 18)} />

        {/* Layered store: top face and three slabs. */}
        <path d="M0 -45 L40.5 -22 L0 1 L-40.5 -22 Z" />
        <path d="M-40.5 -22 V25 L0 48 L40.5 25 V-22" />
        <path d="M-40.5 1.5 L0 24.5 L40.5 1.5 M-40.5 14 L0 37 L40.5 14" />
      </g>

      <g className="fill-diagram">
        {cardinal.map(([x, y]) => (
          <circle key={`c${x},${y}`} cx={x} cy={y} r="4.6" />
        ))}
        {diagonal.map(([x, y]) => (
          <circle key={`d${x},${y}`} cx={x} cy={y} r="3.6" />
        ))}
      </g>
      <g className="fill-steel">
        {relay.map(([x, y]) => (
          <circle key={`r${x},${y}`} cx={x} cy={y} r="3.6" />
        ))}
      </g>
    </svg>
  );
}
