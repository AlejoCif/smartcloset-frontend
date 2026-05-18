import client from './client'
import type { AnalisisPrenda, Prenda } from '../types'

export const analizarPrenda = (foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<AnalisisPrenda>('/api/prendas/analizar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const confirmarPrenda = (
  fotoUrl: string,
  data: {
    categoria: string
    colorPrincipal: string
    colorSecundario?: string
    descripcionIa?: string
    temporada?: string
    ocasion?: string
  }
) => client.post<Prenda>(`/api/prendas/confirmar?fotoUrl=${encodeURIComponent(fotoUrl)}`, data)

export const getPrendas = (categoria?: string) =>
  client.get<Prenda[]>('/api/prendas', { params: categoria ? { categoria } : undefined })

export const deletePrenda = (id: number) =>
  client.delete(`/api/prendas/${id}`)
