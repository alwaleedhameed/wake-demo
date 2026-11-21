import { BookOpen, Headphones, Play, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
import { creators } from '../data/videos'

// Bottom sheet wrapper: tap the dark area to close.
export function Sheet({ onClose, children }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="grab" />
        {children}
      </div>
    </div>
  )
}

// "View as": the same lesson as a video, as text to read, or as audio only, plus captions.
// Every format is prepared when the video is uploaded, so switching is instant and works offline.
export function FormatSheet({ format, setFormat, onClose }) {
  const set = (patch) => setFormat({ ...format, ...patch })
  const modes = [
    { id: 'video', label: 'Watch', icon: Play },
    { id: 'read', label: 'Read', icon: BookOpen },
    { id: 'listen', label: 'Listen', icon: Headphones },
  ]
  return (
    <Sheet onClose={onClose}>
      <h3>View this lesson as</h3>
      <p className="sub">Same content, your way. Prepared for every video when it is published.</p>
      <div className="seg">
        {modes.map(({ id, label, icon: Icon }) => (
          <button key={id} className={format.mode === id ? 'on' : ''} onClick={() => set({ mode: id })}>
            <Icon size={22} />{label}
          </button>
        ))}
      </div>
      <div className="row">Captions<button className={`switch ${format.captions ? 'on' : ''}`} aria-pressed={format.captions} aria-label="Captions" onClick={() => set({ captions: !format.captions })} /></div>
      <div className="row">Sound<button className={`switch ${format.sound ? 'on' : ''}`} aria-pressed={format.sound} aria-label="Sound" onClick={() => set({ sound: !format.sound })} /></div>
      <button className="btn" style={{ marginTop: 10 }} onClick={onClose}>Done</button>
    </Sheet>
  )
}

// Where this came from, and why it is in your feed.
export function SourceSheet({ video, onClose }) {
  const c = creators[video.creator]
  const { source } = video
  const link = source.doi
    ? `https://doi.org/${source.doi}`
    : `https://scholar.google.com/scholar?q=${encodeURIComponent(source.citation)}`
  return (
    <Sheet onClose={onClose}>
      <h3>The source</h3>
      <p className="sub">Every Wake video is built on work you can check yourself.</p>
      <div className="kind"><ShieldCheck size={16} />{source.kind}</div>
      <p className="citation">{source.citation}</p>
      <p className="media-credit">{source.media}</p>
      <a className="btn" href={link} target="_blank" rel="noreferrer"><ExternalLink size={18} />Open the original</a>
      <div className="row" style={{ marginTop: 14 }}>
        <span><b>Presented by {c.name}</b><br /><span style={{ color: 'var(--haze)', fontSize: 13 }}>Verified creator · {c.field} · demo account</span></span>
      </div>
      <div className="row">
        <span style={{ display: 'flex', gap: 10 }}><Sparkles size={18} color="var(--sun)" style={{ flex: 'none' }} />
          <span>Why you are seeing this: you picked <b>{{ ancient: 'History', memory: 'Psychology', space: 'Space', myths: 'The brain' }[video.series]}</b> when you joined.</span></span>
      </div>
    </Sheet>
  )
}
