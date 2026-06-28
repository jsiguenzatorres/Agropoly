// Minimal Web Speech API wrapper for hands-free dice rolling.
// Uses the browser's SpeechRecognition (webkitSpeechRecognition on Safari/Chrome legacy).

// SpeechRecognition is not in lib.dom by default — minimal types here
interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionEventLike { resultIndex: number; results: { length: number; [i: number]: SpeechRecognitionResultLike } }
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror:  (() => void) | null
  onend:    (() => void) | null
  start: () => void
  stop:  () => void
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function isVoiceCommandSupported(): boolean {
  return getRecognitionCtor() !== null
}

export interface VoiceCommandHandle { stop: () => void }

const ROLL_PHRASES = [
  'lanzar dados', 'lanza los dados', 'tirar dados', 'tira los dados',
  'lanzar', 'dados', 'roll',
]

const END_PHRASES = [
  'terminar turno', 'fin del turno', 'pasar turno', 'end turn',
]

const BUY_PHRASES = [
  'comprar', 'comprar propiedad', 'sí comprar', 'buy',
]

const PASS_PHRASES = [
  'pasar', 'no comprar', 'saltar', 'skip', 'pass',
]

export type VoiceIntent = 'roll' | 'end' | 'buy' | 'pass'

function recognizeIntent(transcript: string): VoiceIntent | null {
  const t = transcript.toLowerCase().trim()
  if (ROLL_PHRASES.some(p => t.includes(p))) return 'roll'
  if (END_PHRASES.some(p => t.includes(p)))  return 'end'
  if (BUY_PHRASES.some(p => t.includes(p)))  return 'buy'
  if (PASS_PHRASES.some(p => t.includes(p))) return 'pass'
  return null
}

// Start continuous listening. Callback fires on each recognized intent.
// Returns a handle with stop().
export function startVoiceCommands(onIntent: (intent: VoiceIntent) => void): VoiceCommandHandle | null {
  const Ctor = getRecognitionCtor()
  if (!Ctor) return null
  const rec = new Ctor()
  rec.lang = 'es-SV'
  rec.continuous = true
  rec.interimResults = false

  rec.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      if (!result?.isFinal) continue
      const transcript = result[0]?.transcript ?? ''
      const intent = recognizeIntent(transcript)
      if (intent) onIntent(intent)
    }
  }
  rec.onerror = () => { /* swallow — user may have denied mic */ }
  // Auto-restart on end so it keeps listening
  let stopped = false
  rec.onend = () => { if (!stopped) try { rec.start() } catch { /* ignore */ } }

  try { rec.start() } catch { return null }

  return {
    stop() {
      stopped = true
      try { rec.stop() } catch { /* ignore */ }
    },
  }
}
