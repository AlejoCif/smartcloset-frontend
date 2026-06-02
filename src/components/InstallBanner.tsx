import { useState, useEffect } from 'react'
import { useProfileTheme, getThemeColors } from '../hooks/useProfileTheme'

const DISMISS_KEY = 'install_banner_dismissed'
const DISMISS_DAYS = 7

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const ts = parseInt(raw, 10)
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000
}

function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// ── Modal de instrucciones iOS ────────────────────────────────
function IOSModal({ onClose, colors }: { onClose: () => void; colors: ReturnType<typeof getThemeColors> }) {
  const steps = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      ),
      text: 'Toca el botón Compartir en Safari',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
      text: 'Busca "Añadir a pantalla de inicio"',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
      text: 'Toca "Añadir" — ¡listo!',
    },
  ]

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: '430px', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '0 0 env(safe-area-inset-bottom, 24px)', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
          <div style={{ width: '36px', height: '4px', backgroundColor: '#E0D5C8', borderRadius: '2px' }} />
        </div>

        {/* Ícono + título */}
        <div style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(196,149,106,0.3)' }}>
            <img src="/icon-192.png" alt="SmartCloset" style={{ width: '100%', height: '100%' }} />
          </div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0, textAlign: 'center' }}>
            Instala SmartCloset
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
            Sigue estos pasos en Safari para agregar la app a tu pantalla de inicio
          </p>
        </div>

        {/* Pasos */}
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${colors.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700, color: colors.accent, minWidth: '18px' }}>{i + 1}.</span>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#1A1A1A', margin: 0, lineHeight: 1.4 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 24px 0' }}>
          <button
            onClick={onClose}
            style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: colors.primary, color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

// ── InstallBanner ─────────────────────────────────────────────
export default function InstallBanner() {
  const themeMode = useProfileTheme()
  const colors = getThemeColors(themeMode)

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  useEffect(() => {
    if (isInstalled() || isDismissed()) return

    if (isIOS && isSafari) {
      setVisible(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') dismiss()
    setInstallPrompt(null)
  }

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {showIOSModal && (
        <IOSModal colors={colors} onClose={() => setShowIOSModal(false)} />
      )}

      <div style={{
        margin: '0 16px 16px',
        backgroundColor: colors.surface,
        border: `1px solid ${colors.accent}40`,
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {/* Ícono app */}
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(196,149,106,0.25)' }}>
          <img src="/icon-192.png" alt="SmartCloset" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: colors.primary, margin: 0, lineHeight: 1.2 }}>
            📲 Instala SmartCloset
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: '2px 0 0', lineHeight: 1.3 }}>
            Accede más rápido desde tu pantalla de inicio
          </p>
        </div>

        {/* Botón instalar */}
        <button
          onClick={handleInstall}
          style={{
            flexShrink: 0,
            padding: '7px 14px',
            borderRadius: '20px',
            backgroundColor: colors.accent,
            color: '#fff',
            fontFamily: 'Jost, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Instalar
        </button>

        {/* Cerrar */}
        <button
          onClick={dismiss}
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#C0B8B0', lineHeight: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </>
  )
}
