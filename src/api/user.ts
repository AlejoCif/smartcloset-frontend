import client from './client'
import type { User } from '../types'

export const getPerfil = () =>
  client.get<User>('/api/user/perfil')

export const analizarColorimetria = (foto: File) => {
  const form = new FormData()
  form.append('foto', foto)
  return client.post<User>('/api/user/colorimetria', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const consultarColor = (pregunta: string) =>
  client.post<{ compatible: boolean; colorNombre: string; respuesta: string }>('/api/user/consultar-color', { pregunta })

export const agregarApaleta = (color: string) =>
  client.post<{ yaExiste: boolean; perfil: import('../types').User }>('/api/user/paleta/agregar', { color })

export const guardarTonosFavoritos = (tonos: string[]) =>
  client.post<import('../types').User>('/api/user/tonos-favoritos', { tonos })
