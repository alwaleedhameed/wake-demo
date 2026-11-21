// Placeholder Wake logo: a sun rising over a horizon line, next to the wordmark.
// Swap this component's SVG for the team's real logo when it is final.
export default function Logo({ size = 28, word = true }) {
  return (
    <span className="logo" style={{ fontSize: size }}>
      <svg width={size * 1.2} height={size} viewBox="0 0 48 40" aria-hidden="true">
        <path d="M8 30a16 16 0 0 1 32 0z" fill="var(--sun)" />
        <rect x="2" y="32" width="44" height="4" rx="2" fill="var(--mist)" />
      </svg>
      {word && <span style={{ lineHeight: 0.8 }}>wake</span>}
    </span>
  )
}
