import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { sugerirOutfitsAvanzado, guardarOutfit, getOutfits, getCapsule, eliminarOutfit, chatOutfit, analizarLook } from '../api/outfits'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import PhotoSelector from '../components/PhotoSelector'
import ImageModal from '../components/ImageModal'
import type { OutfitSugerido, OutfitGuardado, CapsuleResponse, Estilo, SugerirRequest, AnalizarLookResponse } from '../types'
import { ESTILOS, CATEGORIA_LABELS } from '../types'

type Tab = 'sugerir' | 'guardados' | 'capsule'

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80
    ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 60
    ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200'
  return (
    <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {score}/100
    </span>
  )
}

function GrupoSection({ titulo, prendas, onImgClick }: {
  titulo: string
  prendas: { id: number; fotoUrl: string; categoria: string }[]
  onImgClick?: (src: string) => void
}) {
  if (!prendas.length) return null
  return (
    <div>
      <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase mb-1.5">{titulo}</p>
      <div className="flex gap-2 flex-wrap">
        {prendas.map(p => (
          <div key={p.id}
            className={`w-16 h-16 rounded-xl overflow-hidden bg-white border border-surface flex-shrink-0 ${onImgClick ? 'cursor-zoom-in' : ''}`}
            onClick={() => onImgClick?.(p.fotoUrl)}
          >
            <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function OutfitSugeridoCard({
  outfit, onGuardar, saving,
}: {
  outfit: OutfitSugerido
  onGuardar: () => void
  saving: boolean
}) {
  const [expandido, setExpandido] = useState(false)
  const [modalImg, setModalImg] = useState<string | null>(null)
  const g = outfit.grupoVisual

  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl font-light text-primary leading-tight">{outfit.nombre}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={outfit.score} />
          <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            {ESTILOS.find(e => e.value === outfit.estilo)?.label ?? outfit.estilo}
          </span>
        </div>
      </div>

{outfit.razonamiento && (
        <p className="text-primary/60 font-body text-sm leading-relaxed">{outfit.razonamiento}</p>
      )}

      {outfit.estiloClimatico && (
        <p className="text-xs font-body text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">
          🌡 {outfit.estiloClimatico}
        </p>
      )}

      {outfit.warnings.length > 0 && (
        <div className="flex flex-col gap-1">
          {outfit.warnings.map((w, i) => (
            <p key={i} className="text-xs font-body text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">⚠ {w}</p>
          ))}
        </div>
      )}

      {modalImg && <ImageModal src={modalImg} onClose={() => setModalImg(null)} />}

      <div className="flex flex-col gap-3">
        <GrupoSection titulo="Superior" prendas={g.parteSuperior} onImgClick={setModalImg} />
        <GrupoSection titulo="Inferior" prendas={g.parteInferior} onImgClick={setModalImg} />
        <GrupoSection titulo="Calzado" prendas={g.calzado} onImgClick={setModalImg} />
        <GrupoSection titulo="Abrigo" prendas={g.abrigo} onImgClick={setModalImg} />
        <GrupoSection titulo="Accesorios" prendas={g.accesorios} onImgClick={setModalImg} />
        <GrupoSection titulo="Bolso" prendas={g.bolso} onImgClick={setModalImg} />
        <GrupoSection titulo="Opcionales" prendas={g.opcionales} onImgClick={setModalImg} />
      </div>

      <div className="bg-white/60 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-primary/50">Armonía</span>
          <ScoreBadge score={outfit.armoniaColor.colorScore} />
        </div>
        {outfit.armoniaColor.coloresDominantes.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {outfit.armoniaColor.coloresDominantes.slice(0, 3).map(c => (
              <span key={c} className="text-[10px] font-body text-primary/60 bg-surface px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setExpandido(!expandido)}
        className="text-xs font-body text-primary/40 hover:text-primary transition-colors text-left"
      >
        {expandido ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}
      </button>

      {expandido && (
        <div className="flex flex-col gap-3 border-t border-primary/10 pt-3">
          {[
            { label: 'Color', value: outfit.explicacion.color },
            { label: 'Silueta', value: outfit.explicacion.silueta },
            { label: 'Ocasión', value: outfit.explicacion.ocasion },
            { label: 'Colorimetría', value: outfit.explicacion.temporada },
            { label: 'Sugerencia de mejora', value: outfit.explicacion.mejoras },
          ].filter(e => e.value).map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">{label}</p>
              <p className="text-primary/70 font-body text-sm leading-relaxed">{value}</p>
            </div>
          ))}
          {outfit.armoniaColor.colorReason && (
            <div>
              <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">Armonía cromática</p>
              <p className="text-primary/70 font-body text-sm">{outfit.armoniaColor.colorReason}</p>
            </div>
          )}
          {outfit.scoreRazon && (
            <div>
              <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">Razón del score</p>
              <p className="text-primary/70 font-body text-sm">{outfit.scoreRazon}</p>
            </div>
          )}
        </div>
      )}

      {outfit.prendaFaltante && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-lg">🛍️</span>
          <p className="text-primary font-body text-xs leading-relaxed">
            <span className="font-medium">Para completar este look:</span> {outfit.prendaFaltante.toLowerCase()}
          </p>
        </div>
      )}

      <button
        onClick={onGuardar}
        disabled={saving}
        className="w-full border border-accent text-accent font-body font-medium py-3 rounded-xl text-sm hover:bg-accent hover:text-white transition-colors disabled:opacity-60"
      >
        {saving ? 'Guardando...' : 'Guardar outfit'}
      </button>
    </div>
  )
}

function CapsuleTab() {
  const [capsule, setCapsule] = useState<CapsuleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCapsule()
      setCapsule(res.data)
    } catch {
      setError('No se pudo analizar tu closet.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  if (loading) return <div className="px-4 pt-6"><LoadingSpinner text="Analizando tu closet..." /></div>
  if (error) return <p className="text-red-500 text-sm font-body text-center px-4 py-3 bg-red-50 rounded-xl mx-4 mt-4">{error}</p>
  if (!capsule) return null

  const scoreColor = capsule.puntuacionCloset >= 70
    ? 'text-green-600'
    : capsule.puntuacionCloset >= 50
    ? 'text-amber-600'
    : 'text-red-600'

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      <div className="bg-surface rounded-2xl p-5 text-center">
        <p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-2">Puntuación de tu closet</p>
        <p className={`font-display text-6xl font-light ${scoreColor}`}>{capsule.puntuacionCloset}</p>
        <p className="text-primary/40 font-body text-xs mt-1">/100</p>
        <p className="text-primary/70 font-body text-sm mt-3 leading-relaxed">{capsule.resumen}</p>
      </div>

      {capsule.prendasEsencialesFaltantes.length > 0 && (
        <CapsuleSection titulo="Prendas esenciales que te faltan" emoji="❗">
          {capsule.prendasEsencialesFaltantes.map((p, i) => (
            <p key={i} className="text-primary/70 font-body text-sm">• {p}</p>
          ))}
        </CapsuleSection>
      )}

      {capsule.prendasVersatiles.length > 0 && (
        <CapsuleSection titulo="Tus prendas más versátiles" emoji="⭐">
          <div className="flex gap-2 flex-wrap">
            {capsule.prendasVersatiles.map(p => (
              <div key={p.id} className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </CapsuleSection>
      )}

      {capsule.coloresQueSeRepiten.length > 0 && (
        <CapsuleSection titulo="Colores dominantes en tu closet" emoji="🎨">
          <div className="flex flex-wrap gap-2">
            {capsule.coloresQueSeRepiten.map((c, i) => (
              <span key={i} className="text-sm font-body text-primary/70 bg-white border border-primary/10 px-3 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </CapsuleSection>
      )}

      {capsule.combinacionesBase.length > 0 && (
        <CapsuleSection titulo="Combinaciones base" emoji="✨">
          {capsule.combinacionesBase.map((c, i) => (
            <p key={i} className="text-primary/70 font-body text-sm">• {c}</p>
          ))}
        </CapsuleSection>
      )}

      {capsule.recomendacionesCompra.length > 0 && (
        <CapsuleSection titulo="Recomendaciones de compra" emoji="🛍️">
          {capsule.recomendacionesCompra.map((r, i) => (
            <p key={i} className="text-primary/70 font-body text-sm">• {r}</p>
          ))}
        </CapsuleSection>
      )}

      <button onClick={cargar} className="text-xs font-body text-accent text-center hover:underline pb-4">
        Actualizar análisis
      </button>
    </div>
  )
}

function CapsuleSection({ titulo, emoji, children }: {
  titulo: string
  emoji: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-2">
      <p className="font-body text-sm font-medium text-primary flex items-center gap-2">
        <span>{emoji}</span>{titulo}
      </p>
      {children}
    </div>
  )
}

function OutfitGuardadoCard({ outfit, onEliminar }: { outfit: OutfitGuardado; onEliminar: () => void }) {
  const [expandido, setExpandido] = useState(false)
  const [modalImg, setModalImg] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatRes, setChatRes] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [lookRes, setLookRes] = useState<AnalizarLookResponse | null>(null)
  const [lookLoading, setLookLoading] = useState(false)
  const m = outfit.metadata

  const handleEliminar = async () => {
    setDeleting(true)
    try { await eliminarOutfit(outfit.id); onEliminar() }
    finally { setDeleting(false) }
  }

  const handleChat = async () => {
    if (!chatMsg.trim()) return
    setChatLoading(true)
    try {
      const res = await chatOutfit(outfit.id, outfit.prendas.map(p => p.id), chatMsg, outfit.estilo)
      setChatRes(res.data.respuesta)
    } finally { setChatLoading(false) }
  }

  const handleLook = async (file: File) => {
    setLookLoading(true)
    try {
      const res = await analizarLook(outfit.id, file)
      setLookRes(res.data)
    } finally { setLookLoading(false) }
  }

  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl font-light text-primary">{outfit.nombre}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {m?.score ? <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${m.score >= 80 ? 'bg-green-100 text-green-700 border-green-200' : m.score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{m.score}/100</span> : null}
          <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            {ESTILOS.find(e => e.value === outfit.estilo)?.label ?? outfit.estilo}
          </span>
        </div>
      </div>

      {modalImg && <ImageModal src={modalImg} onClose={() => setModalImg(null)} />}

      {/* Fotos */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {outfit.prendas.map(p => (
          <div key={p.id} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white cursor-zoom-in"
               onClick={() => setModalImg(p.fotoUrl)}>
            <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {m?.razonamiento && <p className="text-primary/60 font-body text-sm leading-relaxed">{m.razonamiento}</p>}

      {/* Ver más info */}
      {m && (
        <>
          <button onClick={() => setExpandido(!expandido)} className="text-xs font-body text-primary/40 hover:text-primary text-left transition-colors">
            {expandido ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}
          </button>
          {expandido && (
            <div className="flex flex-col gap-2 border-t border-primary/10 pt-3">
              {m.estiloClimatico && <p className="text-xs font-body text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">🌡 {m.estiloClimatico}</p>}
              {m.warnings?.map((w, i) => <p key={i} className="text-xs font-body text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">⚠ {w}</p>)}
              {m.armoniaColor && (
                <div>
                  <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">Armonía de color</p>
                  <p className="text-primary/70 font-body text-sm">{m.armoniaColor.colorReason}</p>
                </div>
              )}
              {m.explicacion && [
                { l: 'Color', v: m.explicacion.color },
                { l: 'Silueta', v: m.explicacion.silueta },
                { l: 'Ocasión', v: m.explicacion.ocasion },
                { l: 'Colorimetría', v: m.explicacion.temporada },
                { l: 'Mejoras', v: m.explicacion.mejoras },
              ].filter(e => e.v).map(({ l, v }) => (
                <div key={l}>
                  <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">{l}</p>
                  <p className="text-primary/70 font-body text-sm">{v}</p>
                </div>
              ))}
              {m.prendaFaltante && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl px-3 py-2 flex gap-2 items-center">
                  <span>🛍️</span>
                  <p className="text-primary font-body text-xs"><span className="font-medium">Para completar:</span> {m.prendaFaltante}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Chat con IA */}
      <div className="border-t border-primary/10 pt-3">
        <p className="text-xs font-body text-primary/50 mb-2">💬 Pregúntale a la IA sobre este outfit</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMsg}
            onChange={e => { setChatMsg(e.target.value); setChatRes('') }}
            onKeyDown={e => e.key === 'Enter' && handleChat()}
            placeholder="¿Le puedo agregar un cinturón?"
            className="flex-1 bg-white border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary placeholder:text-primary/30 outline-none focus:border-accent/40"
          />
          <button onClick={handleChat} disabled={chatLoading || !chatMsg.trim()}
            className="bg-accent text-white font-body text-xs px-3 py-2 rounded-xl disabled:opacity-40">
            {chatLoading ? '...' : 'Preguntar'}
          </button>
        </div>
        {chatRes && <p className="text-primary/70 font-body text-sm mt-2 bg-white rounded-xl px-3 py-2 leading-relaxed">{chatRes}</p>}
      </div>

      {/* Subir foto del look */}
      <div className="border-t border-primary/10 pt-3">
        <p className="text-xs font-body text-primary/50 mb-2">📸 ¿Ya te lo pusiste? Sube una foto y analizo cómo quedó</p>
        {lookLoading && <p className="text-primary/50 font-body text-xs text-center py-2">Analizando tu look...</p>}
        {!lookLoading && !lookRes && <PhotoSelector onFile={handleLook} captureMode="user" compact />}
        {lookRes && (
          <div className="bg-white rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`font-display text-2xl font-light ${lookRes.calificacion >= 80 ? 'text-green-600' : lookRes.calificacion >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{lookRes.calificacion}</span>
              <p className="text-primary/60 font-body text-sm">{lookRes.resumen}</p>
            </div>
            {lookRes.puntosPositivos.map((p, i) => <p key={i} className="text-green-700 font-body text-xs">✓ {p}</p>)}
            {lookRes.sugerencias.map((s, i) => <p key={i} className="text-amber-700 font-body text-xs">→ {s}</p>)}
            <button onClick={() => setLookRes(null)} className="text-xs font-body text-primary/30 text-right">Analizar otra foto</button>
          </div>
        )}
      </div>

      {/* Eliminar */}
      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)} className="text-xs font-body text-red-400 hover:text-red-600 transition-colors text-right">
          Eliminar outfit
        </button>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-xl border border-surface text-primary/60 font-body text-xs">Cancelar</button>
          <button onClick={handleEliminar} disabled={deleting} className="flex-1 py-2 rounded-xl bg-red-500 text-white font-body text-xs font-medium disabled:opacity-60">
            {deleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function OutfitsPage() {
  const location = useLocation()
  const prendaAncla = (location.state as { prendaAncla?: { id: number; categoria: string; colorPrincipal: string } } | null)?.prendaAncla
  const autoGeneratedRef = useRef(false)

  const [tab, setTab] = useState<Tab>('sugerir')
  const [estilo, setEstilo] = useState<Estilo>('CASUAL')
  const [limit, setLimit] = useState(2)
  const [mostrarOpciones, setMostrarOpciones] = useState(false)
  const [temperatura, setTemperatura] = useState('')
  const [condicion, setCondicion] = useState('')
  const [nombreEvento, setNombreEvento] = useState('')
  const [nivelFormalidad, setNivelFormalidad] = useState('')
  const [sugerencias, setSugerencias] = useState<OutfitSugerido[]>([])
  const [outfitsGuardados, setOutfitsGuardados] = useState<OutfitGuardado[]>([])
  const [loadingSugerir, setLoadingSugerir] = useState(false)
  const [loadingGuardados, setLoadingGuardados] = useState(false)
  const [savingIndex, setSavingIndex] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [idsYaMostrados, setIdsYaMostrados] = useState<number[]>([])

  // Auto-generar cuando viene con prenda ancla desde el closet
  useEffect(() => {
    if (prendaAncla && !autoGeneratedRef.current) {
      autoGeneratedRef.current = true
      handleSugerirConAncla()
    }
  }, [prendaAncla])

  const handleSugerirConAncla = async () => {
    if (!prendaAncla) return
    setLoadingSugerir(true)
    setError('')
    setSugerencias([])
    try {
      const res = await sugerirOutfitsAvanzado({
        estilo,
        limit: 2,
        prendaAnclaId: prendaAncla.id,
        prendaIdsExcluir: [],
      })
      setSugerencias(res.data)
      setIdsYaMostrados(res.data.flatMap(o => o.prendaIds))
    } catch {
      setError('No pudimos generar outfits con esa prenda.')
    } finally {
      setLoadingSugerir(false)
    }
  }

  const buildRequest = (excluir: number[]): SugerirRequest => ({
    estilo,
    limit,
    prendaIdsExcluir: excluir,
    prendaAnclaId: undefined,
    clima: temperatura || condicion ? {
      temperatura: temperatura ? parseFloat(temperatura) : undefined,
      condicion: condicion || undefined,
    } : undefined,
    evento: nombreEvento || nivelFormalidad ? {
      nombreEvento: nombreEvento || undefined,
      nivelFormalidad: nivelFormalidad || undefined,
    } : undefined,
  })

  const handleSugerir = async () => {
    setLoadingSugerir(true)
    setError('')
    setSugerencias([])
    setIdsYaMostrados([])
    try {
      const res = await sugerirOutfitsAvanzado(buildRequest([]))
      setSugerencias(res.data)
      setIdsYaMostrados(res.data.flatMap(o => o.prendaIds))
    } catch {
      setError('No pudimos generar sugerencias. Verifica que tengas prendas en tu closet.')
    } finally {
      setLoadingSugerir(false)
    }
  }

  const handleGenerarMas = async () => {
    setLoadingSugerir(true)
    setError('')
    try {
      const res = await sugerirOutfitsAvanzado(buildRequest(idsYaMostrados))
      setSugerencias(prev => [...prev, ...res.data])
      setIdsYaMostrados(prev => [...prev, ...res.data.flatMap(o => o.prendaIds)])
    } catch {
      setError('No se pudieron generar más outfits.')
    } finally {
      setLoadingSugerir(false)
    }
  }

  const cargarGuardados = async () => {
    setLoadingGuardados(true)
    try {
      const res = await getOutfits()
      setOutfitsGuardados(res.data)
    } catch { /* silencioso */ }
    finally { setLoadingGuardados(false) }
  }

  useEffect(() => {
    if (tab === 'guardados') cargarGuardados()
  }, [tab])

  const handleGuardar = async (sug: OutfitSugerido, index: number) => {
    setSavingIndex(index)
    try {
      const metadata = {
        score: sug.score,
        scoreRazon: sug.scoreRazon,
        razonamiento: sug.razonamiento,
        explicacion: sug.explicacion,
        armoniaColor: sug.armoniaColor,
        warnings: sug.warnings,
        prendaFaltante: sug.prendaFaltante,
        estiloClimatico: sug.estiloClimatico,
      }
      await guardarOutfit(sug.nombre, sug.prendaIds, sug.estilo, metadata)
      setSugerencias(prev => prev.filter((_, i) => i !== index))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg === 'Este outfit ya está guardado' ? 'Este outfit ya lo tienes guardado.' : 'No se pudo guardar el outfit.')
    } finally {
      setSavingIndex(null)
    }
  }

  return (
    <Layout title="Outfits">
      <div className="flex gap-1 mx-4 mt-4 mb-2 bg-surface rounded-full p-1">
        {([
          { key: 'sugerir' as Tab, label: 'Sugerir' },
          { key: 'guardados' as Tab, label: 'Guardados' },
          { key: 'capsule' as Tab, label: 'Cápsula' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-full text-xs font-body font-medium transition-all ${
              tab === key ? 'bg-primary text-white shadow-sm' : 'text-primary/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'sugerir' && (
        <div className="px-4 py-4 flex flex-col gap-5">

          {prendaAncla && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-body text-xs text-accent font-medium">Armando outfit con:</p>
                <p className="font-body text-sm text-primary">
                  {CATEGORIA_LABELS[prendaAncla.categoria] ?? prendaAncla.categoria} · {prendaAncla.colorPrincipal}
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-3">Estilo</p>
            <div className="flex flex-wrap gap-2">
              {ESTILOS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setEstilo(value)}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                    estilo === value ? 'bg-accent text-white' : 'bg-surface text-primary/60 hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMostrarOpciones(!mostrarOpciones)}
            className="text-xs font-body text-primary/40 hover:text-primary flex items-center gap-1 transition-colors"
          >
            {mostrarOpciones ? '▲' : '▼'} Opciones avanzadas (clima, evento, cantidad)
          </button>

          {mostrarOpciones && (
            <div className="bg-surface rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-body text-primary/60 tracking-wider uppercase">Cantidad</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLimit(l => Math.max(1, l - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-primary/20 text-primary text-sm"
                  >−</button>
                  <span className="font-body text-primary w-4 text-center">{limit}</span>
                  <button
                    onClick={() => setLimit(l => Math.min(10, l + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-primary/20 text-primary text-sm"
                  >+</button>
                </div>
              </div>

              <div>
                <p className="text-xs font-body text-primary/60 tracking-wider uppercase mb-2">Clima (opcional)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="°C"
                    value={temperatura}
                    onChange={e => setTemperatura(e.target.value)}
                    className="w-20 bg-white border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary outline-none focus:border-accent/50"
                  />
                  <select
                    value={condicion}
                    onChange={e => setCondicion(e.target.value)}
                    className="flex-1 bg-white border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary outline-none"
                  >
                    <option value="">Condición</option>
                    {['soleado', 'nublado', 'lluvia', 'frio', 'calor', 'templado'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-body text-primary/60 tracking-wider uppercase mb-2">Evento (opcional)</p>
                <input
                  type="text"
                  placeholder="Nombre del evento"
                  value={nombreEvento}
                  onChange={e => setNombreEvento(e.target.value)}
                  className="w-full bg-white border border-surface rounded-xl px-3 py-2.5 font-body text-sm text-primary outline-none focus:border-accent/50 mb-2"
                />
                <select
                  value={nivelFormalidad}
                  onChange={e => setNivelFormalidad(e.target.value)}
                  className="w-full bg-white border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary outline-none"
                >
                  <option value="">Nivel de formalidad</option>
                  {[
                    ['casual', 'Casual'],
                    ['semiformal', 'Semiformal'],
                    ['formal', 'Formal'],
                    ['muy_formal', 'Muy formal'],
                  ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleSugerir}
            disabled={loadingSugerir}
            className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl disabled:opacity-60"
          >
            {loadingSugerir ? 'Generando...' : `Sugerir ${limit} outfit${limit > 1 ? 's' : ''} ✨`}
          </button>

          {loadingSugerir && <LoadingSpinner text="La IA está creando tus combinaciones..." />}

          {error && (
            <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
          )}

          {sugerencias.map((sug, i) => (
            <OutfitSugeridoCard
              key={`${sug.nombre}-${i}`}
              outfit={sug}
              onGuardar={() => handleGuardar(sug, i)}
              saving={savingIndex === i}
            />
          ))}

          {sugerencias.length > 0 && !loadingSugerir && (
            <button
              onClick={handleGenerarMas}
              className="w-full border border-accent/40 text-accent font-body font-medium py-3.5 rounded-xl text-sm hover:bg-accent/5 transition-colors"
            >
              Generar más outfits →
            </button>
          )}
        </div>
      )}

      {tab === 'guardados' && (
        <div className="px-4 py-4 flex flex-col gap-4">
          {loadingGuardados && <LoadingSpinner text="Cargando outfits..." />}
          {!loadingGuardados && outfitsGuardados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">💫</div>
              <p className="font-display text-2xl font-light text-primary mb-2">Sin outfits guardados</p>
              <p className="text-primary/50 font-body text-sm">Usa el generador para crear y guardar combinaciones</p>
            </div>
          )}
          {outfitsGuardados.map(outfit => (
            <OutfitGuardadoCard
              key={outfit.id}
              outfit={outfit}
              onEliminar={() => setOutfitsGuardados(prev => prev.filter(o => o.id !== outfit.id))}
            />
          ))}
        </div>
      )}

      {tab === 'capsule' && <CapsuleTab />}
    </Layout>
  )
}
