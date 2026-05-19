import { useState, useEffect } from 'react'

type Platform = 'android' | 'ios' | null

// Detecta si ya está instalada como PWA
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

const detectPlatform = (): Platform => {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/ipad|iphone|ipod/i.test(ua)) return 'ios'
  return null
}

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // No mostrar si ya está instalada o si el user la cerró antes
    if (isStandalone()) return
    if (sessionStorage.getItem('install-dismissed')) return

    const p = detectPlatform()
    if (!p) return
    setPlatform(p)

    if (p === 'android') {
      const handler = (e: Event) => {
        e.preventDefault()
        setInstallEvent(e as BeforeInstallPromptEvent)
        setVisible(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }

    if (p === 'ios') {
      // Mostrar instrucciones en iOS después de 2 segundos
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const handleInstall = async () => {
    if (!installEvent) return
    installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === 'accepted') setVisible(false)
    setInstallEvent(null)
  }

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('install-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-primary rounded-2xl p-4 shadow-xl flex gap-3 items-start max-w-sm mx-auto">
        {/* Ícono */}
        <div className="flex-shrink-0 w-11 h-11 bg-accent/20 rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
            <path d="M50,33 L50,20 A10,10 0 0,1 60,10" stroke="#C4956A" strokeWidth="6" strokeLinecap="round"/>
            <path d="M50,33 L14,73" stroke="#C4956A" strokeWidth="6" strokeLinecap="round"/>
            <path d="M50,33 L86,73" stroke="#C4956A" strokeWidth="6" strokeLinecap="round"/>
            <path d="M14,73 L14,82 L86,82 L86,73" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-white text-sm leading-snug">
            Instala SmartCloset en tu teléfono
          </p>

          {platform === 'android' && (
            <>
              <p className="font-body text-white/50 text-xs mt-0.5 mb-3">
                Accede rápido desde tu pantalla de inicio
              </p>
              <button
                onClick={handleInstall}
                className="bg-accent text-white font-body font-medium text-xs px-4 py-2 rounded-lg"
              >
                Instalar app
              </button>
            </>
          )}

          {platform === 'ios' && (
            <p className="font-body text-white/60 text-xs mt-1 leading-relaxed">
              Toca{' '}
              <span className="inline-flex items-center bg-white/10 px-1.5 py-0.5 rounded text-white text-xs mx-0.5">
                ⬆ Compartir
              </span>
              {' '}y luego{' '}
              <span className="text-white font-medium">"Añadir a pantalla de inicio"</span>
            </p>
          )}
        </div>

        {/* Cerrar */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-white/40 hover:text-white/70 transition-colors mt-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// Tipo que falta en TypeScript estándar
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
