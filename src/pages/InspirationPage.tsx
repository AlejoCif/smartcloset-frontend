import { useState } from 'react'
import { buscarInspiracion, analizarInspiracion } from '../api/inspiration'
import AppBottomNav from '../components/AppBottomNav'
import { useNavigate } from 'react-router-dom'
import type { InspirationImage, InspirationAnalisisResponse } from '../types'
import { CATEGORIA_LABELS } from '../types'

// ── Datos estáticos ──────────────────────────────────────────
const CHIPS = [
  'outfits de verano playa', 'looks casual minimalista',
  'outfits de trabajo elegante', 'estilo boho chic',
  'outfits otoño cálido', 'looks noche ciudad',
]

const MAS_IDEAS = [
  { emoji: '☀️', label: 'Verano' },
  { emoji: '🍂', label: 'Otoño'  },
  { emoji: '💼', label: 'Oficina'},
  { emoji: '🌙', label: 'Noche'  },
  { emoji: '✦',  label: 'Minimal'},
]

const ESTILOS_VISUAL = [
  { label: 'Verano playa',       query: 'verano playa outfit',        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80' },
  { label: 'Casual minimalista', query: 'casual minimalista outfit',  img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80' },
  { label: 'Trabajo elegante',   query: 'work elegant outfit',        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  { label: 'Noche ciudad',       query: 'night out city outfit',      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&q=80' },
  { label: 'Estilo boho chic',   query: 'boho chic fashion outfit',   img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&q=80' },
]

// ── Panel de análisis (bottom sheet) ────────────────────────
function AnalisisSheet({
  img,
  analisis,
  analizando,
  onClose,
}: {
  img: InspirationImage
  analisis: InspirationAnalisisResponse | null
  analizando: boolean
  onClose: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '430px', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }} onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', backgroundColor: '#E0D5C8', borderRadius: '2px' }} />
        </div>

        {/* Imagen seleccionada */}
        <img src={img.imageUrl} alt={img.titulo} onError={e => (e.currentTarget.style.display = 'none')}
          style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Analizando */}
          {analizando && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
              <div style={{ width: '18px', height: '18px', border: '2px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>Analizando el look con tu closet...</p>
            </div>
          )}

          {analisis && (
            <>
              {/* Descripción */}
              <div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>El look</p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.5 }}>{analisis.descripcionLook}</p>
              </div>

              {/* Barra similitud */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: 0, flexShrink: 0 }}>Similitud con tu closet</p>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#F2EBE0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${analisis.similitud}%`, backgroundColor: '#C4956A', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 700, color: '#C4956A', flexShrink: 0 }}>{analisis.similitud}%</span>
              </div>

              {/* Prendas */}
              {analisis.prendas.length > 0 && (
                <div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>Úsalas de tu closet</p>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {analisis.prendas.map(p => (
                      <div key={p.id} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F2EBE0' }}>
                          <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: '#9E9690', margin: 0, width: '64px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{CATEGORIA_LABELS[p.categoria] ?? p.categoria}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consejo */}
              <div style={{ backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.2)', borderRadius: '14px', padding: '14px' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.5 }}>
                  <span style={{ color: '#C4956A', fontWeight: 600 }}>✨ Consejo: </span>{analisis.consejo}
                </p>
              </div>
            </>
          )}

          <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: '#3D2B1F', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── InspirationPage ──────────────────────────────────────────
export default function InspirationPage() {
  const navigate = useNavigate()

  // ── Estado existente intacto ──────────────────────────────
  const [query,      setQuery]      = useState('')
  const [imagenes,   setImagenes]   = useState<InspirationImage[]>([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [seleccionada, setSelec]    = useState<InspirationImage | null>(null)
  const [analisis,   setAnalisis]   = useState<InspirationAnalisisResponse | null>(null)
  const [analizando, setAnalizando] = useState(false)
  const [favoritos,  setFavoritos]  = useState<Set<number>>(new Set())

  // ── Lógica existente intacta ──────────────────────────────
  const handleBuscar = async (q = query) => {
    if (!q.trim()) return
    setLoading(true); setError(''); setImagenes([]); setSelec(null); setAnalisis(null)
    try {
      const res = await buscarInspiracion(q.trim())
      setImagenes(res.data)
    } catch {
      setError('No pudimos buscar imágenes. Intenta de nuevo.')
    } finally { setLoading(false) }
  }

  const handleSeleccionar = async (img: InspirationImage) => {
    setSelec(img); setAnalisis(null); setAnalizando(true)
    try {
      const res = await analizarInspiracion(img.imageUrl)
      setAnalisis(res.data)
    } catch {
      setAnalisis(null)
    } finally { setAnalizando(false) }
  }

  const buscarTermino = (termino: string) => {
    setQuery(termino)
    handleBuscar(termino)
  }

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '96px' }}>

      {/* ── Panel de análisis ──────────────────────────────── */}
      {seleccionada && (
        <AnalisisSheet
          img={seleccionada}
          analisis={analisis}
          analizando={analizando}
          onClose={() => { setSelec(null); setAnalisis(null) }}
        />
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ padding: '52px 16px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => navigate('/home')} style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Inspiración</h1>
      </header>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Buscador ───────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1.5px solid #E0D5C8', borderRadius: '14px', padding: '0 14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9E9690" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBuscar()}
              placeholder="Busca un estilo o look..."
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', backgroundColor: 'transparent', padding: '13px 0' }}
            />
          </div>
          <button
            onClick={() => handleBuscar()}
            disabled={loading || !query.trim()}
            style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#C4956A', backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4', borderRadius: '14px', padding: '0 18px', cursor: loading ? 'not-allowed' : 'pointer', opacity: (!query.trim() && !loading) ? 0.5 : 1 }}
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </div>

        {/* ── Estado vacío ───────────────────────────────────── */}
        {!loading && imagenes.length === 0 && !error && (
          <>
            {/* Ideas para buscar */}
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>Ideas para buscar</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CHIPS.map(chip => (
                  <button key={chip} onClick={() => buscarTermino(chip)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#4A3420', backgroundColor: '#fff', border: '1px solid #E0D5C8', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Inspírate con estilos */}
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>Inspírate con estilos</p>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
                {ESTILOS_VISUAL.map(({ label, query: q, img }) => (
                  <button key={label} onClick={() => buscarTermino(q)} style={{ flexShrink: 0, width: '140px', height: '200px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
                    <p style={{ position: 'absolute', bottom: '14px', left: '12px', right: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 400, color: '#fff', margin: 0, textAlign: 'left', lineHeight: 1.2 }}>{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Más ideas */}
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>Más ideas</p>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {MAS_IDEAS.map(({ emoji, label }) => (
                  <button key={label} onClick={() => buscarTermino(label)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#4A3420', backgroundColor: '#fff', border: '1px solid #E0D5C8', borderRadius: '20px', padding: '7px 14px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty state card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '36px 24px', textAlign: 'center', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(196,149,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px', color: '#C4956A' }}>✦</span>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#1A1A1A', margin: 0, lineHeight: 1.2 }}>Busca tu próximo look</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0, lineHeight: 1.5, maxWidth: '280px' }}>
                Busca por estilo, ocasión, clima o mood. La IA lo compara con tu closet real.
              </p>
            </div>
          </>
        )}

        {/* ── Cargando ───────────────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>Buscando inspiración...</p>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#E05555', backgroundColor: '#FEE', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', margin: 0 }}>{error}</p>
        )}

        {/* ── Grid de resultados ─────────────────────────────── */}
        {imagenes.length > 0 && (
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', marginBottom: '12px' }}>
              Toca una imagen para ver cómo lograrlo con tu closet ✨
            </p>

            {/* Masonry 2 columnas con CSS columns */}
            <div style={{ columns: 2, columnGap: '8px' }}>
              {imagenes.map((img, i) => {
                const isFav = favoritos.has(i)
                return (
                  <div key={i} style={{ breakInside: 'avoid', marginBottom: '8px', position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                    <img
                      src={img.thumbnailUrl || img.imageUrl}
                      alt={img.titulo}
                      onError={e => (e.currentTarget.src = img.imageUrl)}
                      onClick={() => handleSeleccionar(img)}
                      style={{ width: '100%', display: 'block', aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '4/5' : '1/1', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    {/* Corazón favorito */}
                    <button
                      onClick={e => { e.stopPropagation(); setFavoritos(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s }) }}
                      style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? '#C4956A' : 'none'} stroke={isFav ? '#C4956A' : '#9E9690'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    {/* Fuente */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)', padding: '20px 8px 6px' }}>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{img.fuente}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      <AppBottomNav />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
