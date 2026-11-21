import { useMemo } from 'react'

// Splits the voiceover into short caption chunks: at most 3 words, and a new chunk after
// any word that ends a phrase (comma, full stop, question mark). Shorts use this rhythm.
export function chunkWords(words) {
  const chunks = []
  let cur = []
  for (const w of words) {
    cur.push(w)
    if (cur.length === 3 || /[.,?!]$/.test(w.w)) { chunks.push(cur); cur = [] }
  }
  if (cur.length) chunks.push(cur)
  return chunks
}

export default function Captions({ words, time }) {
  const chunks = useMemo(() => chunkWords(words), [words])
  // The chunk on screen is the last one that has started. It stays until the next one starts.
  let current = null
  for (const c of chunks) { if (c[0].start <= time) current = c; else break }
  if (!current || time > current[current.length - 1].end + 1.2) return null
  return (
    <div className="captions" aria-hidden="true">
      {current.map((w, i) => (
        <span key={i} className={w.start <= time && time < w.end + 0.08 ? 'now' : ''}>
          {w.w.replace(/^-/, '')}{' '}
        </span>
      ))}
    </div>
  )
}
