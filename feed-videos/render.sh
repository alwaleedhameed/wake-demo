#!/usr/bin/env bash
# Render one demo feed video: HTML scene -> JPEG frames -> MP4 with the voiceover.
# Usage: ./render.sh <name> [seconds]   (seconds defaults to the voiceover length + 0.6 s tail)
# Output: out/<name>.mp4 (720x1280, H.264, faststart so phones can start playing before it finishes loading)
set -euo pipefail
cd "$(dirname "$0")"
name="$1"
audio="../assets/audio/$name.mp3"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$audio")
secs="${2:-$(python3 -c "print(round($dur + 0.6, 2))")}"
frames="/tmp/wake-frames-$name"
rm -rf "$frames"
# render_frames.mjs needs puppeteer from the reels toolkit, so run it from there.
(cd ~/programming/reels && node tools/render_frames.mjs "$OLDPWD/scenes/$name.html" "$frames" "$secs" 30 720 1280)
ffmpeg -y -loglevel error -framerate 30 -i "$frames/f%06d.jpg" -i "$audio" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -color_range tv \
  -c:a aac -b:a 128k -af "apad,loudnorm=I=-14" -t "$secs" -movflags +faststart "out/$name.mp4"
# Poster frame for the feed while the video loads.
ffmpeg -y -loglevel error -ss "$(python3 -c "print($secs*0.45)")" -i "out/$name.mp4" -frames:v 1 -q:v 4 "out/$name.jpg"
rm -rf "$frames"
echo "done: out/$name.mp4 ($(du -h "out/$name.mp4" | cut -f1))"
