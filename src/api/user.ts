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
