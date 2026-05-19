import client from './client'
import type { Outfit, SugerenciaOutfit, OutfitSugerido, SugerirRequest, CapsuleResponse, Estilo } from '../types'

export const sugerirOutfits = (estilo: Estilo) =>
  client.get<SugerenciaOutfit[]>('/api/outfits/sugerir', { params: { estilo } })

export const sugerirOutfitsAvanzado = (request: SugerirRequest) =>
  client.post<OutfitSugerido[]>('/api/outfits/sugerir', request)

export const guardarOutfit = (nombre: string, prendaIds: number[], estilo: string) =>
  client.post<Outfit>('/api/outfits/guardar', { nombre, prendaIds, estilo })

export const getOutfits = () =>
  client.get<Outfit[]>('/api/outfits')

export const getCapsule = () =>
  client.get<CapsuleResponse>('/api/outfits/capsule')
