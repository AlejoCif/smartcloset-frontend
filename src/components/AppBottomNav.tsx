import { useNavigate, useLocation } from 'react-router-dom'

const sk = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IcHome({ size = 22, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...sk} stroke={color}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
}
function IcHanger({ size = 22, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...sk} stroke={color}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
}
function IcSparkles({ size = 22, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...sk} stroke={color}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z"/><path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"/></svg>
}
function IcHeart({ size = 22, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...sk} stroke={color}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function IcBag({ size = 22, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...sk} stroke={color}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
}

const NAV = [
  { to: '/home',        label: 'Inicio',   Icon: IcHome,     center: false },
  { to: '/closet',      label: 'Closet',   Icon: IcHanger,   center: false },
  { to: '/outfits',     label: 'Outfit IA', Icon: IcSparkles, center: true  },
  { to: '/mis-outfits', label: 'Looks',    Icon: IcHeart,    center: false },
  { to: '/comprar',     label: 'Compras',  Icon: IcBag,      center: false },
]

export default function AppBottomNav() {
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full"
      style={{ maxWidth: '430px', backgroundColor: '#fff', borderTop: '1px solid #EDE8E1', paddingBottom: 'env(safe-area-inset-bottom, 10px)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: '8px', paddingBottom: '4px' }}>
        {NAV.map(({ to, label, Icon, center }) => {
          const active = pathname === to
          const col    = active ? '#C4956A' : '#9E9690'

          if (center) {
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px',
                  transform: 'translateY(-10px)',
                }}
              >
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  backgroundColor: active ? '#C4956A' : '#3D2B1F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(61,43,31,0.3)',
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'Jost, sans-serif', fontWeight: 500, color: active ? '#C4956A' : '#9E9690' }}>
                  {label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}
              className="active:scale-90 transition-transform"
            >
              <Icon size={22} color={col} />
              <span style={{ fontSize: '10px', fontFamily: 'Jost, sans-serif', fontWeight: active ? 600 : 400, color: col }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
