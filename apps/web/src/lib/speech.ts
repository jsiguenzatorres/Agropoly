// Browser-native speech synthesis wrapper. Locks to a Spanish voice — if none is
// installed on this device, the function returns silently (we'd rather have silence
// than English narration of Spanish text).

let cachedVoice: SpeechSynthesisVoice | null = null
let fallbackVoice: SpeechSynthesisVoice | null = null
let probed = false

// Priority list — Salvadoran first, then geographically/linguistically closest variants.
const SPANISH_LOCALES = [
  'es-SV', 'es-419', 'es-MX', 'es-GT', 'es-HN', 'es-NI', 'es-CR', 'es-PA',
  'es-CO', 'es-VE', 'es-EC', 'es-PE', 'es-BO', 'es-CL', 'es-AR', 'es-UY', 'es-PY',
  'es-DO', 'es-PR', 'es-CU',
  'es-ES', 'es-US', 'es',
]

function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Exact lang match first
  for (const loc of SPANISH_LOCALES) {
    const v = voices.find(vv => vv.lang === loc)
    if (v) return v
  }
  // Prefix match (e.g. "es-XX" matches base "es")
  for (const loc of SPANISH_LOCALES) {
    const v = voices.find(vv => vv.lang.toLowerCase().startsWith(loc.toLowerCase()))
    if (v) return v
  }
  // Last resort: voice whose name advertises Spanish
  return voices.find(v => /spanish|español/i.test(v.name)) ?? null
}

function probe() {
  if (probed || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    // Voices load async on some browsers — re-probe on event
    window.speechSynthesis.onvoiceschanged = () => { probed = false; probe() }
    return
  }
  cachedVoice = pickSpanishVoice(voices)
  // Last-resort fallback: pick the system default voice (likely English) so users hear *something*
  // instead of silence. Preferable for diagnostic + accessibility even if it sounds wrong.
  fallbackVoice = voices.find(v => v.default) ?? voices[0] ?? null
  probed = true
  if (cachedVoice) {
    console.info(`[speech] Spanish voice: ${cachedVoice.name} (${cachedVoice.lang})`)
  } else if (fallbackVoice) {
    console.warn(`[speech] No Spanish voice installed. Falling back to "${fallbackVoice.name}" (${fallbackVoice.lang}) — accent will be wrong but narration will be audible.`)
  } else {
    console.warn('[speech] No voices available at all — speech disabled.')
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function hasSpanishVoice(): boolean {
  probe()
  return cachedVoice !== null
}

export function speak(text: string, opts?: { rate?: number; pitch?: number; volume?: number }) {
  if (!isSpeechSupported()) return
  probe()
  // Prefer Spanish voice; fall back to the system default so users still hear narration
  const voice = cachedVoice ?? fallbackVoice
  if (!voice) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.voice = voice
  // Force es-* lang on the utterance even when the voice is English — helps engines
  // that respect the lang hint over the assigned voice, and signals SSML/captions correctly.
  utter.lang = cachedVoice ? cachedVoice.lang : 'es-419'
  utter.rate   = opts?.rate   ?? 1.0
  utter.pitch  = opts?.pitch  ?? 1.05
  utter.volume = opts?.volume ?? 0.85
  window.speechSynthesis.speak(utter)
}

export function stopSpeech() {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}

// Debug helper — list all voices in console
export function listVoices() {
  if (!isSpeechSupported()) return
  const voices = window.speechSynthesis.getVoices()
  console.table(voices.map(v => ({ name: v.name, lang: v.lang, default: v.default, localService: v.localService })))
}

// Expose to window in dev for quick console diagnosis: `__speech.test()` or `__speech.list()`
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __speech: object }).__speech = {
    test: () => speak('Hola, soy la voz del Banco de Fomento Agropecuario.'),
    list: listVoices,
    has:  hasSpanishVoice,
    current: () => {
      probe()
      return cachedVoice
        ? { active: cachedVoice.name, lang: cachedVoice.lang, isSpanish: true }
        : fallbackVoice
        ? { active: fallbackVoice.name, lang: fallbackVoice.lang, isSpanish: false, note: 'fallback — no Spanish voice installed' }
        : { active: null, note: 'no voices at all' }
    },
  }
}
