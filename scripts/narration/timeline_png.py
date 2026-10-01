#!/usr/bin/env python3
"""One waveform/timeline PNG per scene from research/sprint-0930/narration/qa/timeline.json.
Lanes: beats (grey = held, text on top), voice waveform (pink = Nanda, blue = narrator), reveal steps, sfx cues, NEXT/auto.
python3 scripts/narration/timeline_png.py  -> research/sprint-0930/narration/qa/timeline/<scene>.png"""
import json, pathlib, sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from qa import pcm, ROOT  # noqa: E402

TL = json.loads((ROOT / 'research/sprint-0930/narration/qa/timeline.json').read_text())
OUT = ROOT / 'research/sprint-0930/narration/qa/timeline'
OUT.mkdir(parents=True, exist_ok=True)
env_cache = {}


def envelope(f, hop=0.02):
    if f not in env_cache:
        x, sr = pcm(ROOT / 'public' / f, 8000)
        w = int(sr * hop)
        n = max(1, len(x) // w)
        env_cache[f] = np.abs(x[: n * w]).reshape(n, w).max(axis=1) if len(x) >= w else np.zeros(1)
    return env_cache[f]


for sc in TL['scenes']:
    if not any(r['voice'] for r in sc['rows']): continue
    total = sc['ms'] / 1000
    fig, ax = plt.subplots(figsize=(max(8, min(40, total / 3)), 3.2), dpi=90)
    for i, r in enumerate(sc['rows']):
        s, e = r['start'] / 1000, r['end'] / 1000
        ax.add_patch(plt.Rectangle((s, 1.15), e - s, 0.5, color=('#ddd' if i % 2 else '#c8c8c8')))
        ax.text(s + 0.05, 1.4, f"{r['label']} {(r['text'] or '')[:28]}", fontsize=6, va='center', clip_on=True)
        t = r['voice'][0] / 1000 if r['voice'] else None
        for f in r['files']:
            env = envelope(f)
            xs = t + np.arange(len(env)) * 0.02
            ax.fill_between(xs, -env * 0.9, env * 0.9, color='#3b6fb6' if '/narration/' in f else '#d6457a', lw=0)
            t = xs[-1] + 0.02
        if r['step'] is not None: ax.axvline(r['step'] / 1000, color='#2a9d3a', lw=1, ls='--')
        if r['sfx']: ax.plot([r['sfx']['at'] / 1000], [-1.1], marker='^', color='#e08a00', ms=6); ax.text(r['sfx']['at'] / 1000 + 0.05, -1.2, r['sfx']['id'], fontsize=5)
        ax.plot([r['readyAt'] / 1000], [1.05], marker='v', color='#333', ms=4)
    ax.set_xlim(0, total)
    ax.set_ylim(-1.4, 1.75)
    ax.set_yticks([])
    ax.set_xlabel('s (player clicks as soon as NEXT shows)')
    ax.set_title(f"{sc['id']}: beats / voice (pink Nanda, blue narrator) / -- reveal / ^ sfx / v NEXT", fontsize=8)
    fig.tight_layout()
    fig.savefig(OUT / f"{sc['id']}.png")
    plt.close(fig)
    print(sc['id'])
