import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Profile } from '../api/profiles'

interface ProfileContextType {
  profiles: Profile[]
  activeProfile: Profile | null
  setActiveProfile: (p: Profile) => void
  setProfiles: (p: Profile[]) => void
  refreshNeeded: boolean
  setRefreshNeeded: (v: boolean) => void
}

const ProfileContext = createContext<ProfileContextType | null>(null)

const STORAGE_KEY = 'activeProfileId'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles,       setProfiles]       = useState<Profile[]>([])
  const [activeProfile,  setActiveProfileS] = useState<Profile | null>(null)
  const [refreshNeeded,  setRefreshNeeded]  = useState(false)

  // Solo restaura el perfil activo si hay uno guardado en localStorage.
  // Si no hay savedId → muestra el selector para que el usuario elija.
  useEffect(() => {
    if (profiles.length === 0) return
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (!savedId) return  // sin savedId → muestra selector
    const found = profiles.find(p => p.id === Number(savedId))
    if (found) setActiveProfileS(found)
    // Si el savedId no coincide con ningún perfil → también muestra selector
  }, [profiles])

  const setActiveProfile = (p: Profile) => {
    setActiveProfileS(p)
    localStorage.setItem(STORAGE_KEY, String(p.id))
  }

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, setActiveProfile, setProfiles, refreshNeeded, setRefreshNeeded }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be inside ProfileProvider')
  return ctx
}
