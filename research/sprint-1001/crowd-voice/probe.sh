#!/bin/bash
# usage: probe.sh file...  -> format, duration, integrated loudness, true peak
FF=${FFMPEG:-/usr/bin/ffmpeg}
for f in "$@"; do
  echo "== $f"
  ffprobe -v error -show_entries stream=codec_name,sample_rate,channels,bit_rate:format=duration -of csv=p=0 "$f"
  $FF -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E 'I:|Peak:'
done
