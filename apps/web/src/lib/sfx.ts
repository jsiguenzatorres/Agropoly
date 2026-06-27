// Web Audio API sound synthesis — zero files, zero deps
let _ctx: AudioContext | null = null

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function tone(
  freq: number, dur: number,
  type: OscillatorType = 'sine',
  vol = 0.28,
  startDelay = 0,
) {
  const ac = ctx()
  const osc = ac.createOscillator()
  const g   = ac.createGain()
  osc.connect(g); g.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  const t = ac.currentTime + startDelay
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.start(t); osc.stop(t + dur + 0.01)
}

function noise(dur: number, vol = 0.3) {
  const ac   = ctx()
  const size = Math.floor(ac.sampleRate * dur)
  const buf  = ac.createBuffer(1, size, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 1.5)
  }
  const src = ac.createBufferSource()
  const g   = ac.createGain()
  src.buffer = buf; src.connect(g); g.connect(ac.destination)
  g.gain.value = vol; src.start()
}

export const sfx = {
  step() {
    tone(660, 0.04, 'square', 0.08)
  },

  dice() {
    noise(0.12, 0.35)
    tone(280, 0.12, 'triangle', 0.22, 0.06)
  },

  buy() {
    // Ascending major arpeggio C-E-G-C
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'sine', 0.26, i * 0.07))
  },

  rent() {
    // Descending minor G-E♭-C
    [392, 311, 262].forEach((f, i) => tone(f, 0.18, 'sine', 0.22, i * 0.08))
  },

  tax() {
    tone(180, 0.3, 'sawtooth', 0.2)
    tone(160, 0.3, 'sawtooth', 0.1, 0.05)
  },

  card() {
    const ac = ctx()
    const osc = ac.createOscillator()
    const g   = ac.createGain()
    osc.connect(g); g.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.22)
    g.gain.setValueAtTime(0.28, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.28)
    osc.start(); osc.stop(ac.currentTime + 0.3)
  },

  jail() {
    [110, 98, 87].forEach((f, i) => tone(f, 0.45, 'sawtooth', 0.24, i * 0.06))
    noise(0.08, 0.2)
  },

  go() {
    // Fanfare: C-E-G-C'
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      tone(f, 0.22, 'sine', 0.32, i * 0.09))
  },

  win() {
    [523, 659, 784, 988, 1047, 1319].forEach((f, i) =>
      tone(f, 0.28, 'sine', 0.35, i * 0.11))
    setTimeout(() => [523, 659, 784].forEach(f => tone(f, 0.5, 'sine', 0.25)), 700)
  },
}
