import axios from 'axios'

// En dev: vacío → el proxy de Vite redirige /api → localhost:8080
// En producción: VITE_API_URL apunta al backend en Railway
const rawUrl = import.meta.env.VITE_API_URL ?? ''
const baseURL = rawUrl && !rawUrl.startsWith('http') ? `https://${rawUrl}` : rawUrl

const client = axios.create({
  baseURL,
  timeout: 30000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
