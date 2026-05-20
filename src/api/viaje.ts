import client from './client'

export interface ViajeMessage {
  role: 'user' | 'assistant'
  content: string
}

export const chatViaje = (messages: ViajeMessage[]) =>
  client.post<{ respuesta: string }>('/api/viaje/chat', { messages })
