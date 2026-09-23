#!/usr/bin/env bash
# Builds the scroll-driven background image sequence from two source clips.
#
#   scripts/build-sequence.sh <blue-hour.mp4> <sunrise.mp4>
#
# The first clip (blue hour) carries most of the page; the second (golden sea
# of clouds) fades in for the summit at the end. Both are joined with a
# crossfade, graded darker so ivory text stays legible, then sampled into
# evenly spaced WebP frames:
#
#   public/sequence/desktop/NNN.webp  1280x720  (landscape)
#   public/sequence/mobile/NNN.webp    720x1280 (portrait crop)
#   public/sequence/poster.webp       first frame, heavily compressed
#
# Frame counts must match SEQUENCE in src/components/background/SequenceBackground.tsx.
set -euo pipefail

A="${1:?blue-hour clip}"
C="${2:?sunrise clip}"
OUT="$(dirname "$0")/../public/sequence"

DESKTOP_FRAMES=96
MOBILE_FRAMES=64
C_START=4    # seconds into the sunrise clip where the usable part begins
C_LEN=9      # seconds of it that are kept
FADE=2       # crossfade length

A_LEN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$A")
TOTAL=$(awk "BEGIN{print $A_LEN + $C_LEN - $FADE}")
OFFSET=$(awk "BEGIN{print $A_LEN - $FADE}")

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Join + grade into one 1080p intermediate (30 fps, constant).
#    Blue hour: slightly desaturated and darkened. Sunrise: pulled down hard,
#    it is far brighter than the rest of the page.
ffmpeg -v error -y -i "$A" -ss "$C_START" -t "$C_LEN" -i "$C" -filter_complex "
  [0:v]fps=30,scale=1920:1080,setsar=1,eq=brightness=-0.03:saturation=0.85:gamma=0.95[a];
  [1:v]fps=30,scale=1920:1080,setsar=1,eq=brightness=-0.10:saturation=0.85:gamma=0.80[c];
  [a][c]xfade=transition=fade:duration=$FADE:offset=$OFFSET,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 14 -preset slow "$TMP/joined.mp4"

rm -rf "$OUT/desktop" "$OUT/mobile"
mkdir -p "$OUT/desktop" "$OUT/mobile"

# 2. Evenly spaced frames. fps=N/TOTAL yields exactly N samples across the clip.
ffmpeg -v error -y -i "$TMP/joined.mp4" \
  -vf "fps=$DESKTOP_FRAMES/$TOTAL,scale=1280:720:flags=lanczos" \
  -frames:v "$DESKTOP_FRAMES" -c:v libwebp -quality 62 -compression_level 6 \
  -start_number 0 "$OUT/desktop/%03d.webp"

# Portrait crop for phones, biased left of centre where the peaks sit.
ffmpeg -v error -y -i "$TMP/joined.mp4" \
  -vf "fps=$MOBILE_FRAMES/$TOTAL,crop=608:1080:420:0,scale=720:1280:flags=lanczos" \
  -frames:v "$MOBILE_FRAMES" -c:v libwebp -quality 55 -compression_level 6 \
  -start_number 0 "$OUT/mobile/%03d.webp"

# 3. Poster: first frame, small and soft — it is a placeholder under the canvas.
ffmpeg -v error -y -i "$TMP/joined.mp4" -frames:v 1 \
  -vf "scale=960:540:flags=lanczos" -c:v libwebp -quality 45 "$OUT/poster.webp"

echo "desktop: $(ls "$OUT/desktop" | wc -l) frames, $(du -sh "$OUT/desktop" | cut -f1)"
echo "mobile:  $(ls "$OUT/mobile" | wc -l) frames, $(du -sh "$OUT/mobile" | cut -f1)"
echo "poster:  $(du -h "$OUT/poster.webp" | cut -f1)"
