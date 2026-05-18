import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, register } from '../api/auth'

const seasons = [
  { label: 'Primavera Cálida', color: '#E8A87C' },
  { label: 'Primavera Clara', color: '#F7C59F' },
  { label: 'Verano Frío', color: '#A8C5DA' },
  { label: 'Verano Suave', color: '#C4B5C8' },
  { label: 'Otoño Cálido', color: '#C4956A' },
  { label: 'Otoño Profundo', color: '#8B4513' },
  { label: 'Invierno Frío', color: '#2C3E6B' },
  { label: 'Invierno Profundo', color: '#1A1A2E' },
]

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = mode === 'login'
        ? await login(email, password)
        : await register(email, password, nombre)
      setToken(res.data.token)
      navigate('/closet', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
      setError(msg ?? 'Algo salió mal. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Hero panel ── */}
      <div className="relative overflow-hidden md:w-[55%] min-h-[42vh] md:min-h-screen flex flex-col items-center justify-center"
           style={{ background: 'linear-gradient(145deg, #5C3D24 0%, #4A3420 45%, #2E1A0E 100%)' }}>

        {/* Ambient light blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl"
             style={{ background: '#C4956A' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
             style={{ background: '#E8C4A0' }} />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full opacity-10 blur-2xl"
             style={{ background: '#C4956A' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-10 py-12 md:py-0">

          {/* Hanger icon */}
          <svg viewBox="0 0 100 100" className="w-14 h-14 mb-7" fill="none">
            <path d="M50,33 L50,20 A10,10 0 0,1 60,10"
                  stroke="#C4956A" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M50,33 L14,73"
                  stroke="#C4956A" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M50,33 L86,73"
                  stroke="#C4956A" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M14,73 L14,82 L86,82 L86,73"
                  stroke="#C4956A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-6xl font-light text-white tracking-widest leading-tight mb-3">
            Smart<span className="italic" style={{ color: '#C4956A' }}>Closet</span>
          </h1>
          <p className="font-body text-xs tracking-[0.25em] uppercase mb-10"
             style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tu guardarropa inteligente
          </p>

          {/* Color season swatches */}
          <div className="flex gap-2 flex-wrap justify-center max-w-[200px]">
            {seasons.map((s) => (
              <div
                key={s.label}
                title={s.label}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: s.color, borderColor: 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>

          {/* Quote */}
          <p className="mt-10 font-display text-base italic leading-relaxed max-w-xs hidden md:block"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
            "El estilo es una forma de decir quién eres sin tener que hablar."
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#FAF7F2] px-6 py-10 md:py-0">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h2 className="font-display text-3xl font-light text-primary mb-1">
              {mode === 'login' ? 'Bienvenida' : 'Crea tu cuenta'}
            </h2>
            <p className="font-body text-sm text-primary/40">
              {mode === 'login'
                ? 'Inicia sesión para continuar'
                : 'Empieza a descubrir tus colores'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-full bg-surface p-1 mb-7">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-full text-sm font-body font-medium transition-all ${
                  mode === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary/50 hover:text-primary'
                }`}
              >
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-body text-primary/60 mb-1.5 tracking-wider uppercase">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-surface border border-surface focus:border-accent rounded-xl px-4 py-3.5 text-primary font-body text-sm outline-none transition-colors placeholder:text-primary/30"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-body text-primary/60 mb-1.5 tracking-wider uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
                className="w-full bg-surface border border-surface focus:border-accent rounded-xl px-4 py-3.5 text-primary font-body text-sm outline-none transition-colors placeholder:text-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-primary/60 mb-1.5 tracking-wider uppercase">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-surface border border-surface focus:border-accent rounded-xl px-4 py-3.5 text-primary font-body text-sm outline-none transition-colors placeholder:text-primary/30"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-body text-center bg-red-50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full text-white font-body font-medium py-4 rounded-xl transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#C4956A' }}
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
