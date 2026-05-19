import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, register, loginConGoogle } from '../api/auth'
import { useGoogleLogin } from '@react-oauth/google'
import InstallPrompt from '../components/InstallPrompt'

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
  const [googleLoading, setGoogleLoading] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setError('')
      try {
        const res = await loginConGoogle(tokenResponse.access_token)
        setToken(res.data.token)
        navigate('/closet', { replace: true })
      } catch {
        setError('No pudimos iniciar sesión con Google. Intenta de nuevo.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => setError('Error al conectar con Google.'),
  })

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
      <InstallPrompt />

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

          {/* Botón Google */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-primary/20 rounded-xl py-3.5 font-body font-medium text-sm text-primary hover:bg-surface transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="text-primary/50">Conectando...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-primary/10" />
            <span className="text-xs font-body text-primary/30">o</span>
            <div className="flex-1 h-px bg-primary/10" />
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
