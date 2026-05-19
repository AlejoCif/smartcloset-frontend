import client from './client'
import type { SugerenciaOutfit, OutfitSugerido, OutfitGuardado, SugerirRequest, CapsuleResponse, Estilo, AnalizarLookResponse } from '../types'

export const sugerirOutfits = (estilo: Estilo) =>
  client.get<SugerenciaOutfit[]>('/api/outfits/sugerir', { params: { estilo } })

export const sugerirOutfitsAvanzado = (request: SugerirRequest) =>
  client.post<OutfitSugerido[]>('/api/outfits/sugerir', request)

export const guardarOutfit = (nombre: string, prendaIds: number[], estilo: string, metadata?: object) =>
  client.post<OutfitGuardado>('/api/outfits/guardar', { nombre, prendaIds, estilo, metadata })

export const getOutfits = () =>
  client.get<OutfitGuardado[]>('/api/outfits')

export const eliminarOutfit = (id: number) =>
  client.delete(`/api/outfits/${id}`)

export const chatOutfit = (id: number, prendaIds: number[], mensaje: string, estilo?: string) =>
  client.post<{ respuesta: string }>(`/api/outfits/${id}/chat`, { prendaIds, mensaje, estilo })

export const analizarLook = (id: number, foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<AnalizarLookResponse>(`/api/outfits/${id}/analizar-look`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getCapsule = () =>
  client.get<CapsuleResponse>('/api/outfits/capsule')
