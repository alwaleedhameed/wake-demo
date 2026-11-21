import { useEffect, useRef, useState } from 'react'
import { Heart, Bookmark, BookOpen, Ellipsis, Share2, BadgeCheck, Pause, VolumeX, Sun, Check, X, Sparkles } from 'lucide-react'
import { creators, quizzes } from '../data/videos'
import Captions from './Captions'
import { FormatSheet, SourceSheet } from './Sheets'

const base = import.meta.env.BASE_URL
export const videoUrl = (id) => `${base}videos/${id}.mp4`
export const posterUrl = (id) => `${base}videos/${id}.jpg`

// The feed is a vertical scroll that snaps one card per screen.
// ONE shared <video> element plays whichever card is on screen. Why: iPhones only allow sound
// on a video element the user has tapped once. Reusing the same element keeps sound working
// after every swipe. Cards show a still poster underneath while you are mid-swipe.
export default function Feed({ items, videoEl, format, setFormat, onWatched, saved, onToggleSave, needsTap, onUnlock, toast, onMore, onExitList }) {
  const feedRef = useRef(null)
  const [active, setActive] = useState(0)
  const [scrolling, setScrolling] = useState(false)
  const [time, setTime] = useState(0)
  const [paused, setPaused] = useState(false)
  const [sheet, setSheet] = useState(null) // 'format' | 'source' | null
  const [asked, setAsked] = useState({})   // quick questions already answered or skipped, by card key
  const [liked, setLiked] = useState({})
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

  const asking = !!(item?.question && !asked[item.key])
  const doneAsking = () => setAsked((a) => ({ ...a, [item.key]: true }))

  // Load and play the active card's video in the shared element.
  useEffect(() => {
    const v = videoEl.current
    if (!v) return
    if (item?.type === 'youtube') onWatched(item.embed.id)
    if (!item || item.type !== 'video') { v.pause(); return }
    const src = videoUrl(item.video.id)
    if (!v.src.endsWith(src)) { v.src = src; v.currentTime = 0 }
    setPaused(false)
    // Until the viewer has tapped once, play muted: the video still starts straight away.
    if (needsTap) v.muted = true
    if (format.mode === 'read' || format.mode === 'quiz' || asking) v.pause()
    else v.play().catch(() => {})
    onWatched(item.video.id)
  }, [active, item, format.mode, asking]) // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving a card counts as skipping its question, so it does not pop up again on the way back.
  const prevKey = useRef(null)
  useEffect(() => {
    const left = prevKey.current // read it now: the update below runs later, after prevKey has moved on
    if (left && left !== item?.key) setAsked((a) => ({ ...a, [left]: true }))
    prevKey.current = item?.key
  }, [item])

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
                question={i === active && asking ? it.question : null} onQuestionDone={doneAsking}
                paused={i === active && paused} onTap={togglePlay}
                liked={liked[it.key]} saved={saved.includes(it.video.id)}
                onLike={() => setLiked({ ...liked, [it.key]: !liked[it.key] })}
                onSave={() => onToggleSave(it.video.id)}
                onSource={() => setSheet('source')} onFormat={() => setSheet('format')}
                onShare={() => toast('Link copied')}
              />
            )}
            {it.type === 'youtube' && (
              <YouTubeCard embed={it.embed} isActive={i === active} isNear={Math.abs(i - active) <= 1} format={format} soundOk={!needsTap}
                question={i === active && asking ? it.question : null} onQuestionDone={doneAsking}
                liked={liked[it.key]} saved={saved.includes(it.embed.id)} onFormat={() => setSheet('format')}
                onLike={() => setLiked({ ...liked, [it.key]: !liked[it.key] })}
                onSave={() => onToggleSave(it.embed.id)}
                onSource={() => setSheet('source')} onShare={() => toast('Link copied')} />
            )}
            {it.type === 'end' && <div className="card-ui" style={{ pointerEvents: 'auto' }}><EndCard end={it.end} onMore={onMore} onExitList={onExitList} onBack={() => feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} /></div>}
          </section>
        ))}
      </div>
      {needsTap && item?.type === 'video' && format.sound && <span className="muted-badge" aria-label="Muted, tap for sound"><VolumeX size={18} /></span>}
      {sheet === 'format' && <FormatSheet format={format} setFormat={setFormat} hasTranscript={item?.type !== 'youtube'} onClose={() => setSheet(null)} />}
      {sheet === 'source' && item?.type === 'video' && <SourceSheet video={item.video} onClose={() => setSheet(null)} />}
      {sheet === 'source' && item?.type === 'youtube' && <SourceSheet video={item.embed} onClose={() => setSheet(null)} />}
    </>
  )
}

function VideoCard({ video, isActive, format, time, paused, onTap, liked, saved, onLike, onSave, onSource, onFormat, onShare, question, onQuestionDone }) {
  const c = creators[video.creator]
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
      {format.mode === 'quiz' && isActive && <QuizPanel key={video.id} id={video.id} title={video.title} />}
      {format.mode === 'read' && isActive && (
        <div className="read">
          <h2>{video.title}</h2>
          <div className="by">{c.name} · {c.field}</div>
          <p>{video.words.words.map((w) => w.w).join(' ').replace(/ -/g, '-').replace(/ ,/g, ',')}</p>
          <div className="cite"><b>Source.</b> {video.source.citation}</div>
        </div>
      )}
      <div className={`card-ui ${format.mode === 'read' || format.mode === 'quiz' ? 'passive' : ''}`} onClick={format.mode === 'read' || format.mode === 'quiz' ? undefined : onTap}>
        {format.mode !== 'read' && format.mode !== 'quiz' && <><div className="shade-top" /><div className="shade" /></>}
        {isActive && format.mode === 'video' && format.captions && <Captions words={video.words.words} time={time} />}
        {paused && !question && <Pause className="paused-icon" size={64} fill="#fff" />}
        {question && <QuickQuestion q={question} onDone={onQuestionDone} />}
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
          {format.mode !== 'read' && format.mode !== 'quiz' && <><p className="title">{video.title}</p><p className="cap">{video.caption}</p></>}
        </div>
      </div>
    </>
  )
}

// A Short from an established creator, in YouTube's embedded player (nothing is copied).
// Phones stop embedded players from starting or unmuting by themselves, so Wake does not guess:
// it asks the player for its real state over the IFrame API's message channel, and keeps its own
// cover (the Short's still) over the player until the video is really playing. That hides
// YouTube's loading spinner and its play and pause buttons, so only Wake's controls ever show.
// The Shorts just above and below the current card load in the background, so swiping onto one
// starts it almost at once. It plays muted until a tap turns the sound on.
const ytSound = { on: false } // remembered across Shorts once the viewer has turned sound on
function YouTubeCard({ embed: e, isActive, isNear, format, soundOk, liked, saved, onLike, onSave, onSource, onFormat, onShare, question, onQuestionDone }) {
  const c = creators[e.creator]
  const frame = useRef(null)
  const autoUnmute = useRef(false)
  const [state, setState] = useState(-1)   // -1 not started, 0 ended, 1 playing, 2 paused, 3 loading, 5 ready
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(true)
  const [userPaused, setUserPaused] = useState(false)
  const quiz = format.mode === 'quiz' || !!question   // hold the Short while a question is open
  const send = (func, args = []) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  const start = () => {
    send('mute'); send('playVideo')
    if ((ytSound.on || soundOk) && format.sound) { autoUnmute.current = true; setTimeout(() => send('unMute'), 300) }
  }

  // The player's own reports: its state and whether it is muted.
  useEffect(() => {
    if (!isNear) return
    const onMsg = (m) => {
      if (m.source !== frame.current?.contentWindow) return
      heard.current = true
      let d
      try { d = JSON.parse(m.data) } catch { return }
      const st = d.event === 'onStateChange' ? d.info : d.event === 'infoDelivery' ? d.info?.playerState : undefined
      if (typeof st === 'number') setState(st)
      if (d.event === 'infoDelivery' && typeof d.info?.muted === 'boolean') setMuted(d.info.muted)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [isNear])

  useEffect(() => { if (state === 1) setStarted(true) }, [state])
  // If the phone refused an automatic unmute it pauses the video: fall back to playing muted.
  useEffect(() => {
    if (state === 2 && autoUnmute.current && !userPaused) { autoUnmute.current = false; send('mute'); send('playVideo') }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps
  // Start when the card arrives; stop and rewind when it leaves or a quiz opens.
  useEffect(() => {
    if (isActive && !quiz && !userPaused) start()
    else send('pauseVideo')
    if (!isActive) { setUserPaused(false); setStarted(false); send('seekTo', [0, true]) }
  }, [isActive, quiz]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep saying hello until the player answers: a single hello can arrive before the player is
  // ready (more likely on a slow phone), and then it would never report and never start.
  const heard = useRef(false)
  const onLoad = () => {
    heard.current = false
    let tries = 0
    const hello = setInterval(() => {
      if (heard.current || tries++ > 30 || !frame.current) { clearInterval(hello); return }
      frame.current.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: e.id, channel: 'widget' }), '*')
      if (isActiveRef.current && !quiz) start()
    }, 400)
  }
  const isActiveRef = useRef(isActive)
  isActiveRef.current = isActive
  // Safety net: if the player has not reported playing 4 s after the card arrives, lift the cover
  // anyway so the viewer is never stuck looking at a still.
  useEffect(() => {
    if (!isActive || quiz) return
    const t = setTimeout(() => setStarted(true), 4000)
    return () => clearTimeout(t)
  }, [isActive, quiz])
  const onTap = () => {
    autoUnmute.current = false
    if (state !== 1) { setUserPaused(false); send('playVideo'); if (format.sound) { send('unMute'); ytSound.on = true } return }
    if (muted && format.sound) { send('unMute'); ytSound.on = true; return }
    send('pauseVideo'); setUserPaused(true)
  }
  const src = `https://www.youtube-nocookie.com/embed/${e.yt}?autoplay=0&mute=1&controls=0&playsinline=1&rel=0&loop=1&playlist=${e.yt}&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&origin=${encodeURIComponent(window.location.origin)}`
  const still = `https://i.ytimg.com/vi/${e.yt}/oar2.jpg`
  const covered = !started || (state !== 1 && state !== 3 && state !== -1 && heard.current)
  return (
    <>
      <img className="poster yt-poster" src={still} alt="" />
      {isNear && <iframe ref={frame} className="yt-frame" src={src} title={e.title} onLoad={onLoad} allow="autoplay; encrypted-media" />}
      <img className={`yt-cover ${covered ? '' : 'off'}`} src={still} alt="" />
      {quiz && isActive && <QuizPanel key={e.id} id={e.id} title={e.title} />}
      <div className={`card-ui ${quiz ? 'passive' : ''}`} onClick={quiz ? undefined : onTap}>
        {!quiz && <><div className="shade-top" /><div className="shade" /></>}
        {userPaused && !quiz && <Pause className="paused-icon" size={64} fill="#fff" />}
        {question && <QuickQuestion q={question} onDone={onQuestionDone} />}
        {isActive && !started && !userPaused && !quiz && <span className="yt-wait" aria-label="Loading" />}
        {isActive && state === 1 && muted && !quiz && format.sound && <span className="muted-badge" aria-label="Muted, tap for sound"><VolumeX size={18} /></span>}
        <div className="rail" onClick={(ev) => ev.stopPropagation()}>
          <button aria-label={`${c.name}'s profile`}><div className="avatar" style={{ background: `hsl(${c.hue} 70% 45%)` }}>{c.initials}</div></button>
          <button className={liked ? 'liked' : ''} onClick={onLike} aria-pressed={!!liked}><Heart size={32} />{e.likes}</button>
          <button className={saved ? 'saved' : ''} onClick={onSave} aria-pressed={!!saved}><Bookmark size={30} />{e.saves}</button>
          <button className="source-btn" onClick={onSource}><BookOpen size={22} />Source</button>
          <button onClick={onFormat} aria-label="View options"><Ellipsis size={30} />View</button>
          <button onClick={onShare}><Share2 size={28} />Share</button>
        </div>
        <div className="info" onClick={(ev) => ev.stopPropagation()}>
          <div className="handle">@{c.handle}<BadgeCheck size={18} aria-label="Verified creator" /></div>
          <div className="field">{c.field} · demo creator</div>
          {!quiz && <><p className="title">{e.title}</p><p className="cap">{e.caption}</p></>}
        </div>
      </div>
    </>
  )
}

// "Quiz" in the View sheet: three quick questions on this video, one at a time, with the answer
// shown straight away. Testing yourself right after watching is what makes it stick.
function QuizPanel({ id, title }) {
  const qs = quizzes[id] || []
  const [n, setN] = useState(0)
  const [pick, setPick] = useState(null)
  const [score, setScore] = useState(0)
  const done = n >= qs.length
  const q = qs[n]
  const choose = (i) => { if (pick !== null) return; setPick(i); if (i === q.answer) setScore(score + 1) }
  return (
    <div className="read quiz" onClick={(ev) => ev.stopPropagation()}>
      <div className="by">Quiz · {title}</div>
      {done ? <>
        <h2>{score} of {qs.length} right</h2>
        <p>{score === qs.length ? 'Perfect. That one is staying with you.' : 'Nice. The ones you missed are the ones you will now remember best.'}</p>
        <button className="btn" onClick={() => { setN(0); setPick(null); setScore(0) }}>Try again</button>
      </> : <>
        <div className="step-dots">{qs.map((_, i) => <i key={i} className={i <= n ? 'on' : ''} />)}</div>
        <h2>{q.q}</h2>
        {q.options.map((o, i) => (
          <button key={o} className={`answer ${pick === null ? '' : i === q.answer ? 'right' : pick === i ? 'wrong' : ''}`} onClick={() => choose(i)}>
            {o}{pick !== null && i === q.answer && <Check size={18} style={{ float: 'right' }} />}{pick === i && i !== q.answer && <X size={18} style={{ float: 'right' }} />}
          </button>
        ))}
        {pick !== null && <button className="btn" style={{ marginTop: 10 }} onClick={() => { setN(n + 1); setPick(null) }}>{n + 1 < qs.length ? 'Next question' : 'See my score'}</button>}
      </>}
    </div>
  )
}

// A quick question on the video you just watched, as a glass panel over the start of the next
// one. The video waits underneath. Answer with one tap (it closes itself), tap Skip, or just
// swipe on: the panel sits inside the card, so swiping works exactly as on any video.
function QuickQuestion({ q: { id, title }, onDone }) {
  const q = quizzes[id]?.[0]
  const [pick, setPick] = useState(null)
  if (!q) return null
  const choose = (i) => { if (pick !== null) return; setPick(i); setTimeout(onDone, 1400) }
  return (
    <div className="qpanel" onClick={(ev) => ev.stopPropagation()}>
      <div className="qhead"><Sparkles size={18} />Quick question</div>
      <p className="qtext">{q.q}</p>
      <div className="qfrom">From “{title}”</div>
      {q.options.map((o, i) => (
        <button key={o} className={`answer ${pick === null ? '' : i === q.answer ? 'right' : pick === i ? 'wrong' : ''}`} onClick={() => choose(i)}>{o}</button>
      ))}
      <div className="qfoot">{pick === null ? <button className="link-btn" onClick={onDone}>Skip</button> : <span>{pick === q.answer ? 'Locked in.' : 'Now you will remember it.'}</span>}</div>
    </div>
  )
}

function EndCard({ end, onMore, onExitList, onBack }) {
  if (end?.kind === 'list') return (
    <div className="end-card">
      <Check size={44} color="var(--ok)" />
      <h2>End of {end.title || 'this list'}</h2>
      <button className="btn" style={{ marginTop: 10, maxWidth: 280 }} onClick={onExitList}>Back to For you</button>
    </div>
  )
  // The end of the day: the feed stops here instead of scrolling forever.
  return (
    <div className="end-card">
      <Sun size={52} color="var(--sun)" />
      <h2>Done for today.</h2>
      <p>New lessons tomorrow, with one question on what you learned today.</p>
      <p className="big">Tell someone one thing you learned today.</p>
      <button className="btn ghost" style={{ marginTop: 14 }} onClick={onBack}>Rewatch today’s videos</button>
      <button className="link-btn" onClick={onMore}>Demo: start a new day</button>
    </div>
  )
}
