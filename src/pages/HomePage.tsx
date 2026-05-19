import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Section {
  to: string
  number: string
  label: string
  desc: string
  hero?: boolean
  icon: React.ReactNode
}

const iconStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const sections: Section[] = [
  {
    to: '/closet',
    number: '01',
    label: 'Mi Closet',
    desc: 'Tus prendas guardadas',
    hero: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
  },
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
  {
    to: '/perfil',
    number: '06',
    label: 'Perfil',
    desc: 'Tu cuenta y ajustes',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" {...iconStroke}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

interface CardProps {
  section: Section
  className?: string
}

function Card({ section, className = '' }: CardProps) {
  const navigate = useNavigate()

  if (section.hero) {
    return (
      <button
        onClick={() => navigate(section.to)}
        className={`relative overflow-hidden rounded-2xl text-left flex flex-col justify-between active:scale-[0.98] transition-all duration-150 ${className}`}
        style={{
          backgroundColor: '#4A3420',
          boxShadow: '0 4px 20px rgba(74,52,32,0.22)',
          minHeight: '160px',
        }}
      >
        {/* Textura sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #FAF7F2 0%, transparent 60%)' }}
        />

        <div className="relative flex items-start justify-between p-5 pb-0">
          <span className="font-body text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(250,247,242,0.35)' }}>
            {section.number}
          </span>
          <span style={{ color: 'rgba(250,247,242,0.7)' }}>{section.icon}</span>
        </div>

        <div className="relative p-5 pt-3">
          <p className="font-display text-[1.6rem] font-light leading-tight" style={{ color: '#FAF7F2' }}>
            {section.label}
          </p>
          <p className="font-body text-xs mt-1 tracking-wide" style={{ color: 'rgba(250,247,242,0.45)' }}>
            {section.desc}
          </p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => navigate(section.to)}
      className={`relative rounded-2xl text-left flex flex-col justify-between active:scale-[0.98] transition-all duration-150 ${className}`}
      style={{
        backgroundColor: '#F2EBE0',
        border: '1px solid #D4BFA4',
        boxShadow: '0 2px 12px rgba(74,52,32,0.06)',
        minHeight: '140px',
      }}
    >
      <div className="flex items-start justify-between p-4 pb-0">
        <span className="font-body text-[10px] tracking-[0.22em] uppercase" style={{ color: '#9E9690' }}>
          {section.number}
        </span>
        <span style={{ color: '#C4956A' }}>{section.icon}</span>
      </div>

      <div className="p-4 pt-3">
        <p className="font-display text-[1.25rem] font-light leading-tight" style={{ color: '#4A3420' }}>
          {section.label}
        </p>
        <p className="font-body text-[11px] mt-0.5 tracking-wide leading-snug" style={{ color: '#9E9690' }}>
          {section.desc}
        </p>
      </div>
    </button>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const name = user?.nombre?.split(' ')[0] ?? 'Bienvenida'
  const [closet, ...rest] = sections

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto" style={{ backgroundColor: '#FAF7F2' }}>

      {/* Header */}
      <header className="px-6 pt-14 pb-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#9E9690' }}>
          Hola, {name}
        </p>

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

      {/* Grid */}
      <div className="px-6 pb-12 flex flex-col gap-3">

        {/* Hero card — Mi Closet full width */}
        <Card section={closet} />

        {/* Resto en 2 columnas */}
        <div className="grid grid-cols-2 gap-3">
          {rest.map(s => (
            <Card key={s.to} section={s} />
          ))}
        </div>

      </div>
    </div>
  )
}
