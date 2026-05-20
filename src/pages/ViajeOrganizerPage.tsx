import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatViaje, type ViajeMessage } from '../api/viaje'
import AppBottomNav from '../components/AppBottomNav'

const SUGERENCIAS_RAPIDAS = [
  ['🏖️ Playa', 'Voy a la playa'],
  ['🏙️ Ciudad', 'Voy a una ciudad'],
  ['🏔️ Montaña', 'Voy a la montaña'],
  ['✈️ Europa', 'Voy a Europa'],
]

const DURACIONES = ['3 días', '5 días', '7 días', '10+ días']

export default function ViajeOrganizerPage() {
  const navigate = useNavigate()
  const [messages,  setMessages]  = useState<ViajeMessage[]>([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [initiated, setInitiated] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Arranca la conversación automáticamente al entrar
  useEffect(() => {
    if (!initiated) {
      setInitiated(true)
      sendMessage([], '')   // primer turno → IA saluda y pregunta destino
    }
  }, [])

  // Scroll al fondo al recibir mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (history: ViajeMessage[], userText: string) => {
    const newHistory: ViajeMessage[] = userText.trim()
      ? [...history, { role: 'user', content: userText.trim() }]
      : history

    if (userText.trim()) setMessages(newHistory)
    setLoading(true)
    setInput('')

    try {
      const res = await chatViaje(newHistory)
      const assistantMsg: ViajeMessage = { role: 'assistant', content: res.data.respuesta }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '😔 Algo salió mal. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(messages, input)
  }

  const handleChip = (text: string) => {
    if (loading) return
    sendMessage(messages, text)
  }

  // ¿Es el plan final? (mensaje largo con emoji 📅)
  const isPlan = (text: string) => text.includes('📅') && text.length > 200

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header con imagen ──────────────────────────────── */}
      <header style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ height: '180px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80"
            alt="Viaje"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%)' }} />
        </div>

        {/* Navegación sobre la imagen */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>SmartCloset</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1 }}>
              Organiza tu <span style={{ fontStyle: 'italic' }}>viaje</span>
            </h1>
          </div>
        </div>

        {/* Pill inferior */}
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '5px 14px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: '14px' }}>✈️</span>
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#fff', fontWeight: 500 }}>Outfits perfectos para cada día</span>
        </div>
      </header>

      {/* ── Chat ───────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '160px' }}>

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>

            {/* Avatar IA */}
            {msg.role === 'assistant' && (
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#C4956A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '2px' }}>
                <span style={{ fontSize: '13px' }}>✦</span>
              </div>
            )}

            {/* Burbuja */}
            <div style={{
              maxWidth: '78%',
              padding: isPlan(msg.content) ? '16px' : '11px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              backgroundColor: msg.role === 'user' ? '#3D2B1F' : '#fff',
              boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            }}>
              {isPlan(msg.content) ? (
                // Plan de viaje formateado
                <div>
                  {msg.content.split('\n').map((line, li) => {
                    if (line.startsWith('📅')) return (
                      <p key={li} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontWeight: 600, color: '#1A1A1A', margin: '12px 0 4px' }}>{line}</p>
                    )
                    if (line.startsWith('👗') || line.startsWith('✦')) return (
                      <p key={li} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#4A3420', margin: '2px 0', lineHeight: 1.5 }}>{line}</p>
                    )
                    return line.trim() ? (
                      <p key={li} style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: '4px 0', lineHeight: 1.6 }}>{line}</p>
                    ) : <div key={li} style={{ height: '4px' }} />
                  })}
                </div>
              ) : (
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: msg.role === 'user' ? '#fff' : '#1A1A1A', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#C4956A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '13px' }}>✦</span>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C4956A', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input fijo ─────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#FAF7F2', borderTop: '1px solid #EDE8E1', padding: '10px 16px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))', zIndex: 40 }}>

        {/* Chips de sugerencia rápida — solo al inicio */}
        {messages.length <= 2 && !loading && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '8px' }}>
            {SUGERENCIAS_RAPIDAS.map(([label, text]) => (
              <button key={label} onClick={() => handleChip(text)} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#C4956A', backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.25)', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {label}
              </button>
            ))}
            {DURACIONES.map(d => (
              <button key={d} onClick={() => handleChip(d)} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {d}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu respuesta..."
            disabled={loading}
            style={{ flex: 1, border: '1.5px solid #E0D5C8', borderRadius: '24px', padding: '11px 16px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1A1A1A' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#C4956A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (loading || !input.trim()) ? 0.5 : 1, transition: 'opacity 0.15s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4 20-7z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>

      <AppBottomNav />
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0) }
          30% { transform: translateY(-6px) }
        }
      `}</style>
    </div>
  )
}
