// The demo feed. Every video points at a real, checkable source: that is Wake's core promise.
// Creators are fictional demo accounts (marked as such in the UI), so no real person is impersonated.
// `words` holds the voiceover's word timings; captions and the Read view are built from them.
import antikythera from './words/antikythera.words.json'
import forgetting from './words/forgetting.words.json'
import tardigrade from './words/tardigrade.words.json'
import earthrise from './words/earthrise.words.json'
import gage from './words/gage.words.json'
import chills from './words/chills.words.json'
import octopus from './words/octopus.words.json'
import tickle from './words/tickle.words.json'

export const creators = {
  markou: { name: 'Dr. Eleni Markou', handle: 'eleni.markou', field: 'Classical archaeology', route: 'studio', initials: 'EM', hue: 38 },
  wolff: { name: 'Prof. Jonas Wolff', handle: 'prof.wolff', field: 'Cognitive psychology', route: 'self', initials: 'JW', hue: 228 },
  okafor: { name: 'Dr. Ada Okafor', handle: 'ada.okafor', field: 'Astrobiology', route: 'self', initials: 'AO', hue: 300 },
  laine: { name: 'Dr. Mira Laine', handle: 'mira.laine', field: 'History of science', route: 'studio', initials: 'ML', hue: 200 },
  lind: { name: 'Dr. Nora Lind', handle: 'nora.lind', field: 'Marine biology', route: 'studio', initials: 'NL', hue: 170 },
  chen: { name: 'Dr. Lucas Chen', handle: 'lucas.neuro', field: 'Neuroscience', route: 'studio', initials: 'LC', hue: 12 },
  // A Wake Studio cartoon channel: animated lessons in one recurring classroom, with its own intro.
  ada: { name: 'Ms. Ada’s Class', handle: 'msadasclass', field: 'Wake Studio animated class', route: 'studio', initials: 'MA', hue: 45 },
  // Established creators: they already know how to make videos, so they skip the course and the
  // studio and post directly. Their videos still pass Wake's source check.
  sharpe: { name: 'Doug Sharpe', handle: 'dougsharpe', field: 'Science communicator', route: 'established', initials: 'DS', hue: 25 },
  veritasium: { name: 'Veritasium', handle: 'veritasium', field: 'Physics and engineering', route: 'established', initials: 'VE', hue: 210 },
  kurzgesagt: { name: 'Kurzgesagt', handle: 'kurzgesagt', field: 'Animated science', route: 'established', initials: 'KZ', hue: 265 },
  besmart: { name: 'Be Smart', handle: 'besmart', field: 'Biology and big questions', route: 'established', initials: 'BS', hue: 150 },
  minutephysics: { name: 'MinutePhysics', handle: 'minutephysics', field: 'Physics', route: 'established', initials: 'MP', hue: 190 },
}

export const series = {
  ancient: { title: 'Machines of the ancient world', creator: 'markou' },
  memory: { title: 'How memory really works', creator: 'wolff' },
  space: { title: 'Life beyond the sky', creator: 'okafor' },
  myths: { title: 'Brain myths, corrected', creator: 'chen' },
  animals: { title: 'Animal minds', creator: 'lind' },
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
    id: 'octopus', creator: 'lind', series: 'animals', minAge: 0, words: octopus,
    title: 'Where does an octopus think?',
    caption: 'Two thirds of its neurons are not in its head. Class is in session.',
    likes: '301K', saves: '44.8K',
    source: {
      kind: 'Peer-reviewed review',
      citation: 'Hochner, B. (2012). An embodied view of octopus neurobiology. Current Biology, 22(20), R887-R892.',
      doi: '10.1016/j.cub.2012.09.001',
      media: 'Animation made by Wake Studio with AI video tools (Kling 2.5), checked against the source.',
    },
    quiz: { q: 'Where are most of an octopus’s neurons?', options: ['In its head', 'In its arms', 'In its eyes'], answer: 1 },
  },
  {
    id: 'tickle', creator: 'ada', series: 'myths', topic: 'The brain', minAge: 0, words: tickle,
    title: 'Why can’t you tickle yourself?',
    caption: 'Try it right now. Then find out why nothing happens.',
    likes: '512K', saves: '61.2K',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Blakemore, S.-J., Wolpert, D. M., & Frith, C. D. (1998). Central cancellation of self-produced tickle sensation. Nature Neuroscience, 1(7), 635-640.',
      doi: '10.1038/2870',
      media: 'Animation made by Wake Studio with AI video tools (Kling 2.5), checked against the source.',
    },
    quiz: { q: 'Why can’t you tickle yourself?', options: ['Your skin is used to your hands', 'Your brain predicts the touch and turns it down', 'Tickling only works on the feet'], answer: 1 },
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

// Real Shorts by well-known science creators, standing in for what established creators would
// post on Wake. They play through YouTube's embedded player (the licensed way to show someone
// else's video; nothing is copied), styled to look like any other Wake video. Each is paired with
// the paper behind its claim. All three citations were checked on Crossref.
export const embeds = [
  {
    id: 'kansas', yt: 'o8m1-f_vn00', creator: 'sharpe', topic: 'Maths', likes: '412K', saves: '51.3K',
    title: 'Kansas is flatter than a pancake',
    caption: 'Geographers measured it. Then they measured a pancake.',
    source: {
      kind: 'Published paper',
      citation: 'Fonstad, M., Reichart, W., & Sudbury, D. (2003). Kansas is flatter than a pancake. Annals of Improbable Research, 9(3), 16-18.',
      doi: '10.3142/107951403782200100',
    },
  },
  {
    id: 'fat', yt: '6U6Z6pb6ewI', creator: 'veritasium', topic: 'Biology', likes: '1.2M', saves: '96K',
    title: 'Where does fat go when you lose weight?',
    caption: 'Most of it leaves through your breath.',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Meerman, R., & Brown, A. J. (2014). When somebody loses weight, where does the fat go? BMJ, 349, g7257.',
      doi: '10.1136/bmj.g7257',
    },
  },
  {
    id: 'liver', yt: 'oNTaHYXQ4MM', creator: 'kurzgesagt', topic: 'Biology', likes: '688K', saves: '73.4K',
    title: 'The organ that grows back',
    caption: 'Lose part of your liver and it rebuilds itself.',
    source: {
      kind: 'Peer-reviewed review',
      citation: 'Michalopoulos, G. K. (2007). Liver regeneration. Journal of Cellular Physiology, 213(2), 286-300.',
      doi: '10.1002/jcp.21172',
    },
  },
  {
    id: 'momcells', yt: 'fcjR9ORNtXc', creator: 'besmart', topic: 'Biology', likes: '934K', saves: '88.1K',
    title: 'Your mum’s cells are still inside you',
    caption: 'A few of her cells crossed over before you were born. Some never left.',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Maloney, S., Smith, A., Furst, D. E., et al. (1999). Microchimerism of maternal origin persists into adult life. Journal of Clinical Investigation, 104(1), 41-47.',
      doi: '10.1172/JCI6611',
    },
  },
  {
    id: 'babymemory', yt: 'bLX4CSzjRAg', creator: 'besmart', topic: 'Psychology', likes: '1.1M', saves: '102K',
    title: 'Why you can’t remember being a baby',
    caption: 'Your brain was too busy building itself.',
    source: {
      kind: 'Peer-reviewed review',
      citation: 'Josselyn, S. A., & Frankland, P. W. (2012). Infantile amnesia: A neurogenic hypothesis. Learning & Memory, 19(9), 423-433.',
      doi: '10.1101/lm.021311.110',
    },
  },
  {
    id: 'blink', yt: 'hf2b2EVa_F8', creator: 'besmart', topic: 'The brain', likes: '721K', saves: '64.9K',
    title: 'Do you go blind every time you blink?',
    caption: 'Kind of. Your brain just never tells you.',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Volkmann, F. C., Riggs, L. A., & Moore, R. K. (1980). Eyeblinks and visual suppression. Science, 207(4433), 900-902.',
      doi: '10.1126/science.7355270',
    },
  },
  {
    id: 'greenmammals', yt: '4NEdVmPFP7g', creator: 'besmart', topic: 'Biology', likes: '812K', saves: '70.2K',
    title: 'Why are there no green mammals?',
    caption: 'Birds, frogs, lizards, yes. Mammals, almost never.',
    source: {
      kind: 'Peer-reviewed review',
      citation: 'Caro, T., & Mallarino, R. (2020). Coloration in mammals. Trends in Ecology & Evolution, 35(4), 357-366.',
      doi: '10.1016/j.tree.2019.12.008',
    },
  },
  {
    id: 'test99', yt: '2QSkkhbl3v4', creator: 'veritasium', topic: 'Maths', likes: '1.4M', saves: '131K',
    title: 'Why a 99% accurate test can still be wrong',
    caption: 'A positive result is not the same as having the disease.',
    source: {
      kind: 'Peer-reviewed review',
      citation: 'Gigerenzer, G., Gaissmaier, W., Kurz-Milcke, E., Schwartz, L. M., & Woloshin, S. (2007). Helping doctors and patients make sense of health statistics. Psychological Science in the Public Interest, 8(2), 53-96.',
      doi: '10.1111/j.1539-6053.2008.00033.x',
    },
  },
  {
    id: 'bones', yt: 'RQprZZJIb6Y', creator: 'kurzgesagt', topic: 'Biology', likes: '976K', saves: '84.4K',
    title: 'Your skeleton is electric',
    caption: 'Squeeze a bone and it makes a tiny voltage.',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Fukada, E., & Yasuda, I. (1957). On the piezoelectric effect of bone. Journal of the Physical Society of Japan, 12(10), 1158-1162.',
      doi: '10.1143/JPSJ.12.1158',
    },
  },
  {
    id: 'veins', yt: 'sj3Z999TJqM', creator: 'besmart', topic: 'Biology', likes: '655K', saves: '58.7K',
    title: 'Your blood is never blue',
    caption: 'So why do your veins look blue?',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Kienle, A., Lilge, L., Vitkin, I. A., Patterson, M. S., Wilson, B. C., Hibst, R., & Steiner, R. (1996). Why do veins appear blue? A new look at an old question. Applied Optics, 35(7), 1151-1160.',
      doi: '10.1364/AO.35.001151',
    },
  },
  {
    id: 'glow', yt: 'YBKuWCA5pug', creator: 'minutephysics', topic: 'Space', likes: '540K', saves: '47.5K',
    title: 'Why do hot things glow?',
    caption: 'Heat something enough and it starts making its own light.',
    source: {
      kind: 'Landmark paper',
      citation: 'Planck, M. (1901). Ueber das Gesetz der Energieverteilung im Normalspectrum. Annalen der Physik, 309(3), 553-563.',
      doi: '10.1002/andp.19013090310',
    },
  },
  {
    id: 'shrink', yt: '1oMfwA4cSLs', creator: 'besmart', topic: 'Biology', likes: '789K', saves: '69.9K',
    title: 'You shrink every day',
    caption: 'You are tallest when you wake up.',
    source: {
      kind: 'Peer-reviewed paper',
      citation: 'Reilly, T., Tyrrell, A., & Troup, J. D. G. (1984). Circadian variation in human stature. Chronobiology International, 1(2), 121-126.',
      doi: '10.3109/07420528409059129',
    },
  },
]

// The short quiz behind "Quiz" in the View sheet: three questions per video, taken from what the
// video says (or, for the Shorts, from the paper behind it). The first question of each Wake
// video is also the one the break card asks.
const Q = (q, options, answer) => ({ q, options, answer })
export const quizzes = {
  antikythera: [
    Q('What did the Antikythera mechanism predict?', ['Earthquakes', 'Eclipses', 'Harvests'], 1),
    Q('How did scientists finally see inside it?', ['X-ray scans', 'Melting it down', 'Breaking it open'], 0),
    Q('About how old is it?', ['About 200 years', 'About 500 years', 'More than 2,000 years'], 2),
  ],
  forgetting: [
    Q('What flattens the forgetting curve?', ['Re-reading once', 'Spaced reviews', 'Studying all night'], 1),
    Q('After one hour, how much did Ebbinghaus have to relearn?', ['Almost nothing', 'About a quarter', 'More than half'], 2),
    Q('What did the 2015 Amsterdam study find?', ['The same curve', 'No forgetting at all', 'The opposite curve'], 0),
  ],
  tardigrade: [
    Q('How did the tardigrades survive the trip?', ['In a dried-out state', 'Inside the capsule', 'Frozen in ice'], 0),
    Q('How big is a tardigrade?', ['About 5 centimetres', 'About half a millimetre', 'Too small for a microscope'], 1),
    Q('What happened when they got water back on Earth?', ['They dissolved', 'They grew bigger', 'They woke up, and some laid eggs that hatched'], 2),
  ],
  octopus: [
    Q('Where are most of an octopus’s neurons?', ['In its head', 'In its arms', 'In its eyes'], 1),
    Q('About how many neurons does an octopus have?', ['500 thousand', '500 million', '5 billion'], 1),
    Q('What can one arm do by itself?', ['Touch, taste and simple movements', 'Nothing without the brain', 'Only change colour'], 0),
  ],
  tickle: [
    Q('Why can’t you tickle yourself?', ['Your skin is used to your hands', 'Your brain predicts the touch and turns it down', 'Tickling only works on the feet'], 1),
    Q('What does a tickle need to work?', ['Surprise', 'A feather', 'Cold hands'], 0),
    Q('How did the 1998 study find this out?', ['By scanning brains during tickling', 'By asking people online', 'By testing on robots only'], 0),
  ],
  earthrise: [
    Q('What is the overview effect?', ['A camera trick', 'Awe from seeing Earth from space', 'Motion sickness in orbit'], 1),
    Q('Which mission first saw the Earth rise?', ['Apollo 8', 'Apollo 11', 'Sputnik 1'], 0),
    Q('What do astronauts say disappears when they look back?', ['The oceans', 'The clouds', 'The borders'], 2),
  ],
  gage: [
    Q('What did Gage do in Chile?', ['Taught medicine', 'Drove stagecoaches', 'Worked on railways'], 1),
    Q('What went through Gage’s skull?', ['An iron rod', 'An arrow', 'A train wheel'], 0),
    Q('What does his job in Chile suggest?', ['He never recovered', 'He may have recovered more than we were told', 'He lost his memory'], 1),
  ],
  chills: [
    Q('Music chills activate circuits linked to…', ['Reward', 'Balance', 'Vision only'], 0),
    Q('Where did the 2001 brain-scan study take place?', ['Tokyo', 'London', 'Montreal'], 2),
    Q('What else uses the same brain circuits?', ['Food and other things we love', 'Breathing', 'Sleep only'], 0),
  ],
  kansas: [
    Q('Which turned out flatter?', ['The pancake', 'Kansas', 'They tied exactly'], 1),
    Q('How did the researchers compare them?', ['By measuring the height changes across each surface', 'By asking pilots', 'By weighing them'], 0),
    Q('On their scale, what does a score of 1 mean?', ['Very hilly', 'Half flat', 'Perfectly flat'], 2),
  ],
  fat: [
    Q('Where does most of the fat you lose go?', ['Out as heat', 'Breathed out as carbon dioxide', 'Turned into muscle'], 1),
    Q('Roughly how much leaves through the lungs?', ['About 84%', 'About 10%', 'None of it'], 0),
    Q('How does the rest leave the body?', ['As water', 'As heat', 'Through hair'], 0),
  ],
  liver: [
    Q('Which organ can grow back after part of it is removed?', ['The heart', 'The liver', 'The brain'], 1),
    Q('How does it grow back?', ['The remaining cells divide until it is full size', 'A new organ grows from scratch', 'Only with a transplant'], 0),
    Q('Why does this matter for medicine?', ['Livers can never fail', 'It makes livers immune to disease', 'A living person can donate part of their liver'], 2),
  ],
  momcells: [
    Q('What can still be found in many adults?', ['Their twin’s DNA', 'Living cells from their mother', 'Their baby teeth'], 1),
    Q('When do those cells cross over?', ['At age five', 'During pregnancy, across the placenta', 'Only when breastfeeding'], 1),
    Q('What is this called?', ['Mitosis', 'Mutation', 'Microchimerism'], 2),
  ],
  babymemory: [
    Q('What is it called when we cannot remember being a baby?', ['Déjà vu', 'Infantile amnesia', 'Baby brain'], 1),
    Q('What does the neurogenic hypothesis blame?', ['Babies not paying attention', 'Fast growth of new neurons in the memory centre', 'Too little sleep'], 1),
    Q('Which brain region is at the centre of it?', ['The cerebellum', 'The spinal cord', 'The hippocampus'], 2),
  ],
  blink: [
    Q('What happens to your vision during a blink?', ['The brain briefly turns it down', 'It gets sharper', 'Nothing at all'], 0),
    Q('Why don’t we notice the dark moments?', ['Blinks are too slow to matter', 'Our eyes stay open', 'The brain fills in the gap'], 2),
    Q('Is it only the eyelid blocking the light?', ['Blinks let all light through', 'Yes, only the eyelid', 'No, the brain suppresses vision too'], 2),
  ],
  greenmammals: [
    Q('Which pigment colours mammal fur?', ['Chlorophyll', 'Carotene', 'Melanin'], 2),
    Q('Why is green fur so rare?', ['Green is poisonous to mammals', 'Mammals are all colourblind', 'Mammals cannot make a green pigment'], 2),
    Q('Which mammal can look green?', ['Sloths, from algae growing in their fur', 'Squirrels', 'Tigers'], 0),
  ],
  test99: [
    Q('A 99% accurate test for a rare disease says positive. What is true?', ['You definitely have it', 'You have a 99% chance of having it', 'You may well not have it'], 2),
    Q('What else do you need to know?', ['The price of the test', 'The doctor’s age', 'How common the disease is'], 2),
    Q('What is this mistake called?', ['Ignoring the base rate', 'Survivor bias', 'The placebo effect'], 0),
  ],
  bones: [
    Q('What happens when bone is squeezed?', ['It glows', 'It gets colder', 'It makes a tiny electric charge'], 2),
    Q('What is this effect called?', ['Piezoelectricity', 'Static shock', 'Magnetism'], 0),
    Q('When was it first measured in bone?', ['1857', '1957', '2007'], 1),
  ],
  veins: [
    Q('What colour is the blood inside your veins?', ['Blue', 'Purple', 'Dark red'], 2),
    Q('Why do veins look blue through skin?', ['Veins are made of blue tissue', 'The way light travels through skin', 'Blood without oxygen is blue'], 1),
    Q('Darker red blood is blood that…', ['carries more oxygen', 'carries less oxygen', 'has no cells'], 1),
  ],
  glow: [
    Q('Why do very hot objects glow?', ['They reflect sunlight', 'They give off light because of their heat', 'They burn the air around them'], 1),
    Q('As something gets hotter, its glow…', ['gets dimmer', 'shifts from red towards white', 'turns green first'], 1),
    Q('Who explained this light in 1901?', ['Max Planck', 'Marie Curie', 'Isaac Newton'], 0),
  ],
  shrink: [
    Q('When are you tallest?', ['In the morning', 'After lunch', 'At night'], 0),
    Q('Why do you get shorter during the day?', ['The discs in your spine get squashed', 'Your bones shrink', 'Your muscles shrink'], 0),
    Q('Roughly how much height can you lose by evening?', ['About 1 to 2 cm', 'None at all', 'About 10 cm'], 0),
  ],
}

// Only Shorts confirmed to play inside Wake on an iPhone go in the feed (one per demo day, so
// Wake's own videos make up most of it). Veritasium's Shorts play on laptops but not inside other
// websites on iPhones, so they wait here, quizzes included, with the others.
export const featured = embeds.filter((e) => ['kansas'].includes(e.id))

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
