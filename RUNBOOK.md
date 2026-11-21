# Wake demo: runbook

Wake is a demo of a short-video learning app (YouthConnect "Media Literacy in the Age of AI", Nicosia, November 2026).
The demo has no backend: every screen and video works from static files.

## Open it on a phone (the main way to demo)
- Live link: https://alwaleedhameed.github.io/wake-demo/
- On the iPhone: open the link in Safari, tap Share, then "Add to Home Screen". It then opens full screen like a real app.
- To publish changes: `./deploy.sh` from the project root. It builds the app and pushes it to the `gh-pages` branch; the site updates about a minute later.

## Run it on the laptop
```bash
cd ~/programming/projects/youthConnectWake/app
npm install          # first time only
npm run dev          # http://localhost:5180 if started with --port 5180, otherwise http://localhost:5173
```
`npm run dev` also prints a Network address (for example `http://192.168.x.x:5173`). A phone on the same Wi-Fi can open that,
unless the venue Wi-Fi blocks devices from seeing each other. If it does, use the live link.

## Re-make a feed video
Each video is an HTML page (`feed-videos/scenes/<name>.html`) drawn frame by frame, plus an ElevenLabs voiceover
(`assets/audio/<name>.mp3`) and its word timings (`assets/audio/<name>.words.json`).
```bash
cd ~/programming/projects/youthConnectWake/feed-videos
./render.sh <name>                                   # about 1 minute; writes out/<name>.mp4 and out/<name>.jpg
cp out/<name>.mp4 out/<name>.jpg ../app/public/videos/
```
Needs the reels toolkit at `~/programming/reels` (puppeteer and Chrome) and ffmpeg.

## The logo
The team logo is a vector redraw at `app/public/wake-logo.svg` (copy in `promo/wake-logo.svg`); `Logo.jsx` shows it as an image.
The home screen icon is `app/public/icon.svg`. Regenerate `icon-180.png` with headless Chrome, not ImageMagick (it draws this SVG blank):
`google-chrome --headless --no-sandbox --hide-scrollbars --window-size=180,180 --screenshot=$PWD/app/public/icon-180.png file://$PWD/app/public/icon.svg`

## Common problems
| Symptom | Fix |
|---|---|
| Blank page on GitHub Pages | `base` in `app/vite.config.js` must be `/wake-demo/` (the repo name) |
| No sound on iPhone | Tap "Tap for sound" once. Check the ring/silent switch is not on silent |
| Videos slow on venue Wi-Fi | Open the app once before presenting so the videos are cached, or use mobile data |
| Laptop page blank, JS 404 | An old `vite preview` is still running with stale files: `pkill -f "vite preview"` and start again |
| Site not updating | Repo Settings, Pages, Source must be the `gh-pages` branch. Check `gh api repos/alwaleedhameed/wake-demo/pages/builds/latest` |
