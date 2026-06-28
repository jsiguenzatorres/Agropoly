// Browser-native speech synthesis wrapper. Locks to a Spanish voice — if none is
// installed on this device, the function returns silently (we'd rather have silence
// than English narration of Spanish text).

let cachedVoice: SpeechSynthesisVoice | null = null
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
  probed = true
  if (cachedVoice) {
    console.info(`[speech] Spanish voice: ${cachedVoice.name} (${cachedVoice.lang})`)
  } else {
    console.warn('[speech] No Spanish voice installed — speech disabled to avoid English narration of Spanish text.')
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
  // No Spanish voice on this device → silence (don't synthesize Spanish text with an English voice)
  if (!cachedVoice) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.voice = cachedVoice
  utter.lang  = cachedVoice.lang
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
