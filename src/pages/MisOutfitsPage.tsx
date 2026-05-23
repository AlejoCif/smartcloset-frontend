import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { subirMiOutfit, getMisOutfits, eliminarMiOutfit, chatMiOutfit } from '../api/misOutfits'
import ImageModal from '../components/ImageModal'
import AppBottomNav from '../components/AppBottomNav'
import type { MiOutfitItem } from '../types'

// ── Preguntas sugeridas ──────────────────────────────────────
const SUGERIDAS = [
  '¿Qué zapatos combinan mejor?',
  '¿Qué color me favorece?',
  '¿Cómo hacerlo más elegante?',
]

const ACCIONES = [
  { label: '✦ Mejorar look',      pregunta: '¿Cómo puedo mejorar este look?' },
  { label: 'Versión elegante',    pregunta: '¿Cómo haría este look más elegante?' },
  { label: 'Versión noche',       pregunta: '¿Cómo adapto este look para salir de noche?' },
  { label: 'Versión oficina',     pregunta: '¿Cómo adapto este look para la oficina?' },
]

// ── AnalysisCard ─────────────────────────────────────────────
function AnalysisCard({
  item,
  onEliminar,
}: {
  item: MiOutfitItem
  onEliminar: () => void
}) {
  const [modalImg,     setModalImg]     = useState(false)
  const [chatMsg,      setChatMsg]      = useState('')
  const [chatRes,      setChatRes]      = useState('')
  const [chatLoading,  setChatLoading]  = useState(false)
  const [confirmDel,   setConfirmDel]   = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChat = async (msg?: string) => {
    const texto = (msg ?? chatMsg).trim()
    if (!texto) return
    setChatMsg(texto)
    setChatLoading(true)
    setChatRes('')
    try {
      const r = await chatMiOutfit(item.id, texto)
      setChatRes(r.data.respuesta)
    } finally { setChatLoading(false) }
  }

  const fillChat = (pregunta: string) => {
    setChatMsg(pregunta)
    setChatRes('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleEliminar = async () => {
    setDeleting(true)
    try { await eliminarMiOutfit(item.id); onEliminar() }
    finally { setDeleting(false) }
  }

  // Construir 3 insights del análisis IA
  const insights: { icon: string; iconColor: string; bg: string; title: string; desc: string }[] = []
  if (item.puntosPositivos[0]) insights.push({ icon: '✦', iconColor: '#6B8F5E', bg: 'rgba(107,143,94,0.12)', title: 'Favorece tu estilo', desc: item.puntosPositivos[0] })
  if (item.puntosPositivos[1]) insights.push({ icon: '☀', iconColor: '#C4956A', bg: 'rgba(196,149,106,0.12)', title: 'Punto destacado', desc: item.puntosPositivos[1] })
  if (item.sugerencias[0])     insights.push({ icon: '⊟', iconColor: '#C4614A', bg: 'rgba(196,97,74,0.10)', title: 'Sugerencia stylist', desc: item.sugerencias[0] })

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      {modalImg && <ImageModal src={item.fotoUrl} onClose={() => setModalImg(false)} />}

      {/* Top: foto + análisis */}
      <div style={{ display: 'flex', gap: '12px', padding: '16px 16px 0' }}>

        {/* Foto con badge */}
        <div style={{ position: 'relative', flex: '0 0 42%', cursor: 'zoom-in' }} onClick={() => setModalImg(true)}>
          <img src={item.fotoUrl} alt="Mi outfit" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '12px', display: 'block' }} />
          <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700, color: '#1A1A1A' }}>{item.calificacion}/100 Style ✦</span>
          </div>
        </div>

        {/* Texto análisis */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Análisis IA</p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.5 }}>{item.resumen}</p>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: ins.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '14px', color: ins.iconColor }}>{ins.icon}</span>
              </div>
              <div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 2px' }}>{ins.title}</p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: 0, lineHeight: 1.4 }}>{ins.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {ACCIONES.map(({ label, pregunta }, i) => (
          <button key={i} onClick={() => fillChat(pregunta)} style={{
            flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500,
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', border: 'none',
            backgroundColor: i === 0 ? '#3D2B1F' : 'transparent',
            color: i === 0 ? '#fff' : '#9E9690',
            outline: i === 0 ? 'none' : '1.5px solid #E0D5C8',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Chat con stylist IA */}
      <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderTop: '1px solid #F0EBE3' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>💬 Consulta a tu stylist IA</p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 400, color: '#1A1A1A', marginBottom: '12px' }}>¿Qué te gustaría saber sobre este outfit?</p>

        {/* Chips sugeridos */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '12px' }}>
          {SUGERIDAS.map((s, i) => (
            <button key={i} onClick={() => fillChat(s)} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#C4956A', backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.25)', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            type="text"
            value={chatMsg}
            onChange={e => { setChatMsg(e.target.value); setChatRes('') }}
            onKeyDown={e => e.key === 'Enter' && handleChat()}
            placeholder="Escribe tu pregunta..."
            style={{ flex: 1, border: '1.5px solid #E0D5C8', borderRadius: '12px', padding: '10px 14px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
          />
          <button onClick={() => handleChat()} disabled={chatLoading || !chatMsg.trim()} style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#C4956A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (chatLoading || !chatMsg.trim()) ? 0.5 : 1 }}>
            {chatLoading
              ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
            }
          </button>
        </div>

        {chatRes && (
          <div style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '12px 14px', border: '1px solid #F0EBE3' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{chatRes}</p>
          </div>
        )}
      </div>

      {/* Eliminar */}
      <div style={{ padding: '10px 16px 14px', display: 'flex', justifyContent: 'flex-end' }}>
        {!confirmDel
          ? <button onClick={() => setConfirmDel(true)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#C9BFB5', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
          : <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setConfirmDel(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', background: 'none', border: '1px solid #E0D5C8', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleEliminar} disabled={deleting} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#fff', backgroundColor: '#E05555', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', opacity: deleting ? 0.6 : 1 }}>{deleting ? 'Eliminando...' : 'Sí, eliminar'}</button>
            </div>
        }
      </div>
    </div>
  )
}

// ── Upload Sheet ─────────────────────────────────────────────
function UploadSheet({ onFile, onClose }: { onFile: (f: File) => void; onClose: () => void }) {
  const cameraRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { onFile(f); onClose() }
    e.target.value = ''
  }

  return (
    <>
      <input ref={cameraRef}  type="file" accept="image/*" capture="user"  className="hidden" onChange={handleChange} />
      <input ref={galleryRef} type="file" accept="image/*"                  className="hidden" onChange={handleChange} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 32px' }} onClick={onClose}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
          <div style={{ width: '36px', height: '4px', backgroundColor: '#E0D5C8', borderRadius: '2px', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#1A1A1A', textAlign: 'center', marginBottom: '6px' }}>Subir mi outfit</p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', textAlign: 'center', marginBottom: '20px' }}>Elige cómo quieres subir la foto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => cameraRef.current?.click()} style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: '#3D2B1F', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              📷 Tomar foto con cámara
            </button>
            <button onClick={() => galleryRef.current?.click()} style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: 'transparent', color: '#3D2B1F', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: '1.5px solid #D4BFA4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🖼 Elegir de galería
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── MisOutfitsPage ───────────────────────────────────────────
export default function MisOutfitsPage() {
  const navigate   = useNavigate()
  const [outfits,               setOutfits]               = useState<MiOutfitItem[]>([])
  const [loading,               setLoading]               = useState(true)
  const [subiendo,              setSubiendo]              = useState(false)
  const [error,                 setError]                 = useState('')
  const [showSheet,             setShowSheet]             = useState(false)
  const [selectedId,            setSelectedId]            = useState<number | null>(null)
  const [verTodos,              setVerTodos]              = useState(false)
  const [considerarColorimetria, setConsiderarColorimetria] = useState(() =>
    localStorage.getItem('colorimetria_activa') !== 'false'
  )

  useEffect(() => { localStorage.setItem('colorimetria_activa', String(considerarColorimetria)) }, [considerarColorimetria])

  useEffect(() => {
    getMisOutfits().then(r => setOutfits(r.data)).finally(() => setLoading(false))
  }, [])

  // ── Lógica existente intacta ──────────────────────────────
  const handleFile = async (file: File) => {
    setSubiendo(true)
    setError('')
    try {
      const res = await subirMiOutfit(file, considerarColorimetria)
      setOutfits(prev => [res.data, ...prev])
    } catch {
      setError('No pudimos analizar el outfit. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '96px' }}>

      {showSheet && <UploadSheet onFile={handleFile} onClose={() => setShowSheet(false)} />}

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ padding: '52px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/home')} style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>Mis Outfits</h1>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: '2px 0 0' }}>{loading ? '...' : `${outfits.length} look${outfits.length !== 1 ? 's' : ''} analizados`}</p>
          </div>
        </div>
        <button onClick={() => setShowSheet(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, color: '#3D2B1F', backgroundColor: 'transparent', border: '1.5px solid #D4BFA4', borderRadius: '20px', padding: '7px 14px', cursor: 'pointer' }}>
          <span>✦</span> Analizar look
        </button>
      </header>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── Card hero de upload ─────────────────────────── */}
        {!subiendo && (
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', height: '180px' }}>

            {/* Izquierda: texto + botones */}
            <div style={{ flex: '0 0 55%', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1.25 }}>
                Descubre cómo te percibe tu outfit ✦
              </p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0, lineHeight: 1.4 }}>
                La IA analiza tu look y te da insights reales.
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setShowSheet(true)}
                  style={{ flex: 1, fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, color: '#fff', backgroundColor: '#3D2B1F', border: 'none', borderRadius: '20px', padding: '7px 8px', cursor: 'pointer' }}
                >
                  📷 Cámara
                </button>
                <button
                  onClick={() => setShowSheet(true)}
                  style={{ flex: 1, fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, color: '#3D2B1F', backgroundColor: 'transparent', border: '1.5px solid #D4BFA4', borderRadius: '20px', padding: '7px 8px', cursor: 'pointer' }}
                >
                  🖼 Galería
                </button>
              </div>
            </div>

            {/* Derecha: imagen decorativa */}
            <div style={{ flex: '0 0 45%', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff 0%, transparent 50%)' }} />
            </div>
          </div>
        )}

        {/* ── Toggle colorimetría ─────────────────────────── */}
        {!subiendo && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ flex: 1, marginRight: '12px' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 3px' }}>🎨 Considerar mi colorimetría</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0 }}>
                {considerarColorimetria ? 'La IA adaptará el análisis a tu paleta personal' : 'La IA evaluará el outfit sin considerar tus colores'}
              </p>
            </div>
            <button
              onClick={() => setConsiderarColorimetria(v => !v)}
              style={{
                position: 'relative', width: '46px', height: '26px', borderRadius: '13px',
                backgroundColor: considerarColorimetria ? '#C4956A' : '#9E9690',
                border: 'none', cursor: 'pointer', flexShrink: 0,
                transition: 'background-color 0.2s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: considerarColorimetria ? '23px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: '#fff',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        )}

        {/* ── Analizando ─────────────────────────────────── */}
        {subiendo && (
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#1A1A1A', margin: 0 }}>Analizando tu outfit...</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>La IA está evaluando tu look</p>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────── */}
        {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#E05555', backgroundColor: '#FEE', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', margin: 0 }}>{error}</p>}

        {/* ── Loading inicial ─────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {/* ── Vacío ──────────────────────────────────────── */}
        {!loading && outfits.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 0', gap: '10px' }}>
            <span style={{ fontSize: '48px' }}>👗</span>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#1A1A1A', margin: 0 }}>Sin looks analizados aún</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>Sube una foto de lo que llevas puesto y la IA te dice cómo quedó</p>
          </div>
        )}

        {/* ── Outfit seleccionado (análisis expandido) ──── */}
        {!loading && outfits.length > 0 && (() => {
          const focused = outfits.find(o => o.id === selectedId) ?? outfits[0]
          return (
            <AnalysisCard
              key={focused.id}
              item={focused}
              onEliminar={() => {
                setOutfits(prev => {
                  const next = prev.filter(x => x.id !== focused.id)
                  if (selectedId === focused.id) setSelectedId(next[0]?.id ?? null)
                  return next
                })
              }}
            />
          )
        })()}

        {/* ── Carrusel de todos los análisis ──────────────── */}
        {!loading && outfits.length > 1 && !verTodos && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>Tus últimos análisis</p>
              <button
                onClick={() => setVerTodos(true)}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#C4956A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Ver todos ›
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
              {outfits.map(o => {
                const isSel = o.id === (selectedId ?? outfits[0]?.id)
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    style={{ flexShrink: 0, position: 'relative', width: '90px', cursor: 'pointer' }}
                  >
                    <img
                      src={o.fotoUrl}
                      alt="outfit"
                      style={{
                        width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px', display: 'block',
                        outline: isSel ? '2.5px solid #C4956A' : '2.5px solid transparent',
                        transition: 'outline 0.15s',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '10px', padding: '2px 7px' }}>
                      <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap' }}>{o.calificacion}/100</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Ver todos: lista completa ────────────────────── */}
        {!loading && verTodos && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
                Todos los análisis ({outfits.length})
              </p>
              <button
                onClick={() => setVerTodos(false)}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#C4956A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                ‹ Ver menos
              </button>
            </div>
            {outfits.map(o => (
              <AnalysisCard
                key={o.id}
                item={o}
                onEliminar={() => setOutfits(prev => prev.filter(x => x.id !== o.id))}
              />
            ))}
          </div>
        )}

      </div>

      <AppBottomNav />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
