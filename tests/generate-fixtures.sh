#!/bin/bash
# Generates the real media files used by the e2e suite. Output is gitignored.
set -euo pipefail

OUT="$(dirname "$0")/fixtures/gen"
mkdir -p "$OUT"
cd "$OUT"

ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }
SRC="testsrc2=size=1920x1080:rate=30:duration=3"
TONE="sine=frequency=440:duration=3"

[ -f landscape_1080p.mp4 ] || ff -f lavfi -i "$SRC" -f lavfi -i "$TONE" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest landscape_1080p.mp4

# A long-ish clip so that cancellation can land mid-conversion.
[ -f long_1080p.mp4 ] || ff -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=45" \
  -f lavfi -i "sine=frequency=330:duration=45" \
  -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a aac -shortest long_1080p.mp4

# Stored landscape with rotation metadata, like a portrait iPhone clip.
[ -f rotated_tmp.mov ] || ff -f lavfi -i "testsrc2=size=1280x720:rate=30:duration=2" \
  -f lavfi -i "sine=frequency=500:duration=2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest rotated_tmp.mov
[ -f portrait_rotated.mov ] || ff -display_rotation:v:0 -90 -i rotated_tmp.mov -c copy portrait_rotated.mov

[ -f no_audio.mp4 ] || ff -f lavfi -i "testsrc2=size=640x360:rate=30:duration=2" \
  -c:v libx264 -pix_fmt yuv420p no_audio.mp4

# Odd dimensions are legal in VP9, but must be even in the H.264 output.
[ -f odd_dimensions.webm ] || ff -f lavfi -i "testsrc2=size=853x481:rate=30:duration=2" \
  -c:v libvpx-vp9 -b:v 500k -deadline realtime -cpu-used 8 odd_dimensions.webm

[ -f vp9_opus.webm ] || ff -f lavfi -i "testsrc2=size=1280x720:rate=30:duration=2" \
  -f lavfi -i "sine=frequency=440:duration=2" \
  -c:v libvpx-vp9 -b:v 800k -deadline realtime -cpu-used 8 -c:a libopus -shortest vp9_opus.webm

[ -f h264_aac.mkv ] || ff -f lavfi -i "testsrc2=size=1280x720:rate=30:duration=2" \
  -f lavfi -i "sine=frequency=440:duration=2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest h264_aac.mkv

[ -f mono_44k.mp4 ] || ff -f lavfi -i "testsrc2=size=640x360:rate=30:duration=2" \
  -f lavfi -i "sine=frequency=440:sample_rate=44100:duration=2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 1 -shortest mono_44k.mp4

# Left half red, right half blue: lets tests assert WHICH pixels survived a crop.
[ -f split_colors.mp4 ] || ff -f lavfi -i "color=red:size=640x720:rate=30:duration=4" \
  -f lavfi -i "color=blue:size=640x720:rate=30:duration=4" \
  -filter_complex "[0:v][1:v]hstack,format=yuv420p" -c:v libx264 split_colors.mp4

# Piped output has no seekable header, so the duration is missing, as in MediaRecorder files.
[ -f no_duration.webm ] || ffmpeg -hide_banner -loglevel error -f lavfi -i "testsrc2=size=640x360:rate=30:duration=2" \
  -c:v libvpx-vp9 -b:v 400k -deadline realtime -cpu-used 8 -f webm pipe:1 > no_duration.webm

[ -f real_avi.avi ] || ff -f lavfi -i "testsrc2=size=320x240:rate=30:duration=1" \
  -c:v mpeg4 real_avi.avi

[ -f corrupt.mp4 ] || head -c 200000 /dev/urandom > corrupt.mp4

# Has a video extension, but holds no video at all.
[ -f not_a_video.mov ] || head -c 50000 /dev/urandom > not_a_video.mov

[ -f name_with.many.dots\ \&\ spaces.mp4 ] || cp no_audio.mp4 "name_with.many.dots & spaces.mp4"

rm -f rotated_tmp.mov
