import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import { getProfiles } from './api/profiles'
import { useProfileTheme, getThemeColors, getThemeEmojis, isKidTheme } from './hooks/useProfileTheme'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProfileSelectorPage from './pages/ProfileSelectorPage'
import ColorimetriaPage from './pages/ColorimetriaPage'
import ClosetPage from './pages/ClosetPage'
import AgregarPrendaPage from './pages/AgregarPrendaPage'
import OutfitsPage from './pages/OutfitsPage'
import InspirationPage from './pages/InspirationPage'
import ComprarPage from './pages/ComprarPage'
import MisOutfitsPage from './pages/MisOutfitsPage'
import PerfilPage from './pages/PerfilPage'
import ViajeOrganizerPage from './pages/ViajeOrganizerPage'
import LoadingSpinner from './components/LoadingSpinner'

// ── Wrapper global de tema ────────────────────────────────────
const EMOJI_POSITIONS = [
  [5, 8], [18, 72], [32, 22], [48, 48], [62, 85],
  [8, 60], [24, 15], [38, 38], [54, 65], [78, 30],
]

function AppThemeWrapper({ children }: { children: ReactNode }) {
  const themeMode = useProfileTheme()
  const colors    = getThemeColors(themeMode)
  const emojis    = getThemeEmojis(themeMode)
  const kid       = isKidTheme(themeMode)

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', position: 'relative' }}>
      {kid && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {emojis.map((emoji, i) => (
            <span key={i} style={{
              position: 'absolute', fontSize: '30px', opacity: 0.07,
              userSelect: 'none', lineHeight: 1,
              top:  `${EMOJI_POSITIONS[i][0]}%`,
              left: `${EMOJI_POSITIONS[i][1]}%`,
              transform: `rotate(${[-10,15,-5,20,-15,8,-20,12,-8,18][i]}deg)`,
            }}>{emoji}</span>
          ))}
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { token, user, loading } = useAuth()
  const { profiles, setProfiles, activeProfile } = useProfile()

  // Carga perfiles cuando el usuario está autenticado
  useEffect(() => {
    if (token && user) {
      getProfiles().then(r => setProfiles(r.data)).catch(() => {})
    }
  }, [token, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // No autenticada
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage initialMode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Autenticada sin colorimetría
  if (user && user.temporadaColor === null) {
    return (
      <Routes>
        <Route path="/colorimetria" element={<ColorimetriaPage />} />
        <Route path="*" element={<Navigate to="/colorimetria" replace />} />
      </Routes>
    )
  }

  // Autenticada pero sin perfil seleccionado → selector
  if (profiles.length > 0 && !activeProfile) {
    return (
      <Routes>
        <Route path="*" element={<ProfileSelectorPage />} />
      </Routes>
    )
  }

  // Autenticada completa
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/perfiles" element={<ProfileSelectorPage />} />
      <Route path="/closet" element={<ClosetPage />} />
      <Route path="/closet/agregar" element={<AgregarPrendaPage />} />
      <Route path="/outfits" element={<OutfitsPage />} />
      <Route path="/inspiracion" element={<InspirationPage />} />
      <Route path="/comprar" element={<ComprarPage />} />
      <Route path="/mis-outfits" element={<MisOutfitsPage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="/colorimetria" element={<ColorimetriaPage />} />
      <Route path="/viaje" element={<ViajeOrganizerPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <AppThemeWrapper>
            <AppRoutes />
          </AppThemeWrapper>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
