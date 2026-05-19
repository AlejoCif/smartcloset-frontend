import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPrendas, deletePrenda } from '../api/prendas'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import type { Prenda } from '../types'
import { FILTROS_CATEGORIA, CATEGORIA_LABELS } from '../types'

export default function ClosetPage() {
  const [prendas, setPrendas] = useState<Prenda[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
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
      setPrendas((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('No se pudo eliminar la prenda.')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  return (
    <Layout title="Mi Closet">
      {/* Filtros */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-surface sticky top-[65px] bg-background z-20">
        {FILTROS_CATEGORIA.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFiltro(value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-body font-medium transition-all flex-shrink-0 ${
              filtro === value
                ? 'bg-accent text-white'
                : 'bg-surface text-primary/60 hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {loading && <LoadingSpinner text="Cargando tu closet..." />}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 font-body text-sm">{error}</p>
            <button onClick={cargar} className="mt-3 text-accent text-sm font-body underline">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && prendas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">👗</div>
            <p className="font-display text-2xl font-light text-primary mb-2">Tu closet está vacío</p>
            <p className="text-primary/50 font-body text-sm mb-6">Comienza agregando tu primera prenda</p>
            <button
              onClick={() => navigate('/closet/agregar')}
              className="bg-accent text-white font-body font-medium px-6 py-3 rounded-xl text-sm"
            >
              Agregar prenda
            </button>
          </div>
        )}

        {!loading && prendas.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {prendas.map((prenda) => (
              <div key={prenda.id} className="relative group">
                <div className="bg-surface rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={prenda.fotoUrl}
                    alt={CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-1.5 px-1">
                  <p className="font-body text-xs font-medium text-primary truncate">
                    {CATEGORIA_LABELS[prenda.categoria] ?? prenda.categoria}
                  </p>
                  <p className="font-body text-xs text-primary/40 truncate mb-2">{prenda.colorPrincipal}</p>
                  <button
                    onClick={() => navigate('/outfits', { state: { prendaAncla: prenda } })}
                    className="w-full flex items-center justify-center gap-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-body font-medium text-xs py-1.5 rounded-lg transition-colors"
                  >
                    <span>✨</span>
                    <span>Crear outfit</span>
                  </button>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => setConfirmDelete(prenda.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A3420" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB agregar */}
      <button
        onClick={() => navigate('/closet/agregar')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-accent rounded-full shadow-lg flex items-center justify-center text-white z-30 active:scale-95 transition-transform"
        aria-label="Agregar prenda"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Modal confirmar eliminación */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm px-4 pb-8">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl">
            <h3 className="font-display text-2xl font-light text-primary text-center mb-2">
              ¿Eliminar prenda?
            </h3>
            <p className="text-primary/50 font-body text-sm text-center mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3.5 rounded-xl border border-surface text-primary font-body font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-body font-medium text-sm disabled:opacity-60"
              >
                {deletingId === confirmDelete ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
