import { useRef, useState, type ChangeEvent } from 'react'
import CameraCapture from './CameraCapture'

interface PhotoSelectorProps {
  onFile: (file: File) => void
  /** 'user' para selfies (colorimetría), 'environment' para objetos (prendas) */
  captureMode?: 'user' | 'environment'
  /** true = botones pequeños inline para reemplazar foto ya tomada */
  compact?: boolean
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default function PhotoSelector({
  onFile,
  captureMode = 'user',
  compact = false,
}: PhotoSelectorProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = '' // reset so the same file can be re-selected
  }

  const handleTakePhoto = () => {
    if (isMobile) {
      cameraInputRef.current?.click()
    } else {
      setShowCamera(true)
    }
  }

  const handleGallery = () => {
    galleryInputRef.current?.click()
  }

  return (
    <>
      {/* Hidden inputs */}
      {/* Mobile: capture triggers the native camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture={captureMode}
        className="hidden"
        onChange={handleInputChange}
      />
      {/* Gallery: no capture attribute — opens file picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {compact ? (
        /* Small inline row — used in the "change photo" overlay */
        <div className="flex gap-2">
          <button
            onClick={handleTakePhoto}
            className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-body text-primary shadow-sm"
          >
            <CameraIcon size={14} />
            Cámara
          </button>
          <button
            onClick={handleGallery}
            className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-body text-primary shadow-sm"
          >
            <GalleryIcon size={14} />
            Galería
          </button>
        </div>
      ) : (
        /* Full-size primary buttons */
        <div className="flex flex-col gap-3">
          <button
            onClick={handleTakePhoto}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white font-body font-medium py-4 rounded-xl text-sm tracking-wide"
          >
            <CameraIcon size={18} />
            Tomar foto
          </button>
          <button
            onClick={handleGallery}
            className="w-full flex items-center justify-center gap-2 border border-accent text-accent font-body font-medium py-4 rounded-xl text-sm tracking-wide hover:bg-accent/5 transition-colors"
          >
            <GalleryIcon size={18} />
            Subir desde galería
          </button>
        </div>
      )}

      {/* Desktop camera modal */}
      {showCamera && (
        <CameraCapture
          facingMode={captureMode}
          onCapture={(file) => {
            setShowCamera(false)
            onFile(file)
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  )
}

function CameraIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function GalleryIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
