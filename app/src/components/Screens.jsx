import { useState } from 'react'
import { BadgeCheck, IdCard, GraduationCap, FileCheck2, PenTool, Clapperboard, Check, ChevronLeft, Play, ListPlus, Trash2 } from 'lucide-react'
import { videos, embeds, featured, creators, tierFor } from '../data/videos'
import { posterUrl } from './Feed'

// Any Wake video or creator Short by id, with its still image.
const findAny = (id) => videos.find((v) => v.id === id) || embeds.find((e) => e.id === id)
const thumbOf = (it) => (it.yt ? `https://i.ytimg.com/vi/${it.yt}/hq2.jpg` : posterUrl(it.id))
const metaOf = (it) => `${creators[it.creator].name} · ${it.source.kind}`

// A two-way switch with Apple's liquid glass look: a frosted track with a brighter glass pill
// that slides under the chosen side.
export function GlassTabs({ tabs, value, onChange }) {
  const i = Math.max(0, tabs.findIndex((t) => t.id === value))
  return (
    <div className="glass-tabs glass" role="tablist">
      <span className="glass-thumb" style={{ transform: `translateX(${i * 100}%)`, width: `calc((100% - 8px) / ${tabs.length})` }} />
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === value} className={t.id === value ? 'on' : ''} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  )
}

function Empty({ title, children }) {
  return <div className="panel empty"><b>{title}</b><p>{children}</p></div>
}

// ---------- Series: your own shelf, no ready-made courses ----------
// Learners see what they saved and what their teachers send them. Creators see what they saved
// and everything they made, with tools to manage it.
export function SeriesScreen({ openSeries, setOpenSeries, playList, age, mySeries, saved, isCreator, onDelete, onMake }) {
  const tabs = isCreator ? [{ id: 'mine', label: 'Made by you' }, { id: 'saved', label: 'Saved' }]
    : [{ id: 'saved', label: 'Saved' }, { id: 'class', label: 'From teachers' }]
  const [view, setView] = useState(tabs[0].id)
  const visible = (it) => it && (it.minAge === undefined || it.minAge <= age)

  const s = openSeries && mySeries.find((m) => m.id === openSeries)
  if (s) {
    const list = s.ids.map(findAny).filter(visible)
    return (
      <div className="screen">
        <button onClick={() => setOpenSeries(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--haze)' }}><ChevronLeft />Back</button>
        <h1>{s.title}</h1>
        <p className="lead">Your series · {list.length} parts. Students watch it in this order.</p>
        <button className="btn" onClick={() => playList(s.ids, 0, s.title)} style={{ marginBottom: 16 }}><Play size={18} />Play from part 1</button>
        {list.map((v, i) => (
          <button key={v.id} className="series-card" onClick={() => playList(s.ids, i, s.title)}>
            <img src={thumbOf(v)} alt="" />
            <span><b>Part {i + 1}: {v.title}</b><span>{metaOf(v)}</span></span>
          </button>
        ))}
        <button className="btn ghost" style={{ marginTop: 6 }} onClick={() => onDelete(s.id)}><Trash2 size={18} />Delete series</button>
      </div>
    )
  }

  const savedList = saved.map(findAny).filter(visible)
  return (
    <div className="screen">
      <h1>Series</h1>
      <GlassTabs tabs={tabs} value={view} onChange={setView} />

      {view === 'saved' && (savedList.length ? <>
        <button className="btn" onClick={() => playList(saved, 0, 'Saved')} style={{ margin: '4px 0 14px' }}><Play size={18} />Play all saved</button>
        {savedList.map((v, i) => (
          <button key={v.id} className="series-card" onClick={() => playList(saved, i, 'Saved')}>
            <img src={thumbOf(v)} alt="" />
            <span><b>{v.title}</b><span>{metaOf(v)}</span></span>
          </button>
        ))}
      </> : <Empty title="Nothing saved yet">Tap the bookmark on any video and it lands here, ready to rewatch or revise from.</Empty>)}

      {view === 'class' && <Empty title="No series from teachers yet">When a teacher adds you to their class, the series they set for you show up here, in the order they chose.</Empty>}

      {view === 'mine' && <>
        {mySeries.length ? mySeries.map((s) => {
          const first = findAny(s.ids[0])
          return (
            <button key={s.id} className="series-card" onClick={() => setOpenSeries(s.id)}>
              <img src={thumbOf(first)} alt="" />
              <span><b>{s.title}</b><span>{s.ids.length} parts · tap to manage</span></span>
            </button>
          )
        }) : <Empty title="You have not made a series yet">Group videos into an ordered course for your students.</Empty>}
        <button className="btn ghost" style={{ marginTop: 6 }} onClick={onMake}><ListPlus size={18} />Make a series</button>
      </>}
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

export function CreateScreen({ toast, isAdult, onCreateSeries }) {
  const [done, setDone] = useState({})
  const [route, setRoute] = useState(null)
  const [stage, setStage] = useState(2) // the demo project is waiting for the author's review
  const [changes, setChanges] = useState(false)
  const [note, setNote] = useState('')
  const [picked, setPicked] = useState([])
  const [seriesName, setSeriesName] = useState('')
  const verified = VERIFY.every((v) => done[v.id])

  // Creators are verified educators and researchers, so the creator tools are 18+ only.
  if (!isAdult) return (
    <div className="screen">
      <h1>Create on Wake</h1>
      <p className="lead">Wake creators are verified teachers, researchers and authors aged 18 and over.</p>
      <div className="panel" style={{ color: 'var(--haze)', lineHeight: 1.5 }}>You can still save videos, follow series and test yourself on what you watched.</div>
    </div>
  )

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

      {verified && <>
        <h1 style={{ fontSize: 24, marginTop: 20 }}>Make a series</h1>
        <p className="lead" style={{ marginBottom: 10 }}>Tap videos in the order students should watch them. Tap again to take one out.</p>
        {[...videos, ...featured].map((v) => (
          <button key={v.id} className={`option ${picked.includes(v.id) ? 'on' : ''}`} style={{ alignItems: 'center', padding: 10 }}
            onClick={() => setPicked(picked.includes(v.id) ? picked.filter((x) => x !== v.id) : [...picked, v.id])}>
            <img src={thumbOf(v)} alt="" style={{ width: 44, height: 64, objectFit: 'cover', borderRadius: 8 }} />
            <span><b style={{ fontSize: 15 }}>{v.title}</b><span>{picked.includes(v.id) ? `Part ${picked.indexOf(v.id) + 1}` : 'Tap to add'}</span></span>
          </button>
        ))}
        <input type="text" placeholder="Series name, e.g. Memory for exam season" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} />
        <button className="btn" style={{ marginTop: 10 }} disabled={!seriesName.trim() || picked.length < 2}
          onClick={() => {
            onCreateSeries({ id: `mine-${Date.now()}`, title: seriesName.trim(), ids: picked })
            toast(`Series created: ${picked.length} parts`); setSeriesName(''); setPicked([])
          }}><ListPlus size={18} />{picked.length < 2 ? 'Pick at least 2 videos' : `Create series (${picked.length} parts)`}</button>
      </>}
    </div>
  )
}

// ---------- Me: today's goal instead of an endless scroll ----------
export function MeScreen({ user, watched, onReset }) {
  const tier = user.tier
  // A plain count of lessons learned: no daily target to hit, so nothing nudges you to keep scrolling.
  const all = [...videos, ...embeds]
  return (
    <div className="screen">
      <h1>Today</h1>
      <p className="lead">{tier.label}{user.verified18 ? ' · verified with EU age app' : ''} · {tierFor(user.age).id === tier.id ? '' : 'under-18 feed · '}{user.role === 'educator' ? 'Creator' : 'Learner'}</p>
      <div className="ring" style={{ background: 'conic-gradient(var(--sun) 0 100%)' }}>
        <div>{watched.length}<small>{watched.length === 1 ? 'lesson learned' : 'lessons learned'}</small></div>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--haze)', marginTop: 0 }}>Daily limit: 60 lessons or {tier.limit} minutes. No streaks: come back when you want to.</p>
      <div className="panel">
        <b style={{ fontFamily: 'var(--display)' }}>Today I learned</b>
        {watched.length === 0 && <p style={{ color: 'var(--haze)' }}>Nothing yet. Your first lesson is one swipe away.</p>}
        {watched.map((id) => { const v = all.find((x) => x.id === id); return v && <div key={id} className="row" style={{ padding: '10px 0' }}><span>{v.title}</span><Check size={18} color="var(--ok)" /></div> })}
      </div>
      <div className="panel" style={{ color: 'var(--haze)', fontSize: 14, lineHeight: 1.5 }}>
        Tomorrow: one question about today, to help it stick.
      </div>
      <button className="btn ghost" onClick={onReset}>Restart demo</button>
    </div>
  )
}
