import { useState } from 'react'
import { buscarInspiracion, analizarInspiracion } from '../api/inspiration'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import type { InspirationImage, InspirationAnalisisResponse } from '../types'
import { CATEGORIA_LABELS } from '../types'

const SUGERENCIAS = [
  'outfits de verano playa', 'looks casual minimalista', 'outfits de trabajo elegante',
  'estilo boho chic', 'outfits otoño cálido', 'looks noche ciudad',
]

export default function InspirationPage() {
  const [query, setQuery] = useState('')
  const [imagenes, setImagenes] = useState<InspirationImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seleccionada, setSeleccionada] = useState<InspirationImage | null>(null)
  const [analisis, setAnalisis] = useState<InspirationAnalisisResponse | null>(null)
  const [analizando, setAnalizando] = useState(false)

  const handleBuscar = async (q = query) => {
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setImagenes([])
    setSeleccionada(null)
    setAnalisis(null)
    try {
      const res = await buscarInspiracion(q.trim())
      setImagenes(res.data)
    } catch {
      setError('No pudimos buscar imágenes. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSeleccionar = async (img: InspirationImage) => {
    setSeleccionada(img)
    setAnalisis(null)
    setAnalizando(true)
    try {
      const res = await analizarInspiracion(img.imageUrl)
      setAnalisis(res.data)
    } catch {
      setAnalisis(null)
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <Layout title="Inspiración">
      <div className="px-4 py-4 flex flex-col gap-5">

        {/* Buscador */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
            placeholder="Busca un estilo o look..."
            className="flex-1 bg-surface border border-accent/20 rounded-xl px-4 py-3 font-body text-sm text-primary placeholder:text-primary/30 outline-none focus:border-accent/50"
          />
          <button
            onClick={() => handleBuscar()}
            disabled={loading || !query.trim()}
            className="bg-accent text-white font-body font-medium px-4 py-3 rounded-xl text-sm disabled:opacity-40"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </div>

        {/* Sugerencias rápidas */}
        {imagenes.length === 0 && !loading && (
          <div>
            <p className="text-xs font-body text-primary/40 tracking-widest uppercase mb-3">Ideas para buscar</p>
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); handleBuscar(s) }}
                  className="bg-surface text-primary/60 font-body text-xs px-3 py-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingSpinner text="Buscando inspiración..." />}

        {error && (
          <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
        )}

        {/* Grid de imágenes */}
        {imagenes.length > 0 && (
          <>
            <p className="text-xs font-body text-primary/50">
              Toca una imagen para ver cómo lograrlo con tu closet ✨
            </p>
            <div className="grid grid-cols-3 gap-2">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleSeleccionar(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    seleccionada?.imageUrl === img.imageUrl
                      ? 'border-accent scale-95'
                      : 'border-transparent hover:border-accent/40'
                  }`}
                >
                  <img
                    src={img.thumbnailUrl || img.imageUrl}
                    alt={img.titulo}
                    className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.src = img.imageUrl)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-1">
                    <p className="text-white text-[9px] font-body truncate">{img.fuente}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Panel de análisis */}
        {seleccionada && (
          <div className="bg-surface rounded-2xl overflow-hidden">
            <img
              src={seleccionada.imageUrl}
              alt={seleccionada.titulo}
              className="w-full h-48 object-cover"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <div className="p-4 flex flex-col gap-3">
              {analizando && (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <p className="text-primary/50 font-body text-sm">Analizando el look con tu closet...</p>
                </div>
              )}

              {analisis && (
                <>
                  <div>
                    <p className="text-xs font-body text-primary/40 tracking-widest uppercase mb-1">El look</p>
                    <p className="text-primary/70 font-body text-sm leading-relaxed">{analisis.descripcionLook}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xs font-body text-primary/50">Similitud con tu closet:</p>
                    <div className="flex-1 bg-white rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-accent transition-all"
                        style={{ width: `${analisis.similitud}%` }}
                      />
                    </div>
                    <span className="text-xs font-body font-medium text-accent">{analisis.similitud}%</span>
                  </div>

                  {analisis.prendas.length > 0 && (
                    <div>
                      <p className="text-xs font-body text-primary/40 tracking-widest uppercase mb-2">
                        Úsalas de tu closet
                      </p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {analisis.prendas.map(p => (
                          <div key={p.id} className="flex-shrink-0 text-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                              <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                                   className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[9px] font-body text-primary/40 mt-0.5 w-16 truncate text-center">
                              {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-accent/10 border border-accent/20 rounded-xl px-3 py-2.5">
                    <p className="text-primary font-body text-xs leading-relaxed">
                      <span className="font-medium text-accent">✨ Consejo:</span> {analisis.consejo}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
