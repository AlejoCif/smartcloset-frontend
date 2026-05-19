import client from './client'
import type { InspirationImage, InspirationAnalisisResponse } from '../types'

export const buscarInspiracion = (q: string, num = 9) =>
  client.get<InspirationImage[]>('/api/inspiration', { params: { q, num } })

export const analizarInspiracion = (imageUrl: string) =>
  client.post<InspirationAnalisisResponse>('/api/inspiration/analizar', { imageUrl })
