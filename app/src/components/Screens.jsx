import { useState } from 'react'
import { BadgeCheck, IdCard, GraduationCap, FileCheck2, PenTool, Clapperboard, Check, ChevronLeft, Play, Flame, ListPlus } from 'lucide-react'
import { videos, series, creators, tierFor } from '../data/videos'
import { posterUrl } from './Feed'

// ---------- Series: a creator groups videos into an ordered course you watch top to bottom ----------
export function SeriesScreen({ openSeries, setOpenSeries, playSeries, age }) {
  if (openSeries) {
    const s = series[openSeries]
    const list = videos.filter((v) => v.series === openSeries && v.minAge <= age)
    const c = creators[s.creator]
    return (
      <div className="screen">
        <button onClick={() => setOpenSeries(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--haze)' }}><ChevronLeft />All series</button>
        <h1>{s.title}</h1>
        <p className="lead">A series by {c.name}. Watch in order, at your pace.</p>
        <button className="btn" onClick={() => playSeries(openSeries)} style={{ marginBottom: 16 }}><Play size={18} />Play from part 1</button>
        {list.map((v, i) => (
          <button key={v.id} className="series-card" onClick={() => playSeries(openSeries, i)}>
            <img src={posterUrl(v.id)} alt="" />
            <span><b>Part {i + 1}: {v.title}</b><span>{Math.round(v.words.duration)} s · {v.source.kind}</span></span>
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="screen">
      <h1>Series</h1>
      <p className="lead">Creators group their videos into short courses, so you can go deep instead of wide.</p>
      {Object.entries(series).map(([id, s]) => {
        const list = videos.filter((v) => v.series === id && v.minAge <= age)
        if (!list.length) return null
        return (
          <button key={id} className="series-card" onClick={() => setOpenSeries(id)}>
            <img src={posterUrl(list[0].id)} alt="" />
            <span><b>{s.title}</b><span>{creators[s.creator].name} · {list.length} parts</span></span>
          </button>
        )
      })}
    </div>
  )
}

// ---------- Create: become a verified creator, then pick a route ----------
const VERIFY = [
  { id: 'id', icon: IdCard, t: 'Identity', d: 'Confirmed with your EU digital ID. We keep only the result.' },
  { id: 'cred', icon: GraduationCap, t: 'Credentials', d: 'University email, ORCID or publisher record.' },
  { id: 'rights', icon: FileCheck2, t: 'Rights to the work', d: 'Your own work, or written permission from the author.' },
]
const STUDIO_STEPS = ['Request sent', 'Studio drafts the script', 'You review the cut', 'Published with your name']

export function CreateScreen({ toast }) {
  const [done, setDone] = useState({})
  const [route, setRoute] = useState(null)
  const [stage, setStage] = useState(2) // the demo project is waiting for the author's review
  const [changes, setChanges] = useState(false)
  const [note, setNote] = useState('')
  const [picked, setPicked] = useState(['forgetting'])
  const [seriesName, setSeriesName] = useState('')
  const verified = VERIFY.every((v) => done[v.id])

  return (
    <div className="screen">
      <h1>Create on Wake</h1>
      <p className="lead">Only verified people publish on Wake. That is how every video stays trustworthy.</p>

      {VERIFY.map(({ id, icon: Icon, t, d }) => (
        <button key={id} className={`option ${done[id] ? 'on' : ''}`} onClick={() => setDone({ ...done, [id]: true })}>
          <span className="ic">{done[id] ? <Check color="var(--ok)" /> : <Icon />}</span><span><b>{t}</b><span>{done[id] ? 'Verified' : d}</span></span>
        </button>
      ))}

      {verified && <>
        <p className="check" style={{ margin: '14px 0' }}><BadgeCheck />You are a verified creator</p>
        <h1 style={{ fontSize: 24 }}>How do you want to make videos?</h1>
        <button className={`option ${route === 'self' ? 'on' : ''}`} onClick={() => setRoute('self')}>
          <span className="ic"><PenTool /></span><span><b>Make them yourself</b><span>Free Wake Creator Course: six short lessons on scripting, filming and editing for short video.</span></span>
        </button>
        <button className={`option ${route === 'studio' ? 'on' : ''}`} onClick={() => setRoute('studio')}>
          <span className="ic"><Clapperboard /></span><span><b>Work with Wake Studio</b><span>Send your book or paper. Our team scripts, animates and edits. Nothing goes live until you approve it.</span></span>
        </button>
      </>}

      {route === 'self' && (
        <div className="panel">
          <b style={{ fontFamily: 'var(--display)' }}>Wake Creator Course</b>
          {['Find the one surprising idea', 'Write a 30-second script', 'Hook in the first 3 seconds', 'Film on a phone', 'Edit and caption', 'Cite your source on screen'].map((l, i) => (
            <div key={l} className="row" style={{ padding: '10px 0' }}><span>{i + 1}. {l}</span>{i < 2 ? <Check size={18} color="var(--ok)" /> : <span style={{ color: 'var(--haze)', fontSize: 13 }}>4 min</span>}</div>
          ))}
        </div>
      )}

      {route === 'studio' && (
        <div className="panel">
          <b style={{ fontFamily: 'var(--display)' }}>Project: “Why you forget (and the fix)”</b>
          <div style={{ fontSize: 13, color: 'var(--haze)' }}>From your paper · Wake Studio editor: Sofia</div>
          <div className="status">
            {STUDIO_STEPS.map((s, i) => (
              <div key={s} className={i < stage ? 'done' : i === stage ? 'now' : ''}><i>{i < stage && <Check size={13} />}</i>{s}</div>
            ))}
          </div>
          {stage === 2 && !changes && <>
            <img src={posterUrl('forgetting')} alt="Draft cut" style={{ width: '100%', borderRadius: 14, marginBottom: 10, maxHeight: 260, objectFit: 'cover' }} />
            <div style={{ display: 'grid', gap: 8 }}>
              <button className="btn" onClick={() => { setStage(4); toast('Approved and published') }}>Approve and publish</button>
              <button className="btn ghost" onClick={() => setChanges(true)}>Request changes</button>
            </div>
          </>}
          {changes && <>
            <textarea rows={3} placeholder="E.g. at 0:14, say ‘relearn’, not ‘forget’. That is what my data measured." value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn" style={{ marginTop: 8 }} disabled={!note} onClick={() => { setChanges(false); setStage(1); setNote(''); toast('Sent to the studio') }}>Send to the studio</button>
          </>}
          {stage === 1 && !changes && <button className="btn ghost" onClick={() => setStage(2)}>Studio sends a new cut</button>}
          {stage === 4 && <p className="check"><Check />Live, credited to you.</p>}
        </div>
      )}

      {verified && route && <>
        <h1 style={{ fontSize: 24, marginTop: 20 }}>Make a series</h1>
        <p className="lead" style={{ marginBottom: 10 }}>Pick videos and put them in order. Students watch it like a playlist.</p>
        {videos.slice(0, 4).map((v) => (
          <button key={v.id} className={`option ${picked.includes(v.id) ? 'on' : ''}`} style={{ alignItems: 'center', padding: 10 }}
            onClick={() => setPicked(picked.includes(v.id) ? picked.filter((x) => x !== v.id) : [...picked, v.id])}>
            <img src={posterUrl(v.id)} alt="" style={{ width: 44, height: 64, objectFit: 'cover', borderRadius: 8 }} />
            <span><b style={{ fontSize: 15 }}>{v.title}</b><span>{picked.includes(v.id) ? `Part ${picked.indexOf(v.id) + 1}` : 'Tap to add'}</span></span>
          </button>
        ))}
        <input type="text" placeholder="Series name, e.g. Memory for exam season" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} />
        <button className="btn" style={{ marginTop: 10 }} disabled={!seriesName || !picked.length} onClick={() => toast(`Series created: ${picked.length} parts`)}><ListPlus size={18} />Create series</button>
      </>}
    </div>
  )
}

// ---------- Me: today's goal instead of an endless scroll ----------
export function MeScreen({ user, watched, onReset }) {
  const tier = user.tier
  const minutes = Math.round(watched.length * 0.5 * 10) / 10
  const pct = Math.min(100, (minutes / 10) * 100)
  return (
    <div className="screen">
      <h1>Today</h1>
      <p className="lead">{tier.label}{user.verified18 ? ' · verified with EU age app' : ''} · {tierFor(user.age).id === tier.id ? '' : 'under-18 feed · '}{user.role === 'educator' ? 'Creator' : 'Learner'}</p>
      <div className="ring" style={{ background: `conic-gradient(var(--sun) ${pct}%, var(--night-3) 0)` }}>
        <div>{watched.length}/6<small>lessons today</small></div>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--haze)', marginTop: 0 }}><Flame size={16} color="var(--sun)" style={{ verticalAlign: -3 }} /> 4-day streak · daily limit {tier.limit} min</p>
      <div className="panel">
        <b style={{ fontFamily: 'var(--display)' }}>Today I learned</b>
        {watched.length === 0 && <p style={{ color: 'var(--haze)' }}>Nothing yet. Your first lesson is one swipe away.</p>}
        {watched.map((id) => { const v = videos.find((x) => x.id === id); return <div key={id} className="row" style={{ padding: '10px 0' }}><span>{v.title}</span><Check size={18} color="var(--ok)" /></div> })}
      </div>
      <div className="panel" style={{ color: 'var(--haze)', fontSize: 14, lineHeight: 1.5 }}>
        Tomorrow: one question about today, to help it stick.
      </div>
      <button className="btn ghost" onClick={onReset}>Restart demo</button>
    </div>
  )
}
