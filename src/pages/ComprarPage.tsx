import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analizarCompra, chatCompra } from '../api/compras'
import { confirmarPrenda } from '../api/prendas'
import PhotoSelector from '../components/PhotoSelector'
import type { AnalizarCompraResponse } from '../types'

const VEREDICTO_CONFIG = {
  NECESARIO:      { color: 'bg-green-50 border-green-200',  texto: 'text-green-800', badge: 'bg-green-100 text-green-700', emoji: '✅' },
  UTIL:           { color: 'bg-blue-50 border-blue-200',    texto: 'text-blue-800',  badge: 'bg-blue-100 text-blue-700',   emoji: '👍' },
  INNECESARIO:    { color: 'bg-amber-50 border-amber-200',  texto: 'text-amber-800', badge: 'bg-amber-100 text-amber-700', emoji: '🤔' },
  NO_RECOMENDADO: { color: 'bg-red-50 border-red-200',      texto: 'text-red-800',   badge: 'bg-red-100 text-red-700',    emoji: '❌' },
}

export default function ComprarPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<AnalizarCompraResponse | null>(null)
  const [error, setError] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [chatRes, setChatRes] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const navigate = useNavigate()

  const handleFile = async (f: File) => {
    setPreview(URL.createObjectURL(f))
    setResultado(null)
    setError('')
    setChatRes('')
    setLoading(true)
    try {
      const res = await analizarCompra(f)
      setResultado(res.data)
    } catch {
      setError('No pudimos analizar la prenda. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    if (!chatMsg.trim() || !resultado) return
    setChatLoading(true)
    try {
      const res = await chatCompra(resultado.fotoUrl, chatMsg.trim())
      setChatRes(res.data.respuesta)
    } finally {
      setChatLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!resultado) return
    setGuardando(true)
    try {
      await confirmarPrenda(resultado.fotoUrl, {
        categoria: 'OTRO',
        colorPrincipal: '',
        descripcionIa: `Compra analizada: ${resultado.titulo}`,
      })
      setGuardado(true)
    } catch {
      setError('No se pudo guardar en el closet.')
    } finally {
      setGuardando(false)
    }
  }

  const handleNueva = () => {
    setPreview(null)
    setResultado(null)
    setError('')
    setChatRes('')
    setChatMsg('')
    setGuardado(false)
  }

  const cfg = resultado ? VEREDICTO_CONFIG[resultado.veredicto] : null

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-30 bg-background border-b border-surface px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary/60 hover:text-primary p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <h1 className="font-display text-2xl font-light text-primary">¿Lo compro?</h1>
          <p className="text-primary/40 font-body text-xs">Sube una foto y la IA te da su opinión honesta</p>
        </div>
      </header>

      <div className="flex-1 px-5 py-6 flex flex-col gap-5">

        {/* Upload inicial */}
        {!preview && !loading && (
          <div className="flex flex-col gap-5">
            <div className="bg-surface rounded-2xl p-5 flex flex-col gap-3">
              <p className="font-body text-sm text-primary/70 leading-relaxed">
                Toma una foto de la prenda que estás considerando comprar. La IA analizará si la necesitas basándose en tu closet y colorimetría personal.
              </p>
              <p className="font-body text-xs text-primary/40">
                💡 Funciona mejor con fotos claras de la prenda completa.
              </p>
            </div>
            <PhotoSelector onFile={handleFile} captureMode="environment" />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 border-4 border-surface border-t-accent rounded-full animate-spin" />
            <p className="font-display text-xl text-primary">Analizando...</p>
            <p className="text-primary/50 font-body text-sm text-center">
              La IA está revisando tu closet y colorimetría
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
        )}

        {/* Resultado */}
        {resultado && cfg && !guardado && (
          <>
            {/* Foto + veredicto */}
            <div className="relative">
              <img src={preview!} alt="Prenda considerada" className="w-full aspect-square object-cover rounded-2xl" />
              <div className={`absolute top-3 left-3 flex items-center gap-1.5 ${cfg.badge} px-3 py-1.5 rounded-full font-body font-medium text-xs`}>
                <span>{cfg.emoji}</span>
                <span>{resultado.titulo}</span>
              </div>
            </div>

            {/* Análisis */}
            <div className={`rounded-2xl p-5 border ${cfg.color} flex flex-col gap-3`}>
              <p className={`font-body text-sm leading-relaxed ${cfg.texto}`}>
                {resultado.explicacion}
              </p>
              {resultado.consejo && (
                <p className={`font-body text-xs ${cfg.texto} opacity-80 border-t border-current/20 pt-3`}>
                  💡 {resultado.consejo}
                </p>
              )}
            </div>

            {/* Prenda similar del closet */}
            {resultado.prendaSimilarUrl && (
              <div className="bg-surface rounded-2xl p-4 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={resultado.prendaSimilarUrl} alt="Similar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-body text-xs text-primary/50 uppercase tracking-widest mb-1">Ya tienes algo similar</p>
                  <p className="font-body text-sm text-primary/70">Revisa tu closet antes de comprar</p>
                </div>
              </div>
            )}

            {/* Chat */}
            <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
              <p className="font-body text-xs text-primary/50 uppercase tracking-widest">Pregúntale a la IA</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMsg}
                  onChange={e => { setChatMsg(e.target.value); setChatRes('') }}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="¿Combina con mi closet? ¿Es versátil?..."
                  className="flex-1 bg-white border border-surface rounded-xl px-3 py-2.5 font-body text-sm text-primary placeholder:text-primary/30 outline-none focus:border-accent/50"
                />
                <button
                  onClick={handleChat}
                  disabled={chatLoading || !chatMsg.trim()}
                  className="bg-accent text-white font-body font-medium px-4 py-2.5 rounded-xl text-sm disabled:opacity-40"
                >
                  {chatLoading ? '...' : 'Preguntar'}
                </button>
              </div>
              {chatRes && (
                <p className="text-primary/70 font-body text-sm leading-relaxed bg-white rounded-xl px-3 py-2.5">{chatRes}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : '✅ Lo compré — guardar en mi closet'}
              </button>
              <button
                onClick={handleNueva}
                className="w-full border border-primary/20 text-primary/60 font-body font-medium py-3.5 rounded-xl text-sm"
              >
                ❌ No lo compré — descartar
              </button>
            </div>
          </>
        )}

        {/* Confirmación guardado */}
        {guardado && (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="text-5xl">🎉</div>
            <h2 className="font-display text-2xl font-light text-primary">¡Guardado en tu closet!</h2>
            <p className="text-primary/50 font-body text-sm">
              Ve a tu closet para editar la categoría y detalles de la prenda.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => navigate('/closet/agregar')} className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl">
                Completar detalles de la prenda
              </button>
              <button onClick={handleNueva} className="w-full border border-primary/20 text-primary/60 font-body text-sm py-3.5 rounded-xl">
                Analizar otra compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
