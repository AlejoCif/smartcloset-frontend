import client from './client'
import type { AnalizarCompraResponse } from '../types'

export const analizarCompra = (foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<AnalizarCompraResponse>('/api/compras/analizar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const chatCompra = (fotoUrl: string, mensaje: string) =>
  client.post<{ respuesta: string }>('/api/compras/chat', { fotoUrl, mensaje })

export const descartarCompra = (publicId: string) =>
  client.delete('/api/compras/descartar', { data: { publicId } })
