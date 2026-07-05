import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileTheme, getThemeColors } from '../hooks/useProfileTheme'
import type { ThemeColors } from '../hooks/useProfileTheme'
import { getPrendas, deletePrenda, actualizarCategoria, reanalizarPrend } from '../api/prendas'
import ImageModal from '../components/ImageModal'
import type { Prenda } from '../types'
import { type CategoriaSeccion, SECCIONES_ADULTO, SECCIONES_BEBE, SECCIONES_NINO, FILTROS_CATEGORIA, FILTROS_CATEGORIA_BEBE, FILTROS_CATEGORIA_NINO, CATEGORIA_LABELS } from '../types'
import { isBabyTheme, isChildTheme } from '../hooks/useProfileTheme'

// Imágenes de moda femenina por categoría (Unsplash)
const CAT_IMAGES: Record<string, string> = {
  // Tops
  BLUSA:         'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80', // mujer blusa boho
  CAMISETA:      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', // mujer casual
  CAMISA:        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', // mujer camisa oficina
  // Pantalones
  PANTALON:      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80', // mujer pantalón elegante
  JEAN:          'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&q=80', // mujer piernas jeans
  LEGGINS:       'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80', // mujer deportiva
  SHORT:         'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', // street style mujer
  // Vestidos y faldas
  VESTIDO:       'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', // mujer vestido blanco
  FALDA:         'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80', // mujer falda noche
  FALDA_CORTA:   'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', // street style
  FALDA_LARGA:   'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', // mujer maxi look
  // Exterior
  BLAZER:        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', // flat lay blazer beige
  CHAQUETA:      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80', // mujer chaqueta
  ABRIGO:        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80', // mujer abrigo
  // Calzado femenino
  ZAPATO_TACO:   'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', // tacones mujer
  ZAPATO_PLANO:  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80', // zapatos planos
  BOTA:          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', // botas tacón
  TENIS:         'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80', // tenis blancos mujer
  SANDALIA:      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80', // sandalias mujer
  // Bolsos
  BOLSO:         'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', // bolso beige elegante
  CARTERA:       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', // cartera mujer
  // Accesorios
  COLLAR:        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
  ARETES:        'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80',
  CINTURON:      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
  // Bebé
  MAMELUCO:      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  BODY:          'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80',
  PELELE:        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
  ZAPATITO:      'https://images.unsplash.com/photo-1561861422-a549073e547a?w=400&q=80',
  BABERO:        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  // Bebé y niño
  PETO:          'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
  CONJUNTO:      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80',
  GORRO:         'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  MEDIAS:        'https://images.unsplash.com/photo-1561861422-a549073e547a?w=400&q=80',
  PIJAMA:        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
  // Niño
  MOCHILA:       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  DISFRAZ:       'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  UNIFORME:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  OTRO:          'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
}
const CAT_IMG_FALLBACK = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80'

// Orden visual de categorías por tipo de perfil
const CAT_ORDER_ADULTO = [
  'BLUSA','CAMISETA','CAMISA',
  'PANTALON','JEAN','LEGGINS','SHORT',
  'VESTIDO','FALDA','FALDA_CORTA','FALDA_LARGA',
  'BLAZER','CHAQUETA','ABRIGO','SACO',
  'ZAPATO_TACO','ZAPATO_PLANO','BOTA','TENIS','SANDALIA','MEDIAS',
  'BOLSO','CARTERA',
  'COLLAR','ARETES','BALACA','TURBANTE','CINTURON',
  'OTRO',
]

const CAT_ORDER_BEBE = [
  'MAMELUCO','BODY','PETO','CONJUNTO',
  'CAMISETA','BLUSA','PANTALON','JEAN','SHORT',
  'VESTIDO','CHAQUETA','ABRIGO','SACO',
  'ZAPATITO','SANDALIA',
  'GORRO','MEDIAS','BABERO','BALACA','TURBANTE','PIJAMA',
  'OTRO',
]

const CAT_ORDER_NINO = [
  'CAMISETA','PANTALON','JEAN','SHORT','LEGGINS',
  'VESTIDO','FALDA','PETO','CONJUNTO',
  'CHAQUETA','ABRIGO','SACO',
  'TENIS','SANDALIA','BOTA',
  'GORRO','MEDIAS','BALACA','TURBANTE','PIJAMA','MOCHILA',
  'DISFRAZ','UNIFORME',
  'OTRO',
]

function agruparPorCategoria(prendas: Prenda[], catOrder: string[]): [string, Prenda[]][] {
  const map: Record<string, Prenda[]> = {}
  for (const p of prendas) {
    if (!map[p.categoria]) map[p.categoria] = []
    map[p.categoria].push(p)
  }
  return Object.entries(map).sort(([a], [b]) => {
    const ia = catOrder.indexOf(a)
    const ib = catOrder.indexOf(b)
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

// ── EditCategoriaModal ───────────────────────────────────────
function EditCategoriaModal({
  prenda,
  secciones,
  colors,
  onSave,
  onClose,
  saving,
}: {
  prenda: Prenda
  secciones: CategoriaSeccion[]
  colors: ThemeColors
  onSave: (cat: string) => void
  onClose: () => void
  saving: boolean
}) {
  const [selected, setSelected] = useState(prenda.categoria)

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '430px', backgroundColor: colors.bg, borderRadius: '20px 20px 0 0', padding: '20px 16px 40px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: colors.primary, margin: 0 }}>
            Cambiar categoría
          </h2>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '15px', color: colors.primary }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {secciones.map((sec, i) => (
            <div key={sec.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: i === 0 ? 0 : '14px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9E9690', flexShrink: 0 }}>
                  {sec.label}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {sec.items.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelected(cat)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: selected === cat ? `2px solid ${colors.accent}` : '2px solid transparent',
                      backgroundColor: selected === cat ? `${colors.accent}1A` : colors.surface,
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '11px',
                      fontWeight: selected === cat ? 600 : 500,
                      color: selected === cat ? colors.accent : colors.primary,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {CATEGORIA_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSave(selected)}
          disabled={saving || selected === prenda.categoria}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            backgroundColor: saving || selected === prenda.categoria ? '#9E9690' : colors.accent,
            color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500,
            cursor: saving || selected === prenda.categoria ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

// ── PrendaCard ───────────────────────────────────────────────
function PrendaCard({
  prenda,
  favorito,
  reanalizing,
  onToggleFav,
  onZoom,
  onCrearLook,
  onEliminar,
  onEditCategoria,
  onReanalizar,
}: {
  prenda: Prenda
  favorito: boolean
  reanalizing: boolean
  onToggleFav: () => void
  onZoom: () => void
  onCrearLook: () => void
  onEliminar: () => void
  onEditCategoria: () => void
  onReanalizar: () => void
}) {
  const nueva = isNueva(prenda.creadoEn)
  const label = CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria
  const ocasionLabel = prenda.ocasion ? OCASION_LABEL[prenda.ocasion] ?? prenda.ocasion : null

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Foto */}
      <div style={{ position: 'relative', aspectRatio: '4/5', cursor: reanalizing ? 'default' : 'zoom-in' }} onClick={reanalizing ? undefined : onZoom}>
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

        {/* Botón eliminar */}
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

        {/* Botón editar categoría */}
        <button
          onClick={e => { e.stopPropagation(); onEditCategoria() }}
          style={{
            position: 'absolute', bottom: '8px', left: '8px',
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9E9690" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        {/* Botón re-analizar */}
        <button
          onClick={e => { e.stopPropagation(); onReanalizar() }}
          disabled={reanalizing}
          style={{
            position: 'absolute', bottom: '8px', left: '44px',
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: reanalizing ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            opacity: reanalizing ? 0.5 : 1,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9E9690" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>

        {/* Overlay de loading al re-analizar */}
        {reanalizing && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #F2EBE0', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
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
  const [editingPrenda,   setEditingPrenda]   = useState<Prenda | null>(null)
  const [savingCat,       setSavingCat]       = useState(false)
  const [reanalizingId,   setReanalizingId]   = useState<number | null>(null)
  const [toastMsg,        setToastMsg]        = useState('')
  const navigate  = useNavigate()
  const themeMode = useProfileTheme()
  const colors    = getThemeColors(themeMode)
  const filtrosCategoria = isBabyTheme(themeMode)  ? FILTROS_CATEGORIA_BEBE
                         : isChildTheme(themeMode) ? FILTROS_CATEGORIA_NINO
                         : FILTROS_CATEGORIA
  const catOrder         = isBabyTheme(themeMode)  ? CAT_ORDER_BEBE
                         : isChildTheme(themeMode) ? CAT_ORDER_NINO
                         : CAT_ORDER_ADULTO
  const secciones        = isBabyTheme(themeMode)  ? SECCIONES_BEBE
                         : isChildTheme(themeMode) ? SECCIONES_NINO
                         : SECCIONES_ADULTO

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

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  const handleActualizarCategoria = async (categoria: string) => {
    if (!editingPrenda) return
    setSavingCat(true)
    try {
      const res = await actualizarCategoria(editingPrenda.id, categoria)
      setPrendas(prev => prev.map(p => p.id === editingPrenda.id ? { ...p, categoria: res.data.categoria } : p))
      setToastMsg('Categoría actualizada ✓')
      setEditingPrenda(null)
    } catch {
      setToastMsg('No se pudo actualizar la categoría.')
    } finally {
      setSavingCat(false)
    }
  }

  const handleReanalizar = async (id: number) => {
    setReanalizingId(id)
    try {
      const res = await reanalizarPrend(id)
      setPrendas(prev => prev.map(p => p.id === id ? { ...p, descripcionIa: res.data.descripcionIa } : p))
      setToastMsg('Descripción actualizada ✓')
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setToastMsg('Ya re-analizaste esta prenda hoy')
      } else {
        setToastMsg('No se pudo re-analizar. Intenta de nuevo.')
      }
    } finally {
      setReanalizingId(null)
    }
  }

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
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

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
        {filtrosCategoria.map(({ value, label }) => {
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
                reanalizing={reanalizingId === prenda.id}
                onToggleFav={() => toggleFav(prenda.id)}
                onZoom={() => setModalImg({ src: prenda.fotoUrl, alt: CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria })}
                onCrearLook={() => navigate('/outfits', { state: { prendaAncla: prenda } })}
                onEliminar={() => setConfirmDelete(prenda.id)}
                onEditCategoria={() => setEditingPrenda(prenda)}
                onReanalizar={() => handleReanalizar(prenda.id)}
              />
            ))}
          </div>
        )}

        {/* Vista de cajas por categoría — "Todo" sin categoría activa */}
        {!loading && prendas.length > 0 && filtro === '' && categoriaActiva === null && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {agruparPorCategoria(prendas, catOrder).map(([cat, items]) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="active:scale-[0.97] transition-transform"
                style={{ border: 'none', cursor: 'pointer', padding: 0, borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '140px', display: 'block' }}
              >
                {/* Imagen de fondo */}
                <img
                  src={CAT_IMAGES[cat] ?? CAT_IMG_FALLBACK}
                  alt={CATEGORIA_LABELS[cat] ?? cat}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay gradiente */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 55%)' }} />
                {/* Badge conteo arriba derecha */}
                <div style={{ position: 'absolute', top: '9px', right: '9px', backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)', borderRadius: '20px', padding: '2px 9px' }}>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#1A1A1A' }}>{items.length}</span>
                </div>
                {/* Nombre abajo */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.15, textAlign: 'left' }}>
                    {CATEGORIA_LABELS[cat] ?? cat}
                  </p>
                </div>
              </button>
            ))}
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
                    reanalizing={reanalizingId === prenda.id}
                    onToggleFav={() => toggleFav(prenda.id)}
                    onZoom={() => setModalImg({ src: prenda.fotoUrl, alt: CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria })}
                    onCrearLook={() => navigate('/outfits', { state: { prendaAncla: prenda } })}
                    onEliminar={() => setConfirmDelete(prenda.id)}
                    onEditCategoria={() => setEditingPrenda(prenda)}
                    onReanalizar={() => handleReanalizar(prenda.id)}
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

      {/* ── Modal editar categoría ──────────────────────────── */}
      {editingPrenda && (
        <EditCategoriaModal
          prenda={editingPrenda}
          secciones={secciones}
          colors={colors}
          onSave={handleActualizarCategoria}
          onClose={() => setEditingPrenda(null)}
          saving={savingCat}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#3D2B1F', color: '#fff',
          fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500,
          padding: '10px 20px', borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 60, whiteSpace: 'nowrap',
        }}>
          {toastMsg}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
