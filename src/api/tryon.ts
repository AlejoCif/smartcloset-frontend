import client from './client'

export function tryOn(personImageBase64: string, garmentImageUrl: string, garmentDescription: string) {
  return client.post<{ resultImageUrl: string }>('/api/tryon', {
    personImageBase64,
    garmentImageUrl,
    garmentDescription,
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
