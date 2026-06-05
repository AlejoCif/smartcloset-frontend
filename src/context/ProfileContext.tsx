import { createContext, useContext, useState, type ReactNode } from 'react'
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
  const [profiles,      setProfilesState] = useState<Profile[]>([])
  const [activeProfile, setActiveProfileS] = useState<Profile | null>(null)
  const [refreshNeeded, setRefreshNeeded]  = useState(false)

  // Actualiza la lista de perfiles y restaura el activo en el mismo batch de React,
  // evitando el render intermedio donde profiles.length > 0 pero activeProfile === null.
  const setProfiles = (p: Profile[]) => {
    setProfilesState(p)
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (savedId) {
      const found = p.find(pr => pr.id === Number(savedId))
      if (found) setActiveProfileS(found)
    }
  }

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
