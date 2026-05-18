import { useState, useEffect } from 'react'
import { sugerirOutfits, guardarOutfit, getOutfits } from '../api/outfits'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import type { SugerenciaOutfit, Outfit, Estilo } from '../types'
import { ESTILOS, CATEGORIA_LABELS } from '../types'

type Tab = 'sugerir' | 'guardados'

export default function OutfitsPage() {
  const [tab, setTab] = useState<Tab>('sugerir')
  const [estiloSeleccionado, setEstiloSeleccionado] = useState<Estilo>('CASUAL')
  const [sugerencias, setSugerencias] = useState<SugerenciaOutfit[]>([])
  const [outfitsGuardados, setOutfitsGuardados] = useState<Outfit[]>([])
  const [loadingSugerir, setLoadingSugerir] = useState(false)
  const [loadingGuardados, setLoadingGuardados] = useState(false)
  const [savingIndex, setSavingIndex] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleSugerir = async () => {
    setLoadingSugerir(true)
    setError('')
    setSugerencias([])
    try {
      const res = await sugerirOutfits(estiloSeleccionado)
      setSugerencias(res.data)
    } catch {
      setError('No pudimos generar sugerencias. Verifica que tengas prendas en tu closet.')
    } finally {
      setLoadingSugerir(false)
    }
  }

  const cargarGuardados = async () => {
    setLoadingGuardados(true)
    try {
      const res = await getOutfits()
      setOutfitsGuardados(res.data)
    } catch {
      // silencioso
    } finally {
      setLoadingGuardados(false)
    }
  }

  useEffect(() => {
    if (tab === 'guardados') cargarGuardados()
  }, [tab])

  const handleGuardar = async (sugerencia: SugerenciaOutfit, index: number) => {
    setSavingIndex(index)
    try {
      await guardarOutfit(
        sugerencia.nombre,
        sugerencia.prendas.map((p) => p.id),
        sugerencia.estilo
      )
      setSugerencias((prev) => prev.filter((_, i) => i !== index))
    } catch {
      setError('No se pudo guardar el outfit.')
    } finally {
      setSavingIndex(null)
    }
  }

  return (
    <Layout title="Outfits">
      {/* Tabs */}
      <div className="flex gap-1 mx-4 mt-4 mb-2 bg-surface rounded-full p-1">
        {(['sugerir', 'guardados'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-full text-xs font-body font-medium transition-all capitalize ${
              tab === t ? 'bg-primary text-white shadow-sm' : 'text-primary/50'
            }`}
          >
            {t === 'sugerir' ? 'Sugerir outfit' : 'Guardados'}
          </button>
        ))}
      </div>

      {tab === 'sugerir' && (
        <div className="px-4 py-4 flex flex-col gap-5">
          <div>
            <p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-3">Estilo</p>
            <div className="flex flex-wrap gap-2">
              {ESTILOS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setEstiloSeleccionado(value)}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                    estiloSeleccionado === value
                      ? 'bg-accent text-white'
                      : 'bg-surface text-primary/60 hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSugerir}
            disabled={loadingSugerir}
            className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl disabled:opacity-60"
          >
            {loadingSugerir ? 'Generando...' : 'Sugerir outfits ✨'}
          </button>

          {loadingSugerir && <LoadingSpinner text="La IA está creando tus combinaciones..." />}

          {error && (
            <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">
              {error}
            </p>
          )}

          {sugerencias.map((sug, i) => (
            <OutfitCard
              key={i}
              outfit={sug}
              onGuardar={() => handleGuardar(sug, i)}
              saving={savingIndex === i}
            />
          ))}
        </div>
      )}

      {tab === 'guardados' && (
        <div className="px-4 py-4 flex flex-col gap-4">
          {loadingGuardados && <LoadingSpinner text="Cargando outfits..." />}

          {!loadingGuardados && outfitsGuardados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">💫</div>
              <p className="font-display text-2xl font-light text-primary mb-2">Sin outfits guardados</p>
              <p className="text-primary/50 font-body text-sm">
                Usa el generador para crear y guardar combinaciones
              </p>
            </div>
          )}

          {outfitsGuardados.map((outfit) => (
            <div key={outfit.id} className="bg-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl font-light text-primary">{outfit.nombre}</h3>
                <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                  {ESTILOS.find((e) => e.value === outfit.estilo)?.label ?? outfit.estilo}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {outfit.prendas.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white">
                    <img src={p.fotoUrl} alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

function OutfitCard({
  outfit,
  onGuardar,
  saving,
}: {
  outfit: SugerenciaOutfit
  onGuardar: () => void
  saving: boolean
}) {
  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-light text-primary">{outfit.nombre}</h3>
        <span className="text-xs font-body text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          {ESTILOS.find((e) => e.value === outfit.estilo)?.label ?? outfit.estilo}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {outfit.prendas.map((p) => (
          <div key={p.id} className="flex-shrink-0 text-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white mb-1">
              <img
                src={p.fotoUrl}
                alt={CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] font-body text-primary/50 w-20 truncate text-center">
              {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
            </p>
          </div>
        ))}
      </div>

      {outfit.prendaFaltante && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-lg">🛍️</span>
          <p className="text-primary font-body text-xs leading-relaxed">
            <span className="font-medium">Sugerencia de compra:</span> Te falta {outfit.prendaFaltante.toLowerCase()} para completar este look.
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
