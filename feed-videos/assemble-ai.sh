#!/usr/bin/env bash
# Join AI-generated clips into one feed video, timed to its voiceover.
# Usage: ./assemble-ai.sh <name> <clip1> <clip2> ...   (clips in story order)
# Each clip is stretched evenly so the clips together last exactly as long as the voiceover plus a 0.6 s tail.
# Output: out/<name>.mp4 and out/<name>.jpg (720x1280, like the other feed videos)
set -euo pipefail
cd "$(dirname "$0")"
name="$1"; shift
audio="../assets/audio/$name.mp3"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$audio")
total=$(python3 -c "print($dur + 0.6)")
n=$#
inputs=(); filter=""; i=0
for clip in "$@"; do
  cd_len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$clip")
  # factor > 1 slows the clip down a little so the pieces fill the narration.
  factor=$(python3 -c "print(($total / $n) / $cd_len)")
  inputs+=(-i "$clip")
  filter+="[$i:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setpts=$factor*PTS,fps=30,setsar=1[v$i];"
  i=$((i+1))
done
labels=$(for j in $(seq 0 $((n-1))); do printf "[v%s]" "$j"; done)
filter+="${labels}concat=n=$n:v=1:a=0[v]"
ffmpeg -y -loglevel error "${inputs[@]}" -i "$audio" -filter_complex "$filter" -map "[v]" -map "$n:a" \
  -af "apad,loudnorm=I=-14" -t "$total" -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "out/$name.mp4"
ffmpeg -y -loglevel error -ss "$(python3 -c "print($total*0.45)")" -i "out/$name.mp4" -frames:v 1 -q:v 4 "out/$name.jpg"
echo "done: out/$name.mp4 ($(du -h "out/$name.mp4" | cut -f1))"
