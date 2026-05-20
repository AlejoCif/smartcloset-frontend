import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Iconos ───────────────────────────────────────────────────
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IconHome({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function IconHanger({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  )
}
function IconSparkles({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z"/>
      <path d="M5 17l.6 1.4L7 19l-1.4.6L5 21l-.6-1.4L3 19l1.4-.6z"/>
    </svg>
  )
}
function IconHeart({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}
function IconBag({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}
function IconMenu({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s} stroke={color}>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

// ── Bottom Nav ───────────────────────────────────────────────
const navItems = [
  { to: '/home',      label: 'Inicio',   Icon: IconHome },
  { to: '/closet',    label: 'Closet',   Icon: IconHanger },
  { to: '/outfits',   label: 'IA',       Icon: IconSparkles },
  { to: '/mis-outfits', label: 'Looks',  Icon: IconHeart },
  { to: '/comprar',   label: 'Compras',  Icon: IconBag },
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50"
      style={{
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#fff',
        borderTop: '1px solid #F0EBE3',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      }}
    >
      <div className="flex items-center justify-around pt-2 pb-1">
        {navItems.map(({ to, label, Icon }) => {
          const active = location.pathname === to
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all active:scale-90"
            >
              <Icon size={22} color={active ? '#C4956A' : '#9E9690'} />
              <span
                className="font-body text-[10px] font-medium tracking-wide"
                style={{ color: active ? '#C4956A' : '#9E9690' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ── HomePage ─────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.nombre?.split(' ')[0] ?? 'Bienvenida'
  const initial = user?.nombre?.charAt(0).toUpperCase() ?? '?'

  return (
    <div
      className="flex flex-col mx-auto"
      style={{ backgroundColor: '#FAF7F2', maxWidth: '430px', minHeight: '100vh', paddingBottom: '88px' }}
    >

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-12 pb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#F2EBE0' }}>
          <IconMenu size={20} color="#4A3420" />
        </button>

        <button onClick={() => navigate('/perfil')} className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center active:scale-95 transition-transform" style={{ border: '2px solid #D4BFA4' }}>
          {user?.fotoUrl
            ? <img src={user.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
            : <span className="font-display text-lg" style={{ color: '#C4956A', backgroundColor: '#F2EBE0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initial}</span>
          }
        </button>
      </header>

      {/* ── Saludo ─────────────────────────────────────────── */}
      <div className="px-4 pb-5">
        <p className="font-body text-sm font-medium mb-0.5" style={{ color: '#C4956A' }}>
          Hola, {name} 👋
        </p>
        <h1 className="font-display font-light leading-none mb-1" style={{ fontSize: '2.4rem', color: '#1A1A1A' }}>
          Smart<span className="italic">Closet</span>
        </h1>
        <p className="font-body text-sm" style={{ color: '#9E9690' }}>
          Tu guardarropa inteligente ✨
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3">

        {/* ── Card principal — Mi Closet ──────────────────── */}
        <button
          onClick={() => navigate('/closet')}
          className="relative overflow-hidden w-full active:scale-[0.98] transition-transform"
          style={{ borderRadius: '20px', height: '220px' }}
        >
          {/* Imagen de fondo */}
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800"
            alt="Mi Closet"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradiente */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(15,8,3,0.82) 0%, rgba(15,8,3,0.35) 70%, rgba(15,8,3,0.1) 100%)' }}
          />

          {/* Contenido izquierdo */}
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            <div>
              <p className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                01 · Mi Closet
              </p>
              <h2 className="font-display font-light text-white leading-tight" style={{ fontSize: '1.9rem' }}>
                Mi Closet
              </h2>
              <p className="font-body text-xs leading-relaxed mt-2 max-w-[180px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Tus prendas organizadas y siempre a tu alcance.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span className="font-body text-white text-xs font-medium">Ver mi closet</span>
                <span className="text-white text-sm">→</span>
              </div>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <IconHanger size={18} color="white" />
              </div>
            </div>
          </div>
        </button>

        {/* ── Grid 2×2 ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Outfits IA */}
          <MediumCard
            to="/outfits"
            num="02"
            title="Outfits IA"
            desc="Crea combinaciones perfectas con IA"
            imgSrc="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
            icon={<IconSparkles size={16} color="white" />}
          />

          {/* Mis Looks */}
          <MediumCard
            to="/mis-outfits"
            num="03"
            title="Mis Looks"
            desc="Guarda y califica tus outfits"
            imgSrc="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400"
            icon={<IconHeart size={16} color="white" />}
          />

          {/* ¿Lo compro? */}
          <MediumCard
            to="/comprar"
            num="04"
            title="¿Lo compro?"
            desc="Asesora de compras inteligente"
            imgSrc="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"
            icon={<IconBag size={16} color="white" />}
          />

          {/* Inspiración */}
          <MediumCard
            to="/inspiracion"
            num="05"
            title="Inspiración"
            desc="Descubre looks con IA"
            imgSrc="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400"
            icon={<IconSparkles size={16} color="white" />}
          />
        </div>

        {/* ── Banner resumen ──────────────────────────────── */}
        <button
          onClick={() => navigate('/outfits')}
          className="w-full flex items-center justify-between px-4 py-4 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4', borderRadius: '16px' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(196,149,106,0.15)' }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-body text-sm font-semibold" style={{ color: '#1A1A1A' }}>Tu resumen de hoy</p>
              <p className="font-body text-xs" style={{ color: '#9E9690' }}>Descubre insights de tu closet</p>
            </div>
          </div>
          <span
            className="font-body text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: '#C4956A', color: '#fff' }}
          >
            Ver →
          </span>
        </button>

      </div>

      {/* ── Bottom Nav ─────────────────────────────────────── */}
      <BottomNav />
    </div>
  )
}

// ── Card mediana del grid ────────────────────────────────────
function MediumCard({
  to, num, title, desc, imgSrc, icon,
}: {
  to: string
  num: string
  title: string
  desc: string
  imgSrc: string
  icon: React.ReactNode
}) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="relative flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        height: '170px',
        padding: '14px',
      }}
    >
      {/* Imagen decorativa derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden" style={{ borderRadius: '0 16px 16px 0' }}>
        <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #fff 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)' }}
        />
      </div>

      {/* Contenido */}
      <div className="relative flex flex-col justify-between h-full z-10">
        {/* Parte superior: número + ícono */}
        <div className="flex items-start justify-between">
          <span className="font-body text-[10px] tracking-widest" style={{ color: '#9E9690' }}>{num}</span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#C4956A' }}
          >
            {icon}
          </div>
        </div>

        {/* Parte inferior: título + desc + flecha */}
        <div>
          <p className="font-display font-light leading-tight mb-1" style={{ fontSize: '1.15rem', color: '#1A1A1A' }}>
            {title}
          </p>
          <p className="font-body leading-snug mb-3" style={{ fontSize: '10px', color: '#9E9690' }}>
            {desc}
          </p>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#C4956A' }}
          >
            <span className="text-white font-body" style={{ fontSize: '11px', lineHeight: 1 }}>→</span>
          </div>
        </div>
      </div>
    </button>
  )
}
