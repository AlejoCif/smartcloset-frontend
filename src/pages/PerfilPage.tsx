import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function PerfilPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const temporadaEmoji: Record<string, string> = {
    PRIMAVERA: '🌸', VERANO: '☀️', OTOÑO: '🍂', INVIERNO: '❄️',
  }

  return (
    <Layout title="Perfil">
      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Avatar y nombre */}
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4 border-2 border-accent/20">
            <span className="font-display text-4xl text-accent">
              {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
          <h2 className="font-display text-3xl font-light text-primary">{user?.nombre}</h2>
          <p className="text-primary/40 font-body text-sm mt-1">{user?.email}</p>
        </div>

        {/* Colorimetría */}
        {user?.temporadaColor && (
          <div className="bg-surface rounded-2xl p-5">
            <p className="text-xs font-body text-primary/50 tracking-widest uppercase mb-3">
              Tu colorimetría
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{temporadaEmoji[user.temporadaColor] ?? '✨'}</span>
              <div>
                <p className="font-display text-2xl font-light text-primary capitalize">
                  {user.temporadaColor.toLowerCase()}
                </p>
                <p className="text-primary/50 font-body text-xs">Temporada de color</p>
              </div>
            </div>

            {user.paletaColores && user.paletaColores.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-body text-primary/50 mb-2">Te favorecen</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.paletaColores.map((c) => (
                    <span key={c} className="text-xs font-body bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.coloresEvitar && user.coloresEvitar.length > 0 && (
              <div>
                <p className="text-xs font-body text-primary/50 mb-2">Evitar</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.coloresEvitar.map((c) => (
                    <span key={c} className="text-xs font-body bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Colorimetría - rehacer */}
        <button
          onClick={() => navigate('/colorimetria')}
          className="w-full py-4 rounded-xl border border-accent/30 text-accent font-body font-medium text-sm hover:bg-accent/5 transition-colors"
        >
          {user?.temporadaColor ? 'Rehacer análisis de colorimetría' : 'Hacer análisis de colorimetría'}
        </button>

        {/* Botón cerrar sesión */}
        <button
          onClick={logout}
          className="w-full py-4 rounded-xl border border-primary/20 text-primary/60 font-body font-medium text-sm hover:border-primary/40 hover:text-primary transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </Layout>
  )
}
