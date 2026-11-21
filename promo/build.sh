#!/usr/bin/env bash
# Build the finished Wake promo (edit.html + narration + music + sound effects) -> wake-promo.mp4
#   ./build.sh            full render (about 3 to 5 minutes)
#   ./build.sh stills     one still per shot in stills/ for a quick check
# Clips from an iPhone are usually HEVC .MOV, which headless Chrome cannot decode. Convert first:
#   ./build.sh prep <file.MOV> <NN-name>     e.g. ./build.sh prep ~/Downloads/IMG_1234.MOV 01-teach
set -euo pipefail
cd "$(dirname "$0")"

if [[ "${1:-}" == "prep" ]]; then
  mkdir -p clips
  # 1080p H.264, a keyframe every 10 frames so seeking to any frame is fast and exact. Sound is dropped:
  # the promo uses the narration, music and effects instead.
  ffmpeg -y -loglevel error -i "$2" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" \
    -c:v libx264 -crf 18 -g 10 -pix_fmt yuv420p -an "clips/$3.mp4"
  echo "ready: clips/$3.mp4"; exit 0
fi

if [[ "${1:-}" == "stills" ]]; then
  rm -rf stills; mkdir -p stills
  node -e '
    const p = require(process.env.HOME + "/programming/reels/node_modules/puppeteer-core");
    (async () => {
      const b = await p.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--allow-file-access-from-files"] });
      const pg = await b.newPage(); await pg.setViewport({ width: 1920, height: 1080 });
      await pg.goto("file://" + process.cwd() + "/edit.html", { waitUntil: "networkidle0" });
      await pg.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 800));
      for (const t of [1.5, 3.9, 9.9, 12, 13.9, 17.8, 20.8, 23.5, 24.6, 25.3, 26.2, 28.5]) {
        await pg.evaluate((t) => window.seek(t), t);
        await pg.screenshot({ path: `stills/t${String(t).padStart(4, "0")}.jpg`, type: "jpeg", quality: 80 });
      }
      await b.close();
    })();'
  echo "stills in promo/stills/"; exit 0
fi

frames=/tmp/wake-edit-frames; rm -rf "$frames"
(cd ~/programming/reels && node tools/render_frames.mjs "$OLDPWD/edit.html" "$frames" 30 30 1920 1080)

# Sound: narration on top, music 14 dB under it, effects placed on the timeline (ms delays).
ffmpeg -y -loglevel error -framerate 30 -i "$frames/f%06d.jpg" \
  -i audio/voice.mp3 -i audio/music.mp3 -i sfx/ding.mp3 -i sfx/run.mp3 -i sfx/whoosh.mp3 -i sfx/whoosh.mp3 \
  -i sfx/pop.mp3 -i sfx/pop.mp3 -i sfx/pop.mp3 -i sfx/pop.mp3 -i sfx/pop.mp3 -i sfx/pop.mp3 \
  -filter_complex "\
[1:a]volume=1.0[v];[2:a]volume=-14dB,afade=t=out:st=28.5:d=1.5[m];\
[3:a]adelay=9750|9750,volume=-4dB[s1];[4:a]adelay=13450|13450[s2];[5:a]adelay=24150|24150,volume=-3dB[s3];[6:a]adelay=24950|24950,volume=-3dB[s4];\
[7:a]adelay=3350|3350,volume=-8dB[p1];[8:a]adelay=4550|4550,volume=-8dB[p2];[9:a]adelay=5750|5750,volume=-8dB[p3];\
[10:a]adelay=14900|14900,volume=-8dB[p4];[11:a]adelay=20600|20600,volume=-8dB[p5];[12:a]adelay=23300|23300,volume=-8dB[p6];\
[v][m][s1][s2][s3][s4][p1][p2][p3][p4][p5][p6]amix=inputs=12:duration=longest:normalize=0,loudnorm=I=-14[a]" \
  -map 0:v -map "[a]" -t 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart wake-promo.mp4
rm -rf "$frames"
echo "done: promo/wake-promo.mp4"
