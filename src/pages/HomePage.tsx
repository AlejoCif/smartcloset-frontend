import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const sections = [
  {
    to: '/closet',
    label: 'Mi Closet',
    desc: 'Tus prendas guardadas',
    color: '#4A3420',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M38.7 6.9 32 4a8 8 0 0 1-16 0L9.3 6.9a4 4 0 0 0-2.7 4.5l1.2 7.1a2 2 0 0 0 2 1.7H12v20a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-20h2.2a2 2 0 0 0 2-1.7l1.2-7.1a4 4 0 0 0-2.7-4.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/outfits',
    label: 'Outfits',
    desc: 'Combinaciones con IA',
    color: '#C4956A',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M6 14l18-10 18 10-18 10z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 24l18 10 18-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 34l18 10 18-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/mis-outfits',
    label: 'Mis Outfits',
    desc: 'Sube y califica tus looks',
    color: '#8B6F57',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="6" y="6" width="36" height="36" rx="4" stroke="white" strokeWidth="2.5"/>
        <circle cx="17" cy="17" r="5" stroke="white" strokeWidth="2.5"/>
        <path d="M6 32l10-10 8 8 6-6 12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/colorimetria',
    label: 'Colorimetría',
    desc: 'Tu paleta personal',
    color: '#E8A87C',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2.5"/>
        <circle cx="16" cy="20" r="4" fill="white" fillOpacity="0.5"/>
        <circle cx="32" cy="20" r="4" fill="white" fillOpacity="0.5"/>
        <circle cx="24" cy="32" r="4" fill="white" fillOpacity="0.5"/>
      </svg>
    ),
  },
  {
    to: '/comprar',
    label: '¿Lo compro?',
    desc: 'Asesora de compras IA',
    color: '#6B7C3A',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M12 4L6 12v28a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V12l-6-8z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="6" y1="12" x2="42" y2="12" stroke="white" strokeWidth="2.5"/>
        <path d="M32 20a8 8 0 0 1-16 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: '/inspiracion',
    label: 'Inspiración',
    desc: 'Busca looks con IA',
    color: '#C9856D',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="22" cy="22" r="14" stroke="white" strokeWidth="2.5"/>
        <path d="m42 42-7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M22 16v12M16 22h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: '/perfil',
    label: 'Perfil',
    desc: 'Tu cuenta y ajustes',
    color: '#9E9E9E',
    textColor: 'text-white',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="16" r="8" stroke="white" strokeWidth="2.5"/>
        <path d="M8 42a16 16 0 0 1 32 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="px-5 pt-14 pb-6">
        <p className="text-accent text-xs font-body tracking-widest uppercase mb-1">Hola, {user?.nombre?.split(' ')[0] ?? 'Bienvenida'}</p>
        <h1 className="font-display text-4xl font-light text-primary leading-tight">
          Smart<span className="italic">Closet</span>
        </h1>
        <p className="text-primary/40 font-body text-sm mt-1">¿Qué quieres hacer hoy?</p>
      </header>

      {/* Grid de secciones */}
      <div className="px-4 pb-10 grid grid-cols-2 gap-3">
        {sections.map(({ to, label, desc, color, textColor, icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="relative rounded-2xl p-5 flex flex-col gap-3 text-left active:scale-95 transition-transform shadow-sm"
            style={{ backgroundColor: color }}
          >
            {icon}
            <div>
              <p className={`font-body font-semibold text-sm ${textColor}`}>{label}</p>
              <p className={`font-body text-xs ${textColor} opacity-70 mt-0.5`}>{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
