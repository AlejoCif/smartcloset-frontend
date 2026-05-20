import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analizarPrenda, confirmarPrenda } from '../api/prendas'
import type { AnalisisPrenda } from '../types'
import { CATEGORIAS, CATEGORIA_LABELS } from '../types'
import PhotoSelector from '../components/PhotoSelector'
import PhotoGuide from '../components/PhotoGuide'

const GUIDE_KEY = 'photoGuideShown'

type Step = 'upload' | 'loading' | 'confirmacion'

export default function AgregarPrendaPage() {
  const [step, setStep] = useState<Step>('upload')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [analisis, setAnalisis] = useState<AnalisisPrenda | null>(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  // Muestra la guía automáticamente la primera vez
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem(GUIDE_KEY))
  const navigate = useNavigate()
  const handleGuideConfirm = () => {
    localStorage.setItem(GUIDE_KEY, '1')
    setShowGuide(false)
  }

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStep('upload')
  }

  const handleAnalizar = async () => {
    if (!file) return
    setStep('loading')
    setError('')
    try {
      const res = await analizarPrenda(file)
      setAnalisis(res.data)
      setCategoriaSeleccionada(res.data.categoria)
      setStep('confirmacion')
    } catch {
      setError('No pudimos analizar la prenda. Intenta con otra foto.')
      setStep('upload')
    }
  }

  const handleGuardar = async () => {
    if (!analisis) return
    setSaving(true)
    setError('')
    try {
      await confirmarPrenda(analisis.fotoUrl, {
        categoria: categoriaSeleccionada || analisis.categoria,
        colorPrincipal: analisis.colorPrincipal,
        colorSecundario: analisis.colorSecundario,
        descripcionIa: analisis.descripcionIa,
        temporada: analisis.temporada,
        ocasion: analisis.ocasion,
      })
      navigate('/closet', { replace: true })
    } catch {
      setError('Error al guardar la prenda.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">

      {/* Modal guía */}
      {showGuide && (
        <PhotoGuide
          onConfirm={handleGuideConfirm}
          onClose={handleGuideConfirm}
        />
      )}

      <header className="sticky top-0 z-30 bg-background border-b border-surface px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-primary/60 hover:text-primary p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-display text-2xl font-light text-primary">Agregar prenda</h1>
        </div>

        {/* Botón "Ver guía" — solo cuando el modal ya fue cerrado */}
        {!showGuide && (
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{ color: '#C4956A', backgroundColor: 'rgba(196,149,106,0.1)' }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            Ver guía
          </button>
        )}
      </header>

      <div className="flex-1 px-5 py-6">

        {step === 'upload' && !preview && (
          <div className="flex flex-col gap-5">
            <p className="text-primary/60 font-body text-sm leading-relaxed">
              Sube la foto de tu prenda para que la IA la analice y clasifique automáticamente.
            </p>
            <PhotoSelector onFile={handleFile} captureMode="environment" />
          </div>
        )}

        {step === 'upload' && preview && (
          <div className="flex flex-col gap-5">
            <div className="relative">
              <img src={preview} alt="Prenda" className="w-full aspect-square object-cover rounded-2xl" />
              <div className="absolute top-3 right-3">
                <PhotoSelector onFile={handleFile} captureMode="environment" compact />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
            )}
            <button onClick={handleAnalizar} className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl">
              Analizar prenda
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-16 h-16 border-4 border-surface border-t-accent rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-display text-2xl text-primary">Analizando...</p>
              <p className="text-primary/50 text-sm font-body mt-2">La IA está identificando tu prenda</p>
            </div>
          </div>
        )}

        {step === 'confirmacion' && analisis && (
          <div className="flex flex-col gap-6">
            {preview && (
              <img src={preview} alt="Prenda" className="w-full aspect-square object-cover rounded-2xl" />
            )}

            <div className="bg-surface rounded-2xl p-5">
              <p className="text-primary/50 text-xs font-body tracking-widest uppercase mb-1">Detectado</p>
              <p className="font-display text-2xl text-primary mb-3">
                {CATEGORIA_LABELS[analisis.categoria] ?? analisis.categoria}
              </p>
              {analisis.descripcionIa && (
                <p className="text-primary/60 font-body text-sm leading-relaxed">{analisis.descripcionIa}</p>
              )}
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: analisis.colorPrincipal }} />
                  <span className="text-xs font-body text-primary/60">{analisis.colorPrincipal}</span>
                </div>
                {analisis.colorSecundario && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: analisis.colorSecundario }} />
                    <span className="text-xs font-body text-primary/60">{analisis.colorSecundario}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
            )}

            <button
              onClick={handleGuardar}
              disabled={saving}
              className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar en mi closet'}
            </button>

            <div>
              <p className="text-primary/50 text-xs font-body tracking-widest uppercase mb-3">
                ¿No es correcto? Cambia la categoría
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIAS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-body font-medium transition-all ${
                      categoriaSeleccionada === cat
                        ? 'bg-accent text-white'
                        : 'bg-surface text-primary/70 hover:bg-accent/10'
                    }`}
                  >
                    {CATEGORIA_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
