#!/usr/bin/env bash
# Encodes rendered CPU frames (render.mjs output) into the web sequence.
#
#   scripts/render-cpu/encode.sh <desktop-png-dir> <mobile-png-dir>
#
# Frames are rendered at 2x and downscaled here, which is where the clean
# anti-aliasing comes from. Output:
#
#   public/sequence/desktop/NNN.webp  1280x720
#   public/sequence/mobile/NNN.webp    720x1280
#   public/sequence/poster.webp       first desktop frame, small
#
# Frame counts must match SEQUENCE in src/components/background/SequenceBackground.tsx.
set -euo pipefail

DESKTOP="${1:?desktop frame dir}"
MOBILE="${2:?mobile frame dir}"
OUT="$(dirname "$0")/../../public/sequence"

# Empty rather than delete the folders: on Windows a folder that any process
# has open (a shell, an editor, the dev server) can't be removed.
mkdir -p "$OUT/desktop" "$OUT/mobile"
rm -f "$OUT/desktop/"*.webp "$OUT/mobile/"*.webp

ffmpeg -v error -y -i "$DESKTOP/%04d.png" \
  -vf "scale=1280:720:flags=lanczos" \
  -c:v libwebp -quality 64 -compression_level 6 \
  -start_number 0 "$OUT/desktop/%03d.webp"

ffmpeg -v error -y -i "$MOBILE/%04d.png" \
  -vf "scale=720:1280:flags=lanczos" \
  -c:v libwebp -quality 60 -compression_level 6 \
  -start_number 0 "$OUT/mobile/%03d.webp"

ffmpeg -v error -y -i "$DESKTOP/0000.png" -frames:v 1 \
  -vf "scale=960:540:flags=lanczos" -c:v libwebp -quality 55 "$OUT/poster.webp"

echo "desktop: $(ls "$OUT/desktop" | wc -l) frames, $(du -sh "$OUT/desktop" | cut -f1)"
echo "mobile:  $(ls "$OUT/mobile" | wc -l) frames, $(du -sh "$OUT/mobile" | cut -f1)"
echo "poster:  $(du -h "$OUT/poster.webp" | cut -f1)"
