// The demo feed. Every video points at a real, checkable source: that is Wake's core promise.
// Creators are fictional demo accounts (marked as such in the UI), so no real person is impersonated.
// `words` holds the voiceover's word timings; captions and the Read view are built from them.
import antikythera from './words/antikythera.words.json'
import forgetting from './words/forgetting.words.json'
import tardigrade from './words/tardigrade.words.json'
import earthrise from './words/earthrise.words.json'
import gage from './words/gage.words.json'
import chills from './words/chills.words.json'

export const creators = {
  markou: { name: 'Dr. Eleni Markou', handle: 'eleni.markou', field: 'Classical archaeology', route: 'studio', initials: 'EM', hue: 38 },
  wolff: { name: 'Prof. Jonas Wolff', handle: 'prof.wolff', field: 'Cognitive psychology', route: 'self', initials: 'JW', hue: 228 },
  okafor: { name: 'Dr. Ada Okafor', handle: 'ada.okafor', field: 'Astrobiology', route: 'self', initials: 'AO', hue: 300 },
  laine: { name: 'Dr. Mira Laine', handle: 'mira.laine', field: 'History of science', route: 'studio', initials: 'ML', hue: 200 },
  chen: { name: 'Dr. Lucas Chen', handle: 'lucas.neuro', field: 'Neuroscience', route: 'studio', initials: 'LC', hue: 12 },
}

export const series = {
  ancient: { title: 'Machines of the ancient world', creator: 'markou' },
  memory: { title: 'How memory really works', creator: 'wolff' },
  space: { title: 'Life beyond the sky', creator: 'okafor' },
  myths: { title: 'Brain myths, corrected', creator: 'chen' },
}

export const videos = [
  {
    id: 'antikythera', creator: 'markou', series: 'ancient', minAge: 0, words: antikythera,
    title: 'The 2,000-year-old computer',
    caption: 'Found by sponge divers. Decoded with X-rays. Built by Greeks.',
    likes: '48.2K', saves: '9.1K',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Freeth, T., Bitsakis, Y., Moussas, X., et al. (2006). Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism. Nature, 444, 587-591.',
      doi: '10.1038/nature05357',
      media: 'Photo: Antikythera mechanism, National Archaeological Museum, Athens. Marsyas, Wikimedia Commons (CC BY 2.5).',
    },
    quiz: { q: 'What did the Antikythera mechanism predict?', options: ['Earthquakes', 'Eclipses', 'Harvests'], answer: 1 },
  },
  {
    id: 'forgetting', creator: 'wolff', series: 'memory', minAge: 0, words: forgetting,
    title: 'Why you forget (and the fix)',
    caption: 'A 140-year-old experiment, replicated in 2015. Your study plan should know this.',
    likes: '112K', saves: '61.4K',
    source: {
      kind: 'Peer-reviewed replication',
      citation: 'Murre, J. M. J., & Dros, J. (2015). Replication and analysis of Ebbinghaus’ forgetting curve. PLOS ONE, 10(7), e0120644.',
      doi: '10.1371/journal.pone.0120644',
      media: 'Original study: Ebbinghaus, H. (1885). Über das Gedächtnis.',
    },
    quiz: { q: 'What flattens the forgetting curve?', options: ['Re-reading once', 'Spaced reviews', 'Studying all night'], answer: 1 },
  },
  {
    id: 'tardigrade', creator: 'okafor', series: 'space', minAge: 0, words: tardigrade,
    title: 'The animal that survived space',
    caption: 'No suit. No ship. Just vibes and cryptobiosis.',
    likes: '230K', saves: '18.7K',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Jönsson, K. I., Rabbow, E., Schill, R. O., Harms-Ringdahl, M., & Rettberg, P. (2008). Tardigrades survive exposure to space in low Earth orbit. Current Biology, 18, R729-R731.',
      media: 'Image: SEM of Milnesium tardigradum, Schokraie et al. (2012), PLOS ONE (CC BY 2.5).',
    },
    quiz: { q: 'How did the tardigrades survive the trip?', options: ['In a dried-out state', 'Inside the capsule', 'Frozen in ice'], answer: 0 },
  },
  {
    id: 'earthrise', creator: 'okafor', series: 'space', minAge: 0, words: earthrise,
    title: 'What astronauts feel looking back',
    caption: 'Christmas Eve, 1968. The photo that changed how we see home.',
    likes: '87.5K', saves: '22K',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Yaden, D. B., Iwry, J., Slack, K. J., et al. (2016). The overview effect: Awe and self-transcendent experience in space flight. Psychology of Consciousness: Theory, Research, and Practice, 3(1).',
      doi: '10.1037/cns0000086',
      media: 'Photo: “Earthrise”, Bill Anders, Apollo 8 (NASA, public domain).',
    },
    quiz: { q: 'What is the overview effect?', options: ['A camera trick', 'Awe from seeing Earth from space', 'Motion sickness in orbit'], answer: 1 },
  },
  {
    id: 'gage', creator: 'chen', series: 'myths', minAge: 13, words: gage,
    title: 'The textbook story is wrong',
    caption: 'An iron rod, a famous skull, and the part of the story most textbooks skip.',
    likes: '64.9K', saves: '15.3K',
    source: {
      kind: 'Peer-reviewed papers',
      citation: 'Macmillan, M., & Lena, M. L. (2010). Rehabilitating Phineas Gage. Neuropsychological Rehabilitation, 20(5), 641-658. Also: Damasio, H., et al. (1994). The return of Phineas Gage. Science, 264(5162), 1102-1105.',
      doi: '10.1080/09602011003760527',
      media: 'Daguerreotype of Phineas Gage, photo by Jack and Beverly Wilgus (CC BY-SA 3.0). Skull drawing: John M. Harlow, 1868 (public domain).',
    },
    quiz: { q: 'What did Gage do in Chile?', options: ['Taught medicine', 'Drove stagecoaches', 'Worked on railways'], answer: 1 },
  },
  {
    id: 'chills', creator: 'chen', series: 'myths', minAge: 0, words: chills,
    title: 'Why songs give you chills',
    caption: 'Your favourite song lights up the same circuits as food. Science says so.',
    likes: '156K', saves: '30.2K',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Blood, A. J., & Zatorre, R. J. (2001). Intensely pleasurable responses to music correlate with activity in brain regions implicated in reward and emotion. PNAS, 98(20), 11818-11823.',
      doi: '10.1073/pnas.191355898',
      media: 'Motion graphics by Wake Studio.',
    },
    quiz: { q: 'Music chills activate circuits linked to…', options: ['Reward', 'Balance', 'Vision only'], answer: 0 },
  },
]

// Which part of its series a video is, e.g. "Part 2 of 2".
export function seriesPosition(video) {
  const list = videos.filter((v) => v.series === video.series)
  return { index: list.indexOf(video) + 1, total: list.length }
}

// The age tiers follow the European Commission's KIDS Act proposal (Sept 2026).
export function tierFor(age) {
  if (age < 13) return { id: 'child', label: 'Under 13', note: 'A parent or guardian sets up a family account. Limited, hand-picked videos only.', limit: 30 }
  if (age < 15) return { id: 'young-teen', label: 'Ages 13 to 14', note: 'A parent manages your account. Up to one hour a day.', limit: 60 }
  if (age < 18) return { id: 'teen', label: 'Ages 15 to 17', note: 'Your own account with teen protections. Nothing explicit, ever.', limit: 90 }
  return { id: 'adult', label: '18 and over', note: 'Verify once with the EU age app to unlock the full library.', limit: 120 }
}
