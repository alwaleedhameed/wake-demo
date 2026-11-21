#!/usr/bin/env bash
# Build the 30 s Wake promo.
#   1. Render the motion graphics (promo.html) to promo-graphics.mp4.
#   2. Lay the team's clips over the two marked slots:
#        clips/clip1.mp4  shown from 6.0 to 11.0 s  (classroom scene)
#        clips/clip2.mp4  shown from 22.0 to 26.0 s (reacting to Wake on a phone)
#      Missing clips are skipped, so the marked slate shows instead.
#   3. Optional audio: audio/voice.mp3 (team voiceover) and audio/music.mp3, mixed with music 12 dB under the voice.
# Usage: ./assemble.sh            (re-renders graphics only if promo-graphics.mp4 is missing)
#        ./assemble.sh --render   (always re-render the graphics)
set -euo pipefail
cd "$(dirname "$0")"
if [[ "${1:-}" == "--render" || ! -f promo-graphics.mp4 ]]; then
  frames=/tmp/wake-promo-frames; rm -rf "$frames"
  (cd ~/programming/reels && node tools/render_frames.mjs "$OLDPWD/promo.html" "$frames" 30 30 1920 1080)
  ffmpeg -y -loglevel error -framerate 30 -i "$frames/f%06d.jpg" -c:v libx264 -crf 18 -pix_fmt yuv420p promo-graphics.mp4
  rm -rf "$frames"
fi

inputs=(-i promo-graphics.mp4); filter="[0:v]null[v0]"; last=v0; n=1
add_clip() { # file start end
  [[ -f "$1" ]] || { echo "skip: $1 not found"; return; }
  local dur; dur=$(python3 -c "print($3-$2)")
  inputs+=(-i "$1")
  # Fill the 16:9 frame (crop, never squash), trim to the slot length, shift it to the slot start.
  filter+=";[$n:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,trim=0:$dur,setpts=PTS-STARTPTS+$2/TB[c$n]"
  filter+=";[$last][c$n]overlay=enable='between(t,$2,$3)':eof_action=pass[v$n]"
  last="v$n"; n=$((n+1))
}
add_clip clips/clip1.mp4 6 11
add_clip clips/clip2.mp4 22 26

audio_map=(); audio_filter=""
if [[ -f audio/voice.mp3 && -f audio/music.mp3 ]]; then
  inputs+=(-i audio/voice.mp3 -i audio/music.mp3)
  audio_filter=";[$n:a]volume=1.0[va];[$((n+1)):a]volume=-12dB[ma];[va][ma]amix=inputs=2:duration=longest,loudnorm=I=-14[aout]"
  audio_map=(-map "[aout]")
elif [[ -f audio/voice.mp3 || -f audio/music.mp3 ]]; then
  f=$(ls audio/voice.mp3 audio/music.mp3 2>/dev/null | head -1)
  inputs+=(-i "$f"); audio_filter=";[$n:a]loudnorm=I=-14[aout]"; audio_map=(-map "[aout]")
fi

ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$filter$audio_filter" -map "[$last]" "${audio_map[@]}" \
  -t 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart wake-promo.mp4
echo "done: promo/wake-promo.mp4"
