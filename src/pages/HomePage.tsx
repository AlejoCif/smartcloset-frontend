import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppBottomNav from '../components/AppBottomNav'

// ── SVG Icons (locales) ──────────────────────────────────────
function IcHanger({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  )
}
function IcSparkles({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z"/>
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"/>
    </svg>
  )
}
function IcHeart({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}
function IcBag({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}
function IcMenu({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="15" y2="18"/>
    </svg>
  )
}
function IcChart({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6"/>
    </svg>
  )
}


// ── Card pequeña del grid ────────────────────────────────────
interface SmallCardProps {
  to: string
  num: string
  title: string
  desc: string
  imgSrc: string
  icon: React.ReactNode
}

function SmallCard({ to, num, title, desc, imgSrc, icon }: SmallCardProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="active:scale-[0.97] transition-transform text-left"
      style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', display: 'flex', height: '170px' }}
    >
      {/* Lado izquierdo: texto */}
      <div
        style={{
          flex: '0 0 58%',
          backgroundColor: '#fff',
          padding: '12px 10px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: '#C9BFB5', letterSpacing: '0.12em' }}>{num}</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 400, color: '#1A1A1A', lineHeight: 1.15 }}>
            {title}
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', lineHeight: 1.35 }}>
            {desc}
          </p>
        </div>

        {/* Flecha cobre */}
        <div style={{ width: '26px', height: '26px', backgroundColor: '#C4956A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1, marginTop: '1px' }}>→</span>
        </div>
      </div>

      {/* Lado derecho: imagen + ícono */}
      <div style={{ flex: '0 0 42%', position: 'relative' }}>
        <img src={imgSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {/* Ícono arriba derecha */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '32px', height: '32px', backgroundColor: '#C4956A',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(196,149,106,0.4)',
        }}>
          {icon}
        </div>
      </div>
    </button>
  )
}

// ── HomePage principal ───────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const name    = user?.nombre?.split(' ')[0] ?? 'Bienvenida'
  const initial = user?.nombre?.charAt(0).toUpperCase() ?? '?'

  return (
    <div style={{ backgroundColor: '#FAF7F2', maxWidth: '430px', margin: '0 auto', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 16px 8px' }}>
        <button
          style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <IcMenu size={20} color="#4A3420" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/perfil')}
          style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #D4BFA4', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {user?.fotoUrl
            ? <img src={user.fotoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#fff', backgroundColor: '#C4956A', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {initial}
              </span>
          }
        </button>
      </header>

      {/* ── Saludo ─────────────────────────────────────────── */}
      <div style={{ padding: '4px 16px 20px' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#C4956A', marginBottom: '2px' }}>
          Hola, {name} 👋
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '38px', fontWeight: 400, color: '#1A1A1A', lineHeight: 1, margin: '0 0 4px' }}>
          Smart<span style={{ fontStyle: 'italic' }}>Closet</span>
        </h1>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#9E9690' }}>
          Tu guardarropa inteligente ✨
        </p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── Card principal Mi Closet ────────────────────── */}
        <button
          onClick={() => navigate('/closet')}
          className="active:scale-[0.98] transition-transform"
          style={{ borderRadius: '20px', overflow: 'hidden', height: '220px', display: 'flex', width: '100%', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {/* Mitad izquierda: fondo oscuro + texto */}
          <div style={{
            flex: '0 0 50%', backgroundColor: '#3D2B1F',
            padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', marginBottom: '10px' }}>01 · CLOSET</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: '8px' }}>
                Mi Closet
              </p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
                Tus prendas organizadas y siempre a tu alcance.
              </p>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: '20px',
              padding: '7px 14px', alignSelf: 'flex-start',
            }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, color: '#fff' }}>Ver mi closet →</span>
            </div>
          </div>

          {/* Mitad derecha: imagen */}
          <div style={{ flex: '0 0 50%', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80"
              alt="Mi Closet"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Ícono percha */}
            <div style={{
              position: 'absolute', bottom: '14px', right: '14px',
              width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              <IcHanger size={18} color="#3D2B1F" />
            </div>
          </div>
        </button>

        {/* ── Grid 2×2 ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SmallCard
            to="/outfits"
            num="02"
            title="Outfits IA"
            desc="Crea combinaciones perfectas con IA"
            imgSrc="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80"
            icon={<IcSparkles size={15} color="white" />}
          />
          <SmallCard
            to="/mis-outfits"
            num="03"
            title="Mis Looks"
            desc="Guarda y califica tus outfits"
            imgSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80"
            icon={<IcHeart size={15} color="white" />}
          />
          <SmallCard
            to="/comprar"
            num="04"
            title="¿Lo compro?"
            desc="Asesora de compras inteligente"
            imgSrc="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80"
            icon={<IcBag size={15} color="white" />}
          />
          <SmallCard
            to="/inspiracion"
            num="05"
            title="Inspiración"
            desc="Descubre looks con IA"
            imgSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80"
            icon={<IcSparkles size={15} color="white" />}
          />
        </div>

        {/* ── Banner resumen ──────────────────────────────── */}
        <button
          onClick={() => navigate('/outfits')}
          className="active:scale-[0.98] transition-transform"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#F2EBE0', borderRadius: '14px', padding: '14px 16px',
            border: '1px solid #D9CEBF', width: '100%', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(196,149,106,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IcChart size={18} color="#C4956A" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Tu resumen de hoy</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: 0 }}>Descubre insights de tu closet</p>
            </div>
          </div>
          <span style={{
            fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500,
            color: '#fff', backgroundColor: '#C4956A', borderRadius: '20px',
            padding: '7px 14px', flexShrink: 0,
          }}>
            Ver insights →
          </span>
        </button>

      </div>

      {/* ── Bottom Navigation ──────────────────────────────── */}
      <AppBottomNav />
    </div>
  )
}
