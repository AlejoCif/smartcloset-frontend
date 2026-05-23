import client from './client'
import type { MiOutfitItem } from '../types'

export const subirMiOutfit = (foto: File, considerarColorimetria: boolean = true) => {
  const form = new FormData()
  form.append('foto', foto)
  form.append('considerarColorimetria', String(considerarColorimetria))
  return client.post<MiOutfitItem>('/api/mis-outfits', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getMisOutfits = () =>
  client.get<MiOutfitItem[]>('/api/mis-outfits')

export const eliminarMiOutfit = (id: number) =>
  client.delete(`/api/mis-outfits/${id}`)

export const chatMiOutfit = (id: number, mensaje: string, considerarColorimetria: boolean = true) =>
  client.post<{ respuesta: string }>(`/api/mis-outfits/${id}/chat`, { mensaje, considerarColorimetria })
