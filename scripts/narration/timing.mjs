// mp3 duration from the frame headers (no ffprobe in the container), and the spoken end from an alignment.
const BR = { 1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], 2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160] };
const SR = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

// Walk MPEG audio layer III frames; returns ms (0 if nothing parses).
export function mp3Ms(buf) {
  let i = 0, samples = 0, rate = 0;
  if (buf.length > 10 && buf.toString('latin1', 0, 3) === 'ID3') {
    i = 10 + ((buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | (buf[9] & 0x7f));
  }
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) { i++; continue; }
    const ver = (buf[i + 1] >> 3) & 3, layer = (buf[i + 1] >> 1) & 3;
    const bri = buf[i + 2] >> 4, sri = (buf[i + 2] >> 2) & 3, pad = (buf[i + 2] >> 1) & 1;
    if (ver === 1 || layer !== 1 || bri === 0 || bri === 15 || sri === 3) { i++; continue; }
    const sr = SR[ver][sri], kbps = BR[ver === 3 ? 1 : 2][bri], spf = ver === 3 ? 1152 : 576;
    const len = Math.floor((spf / 8) * kbps * 1000 / sr) + pad;
    samples += spf; rate = sr; i += len;
  }
  return rate ? Math.round((samples / rate) * 1000) : 0;
}

// The end of the last spoken character (alignment from /with-timestamps), else the file length.
export function alignedMs(alignment, buf) {
  const e = alignment?.character_end_times_seconds;
  const fileMs = buf ? mp3Ms(buf) : 0;
  return fileMs || (e?.length ? Math.round(e[e.length - 1] * 1000) : 0);
}

// Start time (ms) of the character at `at` in the aligned text (for a reveal / sfx point), null if unaligned.
export function charStartMs(alignment, at) {
  const s = alignment?.character_start_times_seconds;
  if (!s?.length || at < 0) return null;
  return Math.round(s[Math.min(at, s.length - 1)] * 1000);
}
