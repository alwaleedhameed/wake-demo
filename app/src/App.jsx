import { useMemo, useRef, useState } from 'react'
import { Home, Library, Plus, CircleUser } from 'lucide-react'
import Feed, { videoUrl } from './components/Feed'
import Onboarding from './components/Onboarding'
import Logo from './components/Logo'
import { SeriesScreen, CreateScreen, MeScreen } from './components/Screens'
import { videos } from './data/videos'

// Builds the feed: the videos this age group may see, a quiz-and-break card after four,
// and an end card instead of an infinite scroll.
function buildFeed(list) {
  const items = []
  list.forEach((v, i) => {
    items.push({ type: 'video', video: v, key: `${v.id}-${i}` })
    if (i === 3) items.push({ type: 'pause', count: 4, quiz: list[0].quiz, key: 'pause' })
  })
  items.push({ type: 'end', key: 'end' })
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
  const [playing, setPlaying] = useState({ series: null, start: 0 }) // a series opened in the feed
  const [toastMsg, setToastMsg] = useState(null)
  const [feedKey, setFeedKey] = useState(0)

  const age = user ? (user.verified18 ? user.age : Math.min(user.age, 17)) : 17
  const items = useMemo(() => {
    let list = videos.filter((v) => v.minAge <= age)
    if (playing.series) list = list.filter((v) => v.series === playing.series).slice(playing.start)
    return buildFeed(list)
  }, [age, playing])

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 1800) }

  // Called from a real tap, so the browser lets this player use sound from now on.
  const unlockSound = () => {
    const v = videoEl.current
    if (!v) return
    v.muted = false
    v.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true))
  }

  const finishOnboarding = (u) => {
    setUser(u)
    setTab('home')
    const v = videoEl.current
    if (v && !v.src) v.src = videoUrl(items[0].video.id)
    unlockSound()
  }

  const goTab = (t) => {
    if (t !== 'home') videoEl.current?.pause()
    else if (format.mode !== 'read') videoEl.current?.play().catch(() => {})
    setTab(t)
  }

  const playSeries = (id, start = 0) => { setPlaying({ series: id, start }); setFeedKey((k) => k + 1); setTab('home') }
  const markWatched = (id) => setWatched((w) => (w.includes(id) ? w : [...w, id]))
  const restart = () => { videoEl.current?.pause(); setUser(null); setWatched([]); setPlaying({ series: null, start: 0 }); setFeedKey((k) => k + 1) }

  return (
    <div className="phone">
      {/* The feed stays mounted under every other screen, so its player and position survive tab changes. */}
      <Feed key={feedKey} items={items} videoEl={videoEl} format={format} setFormat={setFormat}
        onWatched={markWatched} onOpenSeries={(id) => { setOpenSeries(id); goTab('series') }}
        needsTap={needsTap} onUnlock={unlockSound} toast={toast} />
      {/* The shared player lives here, outside the feed, so it is never replaced: iPhones remember
          the sound permission per element. It sits above the card's poster and below its buttons. */}
      <video ref={videoEl} className="shared-video" playsInline preload="auto" loop style={{ opacity: 0 }} />

      {tab === 'home' && user && (
        <div className="topbar">
          <button onClick={restart} aria-label="Restart demo"><Logo size={22} /></button>
          <div className="tabs">
            <button className={!playing.series ? 'on' : ''} onClick={() => { setPlaying({ series: null, start: 0 }); setFeedKey((k) => k + 1) }}>For you</button>
            <button className={playing.series ? 'on' : ''} onClick={() => goTab('series')}>Series</button>
          </div>
          <span className="pill">{user.verified18 ? '18+ verified' : user.tier.label}</span>
        </div>
      )}

      {tab === 'series' && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><SeriesScreen openSeries={openSeries} setOpenSeries={setOpenSeries} playSeries={playSeries} age={age} /></div>}
      {tab === 'create' && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><CreateScreen toast={toast} /></div>}
      {tab === 'me' && user && <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}><MeScreen user={user} watched={watched} onReset={restart} /></div>}

      {user && (
        <nav className="nav">
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
