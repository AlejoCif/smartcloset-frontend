import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Hook de fade-in al hacer scroll ─────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Mockup del teléfono ──────────────────────────────────────
function PhoneMockup() {
  const cards = [
    { label: 'Outfits IA', num: '02' },
    { label: 'Mis Looks', num: '03' },
    { label: '¿Lo compro?', num: '04' },
    { label: 'Inspiración', num: '05' },
  ]
  return (
    <div className="relative mx-auto select-none" style={{ width: '200px', height: '420px' }}>
      {/* Sombra del teléfono */}
      <div className="absolute inset-0 rounded-[36px] shadow-2xl" style={{ boxShadow: '0 40px 80px rgba(74,52,32,0.35)' }} />

      {/* Marco */}
      <div
        className="absolute inset-0 rounded-[36px] overflow-hidden"
        style={{ backgroundColor: '#FAF7F2', border: '7px solid #1C0F08' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 rounded-b-xl z-10" style={{ backgroundColor: '#1C0F08' }} />

        {/* Contenido de la app */}
        <div className="absolute inset-0 pt-7 px-3 pb-3 flex flex-col gap-2 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <p style={{ fontSize: '6px', color: '#9E9690', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>Hola, María</p>
              <p style={{ fontSize: '15px', color: '#4A3420', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, lineHeight: 1 }}>
                Smart<span style={{ fontStyle: 'italic' }}>Closet</span>
              </p>
            </div>
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4' }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div style={{ height: '0.5px', backgroundColor: '#D4BFA4' }} />

          {/* Card Mi Closet */}
          <div className="rounded-xl px-3 py-2.5 flex flex-col justify-between" style={{ backgroundColor: '#C4956A', height: '72px', flexShrink: 0 }}>
            <p style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', fontFamily: 'Jost' }}>01</p>
            <div>
              <p style={{ fontSize: '14px', color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, lineHeight: 1 }}>Mi Closet</p>
              <p style={{ fontSize: '7px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Jost', marginTop: '2px' }}>Tus prendas guardadas</p>
            </div>
          </div>

          {/* Grid 2×2 */}
          <div className="grid grid-cols-2 gap-1.5">
            {cards.map(c => (
              <div key={c.label} className="rounded-xl px-2.5 py-2 flex flex-col justify-between"
                style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4', height: '58px' }}>
                <p style={{ fontSize: '6px', color: '#9E9690', letterSpacing: '0.12em', fontFamily: 'Jost' }}>{c.num}</p>
                <p style={{ fontSize: '11px', color: '#4A3420', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, lineHeight: 1.1 }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones laterales */}
      <div className="absolute rounded-r-sm" style={{ right: '-9px', top: '90px', width: '5px', height: '40px', backgroundColor: '#1C0F08' }} />
      <div className="absolute rounded-l-sm" style={{ left: '-9px', top: '80px', width: '5px', height: '28px', backgroundColor: '#1C0F08' }} />
      <div className="absolute rounded-l-sm" style={{ left: '-9px', top: '116px', width: '5px', height: '28px', backgroundColor: '#1C0F08' }} />
    </div>
  )
}

// ── Sección Cómo funciona ────────────────────────────────────
const steps = [
  { emoji: '📸', title: 'Fotografía tu ropa', desc: 'Sube fotos de tus prendas y nuestra IA las clasifica automáticamente por tipo, color y temporada.' },
  { emoji: '🎨', title: 'Descubre tu paleta', desc: 'Analiza tu tono de piel y encuentra los colores que más te favorecen según tu colorimetría personal.' },
  { emoji: '✨', title: 'Outfits con IA', desc: 'Recibe combinaciones personalizadas según tu estilo y lo que ya tienes en tu closet.' },
]

// ── Features ─────────────────────────────────────────────────
const features = [
  { emoji: '🤖', title: 'IA que te conoce', desc: 'Aprende tu estilo con cada outfit que guardas o descartas.' },
  { emoji: '👗', title: 'Closet digital', desc: 'Todo tu guardarropa organizado en un solo lugar.' },
  { emoji: '🛍️', title: 'Asesora de compras', desc: 'Sabe qué te falta para completar tus looks antes de comprar.' },
  { emoji: '🎨', title: 'Colorimetría', desc: 'Tu paleta de colores personalizada según tu tono de piel.' },
  { emoji: '💡', title: 'Inspiración', desc: 'Looks de tendencia adaptados a lo que ya tienes en casa.' },
  { emoji: '📱', title: 'Siempre contigo', desc: 'Accede desde cualquier dispositivo, cuando quieras.' },
]

// ── Componente principal ─────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', fontFamily: 'Jost, sans-serif' }}>

      {/* ── 1. HERO ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.06] -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#C4956A' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.05] translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#4A3420' }} />

        <div className="relative max-w-5xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Texto */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ backgroundColor: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.25)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#C4956A' }} />
              <span className="font-body text-xs tracking-[0.15em] uppercase" style={{ color: '#C4956A' }}>Ahora disponible</span>
            </div>

            <h1 className="font-display font-light leading-none mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: '#4A3420' }}>
              Smart<span className="italic">Closet</span>
            </h1>

            <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
              <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: '#D4BFA4' }} />
              <p className="font-body text-xs tracking-[0.22em] uppercase" style={{ color: '#9E9690' }}>Tu guardarropa inteligente</p>
              <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: '#D4BFA4' }} />
            </div>

            <p className="font-body text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0" style={{ color: '#9E9690' }}>
              Organiza tu ropa, descubre outfits con IA y encuentra tu paleta de colores perfecta.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-xl font-body font-medium text-sm tracking-wide transition-all active:scale-95 hover:opacity-90"
                style={{ backgroundColor: '#C4956A', color: '#fff', boxShadow: '0 4px 20px rgba(196,149,106,0.35)' }}
              >
                Empieza gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl font-body font-medium text-sm tracking-wide transition-all active:scale-95"
                style={{ border: '1px solid #D4BFA4', color: '#4A3420', backgroundColor: 'transparent' }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div className="flex-shrink-0">
            <PhoneMockup />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4BFA4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ── 2. CÓMO FUNCIONA ───────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: '#F2EBE0' }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.28em] uppercase mb-3" style={{ color: '#C4956A' }}>El proceso</p>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#4A3420' }}>
              Cómo <span className="italic">funciona</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl" style={{ backgroundColor: '#FAF7F2' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl" style={{ backgroundColor: 'rgba(196,149,106,0.12)' }}>
                    {step.emoji}
                  </div>
                  <div className="font-body text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#C4956A' }}>
                    Paso {i + 1}
                  </div>
                  <h3 className="font-display text-xl font-light mb-3" style={{ color: '#4A3420' }}>{step.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#9E9690' }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.28em] uppercase mb-3" style={{ color: '#C4956A' }}>Funcionalidades</p>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#4A3420' }}>
              Todo lo que <span className="italic">necesitas</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="p-6 rounded-2xl transition-shadow hover:shadow-md"
                  style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4' }}
                >
                  <div className="text-2xl mb-3">{f.emoji}</div>
                  <h3 className="font-display text-lg font-light mb-1.5" style={{ color: '#4A3420' }}>{f.title}</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: '#9E9690' }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CTA FINAL ───────────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: '#4A3420' }}>
        <FadeIn className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">✨</div>
          <h2 className="font-display font-light mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FAF7F2' }}>
            ¿Lista para transformar<br />tu <span className="italic">closet</span>?
          </h2>
          <p className="font-body text-sm leading-relaxed mb-10" style={{ color: 'rgba(250,247,242,0.5)' }}>
            Únete y empieza a descubrir outfits que nunca creíste tener en tu armario.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 rounded-xl font-body font-medium text-sm tracking-wide transition-all active:scale-95 hover:opacity-90"
            style={{ backgroundColor: '#C4956A', color: '#fff', boxShadow: '0 4px 24px rgba(196,149,106,0.4)' }}
          >
            Crear cuenta gratis
          </button>
        </FadeIn>
      </section>

      {/* ── 5. FOOTER ──────────────────────────────────────── */}
      <footer className="py-10 px-6" style={{ backgroundColor: '#4A3420', borderTop: '1px solid rgba(250,247,242,0.08)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-display text-xl font-light" style={{ color: 'rgba(250,247,242,0.6)' }}>
            Smart<span className="italic">Closet</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Términos de uso', 'Política de privacidad', 'Contacto'].map(link => (
              <button key={link} className="font-body text-xs transition-colors hover:text-white" style={{ color: 'rgba(250,247,242,0.35)' }}>
                {link}
              </button>
            ))}
          </div>

          <p className="font-body text-xs" style={{ color: 'rgba(250,247,242,0.25)' }}>
            © 2026 SmartCloset
          </p>
        </div>
      </footer>

    </div>
  )
}
