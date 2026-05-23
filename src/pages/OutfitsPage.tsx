import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  sugerirOutfitsAvanzado, guardarOutfit, getOutfits,
  getCapsule, eliminarOutfit, chatOutfit, analizarLook,
} from '../api/outfits'
import { getPrendas } from '../api/prendas'
import AppBottomNav from '../components/AppBottomNav'
import LoadingSpinner from '../components/LoadingSpinner'
import PhotoSelector from '../components/PhotoSelector'
import ImageModal from '../components/ImageModal'
import type {
  OutfitSugerido, OutfitGuardado, CapsuleResponse,
  Estilo, SugerirRequest, AnalizarLookResponse, Prenda,
} from '../types'
import { ESTILOS, CATEGORIA_LABELS } from '../types'

// ── Tipos ────────────────────────────────────────────────────
type Tab = 'sugerir' | 'guardados' | 'capsule' | 'semana'

interface WeatherData { temp: number; city: string; desc: string; icon: string }

// ── Hook de clima ────────────────────────────────────────────
function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const fetchWeather = async (lat: number, lon: number) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    try {
      const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`)
      const data = await res.json()
      const desc = data.weather?.[0]?.description ?? ''
      const icon = /lluvia|rain|drizzle/i.test(desc) ? '🌧️'
        : /nubl|cloud/i.test(desc) ? '☁️'
        : /nieve|snow/i.test(desc) ? '❄️'
        : /tormenta|thunder/i.test(desc) ? '⛈️'
        : '☀️'
      setWeather({ temp: Math.round(data.main?.temp ?? 0), city: data.name ?? '', desc, icon })
    } catch { /* silencioso */ }
  }

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      ()  => fetchWeather(4.71, -74.07),
    )
  }, [])

  return weather
}

// ── Estilos visuales ─────────────────────────────────────────
const ESTILOS_VISUAL = [
  { value: 'CASUAL'           as Estilo, label: 'Casual chic', img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=200&q=80' },
  { value: 'ELEGANTE'         as Estilo, label: 'Elegante',    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&q=80' },
  { value: 'DEPORTIVO'        as Estilo, label: 'Sport luxe',  img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&q=80' },
  { value: 'TRABAJO'          as Estilo, label: 'Office',      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
  { value: 'SALIDA_NOCTURNA'  as Estilo, label: 'Night out',   img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&q=80' },
]

const SENTIMIENTOS = ['👑 Poderosa', '♡ Femenina', '🌿 Relajada', '✦ Sexy']
const OCASIONES    = ['💼 Oficina', '✈️ Viaje', '🍷 Cena', '🛍 Shopping', '✦ Evento', '☂️ Playa']
const DIAS         = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

// ── Sub-componentes existentes (sin cambios de lógica) ───────

function ScoreBadge({ score }: { score: number }) {
  const c = score >= 80 ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200'
  return <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${c}`}>{score}/100</span>
}

function GrupoSection({ titulo, prendas, onImgClick }: { titulo: string; prendas: { id: number; fotoUrl: string; categoria: string }[]; onImgClick?: (s: string) => void }) {
  if (!prendas.length) return null
  return (
    <div>
      <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase mb-1.5">{titulo}</p>
      <div className="flex gap-2 flex-wrap">
        {prendas.map(p => (
          <div key={p.id} className={`w-16 h-16 rounded-xl overflow-hidden bg-white border border-surface flex-shrink-0 ${onImgClick ? 'cursor-zoom-in' : ''}`} onClick={() => onImgClick?.(p.fotoUrl)}>
            <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function OutfitSugeridoCard({ outfit, onGuardar, saving }: { outfit: OutfitSugerido; onGuardar: () => void; saving: boolean }) {
  const [expandido, setExpandido] = useState(false)
  const [modalImg, setModalImg]   = useState<string | null>(null)
  const g = outfit.grupoVisual
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl font-light text-primary leading-tight">{outfit.nombre}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={outfit.score} />
          <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">{ESTILOS.find(e => e.value === outfit.estilo)?.label ?? outfit.estilo}</span>
        </div>
      </div>
      {outfit.razonamiento && <p className="text-primary/60 font-body text-sm leading-relaxed">{outfit.razonamiento}</p>}
      {outfit.estiloClimatico && <p className="text-xs font-body text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">🌡 {outfit.estiloClimatico}</p>}
      {outfit.warnings.length > 0 && outfit.warnings.map((w, i) => <p key={i} className="text-xs font-body text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">⚠ {w}</p>)}
      {modalImg && <ImageModal src={modalImg} onClose={() => setModalImg(null)} />}
      <div className="flex flex-col gap-3">
        <GrupoSection titulo="Superior"   prendas={g.parteSuperior} onImgClick={setModalImg} />
        <GrupoSection titulo="Inferior"   prendas={g.parteInferior} onImgClick={setModalImg} />
        <GrupoSection titulo="Calzado"    prendas={g.calzado}       onImgClick={setModalImg} />
        <GrupoSection titulo="Abrigo"     prendas={g.abrigo}        onImgClick={setModalImg} />
        <GrupoSection titulo="Accesorios" prendas={g.accesorios}    onImgClick={setModalImg} />
        <GrupoSection titulo="Bolso"      prendas={g.bolso}         onImgClick={setModalImg} />
        <GrupoSection titulo="Opcionales" prendas={g.opcionales}    onImgClick={setModalImg} />
      </div>
      <div className="bg-surface/60 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-xs font-body text-primary/50">Armonía</span><ScoreBadge score={outfit.armoniaColor.colorScore} /></div>
        {outfit.armoniaColor.coloresDominantes.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {outfit.armoniaColor.coloresDominantes.slice(0, 3).map(c => <span key={c} className="text-[10px] font-body text-primary/60 bg-surface px-2 py-0.5 rounded-full">{c}</span>)}
          </div>
        )}
      </div>
      <button onClick={() => setExpandido(!expandido)} className="text-xs font-body text-primary/40 hover:text-primary transition-colors text-left">{expandido ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}</button>
      {expandido && (
        <div className="flex flex-col gap-3 border-t border-primary/10 pt-3">
          {[{ label: 'Color', value: outfit.explicacion.color },{ label: 'Silueta', value: outfit.explicacion.silueta },{ label: 'Ocasión', value: outfit.explicacion.ocasion },{ label: 'Colorimetría', value: outfit.explicacion.temporada },{ label: 'Mejoras', value: outfit.explicacion.mejoras }].filter(e => e.value).map(({ label, value }) => (
            <div key={label}><p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">{label}</p><p className="text-primary/70 font-body text-sm leading-relaxed">{value}</p></div>
          ))}
          {outfit.armoniaColor.colorReason && <div><p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">Armonía cromática</p><p className="text-primary/70 font-body text-sm">{outfit.armoniaColor.colorReason}</p></div>}
          {outfit.scoreRazon && <div><p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">Razón del score</p><p className="text-primary/70 font-body text-sm">{outfit.scoreRazon}</p></div>}
        </div>
      )}
      {outfit.prendaFaltante && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-lg">🛍️</span>
          <p className="text-primary font-body text-xs leading-relaxed"><span className="font-medium">Para completar:</span> {outfit.prendaFaltante.toLowerCase()}</p>
        </div>
      )}
      <button onClick={onGuardar} disabled={saving} className="w-full border border-accent text-accent font-body font-medium py-3 rounded-xl text-sm hover:bg-accent hover:text-white transition-colors disabled:opacity-60">
        {saving ? 'Guardando...' : 'Guardar outfit'}
      </button>
    </div>
  )
}

function OutfitGuardadoCard({ outfit, onEliminar }: { outfit: OutfitGuardado; onEliminar: () => void }) {
  const [expandido, setExpandido]   = useState(false)
  const [modalImg, setModalImg]     = useState<string | null>(null)
  const [confirmDelete, setCD]      = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [chatMsg, setChatMsg]       = useState('')
  const [chatRes, setChatRes]       = useState('')
  const [chatLoading, setCL]        = useState(false)
  const [lookRes, setLookRes]       = useState<AnalizarLookResponse | null>(null)
  const [lookLoading, setLL]        = useState(false)
  const m = outfit.metadata

  const handleEliminar = async () => { setDeleting(true); try { await eliminarOutfit(outfit.id); onEliminar() } finally { setDeleting(false) } }
  const handleChat = async () => {
    if (!chatMsg.trim()) return; setCL(true)
    try { const r = await chatOutfit(outfit.id, outfit.prendas.map(p => p.id), chatMsg, outfit.estilo); setChatRes(r.data.respuesta) } finally { setCL(false) }
  }
  const handleLook = async (file: File) => { setLL(true); try { const r = await analizarLook(outfit.id, file); setLookRes(r.data) } finally { setLL(false) } }

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl font-light text-primary">{outfit.nombre}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {m?.score ? <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${m.score >= 80 ? 'bg-green-100 text-green-700 border-green-200' : m.score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{m.score}/100</span> : null}
          <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">{ESTILOS.find(e => e.value === outfit.estilo)?.label ?? outfit.estilo}</span>
        </div>
      </div>
      {modalImg && <ImageModal src={modalImg} onClose={() => setModalImg(null)} />}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {outfit.prendas.map(p => <div key={p.id} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white cursor-zoom-in" onClick={() => setModalImg(p.fotoUrl)}><img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" /></div>)}
      </div>
      {m?.razonamiento && <p className="text-primary/60 font-body text-sm leading-relaxed">{m.razonamiento}</p>}
      {m && (<>
        <button onClick={() => setExpandido(!expandido)} className="text-xs font-body text-primary/40 hover:text-primary text-left transition-colors">{expandido ? '▲ Ocultar' : '▼ Ver análisis'}</button>
        {expandido && <div className="flex flex-col gap-2 border-t border-primary/10 pt-3">
          {m.estiloClimatico && <p className="text-xs font-body text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">🌡 {m.estiloClimatico}</p>}
          {m.warnings?.map((w, i) => <p key={i} className="text-xs font-body text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">⚠ {w}</p>)}
          {m.explicacion && [['Color', m.explicacion.color],['Silueta', m.explicacion.silueta],['Ocasión', m.explicacion.ocasion],['Colorimetría', m.explicacion.temporada],['Mejoras', m.explicacion.mejoras]].filter(([, v]) => v).map(([l, v]) => <div key={l as string}><p className="text-[10px] font-body text-primary/40 tracking-widest uppercase">{l}</p><p className="text-primary/70 font-body text-sm">{v}</p></div>)}
        </div>}
      </>)}
      <div className="border-t border-primary/10 pt-3">
        <p className="text-xs font-body text-primary/50 mb-2">💬 Pregúntale a la IA</p>
        <div className="flex gap-2">
          <input type="text" value={chatMsg} onChange={e => { setChatMsg(e.target.value); setChatRes('') }} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="¿Le puedo agregar un cinturón?" className="flex-1 bg-surface border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary placeholder:text-primary/30 outline-none focus:border-accent/40" />
          <button onClick={handleChat} disabled={chatLoading || !chatMsg.trim()} className="bg-accent text-white font-body text-xs px-3 py-2 rounded-xl disabled:opacity-40">{chatLoading ? '...' : 'Ask'}</button>
        </div>
        {chatRes && <p className="text-primary/70 font-body text-sm mt-2 bg-surface rounded-xl px-3 py-2 leading-relaxed">{chatRes}</p>}
      </div>
      <div className="border-t border-primary/10 pt-3">
        <p className="text-xs font-body text-primary/50 mb-2">📸 Sube una foto y analizo el look</p>
        {lookLoading && <p className="text-primary/50 font-body text-xs text-center py-2">Analizando...</p>}
        {!lookLoading && !lookRes && <PhotoSelector onFile={handleLook} captureMode="user" compact />}
        {lookRes && <div className="bg-white rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2"><span className={`font-display text-2xl font-light ${lookRes.calificacion >= 80 ? 'text-green-600' : lookRes.calificacion >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{lookRes.calificacion}</span><p className="text-primary/60 font-body text-sm">{lookRes.resumen}</p></div>
          {lookRes.puntosPositivos.map((p, i) => <p key={i} className="text-green-700 font-body text-xs">✓ {p}</p>)}
          {lookRes.sugerencias.map((s, i) => <p key={i} className="text-amber-700 font-body text-xs">→ {s}</p>)}
          <button onClick={() => setLookRes(null)} className="text-xs font-body text-primary/30 text-right">Analizar otra</button>
        </div>}
      </div>
      {!confirmDelete ? (
        <button onClick={() => setCD(true)} className="text-xs font-body text-red-400 hover:text-red-600 transition-colors text-right">Eliminar outfit</button>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setCD(false)} className="flex-1 py-2 rounded-xl border border-surface text-primary/60 font-body text-xs">Cancelar</button>
          <button onClick={handleEliminar} disabled={deleting} className="flex-1 py-2 rounded-xl bg-red-500 text-white font-body text-xs font-medium disabled:opacity-60">{deleting ? 'Eliminando...' : 'Sí, eliminar'}</button>
        </div>
      )}
    </div>
  )
}

function CapsuleSection({ titulo, emoji, children }: { titulo: string; emoji: string; children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl p-4 flex flex-col gap-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}><p className="font-body text-sm font-medium text-primary flex items-center gap-2"><span>{emoji}</span>{titulo}</p>{children}</div>
}

function CapsuleTab() {
  const [capsule, setCapsule] = useState<CapsuleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const cargar = async () => { setLoading(true); setError(''); try { const r = await getCapsule(); setCapsule(r.data) } catch { setError('No se pudo analizar.') } finally { setLoading(false) } }
  useEffect(() => { cargar() }, [])
  if (loading) return <div className="px-4 pt-6"><LoadingSpinner text="Analizando tu closet..." /></div>
  if (error)   return <p className="text-red-500 text-sm font-body text-center px-4 py-3 bg-red-50 rounded-xl mx-4 mt-4">{error}</p>
  if (!capsule) return null
  const sc = capsule.puntuacionCloset
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-2">Puntuación</p>
        <p className={`font-display text-6xl font-light ${sc >= 70 ? 'text-green-600' : sc >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{sc}</p>
        <p className="text-primary/40 font-body text-xs mt-1">/100</p>
        <p className="text-primary/70 font-body text-sm mt-3 leading-relaxed">{capsule.resumen}</p>
      </div>
      {capsule.prendasEsencialesFaltantes.length > 0 && <CapsuleSection titulo="Esenciales que te faltan" emoji="❗">{capsule.prendasEsencialesFaltantes.map((p, i) => <p key={i} className="text-primary/70 font-body text-sm">• {p}</p>)}</CapsuleSection>}
      {capsule.prendasVersatiles.length > 0 && <CapsuleSection titulo="Prendas más versátiles" emoji="⭐"><div className="flex gap-2 flex-wrap">{capsule.prendasVersatiles.map(p => <div key={p.id} className="w-16 h-16 rounded-xl overflow-hidden bg-surface flex-shrink-0"><img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" /></div>)}</div></CapsuleSection>}
      {capsule.coloresQueSeRepiten.length > 0 && <CapsuleSection titulo="Colores dominantes" emoji="🎨"><div className="flex flex-wrap gap-2">{capsule.coloresQueSeRepiten.map((c, i) => <span key={i} className="text-sm font-body text-primary/70 bg-surface border border-primary/10 px-3 py-1 rounded-full">{c}</span>)}</div></CapsuleSection>}
      {capsule.recomendacionesCompra.length > 0 && <CapsuleSection titulo="Recomendaciones de compra" emoji="🛍️">{capsule.recomendacionesCompra.map((r, i) => <p key={i} className="text-primary/70 font-body text-sm">• {r}</p>)}</CapsuleSection>}
      <button onClick={cargar} className="text-xs font-body text-accent text-center hover:underline pb-4">Actualizar análisis</button>
    </div>
  )
}

function DiaCard({ dia, outfit, onGuardar, saving, guardado }: { dia: string; outfit: OutfitSugerido; onGuardar: () => void; saving: boolean; guardado: boolean }) {
  const [modalImg, setModalImg] = useState<string | null>(null)
  const g = outfit.grupoVisual
  const prendas = [...g.parteSuperior, ...g.parteInferior, ...g.calzado, ...g.abrigo, ...g.accesorios, ...g.bolso]
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #D4BFA4' }}>
      {modalImg && <ImageModal src={modalImg} onClose={() => setModalImg(null)} />}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#F2EBE0' }}>
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-light" style={{ color: '#4A3420' }}>{dia}</span>
          <span className="text-[10px] font-body text-accent bg-accent/10 px-2 py-0.5 rounded-full">{ESTILOS.find(e => e.value === outfit.estilo)?.label ?? outfit.estilo}</span>
        </div>
        <ScoreBadge score={outfit.score} />
      </div>
      <div className="bg-white px-4 pt-3 pb-4 flex flex-col gap-3">
        <p className="font-display text-lg font-light text-primary leading-tight">{outfit.nombre}</p>
        {outfit.razonamiento && <p className="text-primary/55 font-body text-xs leading-relaxed">{outfit.razonamiento}</p>}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {prendas.slice(0, 6).map((p, i) => <div key={i} className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-surface cursor-zoom-in" onClick={() => setModalImg(p.fotoUrl)}><img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" /></div>)}
        </div>
        {guardado ? <p className="text-center text-green-600 font-body text-sm py-1.5 font-medium">✓ Guardado</p>
          : <button onClick={onGuardar} disabled={saving} className="w-full border border-accent/40 text-accent font-body text-sm py-2.5 rounded-xl disabled:opacity-60 hover:bg-accent hover:text-white transition-colors">{saving ? 'Guardando...' : 'Guardar outfit'}</button>}
      </div>
    </div>
  )
}

function SemanaTab() {
  const [outfits, setOutfits]         = useState<OutfitSugerido[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [estilo, setEstilo]           = useState<Estilo>('CASUAL')
  const [savingIndex, setSavingIndex] = useState<number | null>(null)
  const [savedIndices, setSaved]      = useState<Set<number>>(new Set())

  const generar = async () => {
    setLoading(true); setError(''); setOutfits([]); setSaved(new Set())
    try { const r = await sugerirOutfitsAvanzado({ estilo, limit: 5 }); setOutfits(r.data.slice(0, 5)) }
    catch { setError('No pudimos generar el plan. Verifica que tengas prendas en tu closet.') }
    finally { setLoading(false) }
  }
  const handleGuardar = async (outfit: OutfitSugerido, index: number) => {
    setSavingIndex(index)
    try { await guardarOutfit(outfit.nombre, outfit.prendaIds, outfit.estilo, { score: outfit.score, scoreRazon: outfit.scoreRazon, razonamiento: outfit.razonamiento, explicacion: outfit.explicacion, armoniaColor: outfit.armoniaColor, warnings: outfit.warnings, prendaFaltante: outfit.prendaFaltante }); setSaved(prev => new Set([...prev, index])) }
    catch { setError('No se pudo guardar.') }
    finally { setSavingIndex(null) }
  }

  if (!outfits.length && !loading) return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <div><p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-3">Estilo de la semana</p>
        <div className="flex flex-wrap gap-2">{ESTILOS.map(({ value, label }) => <button key={value} onClick={() => setEstilo(value)} className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${estilo === value ? 'bg-accent text-white' : 'bg-surface text-primary/60'}`}>{label}</button>)}</div>
      </div>
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <div className="text-5xl">📅</div>
        <p className="font-display text-2xl font-light text-primary">Plan semanal</p>
        <p className="text-primary/50 font-body text-sm max-w-xs">La IA te arma un outfit para cada día de lunes a viernes</p>
      </div>
      {error && <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>}
      <button onClick={generar} className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl">Planear mi semana ✨</button>
    </div>
  )

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {loading && <LoadingSpinner text="Armando tu semana..." />}
      {error && <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>}
      {outfits.map((o, i) => <DiaCard key={i} dia={DIAS[i]} outfit={o} onGuardar={() => handleGuardar(o, i)} saving={savingIndex === i} guardado={savedIndices.has(i)} />)}
      {outfits.length > 0 && !loading && <button onClick={generar} className="w-full border border-accent/40 text-accent font-body font-medium py-3.5 rounded-xl text-sm hover:bg-accent/5 transition-colors">Regenerar semana →</button>}
    </div>
  )
}

// ── OutfitsPage ──────────────────────────────────────────────
export default function OutfitsPage() {
  const location   = useLocation()
  const navigate   = useNavigate()
  const prendaAncla = (location.state as { prendaAncla?: { id: number; categoria: string; colorPrincipal: string } } | null)?.prendaAncla
  const autoRef    = useRef(false)
  const weather    = useWeather()

  const [tab,                    setTab]                    = useState<Tab>('sugerir')
  const [estilo,                 setEstilo]                 = useState<Estilo>('CASUAL')
  const [limit,                  setLimit]                  = useState(2)
  const [mostrarOpc,             setMostrarOpc]             = useState(false)
  const [temperatura,            setTemperatura]            = useState('')
  const [condicion,              setCondicion]              = useState('')
  const [nombreEvento,           setNombreEvento]           = useState('')
  const [nivelFormalidad,        setNivelFormalidad]        = useState('')
  const [sugerencias,            setSugerencias]            = useState<OutfitSugerido[]>([])
  const [guardados,              setGuardados]              = useState<OutfitGuardado[]>([])
  const [loadingSugerir,         setLoadingSugerir]         = useState(false)
  const [loadingGuard,           setLoadingGuard]           = useState(false)
  const [savingIndex,            setSavingIndex]            = useState<number | null>(null)
  const [error,                  setError]                  = useState('')
  const [idsYaMostrados,         setIds]                    = useState<number[]>([])
  const [sentimiento,            setSentimiento]            = useState<string | null>(null)
  const [ocasion,                setOcasion]                = useState<string | null>(null)
  const [closetPrendas,          setClosetPrendas]          = useState<Prenda[]>([])
  const [considerarColorimetria, setConsiderarColorimetria] = useState(() =>
    localStorage.getItem('colorimetria_activa') !== 'false'
  )

  useEffect(() => { getPrendas().then(r => setClosetPrendas(r.data)).catch(() => {}) }, [])
  useEffect(() => { if (tab === 'guardados') cargarGuardados() }, [tab])
  useEffect(() => { localStorage.setItem('colorimetria_activa', String(considerarColorimetria)) }, [considerarColorimetria])
  useEffect(() => {
    if (prendaAncla && !autoRef.current) { autoRef.current = true; handleSugerirAncla() }
  }, [prendaAncla])

  const buildRequest = (excluir: number[]): SugerirRequest => ({
    estilo, limit,
    prendaIdsExcluir: excluir,
    prendaAnclaId: undefined,
    considerarColorimetria,
    clima: temperatura || condicion ? { temperatura: temperatura ? parseFloat(temperatura) : undefined, condicion: condicion || undefined } : undefined,
    evento: nombreEvento || nivelFormalidad ? { nombreEvento: nombreEvento || undefined, nivelFormalidad: nivelFormalidad || undefined } : undefined,
  })

  const handleSugerir = async () => {
    setLoadingSugerir(true); setError(''); setSugerencias([]); setIds([])
    try { const r = await sugerirOutfitsAvanzado(buildRequest([])); setSugerencias(r.data); setIds(r.data.flatMap(o => o.prendaIds)) }
    catch { setError('No pudimos generar sugerencias. Verifica que tengas prendas en tu closet.') }
    finally { setLoadingSugerir(false) }
  }

  const handleSugerirAncla = async () => {
    if (!prendaAncla) return
    setLoadingSugerir(true); setError(''); setSugerencias([])
    try { const r = await sugerirOutfitsAvanzado({ estilo, limit: 2, prendaAnclaId: prendaAncla.id, prendaIdsExcluir: [], considerarColorimetria }); setSugerencias(r.data); setIds(r.data.flatMap(o => o.prendaIds)) }
    catch { setError('No pudimos generar outfits con esa prenda.') }
    finally { setLoadingSugerir(false) }
  }

  const handleGenerarMas = async () => {
    setLoadingSugerir(true); setError('')
    try { const r = await sugerirOutfitsAvanzado(buildRequest(idsYaMostrados)); setSugerencias(prev => [...prev, ...r.data]); setIds(prev => [...prev, ...r.data.flatMap(o => o.prendaIds)]) }
    catch { setError('No se pudieron generar más outfits.') }
    finally { setLoadingSugerir(false) }
  }

  const cargarGuardados = async () => {
    setLoadingGuard(true)
    try { const r = await getOutfits(); setGuardados(r.data) }
    catch { /* silencioso */ }
    finally { setLoadingGuard(false) }
  }

  const handleGuardar = async (sug: OutfitSugerido, index: number) => {
    setSavingIndex(index)
    try {
      await guardarOutfit(sug.nombre, sug.prendaIds, sug.estilo, { score: sug.score, scoreRazon: sug.scoreRazon, razonamiento: sug.razonamiento, explicacion: sug.explicacion, armoniaColor: sug.armoniaColor, warnings: sug.warnings, prendaFaltante: sug.prendaFaltante, estiloClimatico: sug.estiloClimatico })
      setSugerencias(prev => prev.filter((_, i) => i !== index))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg === 'Este outfit ya está guardado' ? 'Este outfit ya lo tienes guardado.' : 'No se pudo guardar el outfit.')
    } finally { setSavingIndex(null) }
  }

  // Contadores del closet
  const tops    = closetPrendas.filter(p => ['BLUSA','CAMISETA','CAMISA'].includes(p.categoria)).length
  const pants   = closetPrendas.filter(p => ['PANTALON','JEAN','LEGGINS','SHORT'].includes(p.categoria)).length
  const shoes   = closetPrendas.filter(p => ['ZAPATO_TACO','ZAPATO_PLANO','BOTA','TENIS','SANDALIA'].includes(p.categoria)).length
  const bolsos  = closetPrendas.filter(p => ['BOLSO','CARTERA'].includes(p.categoria)).length
  const firstPhoto = closetPrendas[0]?.fotoUrl

  const TABS_UI = [
    { key: 'sugerir'   as Tab, icon: '✦', label: 'Crear Look' },
    { key: 'guardados' as Tab, icon: '♡', label: 'Favoritos'  },
    { key: 'capsule'   as Tab, icon: '⊟', label: 'Cápsula'    },
    { key: 'semana'    as Tab, icon: '📅', label: 'Semana'     },
  ]

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', paddingBottom: '96px' }}>

      {/* ── Header con imagen ──────────────────────────────── */}
      <header style={{ position: 'relative', padding: '52px 16px 24px', overflow: 'hidden' }}>
        {/* Imagen decorativa */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #FAF7F2 20%, rgba(250,247,242,0.3) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => navigate('/home')} style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <button style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>✦</span>
            </button>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>Outfits</h1>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0, maxWidth: '55%' }}>Tu IA personal crea looks únicos con tu ropa y tu estilo.</p>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS_UI.map(({ key, icon, label }) => {
          const active = tab === key
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500,
              backgroundColor: active ? '#3D2B1F' : '#fff',
              color: active ? '#fff' : '#9E9690',
              boxShadow: active ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '12px' }}>{icon}</span> {label}
            </button>
          )
        })}
      </div>

      {/* ── TAB: CREAR LOOK ────────────────────────────────── */}
      {tab === 'sugerir' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Prenda ancla */}
          {prendaAncla && (
            <div style={{ backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.2)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>✨</span>
              <div><p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#C4956A', fontWeight: 500, margin: 0 }}>Armando outfit con:</p><p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#1A1A1A', margin: 0 }}>{CATEGORIA_LABELS[prendaAncla.categoria] ?? prendaAncla.categoria} · {prendaAncla.colorPrincipal}</p></div>
            </div>
          )}

          {/* Estilo visual */}
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>¿Qué estilo buscas?</p>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
              {ESTILOS_VISUAL.map(({ value, label, img }) => {
                const sel = estilo === value
                return (
                  <button key={value} onClick={() => setEstilo(value)} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '16px', overflow: 'hidden', border: sel ? '2.5px solid #C4956A' : '2.5px solid transparent', boxShadow: sel ? '0 0 0 1px #C4956A' : 'none', transition: 'all 0.15s' }}>
                      <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: sel ? '#C4956A' : '#9E9690', fontWeight: sel ? 600 : 400, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggle colorimetría */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ flex: 1, marginRight: '12px' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 3px' }}>🎨 Considerar mi colorimetría</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0 }}>
                {considerarColorimetria ? 'La IA adaptará los outfits a tu paleta personal' : 'La IA evaluará el outfit sin considerar tus colores'}
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

          {/* Sentimiento */}
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>¿Cómo quieres sentirte?</p>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {SENTIMIENTOS.map(s => {
                const sel = sentimiento === s
                return (
                  <button key={s} onClick={() => setSentimiento(sel ? null : s)} style={{ flexShrink: 0, width: '68px', height: '68px', borderRadius: '50%', border: `2px solid ${sel ? '#C4956A' : '#E0D5C8'}`, backgroundColor: sel ? 'rgba(196,149,106,0.1)' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '18px' }}>{s.split(' ')[0]}</span>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: sel ? '#C4956A' : '#9E9690', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{s.split(' ').slice(1).join(' ')}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clima */}
          {weather && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', height: '90px' }}>
              <div style={{ flex: '1', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>Clima actual</p>
                <div>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>{weather.icon} {weather.temp}°</p>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: '2px 0 0', textTransform: 'capitalize' }}>{weather.city} · {weather.desc}</p>
                </div>
              </div>
              <div style={{ width: '90px', position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff 0%, transparent 60%)' }} />
              </div>
            </div>
          )}

          {/* Ocasión */}
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>Ocasión</p>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {OCASIONES.map(o => {
                const sel = ocasion === o
                return (
                  <button key={o} onClick={() => setOcasion(sel ? null : o)} style={{ flexShrink: 0, fontFamily: 'Jost, sans-serif', fontSize: '12px', padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${sel ? '#C4956A' : '#E0D5C8'}`, backgroundColor: sel ? 'rgba(196,149,106,0.1)' : '#fff', color: sel ? '#C4956A' : '#9E9690', cursor: 'pointer', transition: 'all 0.15s', fontWeight: sel ? 600 : 400 }}>{o}</button>
                )
              })}
            </div>
          </div>

          {/* Opciones avanzadas */}
          <div>
            <button onClick={() => setMostrarOpc(!mostrarOpc)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', padding: 0 }}>
              <span>{mostrarOpc ? '▲' : '▼'}</span> Opciones avanzadas
            </button>
            {mostrarOpc && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '16px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: 0 }}>Cantidad de outfits</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setLimit(l => Math.max(1, l - 1))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #E0D5C8', backgroundColor: '#fff', fontFamily: 'Jost', fontSize: '16px', color: '#4A3420', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#1A1A1A', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{limit}</span>
                    <button onClick={() => setLimit(l => Math.min(10, l + 1))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #E0D5C8', backgroundColor: '#fff', fontFamily: 'Jost', fontSize: '16px', color: '#4A3420', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: '0 0 6px' }}>Clima (opcional)</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" placeholder="°C" value={temperatura} onChange={e => setTemperatura(e.target.value)} style={{ width: '64px', border: '1px solid #E0D5C8', borderRadius: '10px', padding: '8px 10px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#FAF7F2' }} />
                    <select value={condicion} onChange={e => setCondicion(e.target.value)} style={{ flex: 1, border: '1px solid #E0D5C8', borderRadius: '10px', padding: '8px 10px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#FAF7F2' }}>
                      <option value="">Condición</option>
                      {['soleado','nublado','lluvia','frio','calor','templado'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9E9690', margin: '0 0 6px' }}>Evento (opcional)</p>
                  <input type="text" placeholder="Nombre del evento" value={nombreEvento} onChange={e => setNombreEvento(e.target.value)} style={{ width: '100%', border: '1px solid #E0D5C8', borderRadius: '10px', padding: '8px 10px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#FAF7F2', marginBottom: '8px', boxSizing: 'border-box' }} />
                  <select value={nivelFormalidad} onChange={e => setNivelFormalidad(e.target.value)} style={{ width: '100%', border: '1px solid #E0D5C8', borderRadius: '10px', padding: '8px 10px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none', backgroundColor: '#FAF7F2' }}>
                    <option value="">Nivel de formalidad</option>
                    {[['casual','Casual'],['semiformal','Semiformal'],['formal','Formal'],['muy_formal','Muy formal']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Banner Tu IA usará */}
          {closetPrendas.length > 0 && (
            <div style={{ backgroundColor: '#F2EBE0', borderRadius: '14px', padding: '14px', border: '1px solid #D9CEBF', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {firstPhoto && <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}><img src={firstPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: '0 0 4px' }}>Tu IA usará:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[['Tops', tops],['Panta.', pants],['Zapatos', shoes],['Bolsos', bolsos]].filter(([, n]) => (n as number) > 0).map(([l, n]) => <span key={l as string} style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#4A3420', fontWeight: 600 }}>{n} {l}</span>)}
                </div>
              </div>
              <button onClick={() => navigate('/closet')} style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#C4956A', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, fontWeight: 500 }}>Ver closet ›</button>
            </div>
          )}

          {/* Error */}
          {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#E05555', backgroundColor: '#FEE', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', margin: 0 }}>{error}</p>}

          {/* Botón principal — LÓGICA EXACTAMENTE IGUAL */}
          <button
            onClick={handleSugerir}
            disabled={loadingSugerir}
            style={{
              width: '100%', height: '56px', backgroundColor: '#C4956A',
              borderRadius: '16px', border: 'none', cursor: loadingSugerir ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
              opacity: loadingSugerir ? 0.7 : 1, transition: 'opacity 0.15s',
            }}
          >
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#fff', lineHeight: 1 }}>
              {loadingSugerir ? 'Generando outfits...' : `✦ Crear mis outfits`}
            </span>
            {!loadingSugerir && <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>Deja que la IA haga su magia ✨</span>}
          </button>

          {loadingSugerir && <LoadingSpinner text="La IA está creando tus combinaciones..." />}

          {/* Resultados */}
          {sugerencias.map((sug, i) => (
            <OutfitSugeridoCard key={`${sug.nombre}-${i}`} outfit={sug} onGuardar={() => handleGuardar(sug, i)} saving={savingIndex === i} />
          ))}

          {sugerencias.length > 0 && !loadingSugerir && (
            <button onClick={handleGenerarMas} style={{ width: '100%', border: '1.5px solid rgba(196,149,106,0.4)', borderRadius: '12px', padding: '14px', backgroundColor: 'transparent', fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#C4956A', cursor: 'pointer' }}>
              Generar más outfits →
            </button>
          )}

        </div>
      )}

      {/* ── TAB: GUARDADOS ─────────────────────────────────── */}
      {tab === 'guardados' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loadingGuard && <LoadingSpinner text="Cargando outfits..." />}
          {!loadingGuard && guardados.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center', gap: '8px' }}>
              <span style={{ fontSize: '48px' }}>💫</span>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#1A1A1A', margin: 0 }}>Sin outfits guardados</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0 }}>Usa el generador para crear y guardar combinaciones</p>
            </div>
          )}
          {guardados.map(o => <OutfitGuardadoCard key={o.id} outfit={o} onEliminar={() => setGuardados(prev => prev.filter(x => x.id !== o.id))} />)}
        </div>
      )}

      {/* ── TAB: CÁPSULA ───────────────────────────────────── */}
      {tab === 'capsule' && <CapsuleTab />}

      {/* ── TAB: SEMANA ────────────────────────────────────── */}
      {tab === 'semana' && <SemanaTab />}

      <AppBottomNav />

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
