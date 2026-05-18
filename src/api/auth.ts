import client from './client'

export const register = (email: string, password: string, nombre: string) =>
  client.post<{ token: string }>('/api/auth/register', { email, password, nombre })

export const login = (email: string, password: string) =>
  client.post<{ token: string }>('/api/auth/login', { email, password })
