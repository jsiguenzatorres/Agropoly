// Browser-native speech synthesis wrapper (no external API).
// Speaks Spanish text using the user's installed Spanish voice when available.

let cachedVoice: SpeechSynthesisVoice | null = null
let cachedVoicesLoaded = false

function loadVoices() {
  if (cachedVoicesLoaded || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    // Voices load async on some browsers — try again on event
    window.speechSynthesis.onvoiceschanged = () => { cachedVoicesLoaded = false; loadVoices() }
    return
  }
  // Prefer es-SV, then any es-*, then any voice with lang starting "es"
  cachedVoice =
    voices.find(v => v.lang === 'es-SV') ??
    voices.find(v => v.lang === 'es-419') ??
    voices.find(v => v.lang === 'es-MX') ??
    voices.find(v => v.lang.startsWith('es')) ??
    null
  cachedVoicesLoaded = true
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, opts?: { rate?: number; pitch?: number; volume?: number }) {
  if (!isSpeechSupported()) return
  loadVoices()
  // Cancel any ongoing speech to avoid overlap
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  if (cachedVoice) utter.voice = cachedVoice
  utter.lang = cachedVoice?.lang ?? 'es-ES'
  utter.rate = opts?.rate ?? 1.0
  utter.pitch = opts?.pitch ?? 1.0
  utter.volume = opts?.volume ?? 0.85
  window.speechSynthesis.speak(utter)
}

export function stopSpeech() {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}
