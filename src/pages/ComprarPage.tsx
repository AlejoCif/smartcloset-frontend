import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { analizarCompra, chatCompra } from '../api/compras'
import { confirmarPrenda } from '../api/prendas'
import AppBottomNav from '../components/AppBottomNav'
import type { AnalizarCompraResponse } from '../types'

// ── Configuración de veredictos (lógica existente intacta) ───
const VEREDICTO_CONFIG = {
  NECESARIO:      { label: 'Lo necesitas ✅', score: 92, bg: 'rgba(107,143,94,0.1)',  border: 'rgba(107,143,94,0.3)',  color: '#6B8F5E' },
  UTIL:           { label: 'Útil 👍',          score: 74, bg: 'rgba(196,149,106,0.1)', border: 'rgba(196,149,106,0.3)', color: '#C4956A' },
  INNECESARIO:    { label: 'Innecesario 🤔',   score: 48, bg: 'rgba(196,149,74,0.1)',  border: 'rgba(196,149,74,0.3)',  color: '#B8862A' },
  NO_RECOMENDADO: { label: 'No lo compres ❌', score: 22, bg: 'rgba(196,97,74,0.1)',   border: 'rgba(196,97,74,0.3)',   color: '#C4614A' },
}

// ── Criterios de evaluación IA ───────────────────────────────
const CRITERIOS = [
  { icon: '🪡', title: 'Compatibilidad',  desc: '¿Combina con tu closet?' },
  { icon: '🎨', title: 'Colorimetría',    desc: '¿Favorece tu tono de piel?' },
  { icon: '📊', title: 'Versatilidad',    desc: '¿Cuántos outfits puedes crear?' },
  { icon: '🏷',  title: 'Necesidad real', desc: '¿Ya tienes algo similar?' },
  { icon: '💰', title: 'Costo por uso',   desc: '¿Vale lo que cuesta?' },
]

const TABS_MODO = ['Inteligente ✦', 'Estratégica ⊙', 'Cápsula', 'Lujo silencioso 💎']

const CHAT_CHIPS = [
  '¿Con qué lo combino?',
  '¿Es versátil?',
  '¿Vale la pena el precio?',
]

export default function ComprarPage() {
  // ── Estado existente intacto ──────────────────────────────
  const [preview,     setPreview]     = useState<string | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [resultado,   setResultado]   = useState<AnalizarCompraResponse | null>(null)
  const [error,       setError]       = useState('')
  const [chatMsg,     setChatMsg]     = useState('')
  const [chatRes,     setChatRes]     = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [guardando,   setGuardando]   = useState(false)
  const [guardado,    setGuardado]    = useState(false)
  const [tabActivo,   setTabActivo]   = useState(0)

  const cameraInputRef  = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // ── Lógica existente intacta ──────────────────────────────
  const handleFile = async (f: File) => {
    setPreview(URL.createObjectURL(f))
    setResultado(null)
    setError('')
    setChatRes('')
    setLoading(true)
    try {
      const res = await analizarCompra(f)
      setResultado(res.data)
    } catch {
      setError('No pudimos analizar la prenda. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
    e.target.value = ''
  }

  const handleChat = async () => {
    if (!chatMsg.trim() || !resultado) return
    setChatLoading(true)
    try {
      const res = await chatCompra(resultado.fotoUrl, chatMsg.trim())
      setChatRes(res.data.respuesta)
    } finally { setChatLoading(false) }
  }

  const handleGuardar = async () => {
    if (!resultado) return
    setGuardando(true)
    try {
      await confirmarPrenda(resultado.fotoUrl, {
        categoria: 'OTRO',
        colorPrincipal: '',
        descripcionIa: `Compra analizada: ${resultado.titulo}`,
      })
      setGuardado(true)
    } catch {
      setError('No se pudo guardar en el closet.')
    } finally { setGuardando(false) }
  }

  const handleNueva = () => {
    setPreview(null); setResultado(null); setError('')
    setChatRes(''); setChatMsg(''); setGuardado(false)
  }

  const cfg = resultado ? VEREDICTO_CONFIG[resultado.veredicto] : null

  // ── Inputs de archivo ocultos ─────────────────────────────
  const fileInputs = (
    <>
      <input ref={cameraInputRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInputChange} />
      <input ref={galleryInputRef} type="file" accept="image/*"                       className="hidden" onChange={handleInputChange} />
    </>
  )

  // ── Vista: Confirmación guardado ──────────────────────────
  if (guardado) return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', textAlign: 'center', paddingBottom: '96px' }}>
      <span style={{ fontSize: '56px' }}>🎉</span>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, color: '#1A1A1A', margin: 0 }}>¡Guardado en tu closet!</h2>
      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0, lineHeight: 1.5 }}>Ve a tu closet para completar los detalles de la prenda.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
        <button onClick={() => navigate('/closet/agregar')} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#C4956A', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          Completar detalles
        </button>
        <button onClick={handleNueva} style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'transparent', color: '#9E9690', fontFamily: 'Jost, sans-serif', fontSize: '13px', border: '1px solid #D4BFA4', cursor: 'pointer' }}>
          Analizar otra compra
        </button>
      </div>
      <AppBottomNav />
    </div>
  )

  // ── Vista: Resultado del análisis ─────────────────────────
  if (resultado && cfg) return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '96px' }}>
      {fileInputs}

      <header style={{ padding: '52px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={handleNueva} style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Análisis IA</h1>
        <div style={{ width: '36px' }} />
      </header>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Foto + veredicto */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
          <img src={preview!} alt="Prenda" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px' }}>Veredicto IA</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#fff', margin: 0 }}>{cfg.label}</p>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: cfg.color, margin: 0, lineHeight: 1 }}>{cfg.score}</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', color: '#9E9690', margin: 0 }}>Score IA</p>
            </div>
          </div>
        </div>

        {/* Análisis */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${cfg.border}` }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: '0 0 10px', lineHeight: 1.6 }}>{resultado.explicacion}</p>
          {resultado.consejo && (
            <div style={{ backgroundColor: cfg.bg, borderRadius: '10px', padding: '10px 12px', borderTop: `1px solid ${cfg.border}` }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: cfg.color, margin: 0, lineHeight: 1.5 }}>💡 {resultado.consejo}</p>
            </div>
          )}
        </div>

        {/* Prenda similar */}
        {resultado.prendaSimilarUrl && (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={resultado.prendaSimilarUrl} alt="Similar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px' }}>Ya tienes algo similar</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0 }}>Revisa tu closet antes de comprar</p>
            </div>
          </div>
        )}

        {/* Chat */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>💬 Pregúntale a la IA</p>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '10px' }}>
            {CHAT_CHIPS.map(chip => (
              <button key={chip} onClick={() => { setChatMsg(chip); setChatRes('') }} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#C4956A', backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.2)', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{chip}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" value={chatMsg} onChange={e => { setChatMsg(e.target.value); setChatRes('') }} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="¿Combina con mi closet? ¿Es versátil?..." style={{ flex: 1, border: '1.5px solid #E0D5C8', borderRadius: '12px', padding: '10px 14px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#FAF7F2' }} />
            <button onClick={handleChat} disabled={chatLoading || !chatMsg.trim()} style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#C4956A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (chatLoading || !chatMsg.trim()) ? 0.5 : 1 }}>
              {chatLoading
                ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
              }
            </button>
          </div>
          {chatRes && <div style={{ marginTop: '10px', backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '12px 14px' }}><p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{chatRes}</p></div>}
        </div>

        {/* Acciones */}
        <button onClick={handleGuardar} disabled={guardando} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#3D2B1F', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', opacity: guardando ? 0.7 : 1 }}>
          {guardando ? 'Guardando...' : '✅ Lo compré — guardar en mi closet'}
        </button>
        <button onClick={handleNueva} style={{ width: '100%', padding: '14px', borderRadius: '16px', backgroundColor: 'transparent', color: '#9E9690', fontFamily: 'Jost, sans-serif', fontSize: '13px', border: '1px solid #D4BFA4', cursor: 'pointer' }}>
          ❌ No lo compré — analizar otra
        </button>
      </div>

      <AppBottomNav />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── Vista principal (landing + upload) ────────────────────
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '96px' }}>
      {fileInputs}

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ padding: '52px 16px 0', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

          {/* Texto izquierda */}
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <button onClick={() => navigate('/home')} style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              </button>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '30px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 6px', lineHeight: 1.1 }}>¿Lo compro?</h1>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: '0 0 14px', lineHeight: 1.4 }}>Tu stylist IA te ayuda a tomar mejores decisiones de compra</p>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80',
                ].map((url, i) => (
                  <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FAF7F2', marginLeft: i > 0 ? '-8px' : 0 }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: 0 }}>+12k mujeres ya compran mejor 🤎</p>
            </div>
          </div>

          {/* Imagen decorativa */}
          <div style={{ width: '120px', height: '160px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Banner IA */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E0D5C8', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(196,149,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#C4956A', fontSize: '14px' }}>✦</span>
          </div>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#4A3420', margin: 0, lineHeight: 1.5 }}>
            La IA analiza <strong>compatibilidad, colorimetría, versatilidad</strong> y te dice si realmente vale la pena.
          </p>
        </div>

        {/* Error */}
        {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#E05555', backgroundColor: '#FEE', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', margin: 0 }}>{error}</p>}

        {/* Loading */}
        {loading && (
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.07)' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#1A1A1A', margin: 0 }}>Analizando tu prenda...</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: 0, textAlign: 'center' }}>La IA está revisando tu closet y colorimetría</p>
          </div>
        )}

        {/* ── PASO 1: Sube la prenda ──────────────────────── */}
        {!loading && (
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>1. Sube la prenda que quieres analizar</p>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px dashed #D4BFA4', display: 'flex', minHeight: '180px' }}>

              {/* Izquierda: acciones */}
              <div style={{ flex: '0 0 58%', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(196,149,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 4px' }}>Sube una foto clara de la prenda completa</p>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0 }}>Fondo limpio, buena luz y sin filtros</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  <button onClick={() => cameraInputRef.current?.click()} style={{ padding: '9px', borderRadius: '10px', backgroundColor: '#C4956A', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                    📷 Tomar foto
                  </button>
                  <button onClick={() => galleryInputRef.current?.click()} style={{ padding: '9px', borderRadius: '10px', backgroundColor: 'transparent', color: '#3D2B1F', fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, border: '1.5px solid #D4BFA4', cursor: 'pointer' }}>
                    🖼 Subir desde galería
                  </button>
                </div>
              </div>

              {/* Derecha: fotos ideales */}
              <div style={{ flex: '0 0 42%', padding: '12px 12px 12px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Fotos ideales</p>
                {[
                  { ok: true,  label: 'Prenda completa',            url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=60&q=80' },
                  { ok: true,  label: 'Buena iluminación',          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&q=80' },
                  { ok: true,  label: 'Fondo limpio',               url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=60&q=80' },
                  { ok: false, label: 'Evita filtros',              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=60&q=80' },
                ].map(({ ok, label, url }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: ok ? '#6B8F5E' : '#C4614A', fontWeight: 600, flexShrink: 0 }}>{ok ? '✓' : '✗'}</span>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: '#9E9690', margin: 0, lineHeight: 1.3 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 2: La IA evaluará ─────────────────────── */}
        {!loading && (
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>2. La IA evaluará tu prenda en:</p>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
              {CRITERIOS.map(({ icon, title, desc }) => (
                <div key={title} style={{ flexShrink: 0, width: '110px', backgroundColor: '#fff', borderRadius: '14px', padding: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #F0EBE3', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(196,149,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '18px' }}>{icon}</span>
                  </div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{title}</p>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: '#9E9690', margin: 0, lineHeight: 1.3 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PASO 3: Ejemplo de resultado ─────────────────── */}
        {!loading && (
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>3. Recibirás un análisis completo</p>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #F0EBE3', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2.5px solid #C4956A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 700, color: '#C4956A', margin: 0, lineHeight: 1 }}>82</p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '7px', color: '#9E9690', margin: 0 }}>Score IA</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {['Combina con 18 outfits', 'Alta versatilidad', 'Favorece tu colorimetría', 'Buena inversión'].map(item => (
                  <p key={item} style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: '#6B8F5E', margin: 0 }}>✓ {item}</p>
                ))}
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: '#9E9690', margin: '2px 0 0', textDecoration: 'underline', cursor: 'default' }}>Ver outfits que puedes crear →</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs modo de compra ─────────────────────────── */}
        {!loading && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS_MODO.map((tab, i) => (
              <button key={tab} onClick={() => setTabActivo(i)} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', transition: 'all 0.15s', backgroundColor: tabActivo === i ? '#3D2B1F' : '#fff', color: tabActivo === i ? '#fff' : '#9E9690', boxShadow: tabActivo === i ? 'none' : '0 1px 4px rgba(0,0,0,0.07)', outline: tabActivo === i ? 'none' : '1px solid #E0D5C8' }}>
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* ── Botón principal — LÓGICA EXACTAMENTE IGUAL ─── */}
        {!loading && (
          <button
            onClick={() => galleryInputRef.current?.click()}
            style={{ width: '100%', height: '56px', backgroundColor: '#C4956A', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', boxShadow: '0 4px 20px rgba(196,149,106,0.35)' }}
          >
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#fff', lineHeight: 1 }}>✦ Analizar prenda</span>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>Obtén tu opinión honesta de la IA</span>
          </button>
        )}

      </div>

      <AppBottomNav />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
