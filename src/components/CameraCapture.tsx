import { useState, useRef, useEffect, useCallback } from 'react'

interface CameraCaptureProps {
  facingMode: 'user' | 'environment'
  onCapture: (file: File) => void
  onClose: () => void
}

export default function CameraCapture({ facingMode, onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [currentFacing, setCurrentFacing] = useState<'user' | 'environment'>(facingMode)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [captured, setCaptured] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const startCamera = useCallback(async (facing: 'user' | 'environment') => {
    stopStream()
    setLoading(true)
    setError('')
    setCaptured(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Tu navegador no soporta acceso a la cámara. Usa Chrome, Firefox o Safari actualizado.')
      setLoading(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      setHasMultipleCameras(devices.filter((d) => d.kind === 'videoinput').length > 1)
    } catch (err) {
      const name = (err as Error).name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError(
          'Acceso a la cámara denegado. Haz clic en el ícono de cámara en la barra de direcciones y permite el acceso.'
        )
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('No se encontró ninguna cámara en este dispositivo.')
      } else {
        setError('No se pudo iniciar la cámara. Verifica que no esté en uso por otra aplicación.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    startCamera(currentFacing)
    return () => stopStream()
  }, [currentFacing, startCamera])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw video frame without mirroring — AI needs the real orientation
    ctx.drawImage(video, 0, 0)
    setCaptured(canvas.toDataURL('image/jpeg', 0.92))
  }

  const handleRepeat = () => {
    setCaptured(null)
    // Resume live preview
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }

  const handleConfirm = () => {
    const canvas = canvasRef.current
    if (!canvas || !captured) return
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const file = new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' })
        stopStream()
        onCapture(file)
      },
      'image/jpeg',
      0.92
    )
  }

  const handleClose = () => {
    stopStream()
    onClose()
  }

  const switchCamera = () => {
    setCurrentFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 safe-top">
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {hasMultipleCameras && !captured && !loading && !error && (
          <button
            onClick={switchCamera}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            aria-label="Cambiar cámara"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </button>
        )}
      </div>

      {/* Viewport */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm font-body">Iniciando cámara...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">📷</div>
            <p className="text-white font-body text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => startCamera(currentFacing)}
              className="mt-2 px-6 py-3 rounded-xl bg-accent text-white font-body text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Live preview */}
        {!error && (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              loading || captured ? 'opacity-0' : 'opacity-100'
            } ${currentFacing === 'user' ? '-scale-x-100' : ''}`}
          />
        )}

        {/* Captured photo preview */}
        {captured && (
          <img
            src={captured}
            alt="Foto tomada"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Viewfinder guide (only on live preview) */}
        {!loading && !error && !captured && (
          <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none" />
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="px-6 pb-10 pt-6 flex items-center justify-center gap-8">
        {!captured && !error && !loading && (
          <>
            {/* Spacer for symmetry */}
            <div className="w-12" />

            {/* Shutter button */}
            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              aria-label="Tomar foto"
            >
              <div className="w-16 h-16 rounded-full border-4 border-black/10" />
            </button>

            <div className="w-12" />
          </>
        )}

        {captured && (
          <>
            <button
              onClick={handleRepeat}
              className="flex-1 py-4 rounded-xl border border-white/30 text-white font-body font-medium text-sm"
            >
              Repetir
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl bg-accent text-white font-body font-medium text-sm"
            >
              Usar foto
            </button>
          </>
        )}
      </div>
    </div>
  )
}
