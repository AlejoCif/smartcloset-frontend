import client from './client'
import type { Outfit, SugerenciaOutfit, Estilo } from '../types'

export const sugerirOutfits = (estilo: Estilo) =>
  client.get<SugerenciaOutfit[]>('/api/outfits/sugerir', { params: { estilo } })

export const guardarOutfit = (nombre: string, prendaIds: number[], estilo: string) =>
  client.post<Outfit>('/api/outfits/guardar', { nombre, prendaIds, estilo })

export const getOutfits = () =>
  client.get<Outfit[]>('/api/outfits')
