import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analizarColorimetria } from '../api/user'
import { useAuth } from '../context/AuthContext'
import PhotoSelector from '../components/PhotoSelector'
import type { User } from '../types'

type Step = 'instrucciones' | 'upload' | 'loading' | 'resultado'

export default function ColorimetriaPage() {
  const [step, setStep] = useState<Step>('instrucciones')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [resultado, setResultado] = useState<User | null>(null)
  const [error, setError] = useState('')
  const { refreshUser } = useAuth()
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
      const res = await analizarColorimetria(file)
      setResultado(res.data)
      await refreshUser()
      setStep('resultado')
    } catch {
      setError('No pudimos analizar tu foto. Intenta con otra imagen.')
      setStep('upload')
    }
  }

  const temporadaEmoji: Record<string, string> = {
    PRIMAVERA: '🌸', VERANO: '☀️', OTOÑO: '🍂', INVIERNO: '❄️',
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <header className="px-6 pt-14 pb-6">
        <p className="text-accent text-xs font-body tracking-widest uppercase mb-2">Bienvenida</p>
        <h1 className="font-display text-4xl font-light text-primary leading-tight">
          Tu análisis de<br /><em>colorimetría</em>
        </h1>
      </header>

      <div className="flex-1 px-6 pb-10">
        {step === 'instrucciones' && (
          <div className="flex flex-col gap-6">
            <p className="text-primary/70 font-body text-sm leading-relaxed">
              Vamos a analizar tu colorimetría personal para recomendarte los colores que mejor te favorecen.
            </p>

            <div className="bg-surface rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="font-display text-xl text-primary">Para la foto perfecta:</h2>
              {[
                { num: '01', text: 'Rostro sin maquillaje o con maquillaje muy ligero' },
                { num: '02', text: 'Luz natural directa, evita flashes o luz artificial' },
                { num: '03', text: 'Fondo neutro (blanco o gris claro)' },
                { num: '04', text: 'Ropa en colores neutros que no distorsione tu tono' },
                { num: '05', text: 'Foto centrada en tu rostro y cuello' },
              ].map(({ num, text }) => (
                <div key={num} className="flex gap-4 items-start">
                  <span className="font-display text-accent text-lg leading-none mt-0.5">{num}</span>
                  <p className="text-primary/70 font-body text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <PhotoSelector onFile={handleFile} captureMode="user" />
          </div>
        )}

        {step === 'upload' && preview && (
          <div className="flex flex-col gap-5">
            <div className="relative">
              <img
                src={preview}
                alt="Tu foto"
                className="w-full aspect-square object-cover rounded-2xl"
              />
              <div className="absolute top-3 right-3">
                <PhotoSelector onFile={handleFile} captureMode="user" compact />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-body bg-red-50 rounded-xl px-4 py-3 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleAnalizar}
              className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl text-sm"
            >
              Analizar con IA
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-16 h-16 border-4 border-surface border-t-accent rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-display text-2xl text-primary">Analizando...</p>
              <p className="text-primary/50 text-sm font-body mt-2">
                La IA está evaluando tu colorimetría
              </p>
            </div>
          </div>
        )}

        {step === 'resultado' && resultado && (
          <div className="flex flex-col gap-6">
            <div className="bg-surface rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">
                {temporadaEmoji[resultado.temporadaColor ?? ''] ?? '✨'}
              </p>
              <p className="text-accent text-xs font-body tracking-widest uppercase mb-1">Tu temporada</p>
              <h2 className="font-display text-3xl font-light text-primary capitalize">
                {resultado.temporadaColor?.toLowerCase() ?? '—'}
              </h2>
            </div>

            {resultado.paletaColores && resultado.paletaColores.length > 0 && (
              <div>
                <h3 className="font-body text-xs text-primary/50 tracking-widest uppercase mb-3">
                  Colores que te favorecen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resultado.paletaColores.map((color) => (
                    <span
                      key={color}
                      className="bg-surface border border-accent/20 text-primary font-body text-sm px-3 py-1.5 rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resultado.coloresEvitar && resultado.coloresEvitar.length > 0 && (
              <div>
                <h3 className="font-body text-xs text-primary/50 tracking-widest uppercase mb-3">
                  Colores a evitar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resultado.coloresEvitar.map((color) => (
                    <span
                      key={color}
                      className="bg-red-50 border border-red-100 text-red-600 font-body text-sm px-3 py-1.5 rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/closet', { replace: true })}
              className="w-full bg-accent text-white font-body font-medium py-4 rounded-xl mt-2"
            >
              Ir a mi closet →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
