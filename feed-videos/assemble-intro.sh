#!/usr/bin/env bash
# Like assemble-ai.sh, but opens with a channel intro sting and a chime, and starts the
# voiceover right after it.
# Usage: ./assemble-intro.sh <name> <intro.mp4> <clip1> <clip2> ...   (clips in story order)
# The clips are stretched evenly to fill the voiceover plus a 0.6 s tail.
# Output: out/<name>.mp4 and out/<name>.jpg (720x1280, like the other feed videos)
set -euo pipefail
cd "$(dirname "$0")"
name="$1"; intro="$2"; shift 2
audio="../assets/audio/$name.mp3"
idur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$intro")
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$audio")
body=$(python3 -c "print($dur + 0.6)")
total=$(python3 -c "print($idur + $body)")
delay=$(python3 -c "print(int($idur * 1000))")
n=$#
inputs=(-i "$intro"); filter="[0:v]scale=720:1280,fps=30,setsar=1[v0];"; i=1
for clip in "$@"; do
  len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$clip")
  factor=$(python3 -c "print(($body / $n) / $len)")   # > 1 slows a clip a little so they fill the narration
  inputs+=(-i "$clip")
  filter+="[$i:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setpts=$factor*PTS,fps=30,setsar=1[v$i];"
  i=$((i+1))
done
labels=$(for j in $(seq 0 $n); do printf "[v%s]" "$j"; done)
a=$((n+1)); c=$((n+2))
filter+="${labels}concat=n=$((n+1)):v=1:a=0[v];"
# Voice after the sting; a soft chime on the sting itself.
filter+="[$a:a]adelay=$delay|$delay,apad[vo];[$c:a]adelay=150|150,volume=-10dB[ch];[vo][ch]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14[au]"
ffmpeg -y -loglevel error "${inputs[@]}" -i "$audio" -i ../promo/sfx/ding.mp3 -filter_complex "$filter" -map "[v]" -map "[au]" \
  -t "$total" -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "out/$name.mp4"
ffmpeg -y -loglevel error -ss "$(python3 -c "print($total*0.45)")" -i "out/$name.mp4" -frames:v 1 -q:v 4 "out/$name.jpg"
echo "done: out/$name.mp4 ($(du -h "out/$name.mp4" | cut -f1), $(python3 -c "print(round($total,1))") s)"
