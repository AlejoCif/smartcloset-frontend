import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { subirFotoPerfil } from '../api/user'

export default function PerfilPage() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const temporadaEmoji: Record<string, string> = {
    PRIMAVERA: '🌸', VERANO: '☀️', OTOÑO: '🍂', INVIERNO: '❄️',
  }

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await subirFotoPerfil(file)
      await refreshUser()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <Layout title="Perfil">
      <div className="px-5 py-6 flex flex-col gap-6">

        {/* Avatar */}
        <div className="flex flex-col items-center text-center py-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-24 h-24 rounded-full mb-4 overflow-hidden group"
            style={{ border: '2px solid #D4BFA4' }}
            aria-label="Cambiar foto de perfil"
          >
            {user?.fotoUrl ? (
              <img
                src={user.fotoUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F2EBE0' }}>
                <span className="font-display text-4xl" style={{ color: '#C4956A' }}>
                  {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
            )}

            {/* Overlay al hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(74,52,32,0.45)' }}>
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFotoChange}
          />

          <h2 className="font-display text-3xl font-light" style={{ color: '#4A3420' }}>{user?.nombre}</h2>
          <p className="font-body text-sm mt-1" style={{ color: '#9E9690' }}>{user?.email}</p>
          <p className="font-body text-xs mt-1" style={{ color: '#D4BFA4' }}>
            {uploading ? 'Subiendo foto...' : 'Toca la foto para cambiarla'}
          </p>
        </div>

        {/* Colorimetría */}
        {user?.temporadaColor && (
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#F2EBE0', border: '1px solid #D4BFA4' }}>
            <p className="text-xs font-body tracking-widest uppercase mb-3" style={{ color: '#9E9690' }}>
              Tu colorimetría
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{temporadaEmoji[user.temporadaColor] ?? '✨'}</span>
              <div>
                <p className="font-display text-2xl font-light capitalize" style={{ color: '#4A3420' }}>
                  {user.temporadaColor.toLowerCase()}
                </p>
                <p className="font-body text-xs" style={{ color: '#9E9690' }}>Temporada de color</p>
              </div>
            </div>

            {user.paletaColores && user.paletaColores.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-body mb-2" style={{ color: '#9E9690' }}>Te favorecen</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.paletaColores.map(c => (
                    <span key={c} className="text-xs font-body px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(196,149,106,0.12)', color: '#C4956A' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.coloresEvitar && user.coloresEvitar.length > 0 && (
              <div>
                <p className="text-xs font-body mb-2" style={{ color: '#9E9690' }}>Evitar</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.coloresEvitar.map(c => (
                    <span key={c} className="text-xs font-body px-2.5 py-1 rounded-full bg-red-50 text-red-400">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón colorimetría */}
        <button
          onClick={() => navigate('/colorimetria')}
          className="w-full py-4 rounded-xl font-body font-medium text-sm transition-colors"
          style={{ border: '1px solid #D4BFA4', color: '#C4956A', backgroundColor: 'transparent' }}
        >
          {user?.temporadaColor ? 'Rehacer análisis de colorimetría' : 'Hacer análisis de colorimetría'}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={logout}
          className="w-full py-4 rounded-xl font-body font-medium text-sm transition-colors"
          style={{ border: '1px solid #D4BFA4', color: '#9E9690', backgroundColor: 'transparent' }}
        >
          Cerrar sesión
        </button>

      </div>
    </Layout>
  )
}
