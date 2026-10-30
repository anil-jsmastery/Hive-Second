// The glow filter the honeycomb cells use. Rendered once, in the root layout.
export function GlowDefs() {
  return (
    <svg className="defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
