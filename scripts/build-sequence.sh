#!/usr/bin/env bash
# Builds the scroll-driven background image sequence from two source clips.
#
#   scripts/build-sequence.sh <flight.mp4> <summit.mp4>
#
# The first clip (drone flight up a misty valley towards the peaks) carries
# most of the page; the second (golden sea of clouds) fades in for the summit
# at the end. Both are joined with a
# crossfade, graded darker so ivory text stays legible, then sampled into
# evenly spaced WebP frames:
#
#   public/sequence/desktop/NNN.webp  1280x720  (landscape)
#   public/sequence/mobile/NNN.webp    720x1280 (portrait crop)
#   public/sequence/poster.webp       first frame, heavily compressed
#
# Frame counts must match SEQUENCE in src/components/background/SequenceBackground.tsx.
set -euo pipefail

A="${1:?flight clip}"
C="${2:?summit clip}"
OUT="$(dirname "$0")/../public/sequence"

DESKTOP_FRAMES=112
MOBILE_FRAMES=80
C_START=4    # seconds into the sunrise clip where the usable part begins
C_LEN=9      # seconds of it that are kept
FADE=2       # crossfade length

A_LEN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$A")
TOTAL=$(awk "BEGIN{print $A_LEN + $C_LEN - $FADE}")
OFFSET=$(awk "BEGIN{print $A_LEN - $FADE}")

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Join + grade into one 1080p intermediate (30 fps, constant).
#    Flight: shot in bright daylight, so it is pulled down hard and cooled
#    towards the brand's blue. Summit: darkened, warmth kept for the sunrise.
ffmpeg -v error -y -i "$A" -ss "$C_START" -t "$C_LEN" -i "$C" -filter_complex "
  [0:v]fps=30,scale=1920:1080,setsar=1,eq=brightness=-0.13:contrast=1.06:saturation=0.70:gamma=0.72,colorbalance=bs=0.08:bm=0.05:rh=-0.08:gh=-0.05:bh=0.08[a];
  [1:v]fps=30,scale=1920:1080,setsar=1,eq=brightness=-0.10:saturation=0.85:gamma=0.80[c];
  [a][c]xfade=transition=fade:duration=$FADE:offset=$OFFSET,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 14 -preset slow "$TMP/joined.mp4"

rm -rf "$OUT/desktop" "$OUT/mobile"
mkdir -p "$OUT/desktop" "$OUT/mobile"

# 2. Evenly spaced frames. fps=N/TOTAL yields exactly N samples across the clip.
#    A faint blur costs nothing visually (the frames sit under a dark scrim)
#    but snow and forest texture compress far better without the fine grain.
ffmpeg -v error -y -i "$TMP/joined.mp4" \
  -vf "fps=$DESKTOP_FRAMES/$TOTAL,scale=1280:720:flags=lanczos,gblur=sigma=0.7" \
  -frames:v "$DESKTOP_FRAMES" -c:v libwebp -quality 50 -compression_level 6 \
  -start_number 0 "$OUT/desktop/%03d.webp"

# Portrait crop for phones, biased left of centre where the peaks sit.
ffmpeg -v error -y -i "$TMP/joined.mp4" \
  -vf "fps=$MOBILE_FRAMES/$TOTAL,crop=608:1080:420:0,scale=720:1280:flags=lanczos,gblur=sigma=0.7" \
  -frames:v "$MOBILE_FRAMES" -c:v libwebp -quality 45 -compression_level 6 \
  -start_number 0 "$OUT/mobile/%03d.webp"

# 3. Poster: first frame, small and soft — it is a placeholder under the canvas.
ffmpeg -v error -y -i "$TMP/joined.mp4" -frames:v 1 \
  -vf "scale=960:540:flags=lanczos" -c:v libwebp -quality 45 "$OUT/poster.webp"

echo "desktop: $(ls "$OUT/desktop" | wc -l) frames, $(du -sh "$OUT/desktop" | cut -f1)"
echo "mobile:  $(ls "$OUT/mobile" | wc -l) frames, $(du -sh "$OUT/mobile" | cut -f1)"
echo "poster:  $(du -h "$OUT/poster.webp" | cut -f1)"
