// Voice settings button — shows the currently selected narration voice with a
// color-coded badge (green = Latin Spanish, yellow = European Spanish, red = no
// Spanish at all, gray = browser doesn't support speech). Click opens a modal
// with step-by-step instructions to install a Latin Spanish voice per OS.

import { useEffect, useState } from 'react'
import { listVoices, speak, isSpeechSupported } from '../../lib/speech'

type VoiceStatus = 'latin' | 'spain' | 'fallback' | 'none' | 'unsupported'

// Geographic groupings — used to decide the badge color and label
const LATIN_LANGS = new Set([
  'es-419', 'es-MX', 'es-SV', 'es-GT', 'es-HN', 'es-NI', 'es-CR', 'es-PA',
  'es-CO', 'es-VE', 'es-EC', 'es-PE', 'es-BO', 'es-CL', 'es-AR', 'es-UY', 'es-PY',
  'es-DO', 'es-PR', 'es-CU', 'es-US',
])

interface CurrentVoice {
  name: string | null
  lang: string | null
  isSpanish: boolean
  status: VoiceStatus
}

function readCurrentVoice(): CurrentVoice {
  if (!isSpeechSupported()) {
    return { name: null, lang: null, isSpanish: false, status: 'unsupported' }
  }
  // Read what speech.ts decided on — exposed via __speech.current() in dev/preview
  const w = window as unknown as { __speech?: { current?: () => Record<string, unknown> } }
  const cur = w.__speech?.current?.()
  if (!cur || !cur.active) {
    return { name: null, lang: null, isSpanish: false, status: 'none' }
  }
  const name     = String(cur.active)
  const lang     = String(cur.lang ?? '')
  const isSpanish = !!cur.isSpanish
  let status: VoiceStatus
  if (!isSpanish) status = 'fallback'
  else if (LATIN_LANGS.has(lang)) status = 'latin'
  else status = 'spain'
  return { name, lang, isSpanish, status }
}

const BADGE_COLOR: Record<VoiceStatus, string> = {
  latin:       '#2E8B4A',   // green
  spain:       '#F5C518',   // gold (warning, voice works but not ideal)
  fallback:    '#E67E22',   // orange (English fallback)
  none:        '#C0392B',   // red
  unsupported: '#666',
}

const STATUS_LABEL: Record<VoiceStatus, string> = {
  latin:       'Voz latina ✓',
  spain:       'Voz España',
  fallback:    'Sin voz español',
  none:        'Sin voces',
  unsupported: 'No soportado',
}

export function VoiceSettingsButton() {
  const [open, setOpen] = useState(false)
  const [voice, setVoice] = useState<CurrentVoice>(() => readCurrentVoice())

  // Re-read voice info when modal opens (voices load async on some browsers)
  useEffect(() => {
    if (open) {
      setVoice(readCurrentVoice())
      const t = setTimeout(() => setVoice(readCurrentVoice()), 500)
      return () => clearTimeout(t)
    }
  }, [open])

  // Initial probe — voices may not be loaded on first render
  useEffect(() => {
    const t1 = setTimeout(() => setVoice(readCurrentVoice()), 200)
    const t2 = setTimeout(() => setVoice(readCurrentVoice()), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Voz del narrador: ${voice.name ?? '—'} (${voice.lang ?? 'sin lenguaje'}) · ${STATUS_LABEL[voice.status]} — click para opciones`}
        className="glass-card flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs hover:bg-white/10 transition-colors"
        style={{ pointerEvents: 'auto' }}
      >
        <span style={{ fontSize: '14px', lineHeight: 1 }}>🗣️</span>
        <span
          aria-label={STATUS_LABEL[voice.status]}
          style={{
            display: 'inline-block',
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: BADGE_COLOR[voice.status],
            boxShadow: `0 0 6px ${BADGE_COLOR[voice.status]}`,
          }}
        />
      </button>

      {open && <VoiceModal voice={voice} onClose={() => setOpen(false)} />}
    </>
  )
}

interface ModalProps {
  voice: CurrentVoice
  onClose: () => void
}

function VoiceModal({ voice, onClose }: ModalProps) {
  const isWindows = navigator.platform.startsWith('Win')
  const isMac     = navigator.platform.startsWith('Mac')

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(6, 14, 8, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'intro-fade-in 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-card"
        style={{
          maxWidth: '560px', width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          padding: '24px',
          background: 'rgba(13, 43, 20, 0.96)',
          border: '1px solid rgba(245, 197, 24, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h2 style={{
            color: '#F5C518', fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1.1,
          }}>
            🗣️ Voz del narrador
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(245,232,200,0.6)', fontSize: '22px',
              cursor: 'pointer', lineHeight: 1, padding: 0,
            }}
            aria-label="Cerrar"
          >×</button>
        </div>

        {/* Current voice status */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${BADGE_COLOR[voice.status]}40`,
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px', height: '10px',
              borderRadius: '50%',
              background: BADGE_COLOR[voice.status],
              boxShadow: `0 0 8px ${BADGE_COLOR[voice.status]}`,
            }} />
            <span style={{ color: BADGE_COLOR[voice.status], fontWeight: 700, letterSpacing: '0.05em' }}>
              {STATUS_LABEL[voice.status].toUpperCase()}
            </span>
          </div>
          <div style={{ color: '#FDF8EE' }}>
            <strong>Voz activa:</strong> {voice.name ?? 'ninguna'}
          </div>
          <div style={{ color: 'rgba(245,232,200,0.6)' }}>
            <strong>Lang:</strong> {voice.lang ?? '—'}
          </div>
        </div>

        {/* Test button */}
        {voice.name && (
          <button
            onClick={() => speak('Hola, soy la voz del Banco de Fomento Agropecuario. ¡Que comience la partida!')}
            className="btn-secondary"
            style={{ width: '100%', marginBottom: '20px', fontSize: '13px' }}
          >
            🔊  Probar voz actual
          </button>
        )}

        {/* Status-specific recommendation */}
        {voice.status === 'latin' && (
          <div style={{
            background: 'rgba(46, 139, 74, 0.12)',
            border: '1px solid rgba(46, 139, 74, 0.4)',
            borderRadius: '10px',
            padding: '12px 14px',
            color: '#FDF8EE', fontSize: '13px', lineHeight: 1.5,
          }}>
            <strong style={{ color: '#4CAF70' }}>✓ Tu voz es latina</strong> — el acento coincide
            con el contexto BFA · El Salvador. No necesitás cambiar nada.
          </div>
        )}

        {voice.status === 'spain' && (
          <>
            <p style={{ color: '#FDF8EE', fontSize: '14px', lineHeight: 1.5, marginBottom: '14px' }}>
              Tu voz es <strong>española de España</strong> (acento ibérico, ceceo). Funciona,
              pero no es el acento esperado para un juego del BFA · El Salvador. Para tener
              voz latina:
            </p>
            <InstallSteps isWindows={isWindows} isMac={isMac} />
          </>
        )}

        {(voice.status === 'fallback' || voice.status === 'none') && (
          <>
            <p style={{ color: '#FDF8EE', fontSize: '14px', lineHeight: 1.5, marginBottom: '14px' }}>
              {voice.status === 'fallback'
                ? <>Tu sistema no tiene <strong>ninguna voz en español</strong> instalada. Estamos usando una voz inglesa como respaldo. Para escuchar la narración con el acento correcto:</>
                : <>Tu sistema no tiene <strong>voces TTS instaladas</strong>. La narración no funciona. Para activarla:</>
              }
            </p>
            <InstallSteps isWindows={isWindows} isMac={isMac} />
          </>
        )}

        {voice.status === 'unsupported' && (
          <p style={{ color: '#FDF8EE', fontSize: '14px', lineHeight: 1.5 }}>
            Tu navegador no soporta Web Speech API. Probá con Chrome, Edge, Firefox o Safari recientes.
          </p>
        )}

        {/* Always show — list voices in console */}
        <p style={{
          marginTop: '20px',
          color: 'rgba(245,232,200,0.5)',
          fontSize: '11px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          💡 Avanzado: abrí la consola (F12) y ejecutá <code style={{ color: '#F5C518' }}>__speech.list()</code> para ver todas las voces instaladas
        </p>

        <button
          onClick={() => { listVoices(); alert('Voces listadas en la consola (F12 → Console)') }}
          style={{
            marginTop: '8px', width: '100%',
            background: 'transparent', border: '1px dashed rgba(245,232,200,0.25)',
            color: 'rgba(245,232,200,0.6)', fontSize: '11px',
            padding: '6px', borderRadius: '8px',
            fontFamily: 'monospace', cursor: 'pointer',
          }}
        >
          Listar voces en consola
        </button>
      </div>
    </div>
  )
}

function InstallSteps({ isWindows, isMac }: { isWindows: boolean; isMac: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {isWindows && (
        <StepGroup
          title="Windows 10 / 11"
          icon="🪟"
          steps={[
            'Abrí <strong>Configuración</strong> (Win + I)',
            '<strong>Hora e idioma</strong> → <strong>Idioma y región</strong>',
            'Click en <strong>+ Agregar un idioma</strong>',
            'Buscá <strong>"Español (México)"</strong> o <strong>"Español (Argentina)"</strong> y agregalo',
            'Click sobre el idioma agregado → <strong>Opciones de idioma</strong>',
            'En "Voz", click <strong>Descargar</strong> (≈150 MB)',
            'Reiniciá Chrome — aparecerá <em>"Microsoft Sabina"</em> (MX) o similar',
          ]}
        />
      )}
      {isMac && (
        <StepGroup
          title="macOS"
          icon="🍎"
          steps={[
            '<strong>Preferencias del Sistema</strong> → <strong>Accesibilidad</strong>',
            '<strong>Contenido hablado</strong> → <strong>Voz del sistema</strong>',
            'Click <strong>Personalizar</strong> al lado del menú de voz',
            'Marcá <strong>"Paulina (Mexicana)"</strong>, <strong>"Diego (Argentina)"</strong> o similar',
            'Esperá la descarga y reiniciá Safari/Chrome',
          ]}
        />
      )}
      {!isWindows && !isMac && (
        <StepGroup
          title="Linux"
          icon="🐧"
          steps={[
            'Instalá <code>espeak-ng</code> con voces en español: <code>sudo apt install espeak-ng espeak-ng-data</code>',
            'En Chrome/Firefox las voces aparecen automáticamente',
            'Reiniciá el navegador',
          ]}
        />
      )}
      <StepGroup
        title="Chrome — voces remotas (sin instalar)"
        icon="🌐"
        steps={[
          'Chrome trae voces remotas <em>"Google español"</em> que se descargan en tiempo real',
          'No requieren instalación pero necesitan internet',
          'Si solo aparece <em>"Google español"</em> (España) y querés latino, la única forma es instalar localmente (pasos arriba)',
        ]}
      />
    </div>
  )
}

function StepGroup({ title, icon, steps }: { title: string; icon: string; steps: string[] }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)',
      border: '1px solid rgba(245,232,200,0.12)',
      borderRadius: '10px',
      padding: '12px 14px',
    }}>
      <h3 style={{
        color: '#F5C518', fontSize: '13px', fontWeight: 700,
        margin: '0 0 8px', letterSpacing: '0.05em',
      }}>
        {icon}  {title}
      </h3>
      <ol style={{
        margin: 0, paddingLeft: '20px',
        color: '#FDF8EE', fontSize: '13px', lineHeight: 1.6,
      }}>
        {steps.map((s, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: s }} />
        ))}
      </ol>
    </div>
  )
}
