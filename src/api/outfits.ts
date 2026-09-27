import client from './client'
import type { SugerenciaOutfit, OutfitSugerido, OutfitGuardado, SugerirRequest, CapsuleResponse, Estilo, AnalizarLookResponse } from '../types'

const rawUrl = import.meta.env.VITE_API_URL ?? ''
const streamBaseURL = rawUrl && !rawUrl.startsWith('http') ? `https://${rawUrl}` : rawUrl

export const sugerirOutfitsStream = async (
  request: SugerirRequest,
  onOutfit: (outfit: OutfitSugerido) => void,
  onDone: () => void,
  onError: (message: string) => void,
  signal?: AbortSignal
): Promise<void> => {
  const token = localStorage.getItem('token')
  const profileId = localStorage.getItem('activeProfileId')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (profileId) headers['X-Profile-Id'] = profileId

  const response = await fetch(`${streamBaseURL}/api/outfits/sugerir/stream`, {
    method: 'POST', headers, body: JSON.stringify(request), signal,
  })

  if (!response.ok) {
    if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; return }
    throw new Error(`HTTP ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''
    for (const event of events) {
      let eventName = '', data = ''
      for (const line of event.split('\n')) {
        if (line.startsWith('event: ')) eventName = line.slice(7).trim()
        if (line.startsWith('data: ')) data = line.slice(6)
      }
      if (!data) continue
      if (eventName === 'outfit') { try { onOutfit(JSON.parse(data) as OutfitSugerido) } catch { /* malformed */ } }
      else if (eventName === 'done') onDone()
      else if (eventName === 'error') { try { onError((JSON.parse(data) as { message: string }).message) } catch { onError('Error desconocido') } }
    }
  }
}

export const sugerirOutfits = (estilo: Estilo) =>
  client.get<SugerenciaOutfit[]>('/api/outfits/sugerir', { params: { estilo } })

export const sugerirOutfitsAvanzado = (request: SugerirRequest) =>
  client.post<OutfitSugerido[]>('/api/outfits/sugerir', request, { timeout: 90000 })

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
