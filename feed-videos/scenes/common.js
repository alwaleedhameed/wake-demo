// Shared helpers for the Wake demo feed videos.
// Each scene page loads ../words/<name>.js (sets window.WORDS from the voiceover's word timings)
// and defines draw(t). The renderer calls window.seek(t) once per frame, so every frame is exact.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);              // fast in, soft landing
const easeIO = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const prog = (t, start, dur) => clamp((t - start) / dur);       // 0 before start, 1 after start+dur
const lerp = (a, b, k) => a + (b - a) * k;

// Time (s) when the nth occurrence of a spoken word starts. Matching ignores case and punctuation,
// so at("gears") finds "gears," too. Falls back to 0 so a typo never crashes a render.
function at(word, n = 1) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = clean(word);
  let seen = 0;
  for (const w of window.WORDS.words) {
    if (clean(w.w) === target && ++seen === n) return w.start;
  }
  console.warn("word not found:", word);
  return 0;
}

// Show an element between two times with a fade/slide in and a quick fade out.
function show(el, t, start, end, { dy = 40, scale = 1, inDur = 0.35, outDur = 0.25 } = {}) {
  const kIn = ease(prog(t, start, inDur));
  const kOut = 1 - prog(t, end - outDur, outDur);
  const k = Math.min(kIn, kOut);
  el.style.opacity = k;
  el.style.transform = `translateY(${(1 - kIn) * dy}px) scale(${lerp(scale, 1, kIn)})`;
}

// Deterministic pseudo-random numbers, so particles sit in the same place on every frame.
function rand(seed) { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }

window.seek = (t) => draw(t);
