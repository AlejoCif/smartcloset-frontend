import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPrendas, deletePrenda } from '../api/prendas'
import ImageModal from '../components/ImageModal'
import type { Prenda } from '../types'
import { FILTROS_CATEGORIA, CATEGORIA_LABELS } from '../types'

// Orden visual de categorías para la vista agrupada
const CAT_ORDER = [
  'BLUSA','CAMISETA','CAMISA',
  'PANTALON','JEAN','LEGGINS','SHORT',
  'VESTIDO','FALDA','FALDA_CORTA','FALDA_LARGA',
  'BLAZER','CHAQUETA','ABRIGO',
  'ZAPATO_TACO','ZAPATO_PLANO','BOTA','TENIS','SANDALIA',
  'BOLSO','CARTERA',
  'COLLAR','ARETES','CINTURON',
  'OTRO',
]

function agruparPorCategoria(prendas: Prenda[]): [string, Prenda[]][] {
  const map: Record<string, Prenda[]> = {}
  for (const p of prendas) {
    if (!map[p.categoria]) map[p.categoria] = []
    map[p.categoria].push(p)
  }
  return Object.entries(map).sort(([a], [b]) => {
    const ia = CAT_ORDER.indexOf(a)
    const ib = CAT_ORDER.indexOf(b)
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
  })
}

// ── helpers ──────────────────────────────────────────────────
function isNueva(creadoEn: string) {
  return Date.now() - new Date(creadoEn).getTime() < 7 * 24 * 60 * 60 * 1000
}

const OCASION_LABEL: Record<string, string> = {
  CASUAL: 'Casual', ELEGANTE: 'Elegante', DEPORTIVO: 'Sport',
  TRABAJO: 'Trabajo', SALIDA_NOCTURNA: 'Noche',
}

// ── PrendaCard ───────────────────────────────────────────────
function PrendaCard({
  prenda,
  favorito,
  onToggleFav,
  onZoom,
  onCrearLook,
  onEliminar,
}: {
  prenda: Prenda
  favorito: boolean
  onToggleFav: () => void
  onZoom: () => void
  onCrearLook: () => void
  onEliminar: () => void
}) {
  const nueva = isNueva(prenda.creadoEn)
  const label = CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria
  const ocasionLabel = prenda.ocasion ? OCASION_LABEL[prenda.ocasion] ?? prenda.ocasion : null

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Foto */}
      <div style={{ position: 'relative', aspectRatio: '4/5', cursor: 'zoom-in' }} onClick={onZoom}>
        <img
          src={prenda.fotoUrl}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Badge NUEVO */}
        {nueva && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            backgroundColor: '#C4956A', color: '#fff',
            fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '20px',
          }}>
            NUEVO
          </span>
        )}

        {/* Corazón favorito */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav() }}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={favorito ? '#C4956A' : 'none'} stroke={favorito ? '#C4956A' : '#9E9690'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Botón eliminar (hover) */}
        <button
          onClick={e => { e.stopPropagation(); onEliminar() }}
          style={{
            position: 'absolute', bottom: '8px', right: '8px',
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9E9690" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </p>

        {/* Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: prenda.colorPrincipal, border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {prenda.colorPrincipal}
          </span>
        </div>

        {/* Chip ocasión */}
        {ocasionLabel && (
          <span style={{
            alignSelf: 'flex-start', fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 500,
            color: '#9E9690', backgroundColor: '#F2EBE0', padding: '2px 8px', borderRadius: '20px',
          }}>
            {ocasionLabel}
          </span>
        )}

        {/* Botón crear look */}
        <button
          onClick={onCrearLook}
          style={{
            width: '100%', backgroundColor: '#C4956A', color: '#fff',
            fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500,
            border: 'none', borderRadius: '8px', padding: '7px 0',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            marginTop: '2px',
          }}
        >
          <span style={{ fontSize: '11px' }}>✦</span> Crear look con IA
        </button>
      </div>
    </div>
  )
}

// ── ClosetPage ───────────────────────────────────────────────
export default function ClosetPage() {
  const [prendas,         setPrendas]         = useState<Prenda[]>([])
  const [filtro,          setFiltro]          = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [deletingId,      setDeletingId]      = useState<number | null>(null)
  const [confirmDelete,   setConfirmDelete]   = useState<number | null>(null)
  const [modalImg,        setModalImg]        = useState<{ src: string; alt: string } | null>(null)
  const [favoritos,       setFavoritos]       = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPrendas(filtro || undefined)
      setPrendas(res.data)
    } catch {
      setError('No pudimos cargar tu closet.')
    } finally {
      setLoading(false)
    }
  }, [filtro])

  useEffect(() => { cargar() }, [cargar])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deletePrenda(id)
      setPrendas(prev => prev.filter(p => p.id !== id))
    } catch {
      setError('No se pudo eliminar la prenda.')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const toggleFav = (id: number) =>
    setFavoritos(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  // Insight: categoría con más prendas
  const topCat = prendas.length > 0
    ? Object.entries(prendas.reduce((acc, p) => ({ ...acc, [p.categoria]: (acc[p.categoria] ?? 0) + 1 }), {} as Record<string, number>))
        .sort((a, b) => b[1] - a[1])[0]
    : null

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ padding: '52px 16px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>
              Mi Closet
            </h1>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: '2px 0 0' }}>
              {loading ? '...' : `${prendas.length} prenda${prendas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '4px' }}>
          <button style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Filtros horizontales ────────────────────────────── */}
      <div style={{ padding: '0 16px 16px', overflowX: 'auto', display: 'flex', gap: '8px', scrollbarWidth: 'none' }}>
        {FILTROS_CATEGORIA.map(({ value, label }) => {
          const active = filtro === value
          return (
            <button
              key={value}
              onClick={() => { setFiltro(value); setCategoriaActiva(null) }}
              style={{
                flexShrink: 0,
                fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500,
                padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', border: 'none',
                backgroundColor: active ? '#3D2B1F' : '#fff',
                color: active ? '#fff' : '#9E9690',
                boxShadow: active ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
                outline: active ? 'none' : '1px solid #E0D5C8',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* ── Insights banner ─────────────────────────────── */}
        {!loading && prendas.length > 0 && topCat && (
          <div style={{
            backgroundColor: '#FAF7F2', border: '1px solid #E0D5C8',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(196,149,106,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#C4956A', fontSize: '16px' }}>✦</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                  Tu closet en insights
                </p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {CATEGORIA_LABELS[topCat[0]] ?? topCat[0]} es tu categoría más frecuente ({topCat[1]} prendas)
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/outfits')}
              style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, color: '#C4956A', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Ver insights ›
            </button>
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690' }}>Cargando tu closet...</p>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#E05555' }}>{error}</p>
            <button onClick={cargar} style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#C4956A', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textDecoration: 'underline' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* ── Vacío ───────────────────────────────────────── */}
        {!loading && !error && prendas.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center', gap: '8px' }}>
            <span style={{ fontSize: '48px' }}>👗</span>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#1A1A1A', margin: 0 }}>Tu closet está vacío</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>Comienza agregando tu primera prenda</p>
            <button
              onClick={() => navigate('/closet/agregar')}
              style={{ marginTop: '16px', backgroundColor: '#C4956A', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              Agregar prenda
            </button>
          </div>
        )}

        {/* ── Grid de prendas ─────────────────────────────── */}

        {/* Vista plana — cuando hay filtro activo */}
        {!loading && prendas.length > 0 && filtro !== '' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {prendas.map(prenda => (
              <PrendaCard
                key={prenda.id}
                prenda={prenda}
                favorito={favoritos.has(prenda.id)}
                onToggleFav={() => toggleFav(prenda.id)}
                onZoom={() => setModalImg({ src: prenda.fotoUrl, alt: CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria })}
                onCrearLook={() => navigate('/outfits', { state: { prendaAncla: prenda } })}
                onEliminar={() => setConfirmDelete(prenda.id)}
              />
            ))}
          </div>
        )}

        {/* Vista de cajas por categoría — "Todo" sin categoría activa */}
        {!loading && prendas.length > 0 && filtro === '' && categoriaActiva === null && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {agruparPorCategoria(prendas).map(([cat, items]) => {
              const preview = items.slice(0, 4)
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  style={{ border: 'none', cursor: 'pointer', padding: 0, borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Mosaico de fotos */}
                  <div style={{ height: '110px', display: 'grid', gridTemplateColumns: preview.length >= 2 ? '1fr 1fr' : '1fr', gridTemplateRows: preview.length >= 3 ? '1fr 1fr' : '1fr', gap: '2px', overflow: 'hidden' }}>
                    {preview.map((p, i) => (
                      <div key={i} style={{ overflow: 'hidden', backgroundColor: '#F2EBE0' }}>
                        <img src={p.fotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    ))}
                    {/* Relleno si hay menos de 4 fotos */}
                    {Array.from({ length: Math.max(0, (preview.length >= 3 ? 4 : preview.length >= 2 ? 2 : 1) - preview.length) }).map((_, i) => (
                      <div key={`empty-${i}`} style={{ backgroundColor: '#F2EBE0' }} />
                    ))}
                  </div>
                  {/* Info */}
                  <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 400, color: '#1A1A1A', margin: 0, lineHeight: 1.2, textAlign: 'left' }}>
                      {CATEGORIA_LABELS[cat] ?? cat}
                    </p>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, color: '#9E9690', backgroundColor: '#F2EBE0', padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
                      {items.length}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Vista de fotos dentro de una categoría */}
        {!loading && prendas.length > 0 && filtro === '' && categoriaActiva !== null && (() => {
          const items = prendas.filter(p => p.categoria === categoriaActiva)
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Cabecera de la categoría con botón volver */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setCategoriaActiva(null)}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>
                  {CATEGORIA_LABELS[categoriaActiva] ?? categoriaActiva}
                </h3>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, color: '#9E9690', backgroundColor: '#F2EBE0', padding: '3px 10px', borderRadius: '20px' }}>
                  {items.length}
                </span>
              </div>
              {/* Grid de prendas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {items.map(prenda => (
                  <PrendaCard
                    key={prenda.id}
                    prenda={prenda}
                    favorito={favoritos.has(prenda.id)}
                    onToggleFav={() => toggleFav(prenda.id)}
                    onZoom={() => setModalImg({ src: prenda.fotoUrl, alt: CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria })}
                    onCrearLook={() => navigate('/outfits', { state: { prendaAncla: prenda } })}
                    onEliminar={() => setConfirmDelete(prenda.id)}
                  />
                ))}
              </div>
            </div>
          )
        })()}

      </div>

      {/* ── FAB agregar ─────────────────────────────────────── */}
      <button
        onClick={() => navigate('/closet/agregar')}
        style={{
          position: 'fixed', bottom: '90px', right: 'max(16px, calc(50vw - 215px + 16px))',
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: '#3D2B1F', color: '#fff',
          border: 'none', cursor: 'pointer', zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(61,43,31,0.35)',
        }}
        aria-label="Agregar prenda"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* ── ImageModal ──────────────────────────────────────── */}
      {modalImg && <ImageModal src={modalImg.src} alt={modalImg.alt} onClose={() => setModalImg(null)} />}

      {/* ── Modal confirmar eliminación ──────────────────────── */}
      {confirmDelete !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', padding: '0 16px 32px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#1A1A1A', textAlign: 'center', margin: '0 0 6px' }}>¿Eliminar prenda?</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', textAlign: 'center', margin: '0 0 24px' }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E0D5C8', backgroundColor: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, color: '#4A3420', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#E05555', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, color: '#fff', cursor: 'pointer', opacity: deletingId === confirmDelete ? 0.6 : 1 }}
              >
                {deletingId === confirmDelete ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
