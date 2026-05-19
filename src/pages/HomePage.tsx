import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const gridSections = [
  {
    to: '/outfits',
    number: '02',
    label: 'Outfits IA',
    desc: 'Combinaciones con IA',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    to: '/mis-outfits',
    number: '03',
    label: 'Mis Looks',
    desc: 'Califica tus outfits',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    to: '/comprar',
    number: '04',
    label: '¿Lo compro?',
    desc: 'Asesora de compras',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    to: '/inspiracion',
    number: '05',
    label: 'Inspiración',
    desc: 'Busca looks con IA',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.nombre?.split(' ')[0] ?? 'Bienvenida'

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto" style={{ backgroundColor: '#FAF7F2' }}>

      {/* Header */}
      <header className="px-6 pt-14 pb-8">
        {/* Fila superior: saludo + ícono perfil */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: '#9E9690' }}>
            Hola, {name}
          </p>
          <button
            onClick={() => navigate('/perfil')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95"
            style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4', color: '#C4956A' }}
            aria-label="Perfil"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" {...iconStroke}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        {/* Logo con separadores */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: '#D4BFA4' }} />
          <h1 className="font-display text-[2.2rem] font-light leading-none whitespace-nowrap" style={{ color: '#4A3420' }}>
            Smart<span className="italic">Closet</span>
          </h1>
          <div className="h-px flex-1" style={{ backgroundColor: '#D4BFA4' }} />
        </div>

        <p className="font-body text-[11px] tracking-[0.18em] text-center mt-3" style={{ color: '#9E9690' }}>
          Tu guardarropa inteligente
        </p>
      </header>

      {/* Grid de secciones */}
      <div className="px-6 pb-12 flex flex-col gap-3">

        {/* Mi Closet — card hero cobre */}
        <button
          onClick={() => navigate('/closet')}
          className="w-full rounded-2xl text-left flex flex-col justify-between active:scale-[0.98] transition-transform duration-150"
          style={{
            backgroundColor: '#C4956A',
            boxShadow: '0 4px 20px rgba(196,149,106,0.35)',
            height: '140px',
          }}
        >
          <div className="flex items-start justify-between px-5 pt-5">
            <span className="font-body text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
              01
            </span>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>
              <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
              </svg>
            </span>
          </div>
          <div className="px-5 pb-5">
            <p className="font-display text-[1.7rem] font-light leading-tight" style={{ color: '#fff' }}>
              Mi Closet
            </p>
            <p className="font-body text-[11px] mt-0.5 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Tus prendas guardadas
            </p>
          </div>
        </button>

        {/* Grid 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          {gridSections.map(s => (
            <button
              key={s.to}
              onClick={() => navigate(s.to)}
              className="rounded-2xl text-left flex flex-col justify-between active:scale-[0.98] transition-transform duration-150"
              style={{
                backgroundColor: '#F2EBE0',
                border: '1px solid #D4BFA4',
                boxShadow: '0 2px 12px rgba(74,52,32,0.06)',
                height: '130px',
              }}
            >
              <div className="flex items-start justify-between px-4 pt-4">
                <span className="font-body text-[10px] tracking-[0.22em] uppercase" style={{ color: '#9E9690' }}>
                  {s.number}
                </span>
                <span style={{ color: '#C4956A' }}>{s.icon}</span>
              </div>
              <div className="px-4 pb-4">
                <p className="font-display text-[1.2rem] font-light leading-tight" style={{ color: '#4A3420' }}>
                  {s.label}
                </p>
                <p className="font-body text-[11px] mt-0.5 tracking-wide leading-snug" style={{ color: '#9E9690' }}>
                  {s.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
