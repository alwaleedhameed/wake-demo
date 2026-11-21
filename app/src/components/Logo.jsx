// The team's Wake logo (hand-drawn WAKE with sleepy z's), served from public/wake-logo.svg.
// size is the old cap-height prop: the drawing is about twice as wide as it is tall.
export default function Logo({ size = 28 }) {
  const h = Math.round(size * 1.5)
  return (
    <img className="logo" src={`${import.meta.env.BASE_URL}wake-logo.svg`} alt="Wake" height={h} width={Math.round(h * 560 / 290)} />
  )
}
