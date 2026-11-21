import { useMemo, useRef, useState } from 'react'
import { Home, Library, Plus, CircleUser } from 'lucide-react'
import Feed, { videoUrl } from './components/Feed'
import Onboarding from './components/Onboarding'
import Logo from './components/Logo'
import { SeriesScreen, CreateScreen, MeScreen } from './components/Screens'
import { videos, embeds, featured } from './data/videos'

// Every Wake video and creator Short, by id, so a series or the saved list can mix both.
export const byId = (id) => {
  const v = videos.find((x) => x.id === id)
  if (v) return { type: 'video', video: v }
  const e = embeds.find((x) => x.id === id)
  return e ? { type: 'youtube', embed: e } : null
}
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// How much one day holds. Wake stops the feed at 60 lessons or 2 hours, whichever comes first,
// and then shows the "done for today" card instead of scrolling forever. For the pitch demo the
// day ends after 5 videos, so judges reach that card in a minute.
export const DAILY = { lessons: 60, minutes: 120 }
const DEMO_DAY = 5

// Builds a feed with an end card after the last video. The main feed is shuffled every time it
// is opened, about three Wake videos to one creator Short, and always opens on a Wake video so the
// first tap can switch sound on. A series or the saved list plays in its own order.
// A quick question on the video just watched comes once every 5 lessons, as a glass panel over
// the start of the next video. In the demo it comes after the 2nd video, so judges see it
// straight away. It never blocks: skip it, answer it, or just keep swiping.
const QUIZ_EVERY = 5
const DEMO_QUIZ_AFTER = 2
function buildFeed(entries, end, quizAfter) {
  const items = []
  entries = [...entries]
  entries.forEach((it, i) => {
    const id = (it.video || it.embed).id
    items.push({ ...it, key: `${it.type}-${id}-${i}` })
    const n = i + 1
    // The question rides on the NEXT video card as a panel, never as a card of its own.
    if (n < entries.length && quizAfter(n)) entries[i + 1] = { ...entries[i + 1], question: { id, title: (it.video || it.embed).title } }
  })
  items.push({ type: 'end', end, key: 'end' })
  return items
}

export default function App() {
  const videoEl = useRef(null)            // the one shared player (see Feed.jsx for why)
  const [user, setUser] = useState(null)  // null until sign-up is finished
  const [tab, setTab] = useState('home')
  const [format, setFormat] = useState({ mode: 'video', captions: true, sound: true })
  const [needsTap, setNeedsTap] = useState(true)
  const [watched, setWatched] = useState([])
  const [openSeries, setOpenSeries] = useState(null)
  const [playing, setPlaying] = useState(null) // { ids, start, title } when a series or the saved list plays
  const [toastMsg, setToastMsg] = useState(null)
  const [feedKey, setFeedKey] = useState(0)
  const [mySeries, setMySeries] = useState([]) // series made in the Create tab: { id, title, ids }
  const [saved, setSaved] = useState([])       // ids of saved videos, newest first

  const age = user ? (user.verified18 ? user.age : Math.min(user.age, 17)) : 17
  const items = useMemo(() => {
    if (playing) return buildFeed(playing.ids.map(byId).filter(Boolean).slice(playing.start), { kind: 'list', title: playing.title }, (n) => n % QUIZ_EVERY === 0)
    const own = shuffle(videos.filter((v) => v.minAge <= age)).map((v) => ({ type: 'video', video: v }))
    const short = { type: 'youtube', embed: shuffle(featured)[0] }
    const day = [own[0], ...shuffle([...own.slice(1, DEMO_DAY - 1), short])]
    return buildFeed(day, { kind: 'day' }, (n) => n === DEMO_QUIZ_AFTER)
  }, [age, playing, feedKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 1800) }

  // Called from a real tap, so the browser lets this player use sound from now on.
  const unlockSound = () => {
    const v = videoEl.current
    if (!v) return
    v.muted = false
    v.play().then(() => setNeedsTap(false)).catch(() => { v.muted = true; v.play().catch(() => {}); setNeedsTap(true) })
  }

  const finishOnboarding = (u) => {
    setUser(u)
    setTab('home')
    const v = videoEl.current
    if (v && !v.src && items[0].video) v.src = videoUrl(items[0].video.id)
    unlockSound()
  }

  const goTab = (t) => {
    if (t !== 'home') videoEl.current?.pause()
    else if (format.mode === 'video' || format.mode === 'listen') videoEl.current?.play().catch(() => {})
    setTab(t)
  }

  const playList = (ids, start = 0, title = '') => { setPlaying({ ids, start, title }); setFeedKey((k) => k + 1); setTab('home') }
  const forYou = () => { setPlaying(null); setFeedKey((k) => k + 1) } // reshuffles
  const toggleSave = (id) => setSaved((s) => {
    if (s.includes(id)) return s.filter((x) => x !== id)
    toast('Saved')
    return [id, ...s]
  })
  const markWatched = (id) => setWatched((w) => (w.includes(id) ? w : [...w, id]))
  const restart = () => { videoEl.current?.pause(); setUser(null); setWatched([]); setSaved([]); setMySeries([]); setPlaying(null); setFeedKey((k) => k + 1) }

  return (
    <div className="phone">
      {/* The feed stays mounted under every other screen, so its player and position survive tab changes. */}
      <Feed key={feedKey} items={items} videoEl={videoEl} format={format} setFormat={setFormat}
        onWatched={markWatched} saved={saved} onToggleSave={toggleSave}
        needsTap={needsTap} onUnlock={unlockSound} toast={toast} onExitList={forYou}
        onMore={forYou} />
      {/* The shared player lives here, outside the feed, so it is never replaced: iPhones remember
          the sound permission per element. It sits above the card's poster and below its buttons. */}
      <video ref={videoEl} className="shared-video" playsInline preload="auto" loop style={{ opacity: 0 }} />

      {tab === 'home' && user && (
        <div className="topbar">
          <button onClick={restart} aria-label="Restart demo"><Logo size={22} /></button>
          <div className="tabs">
            <button className={!playing ? 'on' : ''} onClick={forYou}>For you</button>
            <button className={playing ? 'on' : ''} onClick={() => goTab('series')}>{playing ? playing.title : 'Series'}</button>
          </div>
          <span className="pill">{user.verified18 ? '18+ verified' : user.tier.label}</span>
        </div>
      )}

      {tab === 'series' && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><SeriesScreen openSeries={openSeries} setOpenSeries={setOpenSeries} playList={playList} age={age}
        mySeries={mySeries} saved={saved} isCreator={user?.role === 'educator' || mySeries.length > 0}
        onDelete={(id) => { setMySeries((m) => m.filter((x) => x.id !== id)); setOpenSeries(null); toast('Series deleted') }}
        onMake={() => goTab('create')} /></div>}
      {tab === 'create' && user && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><CreateScreen toast={toast} isAdult={user.age >= 18}
        onCreateSeries={(s) => { setMySeries((m) => [...m, s]); setOpenSeries(s.id); goTab('series') }} /></div>}
      {tab === 'me' && user && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><MeScreen user={user} watched={watched} onReset={restart} /></div>}

      {user && (
        <nav className={`nav ${tab === 'home' ? '' : 'light'}`}>
          <button className={tab === 'home' ? 'on' : ''} onClick={() => goTab('home')}><Home size={24} />Home</button>
          <button className={tab === 'series' ? 'on' : ''} onClick={() => goTab('series')}><Library size={24} />Series</button>
          <button className={`make ${tab === 'create' ? 'on' : ''}`} onClick={() => goTab('create')}><span className="ic"><Plus size={22} /></span></button>
          <button className={tab === 'me' ? 'on' : ''} onClick={() => goTab('me')}><CircleUser size={24} />Me</button>
        </nav>
      )}

      {!user && <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}><Onboarding onDone={finishOnboarding} /></div>}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </div>
  )
}
