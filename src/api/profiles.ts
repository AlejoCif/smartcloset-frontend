import client from './client'

export interface Profile {
  id: number
  nombre: string
  tipo: 'ADULTO' | 'NINO'
  edad: number | null
  fotoUrl: string | null
  temporadaColor: string | null
  paletaColores: string[] | null
  coloresEvitar: string[] | null
  tonosFavoritos: string[] | null
}

export const getProfiles = () =>
  client.get<Profile[]>('/api/profiles')

export const createProfile = (nombre: string, tipo: 'ADULTO' | 'NINO', edad?: number) =>
  client.post<Profile>('/api/profiles', { nombre, tipo, edad })

export const deleteProfile = (id: number) =>
  client.delete(`/api/profiles/${id}`)

export const uploadProfilePhoto = (id: number, foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<Profile>(`/api/profiles/${id}/foto`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
