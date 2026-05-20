import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
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

function AppRoutes() {
  const { token, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // No autenticada: landing + login + register
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

  // Autenticada completa
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
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
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
