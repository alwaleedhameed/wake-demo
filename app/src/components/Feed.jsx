import { useEffect, useRef, useState } from 'react'
import { Heart, Bookmark, BookOpen, Ellipsis, Share2, BadgeCheck, ListVideo, Pause, Volume2, Coffee, Sun } from 'lucide-react'
import { creators, series, seriesPosition } from '../data/videos'
import Captions from './Captions'
import { FormatSheet, SourceSheet } from './Sheets'

const base = import.meta.env.BASE_URL
export const videoUrl = (id) => `${base}videos/${id}.mp4`
export const posterUrl = (id) => `${base}videos/${id}.jpg`

// The feed is a vertical scroll that snaps one card per screen.
// ONE shared <video> element plays whichever card is on screen. Why: iPhones only allow sound
// on a video element the user has tapped once. Reusing the same element keeps sound working
// after every swipe. Cards show a still poster underneath while you are mid-swipe.
export default function Feed({ items, videoEl, format, setFormat, onWatched, onOpenSeries, needsTap, onUnlock, toast }) {
  const feedRef = useRef(null)
  const [active, setActive] = useState(0)
  const [scrolling, setScrolling] = useState(false)
  const [time, setTime] = useState(0)
  const [paused, setPaused] = useState(false)
  const [sheet, setSheet] = useState(null) // 'format' | 'source' | null
  const [liked, setLiked] = useState({})
  const [saved, setSaved] = useState({})
  const item = items[active]

  // Which card is on screen: the one at least 60% visible.
  useEffect(() => {
    const cards = feedRef.current.querySelectorAll('.card')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.index))
    }, { root: feedRef.current, threshold: 0.6 })
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [items])

  // Hide the moving video while the user swipes; show it again once the scroll settles.
  useEffect(() => {
    const el = feedRef.current
    let timer
    const onScroll = () => { setScrolling(true); clearTimeout(timer); timer = setTimeout(() => setScrolling(false), 140) }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Load and play the active card's video in the shared element.
  useEffect(() => {
    const v = videoEl.current
    if (!v) return
    if (!item || item.type !== 'video') { v.pause(); return }
    const src = videoUrl(item.video.id)
    if (!v.src.endsWith(src)) { v.src = src; v.currentTime = 0 }
    setPaused(false)
    if (format.mode === 'read') v.pause()
    else v.play().catch(() => {})
    onWatched(item.video.id)
  }, [active, item, format.mode]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (videoEl.current) videoEl.current.muted = !format.sound }, [format.sound, videoEl])

  // Caption clock: check the playhead every animation frame, but only re-render about 12 times
  // a second. That is smooth enough for word highlights and keeps swiping smooth on a phone.
  useEffect(() => {
    let raf, lastStep = -1
    const tick = () => {
      const t = videoEl.current ? videoEl.current.currentTime : 0
      const step = Math.floor(t * 12)
      if (step !== lastStep) { lastStep = step; setTime(t) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [videoEl])

  // Keep the shared video glued to the active card's position inside the feed.
  const videoVisible = item?.type === 'video' && !scrolling && format.mode === 'video'
  useEffect(() => { if (videoEl.current) videoEl.current.style.opacity = videoVisible ? 1 : 0 }, [videoVisible, videoEl])
  const togglePlay = () => {
    const v = videoEl.current
    if (needsTap) { onUnlock(); return }
    if (v.paused) { v.play(); setPaused(false) } else { v.pause(); setPaused(true) }
  }

  return (
    <>
      <div className="feed" ref={feedRef}>
        {items.map((it, i) => (
          <section className="card" key={it.key} data-index={i}>
            {it.type === 'video' && (
              <VideoCard
                video={it.video} isActive={i === active} format={format} time={i === active ? time : 0}
                paused={i === active && paused} onTap={togglePlay}
                liked={liked[it.key]} saved={saved[it.key]}
                onLike={() => setLiked({ ...liked, [it.key]: !liked[it.key] })}
                onSave={() => { setSaved({ ...saved, [it.key]: !saved[it.key] }); if (!saved[it.key]) toast('Saved to your library') }}
                onSource={() => setSheet('source')} onFormat={() => setSheet('format')}
                onSeries={() => onOpenSeries(it.video.series)} onShare={() => toast('Link copied')}
              />
            )}
            {it.type === 'pause' && <PauseCard quiz={it.quiz} count={it.count} />}
            {it.type === 'end' && <EndCard />}
          </section>
        ))}
      </div>
      {needsTap && item?.type === 'video' && (
        <button className="tap-sound" onClick={onUnlock}><Volume2 size={20} />Tap for sound</button>
      )}
      {sheet === 'format' && <FormatSheet format={format} setFormat={setFormat} onClose={() => setSheet(null)} />}
      {sheet === 'source' && item?.type === 'video' && <SourceSheet video={item.video} onClose={() => setSheet(null)} />}
    </>
  )
}

function VideoCard({ video, isActive, format, time, paused, onTap, liked, saved, onLike, onSave, onSource, onFormat, onSeries, onShare }) {
  const c = creators[video.creator]
  const pos = seriesPosition(video)
  return (
    <>
      <img className="poster" src={posterUrl(video.id)} alt="" />
      {format.mode === 'listen' && isActive && (
        <div className="listen" style={{ paddingBottom: 160 }}>
          <div style={{ display: 'grid', justifyItems: 'center' }}>
            <div className="disc" style={{ backgroundImage: `url(${posterUrl(video.id)})` }} />
            <div className="bars">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 4) * 0.15}s` }} />)}</div>
            <p style={{ color: 'var(--haze)', margin: '14px 0 0' }}>Audio only · screen can stay off</p>
          </div>
        </div>
      )}
      {format.mode === 'read' && isActive && (
        <div className="read">
          <h2>{video.title}</h2>
          <div className="by">{c.name} · {c.field}</div>
          <p>{video.words.words.map((w) => w.w).join(' ').replace(/ -/g, '-').replace(/ ,/g, ',')}</p>
          <div className="cite"><b>Source.</b> {video.source.citation}</div>
        </div>
      )}
      <div className="card-ui" onClick={format.mode === 'read' ? undefined : onTap}>
        {format.mode !== 'read' && <><div className="shade-top" /><div className="shade" /></>}
        {isActive && format.mode === 'video' && format.captions && <Captions words={video.words.words} time={time} />}
        {paused && <Pause className="paused-icon" size={64} fill="#fff" />}
        <div className="rail" onClick={(e) => e.stopPropagation()}>
          <button aria-label={`${c.name}'s profile`}><div className="avatar" style={{ background: `hsl(${c.hue} 70% 45%)` }}>{c.initials}</div></button>
          <button className={liked ? 'liked' : ''} onClick={onLike} aria-pressed={!!liked}><Heart size={32} />{video.likes}</button>
          <button className={saved ? 'saved' : ''} onClick={onSave} aria-pressed={!!saved}><Bookmark size={30} />{video.saves}</button>
          <button className="source-btn" onClick={onSource}><BookOpen size={22} />Source</button>
          <button onClick={onFormat} aria-label="View options"><Ellipsis size={30} />View</button>
          <button onClick={onShare}><Share2 size={28} />Share</button>
        </div>
        <div className="info" onClick={(e) => e.stopPropagation()}>
          <div className="handle">@{c.handle}<BadgeCheck size={18} aria-label="Verified creator" /></div>
          <div className="field">{c.field} · demo creator</div>
          {format.mode !== 'read' && <><p className="title">{video.title}</p><p className="cap">{video.caption}</p></>}
          <button className="series-chip" onClick={onSeries}>
            <ListVideo size={16} />{pos.total > 1 ? `Part ${pos.index} of ${pos.total} · ` : 'Series · '}{series[video.series].title}
          </button>
        </div>
      </div>
    </>
  )
}

// A natural stopping point: check one thing you learned earlier, then a nudge to take a break.
// Instead of the endless scroll, retrieval practice (testing yourself) makes it stick.
function PauseCard({ quiz, count }) {
  const [pick, setPick] = useState(null)
  return (
    <div className="pause-card">
      <Coffee size={36} color="var(--sun)" />
      <h2>{count} things learned. Quick check?</h2>
      <p style={{ marginTop: 0 }}>{quiz.q}</p>
      {quiz.options.map((o, i) => (
        <button key={o} className={`answer ${pick === null ? '' : i === quiz.answer ? 'right' : pick === i ? 'wrong' : ''}`} onClick={() => setPick(i)}>{o}</button>
      ))}
      {pick !== null && (
        <p style={{ color: 'var(--mist)' }}>
          {pick === quiz.answer ? 'Locked in. ' : 'Close, now you will remember it. '}
          Good moment for a break: your brain stores what it just learned while you rest.
        </p>
      )}
    </div>
  )
}

function EndCard() {
  return (
    <div className="pause-card" style={{ textAlign: 'center', alignItems: 'center' }}>
      <Sun size={48} color="var(--sun)" />
      <h2>That is today’s set.</h2>
      <p>You have reached your daily goal. New lessons tomorrow, with a question on what you learned today.</p>
      <p style={{ color: 'var(--mist)', fontWeight: 700 }}>Go outside. Tell someone one thing you learned.</p>
    </div>
  )
}
