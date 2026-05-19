import { useState, useEffect } from 'react'
import { subirMiOutfit, getMisOutfits, eliminarMiOutfit, chatMiOutfit } from '../api/misOutfits'
import Layout from '../components/Layout'
import PhotoSelector from '../components/PhotoSelector'
import ImageModal from '../components/ImageModal'
import type { MiOutfitItem } from '../types'

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200'
  return (
    <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {score}/100
    </span>
  )
}

function MiOutfitCard({ item, onEliminar }: { item: MiOutfitItem; onEliminar: () => void }) {
  const [expandido, setExpandido] = useState(false)
  const [modalImg, setModalImg] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatRes, setChatRes] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleChat = async () => {
    if (!chatMsg.trim()) return
    setChatLoading(true)
    try {
      const res = await chatMiOutfit(item.id, chatMsg.trim())
      setChatRes(res.data.respuesta)
    } finally { setChatLoading(false) }
  }

  const handleEliminar = async () => {
    setDeleting(true)
    try { await eliminarMiOutfit(item.id); onEliminar() }
    finally { setDeleting(false) }
  }

  return (
    <div className="bg-surface rounded-2xl overflow-hidden">
      {modalImg && <ImageModal src={item.fotoUrl} onClose={() => setModalImg(false)} />}

      {/* Foto */}
      <div className="relative cursor-zoom-in" onClick={() => setModalImg(true)}>
        <img src={item.fotoUrl} alt="Mi outfit" className="w-full h-56 object-cover" />
        <div className="absolute top-3 right-3">
          <ScoreBadge score={item.calificacion} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
          <p className="text-white font-body text-sm leading-snug">{item.resumen}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Puntos positivos y sugerencias */}
        <button onClick={() => setExpandido(!expandido)}
          className="text-xs font-body text-primary/40 hover:text-primary text-left transition-colors">
          {expandido ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}
        </button>

        {expandido && (
          <div className="flex flex-col gap-3 border-t border-primary/10 pt-3">
            {item.puntosPositivos.length > 0 && (
              <div>
                <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase mb-1.5">Lo que funciona</p>
                {item.puntosPositivos.map((p, i) => (
                  <p key={i} className="text-green-700 font-body text-sm">✓ {p}</p>
                ))}
              </div>
            )}
            {item.sugerencias.length > 0 && (
              <div>
                <p className="text-[10px] font-body text-primary/40 tracking-widest uppercase mb-1.5">Sugerencias</p>
                {item.sugerencias.map((s, i) => (
                  <p key={i} className="text-amber-700 font-body text-sm">→ {s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat */}
        <div className="border-t border-primary/10 pt-3">
          <p className="text-xs font-body text-primary/40 uppercase tracking-widest mb-2">💬 Consulta sobre este outfit</p>
          <div className="flex gap-2">
            <input type="text" value={chatMsg}
              onChange={e => { setChatMsg(e.target.value); setChatRes('') }}
              onKeyDown={e => e.key === 'Enter' && handleChat()}
              placeholder="¿Qué me falta para completarlo?"
              className="flex-1 bg-white border border-surface rounded-xl px-3 py-2 font-body text-sm text-primary placeholder:text-primary/30 outline-none focus:border-accent/40"
            />
            <button onClick={handleChat} disabled={chatLoading || !chatMsg.trim()}
              className="bg-accent text-white font-body text-xs px-3 py-2 rounded-xl disabled:opacity-40">
              {chatLoading ? '...' : 'Preguntar'}
            </button>
          </div>
          {chatRes && (
            <p className="text-primary/70 font-body text-sm mt-2 bg-white rounded-xl px-3 py-2.5 leading-relaxed">{chatRes}</p>
          )}
        </div>

        {/* Eliminar */}
        <div className="border-t border-primary/10 pt-2">
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="text-xs font-body text-primary/30 hover:text-red-400 transition-colors">
              Eliminar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border border-surface text-primary/60 font-body text-xs">Cancelar</button>
              <button onClick={handleEliminar} disabled={deleting}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-body text-xs font-medium disabled:opacity-60">
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MisOutfitsPage() {
  const [outfits, setOutfits] = useState<MiOutfitItem[]>([])
  const [loading, setLoading] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMisOutfits().then(r => setOutfits(r.data)).finally(() => setLoading(false))
  }, [])

  const handleFile = async (file: File) => {
    setSubiendo(true)
    setError('')
    try {
      const res = await subirMiOutfit(file)
      setOutfits(prev => [res.data, ...prev])
    } catch {
      setError('No pudimos analizar el outfit. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <Layout title="Mis Outfits">
      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Subir nuevo */}
        <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <p className="font-body text-sm font-medium text-primary">Sube un outfit que te pusiste</p>
            <p className="font-body text-xs text-primary/40 mt-0.5">La IA lo califica y te da sugerencias reales</p>
          </div>
          {subiendo ? (
            <div className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="text-primary/50 font-body text-sm">Analizando tu outfit...</p>
            </div>
          ) : (
            <PhotoSelector onFile={handleFile} captureMode="user" compact />
          )}
          {error && <p className="text-red-500 text-xs font-body">{error}</p>}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-surface border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {!loading && outfits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="text-5xl">👗</div>
            <p className="font-display text-2xl font-light text-primary">Sin outfits aún</p>
            <p className="text-primary/50 font-body text-sm">Sube una foto de lo que llevas puesto y la IA te dice cómo quedó</p>
          </div>
        )}

        {outfits.map(o => (
          <MiOutfitCard
            key={o.id}
            item={o}
            onEliminar={() => setOutfits(prev => prev.filter(x => x.id !== o.id))}
          />
        ))}
      </div>
    </Layout>
  )
}
