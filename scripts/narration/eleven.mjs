// Tiny ElevenLabs client for the narration takes. Key: $ELEVENLABS_API_KEY, or an env file named by $ELEVEN_ENV
// (KEY=value lines). The key is only ever sent as the xi-api-key header, never printed.
// Stops the process on 401/402/quota errors.
import fs from 'node:fs';

function key() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const f = process.env.ELEVEN_ENV;
  if (f && fs.existsSync(f)) {
    const m = /ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/.exec(fs.readFileSync(f, 'utf8'));
    if (m) return m[1];
  }
  throw new Error('no ElevenLabs key (set ELEVEN_ENV or ELEVENLABS_API_KEY)');
}
const API = 'https://api.elevenlabs.io';

async function call(path, body) {
  const res = await fetch(API + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'xi-api-key': key(), ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = (await res.text()).slice(0, 400);
    if (res.status === 401 || res.status === 402 || /quota|credits|limit/i.test(t)) {
      console.error(`STOP: ElevenLabs ${res.status}: ${t}`);
      process.exit(3);
    }
    throw new Error(`ElevenLabs ${res.status} ${path}: ${t}`);
  }
  return res.json();
}

export const models = () => call('/v1/models');
export const voices = () => call('/v2/voices?page_size=100').catch(() => call('/v1/voices'));

// TTS with character alignment. Returns { mp3: Buffer, alignment, ms } (ms = wall-clock latency of the request).
export async function speak(voiceId, text, { model = 'eleven_multilingual_v2', settings, format = 'mp3_44100_128' } = {}) {
  const t0 = performance.now();
  const j = await call(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=${format}`, {
    text, model_id: model, ...(settings ? { voice_settings: settings } : {}),
  });
  return { mp3: Buffer.from(j.audio_base64, 'base64'), alignment: j.alignment ?? j.normalized_alignment ?? null, ms: Math.round(performance.now() - t0) };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const cmd = process.argv[2];
  if (cmd === 'models') for (const m of await models()) console.log(m.model_id, m.can_do_text_to_speech, m.model_rates?.character_cost_multiplier ?? '', m.maximum_text_length_per_request ?? '');
  if (cmd === 'voices') {
    const j = await voices();
    for (const v of j.voices) console.log(v.voice_id, '|', v.name, '|', v.category, '|', JSON.stringify(v.labels ?? {}), '|', (v.description ?? '').slice(0, 80));
  }
}
