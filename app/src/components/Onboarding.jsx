import { useState } from 'react'
import { Minus, Plus, ShieldCheck, Users, GraduationCap, Compass, Loader2, CheckCircle2 } from 'lucide-react'
import Logo from './Logo'
import { tierFor } from '../data/videos'

const TOPICS = ['History', 'Space', 'The brain', 'Biology', 'Psychology', 'Maths', 'Art', 'Climate', 'Philosophy']

// Sign-up in four short steps: age (which decides the feed tier), age check, role, interests.
// The last button is a real tap, which is what lets the phone play sound from then on.
export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [age, setAge] = useState(17)
  const [check, setCheck] = useState('idle') // idle | working | done | skipped
  const [role, setRole] = useState('learner')
  const [topics, setTopics] = useState(['History', 'Space', 'The brain'])
  const tier = tierFor(age)
  const needsAdult = age < 15
  const needsEuApp = age >= 18

  const runCheck = () => { setCheck('working'); setTimeout(() => setCheck('done'), 1600) }
  const finish = () => onDone({ age, tier: needsEuApp && check !== 'done' ? tierFor(17) : tier, verified18: check === 'done' && needsEuApp, role, topics })

  if (step === 0) return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'radial-gradient(90% 55% at 50% 100%, #4a3a12, var(--night) 70%)' }}>
      <Logo size={56} />
      <h1 style={{ fontSize: 44, marginTop: 28 }}>The scroll that leaves you smarter.</h1>
      <p className="lead">Short videos made from real research and real books, by the people who wrote them.</p>
      <div className="bottom-cta"><button className="btn" onClick={() => setStep(1)}>Get started</button></div>
    </div>
  )

  return (
    <div className="screen">
      <div className="step-dots">{[1, 2, 3, 4].map((s) => <i key={s} className={s <= step ? 'on' : ''} />)}</div>

      {step === 1 && <>
        <h1>How old are you?</h1>
        <p className="lead">Your age decides what Wake shows you. Nothing explicit appears for anyone under 18.</p>
        <div className="age">
          <button onClick={() => setAge(Math.max(8, age - 1))} aria-label="Younger"><Minus /></button>
          <output aria-live="polite">{age}</output>
          <button onClick={() => setAge(Math.min(99, age + 1))} aria-label="Older"><Plus /></button>
        </div>
        <div className="panel"><b style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{tier.label}</b><p style={{ margin: '6px 0 0', color: 'var(--haze)', lineHeight: 1.45 }}>{tier.note}</p></div>
        <p style={{ fontSize: 13, color: 'var(--haze)' }}>Age groups follow the EU KIDS Act proposal (European Commission, September 2026).</p>
        <div className="bottom-cta"><button className="btn" onClick={() => setStep(2)}>Continue</button></div>
      </>}

      {step === 2 && <>
        {needsEuApp ? <>
          <h1>Confirm you are 18+</h1>
          <p className="lead">Use the EU age verification app. It tells Wake one thing, “over 18: yes”. Wake never sees your ID, name or birthday.</p>
          <div className="panel" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {check === 'done' ? <CheckCircle2 size={40} color="var(--ok)" /> : check === 'working' ? <Loader2 size={40} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={40} color="var(--sun)" />}
            <div>{check === 'done' ? <b className="check">Verified: over 18</b> : check === 'working' ? 'Waiting for the EU age app…' : 'Privacy-preserving age check'}
              <div style={{ fontSize: 13, color: 'var(--haze)' }}>Nothing is stored except the yes.</div></div>
          </div>
          <div className="bottom-cta">
            {check === 'done' ? <button className="btn" onClick={() => setStep(3)}>Continue</button> : <>
              <button className="btn" onClick={runCheck} disabled={check === 'working'}>Open EU age app</button>
              <button className="btn ghost" onClick={() => { setCheck('skipped'); setStep(3) }}>Not now (use the under-18 feed)</button></>}
          </div>
        </> : needsAdult ? <>
          <h1>Ask a parent to join you</h1>
          <p className="lead">Under 15, a parent or guardian sets up and manages your account. {age < 13 ? 'Under 13, you watch a hand-picked family list.' : 'You get up to one hour a day.'}</p>
          <div className="panel" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {check === 'done' ? <CheckCircle2 size={40} color="var(--ok)" /> : <Users size={40} color="var(--sun)" />}
            <div>{check === 'done' ? <b className="check">Parent approved</b> : 'We send your parent a link to approve.'}</div>
          </div>
          <div className="bottom-cta">{check === 'done' ? <button className="btn" onClick={() => setStep(3)}>Continue</button>
            : <button className="btn" onClick={runCheck} disabled={check === 'working'}>{check === 'working' ? 'Waiting for parent…' : 'Send to my parent'}</button>}</div>
        </> : <>
          <h1>Your teen account</h1>
          <p className="lead">Private by default. No messages from strangers. No targeted ads. Break reminders are on.</p>
          <div className="panel"><b className="check"><CheckCircle2 />Teen protections on</b></div>
          <div className="bottom-cta"><button className="btn" onClick={() => setStep(3)}>Continue</button></div>
        </>}
      </>}

      {step === 3 && <>
        <h1>What brings you here?</h1>
        <p className="lead">You can change this later.</p>
        {[
          { id: 'learner', icon: Compass, t: 'I want to learn', d: 'Watch, read or listen to lessons built on real sources.' },
          { id: 'educator', icon: GraduationCap, t: 'I teach or research', d: 'Share your work as videos, yourself or with the Wake Studio.' },
        ].map(({ id, icon: Icon, t, d }) => (
          <button key={id} className={`option ${role === id ? 'on' : ''}`} onClick={() => setRole(id)}>
            <span className="ic"><Icon /></span><span><b>{t}</b><span>{d}</span></span>
          </button>
        ))}
        <div className="bottom-cta"><button className="btn" onClick={() => setStep(4)}>Continue</button></div>
      </>}

      {step === 4 && <>
        <h1>Pick what you are curious about</h1>
        <p className="lead">This is the only thing your feed starts from. We show you why each video appears.</p>
        <div className="chips">
          {TOPICS.map((t) => <button key={t} className={`chip ${topics.includes(t) ? 'on' : ''}`}
            onClick={() => setTopics(topics.includes(t) ? topics.filter((x) => x !== t) : [...topics, t])}>{t}</button>)}
        </div>
        <div className="bottom-cta"><button className="btn" onClick={finish} disabled={!topics.length}>Start watching</button></div>
      </>}
    </div>
  )
}
