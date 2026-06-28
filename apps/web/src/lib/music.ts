// Adaptive music engine — Tone.js. Synth-only (no audio files), so it's procedural
// and works without any asset pipeline. 5 tracks selected by game state.
//
// Tracks pick a different key/tempo/instrument blend per mood. Crossfade 2s between tracks.

import * as Tone from 'tone'

export type Track = 'lobby' | 'playing' | 'tension' | 'victory' | 'bankrupt'

interface TrackConfig {
  bpm: number
  key: string             // root note for the marimba pattern
  notes: string[]         // 8-step pattern
  reverb: number          // 0..1
  volume: number          // dB
}

const TRACKS: Record<Track, TrackConfig> = {
  lobby:    { bpm: 70,  key: 'C4', notes: ['C4', 'E4', 'G4', 'B4', 'A4', 'G4', 'E4', 'D4'], reverb: 0.4, volume: -16 },
  playing:  { bpm: 88,  key: 'D4', notes: ['D4', 'F#4', 'A4', 'E4', 'D4', 'A3', 'F#4', 'B4'], reverb: 0.25, volume: -14 },
  tension:  { bpm: 110, key: 'A3', notes: ['A3', 'C4', 'E4', 'C4', 'B3', 'E4', 'C4', 'A3'], reverb: 0.15, volume: -12 },
  victory:  { bpm: 100, key: 'G4', notes: ['G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4', 'B4'], reverb: 0.6, volume: -10 },
  bankrupt: { bpm: 56,  key: 'E3', notes: ['E3', 'G3', 'B3', 'A3', 'G3', 'E3', 'D3', 'E3'], reverb: 0.8, volume: -18 },
}

let initialized = false
let activeTrack: Track | null = null
let marimba: Tone.PolySynth | null = null
let reverb: Tone.Reverb | null = null
let loop: Tone.Loop | null = null
let enabled = false

export function isMusicEnabled(): boolean { return enabled }

export async function startMusic() {
  if (enabled) return
  await Tone.start()
  if (!initialized) {
    reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination()
    marimba = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.5, sustain: 0.1, release: 1.2 },
    }).connect(reverb)
    initialized = true
  }
  enabled = true
}

export function stopMusic() {
  if (!enabled) return
  loop?.stop()
  loop?.dispose()
  loop = null
  Tone.Transport.stop()
  activeTrack = null
  enabled = false
}

export function setTrack(track: Track) {
  if (!enabled || !marimba) return
  if (activeTrack === track) return
  activeTrack = track
  const cfg = TRACKS[track]
  Tone.Transport.bpm.rampTo(cfg.bpm, 1.5)
  marimba.volume.rampTo(cfg.volume, 1.5)
  if (reverb) reverb.wet.rampTo(cfg.reverb, 1.5)

  loop?.stop()
  loop?.dispose()

  let step = 0
  loop = new Tone.Loop(time => {
    const note = cfg.notes[step % cfg.notes.length]
    marimba?.triggerAttackRelease(note, '8n', time)
    step++
  }, '4n')
  loop.start(0)

  if (Tone.Transport.state !== 'started') Tone.Transport.start()
}
