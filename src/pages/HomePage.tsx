import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Section {
  to: string
  number: string
  label: string
  desc: string
  gradient: string
  icon: React.ReactNode
}

const sections: Section[] = [
  {
    to: '/closet',
    number: '01',
    label: 'Mi Closet',
    desc: 'Tus prendas guardadas',
    gradient: 'linear-gradient(145deg, #0E0906 0%, #2A1810 50%, #4A3420 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    to: '/outfits',
    number: '02',
    label: 'Outfits IA',
    desc: 'Combinaciones con IA',
    gradient: 'linear-gradient(145deg, #120A04 0%, #3A1E0C 50%, #6B3A18 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    gradient: 'linear-gradient(145deg, #0C0A07 0%, #241808 50%, #3D2A18 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    ),
  },
  {
    to: '/comprar',
    number: '04',
    label: '¿Lo compro?',
    desc: 'Asesora de compras',
    gradient: 'linear-gradient(145deg, #080E06 0%, #1A2E10 50%, #345224 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    gradient: 'linear-gradient(145deg, #200608 0%, #5C1418 50%, #952430 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    gradient: 'linear-gradient(145deg, #0C0C0C 0%, #1E1E1E 50%, #303030 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

interface CardProps {
  section: Section
  className?: string
  large?: boolean
}

function Card({ section, className = '', large = false }: CardProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(section.to)}
      className={`relative overflow-hidden rounded-2xl active:scale-[0.97] transition-all duration-150 text-left flex flex-col justify-between ${className}`}
      style={{ background: section.gradient }}
    >
      {/* Shimmer diagonal */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.09] via-transparent to-transparent pointer-events-none" />
      {/* Subtle ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/[0.07] pointer-events-none" />
      {/* Decorative arcs (solo en tarjeta grande) */}
      {large && (
        <div className="absolute -top-8 -right-8 w-40 h-40 opacity-[0.06] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="100" cy="0" r="70" stroke="white" strokeWidth="1"/>
            <circle cx="100" cy="0" r="50" stroke="white" strokeWidth="0.8"/>
            <circle cx="100" cy="0" r="30" stroke="white" strokeWidth="0.6"/>
          </svg>
        </div>
      )}

      {/* Top row: number + icon */}
      <div className="relative flex items-start justify-between p-4 pb-0">
        <span className="font-body text-[10px] tracking-[0.2em] text-white/20 font-light">
          {section.number}
        </span>
        <span className="text-white/40 mt-0.5">{section.icon}</span>
      </div>

      {/* Bottom: label + desc */}
      <div className="relative p-4 pt-2">
        <p className={`font-display font-light text-white leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>
          {section.label}
        </p>
        <p className="font-body text-[10px] text-white/35 mt-0.5 tracking-wide leading-snug">
          {section.desc}
        </p>
      </div>
    </button>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const name = user?.nombre?.split(' ')[0] ?? 'Bienvenida'
  const [closet, outfits, misOutfits, comprar, inspiracion, perfil] = sections

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">

      {/* Header editorial */}
      <header className="px-5 pt-14 pb-7">
        <p className="font-body text-[10px] tracking-[0.28em] text-primary/35 uppercase mb-3">
          Hola, {name}
        </p>
        <h1 className="font-display text-[2.8rem] font-light text-primary leading-none">
          Smart<span className="italic">Closet</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-px flex-1 bg-primary/10" />
          <p className="font-body text-[9px] tracking-[0.32em] text-primary/25 uppercase">
            Guardarropa inteligente
          </p>
          <div className="h-px flex-1 bg-primary/10" />
        </div>
      </header>

      {/* Grid editorial asimétrico */}
      <div className="px-3 pb-10 flex flex-col gap-2">

        {/* Fila 1: grande + vertical */}
        <div className="grid grid-cols-3 gap-2" style={{ height: '196px' }}>
          <Card section={closet} className="col-span-2" large />
          <Card section={outfits} />
        </div>

        {/* Fila 2: dos iguales */}
        <div className="grid grid-cols-2 gap-2" style={{ height: '138px' }}>
          <Card section={misOutfits} />
          <Card section={comprar} />
        </div>

        {/* Fila 3: ancha + estrecha */}
        <div className="grid grid-cols-3 gap-2" style={{ height: '138px' }}>
          <Card section={inspiracion} className="col-span-2" />
          <Card section={perfil} />
        </div>

      </div>
    </div>
  )
}
