#!/usr/bin/env python3
"""Before/after spectrogram PNGs -> spectro/. FFMPEG=/usr/bin/ffmpeg python3 spectro.py"""
import os, subprocess
FF = os.environ.get("FFMPEG", "/usr/bin/ffmpeg")
H = os.path.dirname(os.path.abspath(__file__))
V = os.path.join(H, "../../../public/date-beta/voice/narration")
os.makedirs(os.path.join(H, "spectro"), exist_ok=True)
for rel in ["leave-fu/380_2", "leave-fu/381_3", "leave-yeah/383_2", "leave-yeah/384_3"]:
    n = rel.replace("/", "_")
    for tag, src in (("before", f"{H}/orig/{n}.mp3.orig"), ("after", f"{V}/{rel}.mp3")):
        subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-lavfi",
                        "showspectrumpic=s=900x400:legend=0", f"{H}/spectro/{n}.{tag}.png"], check=True)
