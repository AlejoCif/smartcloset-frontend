import client from './client'
import type { MiOutfitItem } from '../types'

export const subirMiOutfit = (foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<MiOutfitItem>('/api/mis-outfits', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getMisOutfits = () =>
  client.get<MiOutfitItem[]>('/api/mis-outfits')

export const eliminarMiOutfit = (id: number) =>
  client.delete(`/api/mis-outfits/${id}`)

export const chatMiOutfit = (id: number, mensaje: string) =>
  client.post<{ respuesta: string }>(`/api/mis-outfits/${id}/chat`, { mensaje })
