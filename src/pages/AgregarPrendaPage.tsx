import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analizarPrenda, confirmarPrenda } from '../api/prendas'
import type { AnalisisPrenda } from '../types'
import { CATEGORIAS, CATEGORIA_LABELS } from '../types'
import PhotoSelector from '../components/PhotoSelector'

type Step = 'guia' | 'upload' | 'loading' | 'confirmacion'

export default function AgregarPrendaPage() {
  const [step, setStep] = useState<Step>('guia')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [analisis, setAnalisis] = useState<AnalisisPrenda | null>(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      <header className="sticky top-0 z-30 bg-background border-b border-surface px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary/60 hover:text-primary p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="font-display text-2xl font-light text-primary">Agregar prenda</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        {step === 'guia' && (
          <div className="flex flex-col gap-6">
            <p className="text-primary/70 font-body text-sm leading-relaxed">
              Para que la IA analice correctamente tu prenda, sigue estas recomendaciones:
            </p>

            <div className="bg-surface rounded-2xl p-5 flex flex-col gap-4">
              {[
                { num: '01', text: 'Fondo blanco o muy claro y uniforme' },
                { num: '02', text: 'Prenda completamente extendida, sin arrugas' },
                { num: '03', text: 'Luz natural, evita sombras fuertes' },
                { num: '04', text: 'Foto desde arriba, centrada en la prenda' },
                { num: '05', text: 'Una prenda a la vez' },
              ].map(({ num, text }) => (
                <div key={num} className="flex gap-4 items-start">
                  <span className="font-display text-accent text-lg leading-none mt-0.5">{num}</span>
                  <p className="text-primary/70 font-body text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

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
                  <div
                    className="w-5 h-5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: analisis.colorPrincipal }}
                  />
                  <span className="text-xs font-body text-primary/60">{analisis.colorPrincipal}</span>
                </div>
                {analisis.colorSecundario && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: analisis.colorSecundario }}
                    />
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
