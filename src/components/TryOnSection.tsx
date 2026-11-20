import { useState, useRef } from 'react'
import { tryOn, fileToBase64 } from '../api/tryon'
import { useProfileTheme, getThemeColors } from '../hooks/useProfileTheme'

interface Props {
  garmentImageUrl: string
  garmentDescription?: string
}

export default function TryOnSection({ garmentImageUrl, garmentDescription = '' }: Props) {
  const themeMode = useProfileTheme()
  const colors    = getThemeColors(themeMode)

  const [expanded,    setExpanded]    = useState(false)
  const [personFile,  setPersonFile]  = useState<File | null>(null)
  const [personPreview, setPersonPreview] = useState<string | null>(null)
  const [result,      setResult]      = useState<string | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePersonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPersonFile(file)
    setPersonPreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  const handleGenerate = async () => {
    if (!personFile) return
    setLoading(true)
    setError('')
    try {
      const base64 = await fileToBase64(personFile)
      const res    = await tryOn(base64, garmentImageUrl, garmentDescription)
      setResult(res.data.resultImageUrl)
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || ''
      setError(msg ? `Error: ${msg}` : 'No se pudo generar el try-on. Intenta con otra foto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${colors.accent}30`, marginTop: '8px' }}>

      {/* Header toggle */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: `${colors.accent}10`, border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>👗</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 600, color: colors.primary, margin: 0 }}>
              Próbatela virtualmente
            </p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: colors.primary + '80', margin: 0 }}>
              Sube tu foto y mira cómo te queda
            </p>
          </div>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent}
          strokeWidth="2" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '16px', backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Foto de la prenda (referencia) */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 80px' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: colors.primary + '60', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Prenda
              </p>
              <img
                src={garmentImageUrl}
                alt="Prenda"
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${colors.accent}20` }}
              />
            </div>

            {/* Flecha */}
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Foto de la persona */}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: colors.primary + '60', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Tu foto
              </p>
              {personPreview ? (
                <div style={{ position: 'relative', width: '80px' }}>
                  <img
                    src={personPreview}
                    alt="Tu foto"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${colors.accent}20` }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: colors.primary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: '80px', height: '80px', borderRadius: '10px',
                    border: `1.5px dashed ${colors.accent}60`,
                    backgroundColor: `${colors.accent}08`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '4px', cursor: 'pointer',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', color: colors.accent }}>Subir foto</span>
                </button>
              )}
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePersonFile} />

          {/* Tip de foto */}
          {!personPreview && (
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: colors.primary + '50', textAlign: 'center', margin: 0 }}>
              💡 Mejor resultado con foto de cuerpo completo, fondo claro y buena iluminación
            </p>
          )}

          {/* Error */}
          {error && (
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '10px', padding: '10px 12px', margin: 0 }}>
              {error}
            </p>
          )}

          {/* Resultado */}
          {result && (
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: colors.primary + '60', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Resultado
              </p>
              <img
                src={result}
                alt="Try-on resultado"
                style={{ width: '100%', borderRadius: '14px', border: `1px solid ${colors.accent}20` }}
              />
              <a
                href={result}
                download="tryon.jpg"
                style={{ display: 'block', marginTop: '10px', textAlign: 'center', fontFamily: 'Jost, sans-serif', fontSize: '12px', color: colors.accent, textDecoration: 'underline' }}
              >
                Descargar imagen
              </a>
            </div>
          )}

          {/* Botón generar */}
          {personPreview && !result && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                backgroundColor: loading ? `${colors.accent}60` : colors.accent,
                color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Generando (20–40 seg)...
                </>
              ) : (
                '✨ Generar prueba virtual'
              )}
            </button>
          )}

          {result && (
            <button
              onClick={() => { setResult(null); setPersonPreview(null); setPersonFile(null) }}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: `1px solid ${colors.accent}40`, backgroundColor: 'transparent',
                color: colors.accent, fontFamily: 'Jost, sans-serif', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Intentar con otra foto
            </button>
          )}

        </div>
      )}
    </div>
  )
}
