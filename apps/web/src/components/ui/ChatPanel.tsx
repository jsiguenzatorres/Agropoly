import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useMultiplayerStore } from '../../store/multiplayerStore'

const QUICK_REACTS = ['👍', '🔥', '😅', '😱', '💰', '🌽', '🎯', '👏']

export function ChatPanel() {
  const messages    = useChatStore(s => s.messages)
  const reactions   = useChatStore(s => s.reactions)
  const dropReact   = useChatStore(s => s.dropReaction)
  const unread      = useChatStore(s => s.unread)
  const open        = useChatStore(s => s.open)
  const setOpen     = useChatStore(s => s.setOpen)

  const sendChat    = useMultiplayerStore(s => s.sendChat)
  const sendReact   = useMultiplayerStore(s => s.sendReact)
  const mySessionId = useMultiplayerStore(s => s.mySessionId)

  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: 999999 })
  }, [messages.length, open])

  // Auto-expire reactions after 2.4s
  useEffect(() => {
    const timers = reactions.map(r => setTimeout(() => dropReact(r.id), 2400))
    return () => { timers.forEach(clearTimeout) }
  }, [reactions, dropReact])

  const submit = () => {
    const t = draft.trim()
    if (!t) return
    sendChat(t)
    setDraft('')
  }

  return (
    <>
      {/* Floating reactions overlay — bottom-center */}
      <div style={{
        position: 'fixed', zIndex: 70, bottom: '160px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column-reverse',
        gap: '8px', pointerEvents: 'none',
      }}>
        {reactions.map(r => (
          <div
            key={r.id}
            style={{
              background: 'rgba(13,43,20,0.85)',
              border: '1px solid rgba(245,197,24,0.35)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '14px',
              color: '#FDF8EE',
              animation: 'fade-up 2.4s ease-out forwards',
              fontFamily: 'monospace',
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '6px' }}>{r.emoji}</span>
            {r.fromName}
          </div>
        ))}
      </div>
      <style>{`@keyframes fade-up { 0% { opacity: 0; transform: translateY(20px); } 12%, 75% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-16px); } }`}</style>

      {/* Toggle button — top right, below dice if any */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-2 right-2 sm:top-4 sm:right-32 z-30 glass-card px-2 py-1 text-[10px] sm:text-xs font-mono"
        style={{ position: 'fixed' }}
      >
        💬 {open ? 'cerrar' : (unread > 0 ? `${unread} nuevo${unread !== 1 ? 's' : ''}` : 'chat')}
      </button>

      {/* Sidebar */}
      {open && (
        <div
          style={{
            position: 'fixed', zIndex: 35,
            top: '60px', right: '8px', bottom: '180px',
            width: '300px', maxWidth: 'calc(100vw - 16px)',
            background: 'linear-gradient(180deg, rgba(13,43,20,0.95), rgba(6,14,8,0.95))',
            border: '1px solid rgba(245,197,24,0.3)',
            borderRadius: '14px',
            display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(6px)',
          }}
        >
          {/* Messages */}
          <div
            ref={listRef}
            style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            {messages.length === 0 && (
              <p className="text-bfa-cream/30 text-xs text-center mt-4 font-mono">Sin mensajes aún.</p>
            )}
            {messages.map((m, i) => {
              const isMine = m.fromId === mySessionId
              return (
                <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-1.5 text-xs ${
                      isMine
                        ? 'bg-bfa-gold-500/15 border border-bfa-gold-500/30 text-bfa-cream'
                        : 'bg-white/5 border border-white/10 text-bfa-cream'
                    }`}
                  >
                    {!isMine && (
                      <p className="text-bfa-gold-500/80 text-[10px] font-mono mb-0.5">{m.fromName}</p>
                    )}
                    <p>{m.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reactions row */}
          <div className="flex gap-1 px-2 py-1 border-t border-white/10 overflow-x-auto scrollbar-hide">
            {QUICK_REACTS.map(e => (
              <button
                key={e}
                onClick={() => sendReact(e)}
                className="text-lg px-1.5 py-0.5 rounded hover:bg-white/10 shrink-0"
              >
                {e}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-1 p-2 border-t border-white/10">
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit() }}
              placeholder="Escribí…"
              maxLength={200}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-bfa-cream text-xs outline-none focus:border-bfa-gold-500/40"
            />
            <button onClick={submit} className="btn-gold text-xs px-3 py-1">
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
