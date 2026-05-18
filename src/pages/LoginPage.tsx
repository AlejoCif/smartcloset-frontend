import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, register } from '../api/auth'

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-light text-primary tracking-widest">
            Smart<span className="italic">Closet</span>
          </h1>
          <p className="mt-2 text-primary/50 text-sm font-body tracking-wider uppercase">
            Tu guardarropa inteligente
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-full bg-surface p-1 mb-8">
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
            className="mt-2 w-full bg-accent hover:bg-accent/90 active:bg-accent/80 text-white font-body font-medium py-4 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
