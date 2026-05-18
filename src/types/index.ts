export interface User {
  id: number
  email: string
  nombre: string
  temporadaColor: string | null
  paletaColores: string[] | null
  coloresEvitar: string[] | null
}

export interface Prenda {
  id: number
  fotoUrl: string
  categoria: string
  colorPrincipal: string
  colorSecundario?: string
  descripcionIa?: string
  temporada?: string
  ocasion?: string
  creadoEn: string
}

export interface OutfitPrenda {
  id: number
  fotoUrl: string
  categoria: string
  colorPrincipal: string
}

export interface Outfit {
  id: number
  nombre: string
  estilo: string
  prendas: OutfitPrenda[]
  creadoEn: string
}

export interface SugerenciaOutfit {
  nombre: string
  prendas: OutfitPrenda[]
  prendaFaltante?: string
  estilo: string
}

export interface AnalisisPrenda {
  fotoUrl: string
  categoria: string
  colorPrincipal: string
  colorSecundario?: string
  descripcionIa: string
  temporada?: string
  ocasion?: string
}

export type Estilo = 'CASUAL' | 'ELEGANTE' | 'DEPORTIVO' | 'TRABAJO' | 'SALIDA_NOCTURNA'

export const CATEGORIAS = [
  'BLUSA', 'CAMISETA', 'CAMISA', 'PANTALON', 'JEAN', 'LEGGINS', 'SHORT',
  'VESTIDO', 'FALDA', 'BLAZER', 'ABRIGO', 'CHAQUETA', 'ZAPATO_TACO',
  'ZAPATO_PLANO', 'BOTA', 'TENIS', 'SANDALIA', 'BOLSO', 'CARTERA',
  'COLLAR', 'ARETES', 'CINTURON', 'OTRO',
] as const

export const ESTILOS: { value: Estilo; label: string }[] = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'ELEGANTE', label: 'Elegante' },
  { value: 'DEPORTIVO', label: 'Deportivo' },
  { value: 'TRABAJO', label: 'Trabajo' },
  { value: 'SALIDA_NOCTURNA', label: 'Salida nocturna' },
]

export const CATEGORIA_LABELS: Record<string, string> = {
  BLUSA: 'Blusa', CAMISETA: 'Camiseta', CAMISA: 'Camisa',
  PANTALON: 'Pantalón', JEAN: 'Jean', LEGGINS: 'Leggings',
  SHORT: 'Short', VESTIDO: 'Vestido', FALDA: 'Falda',
  BLAZER: 'Blazer', ABRIGO: 'Abrigo', CHAQUETA: 'Chaqueta',
  ZAPATO_TACO: 'Zapato de tacón', ZAPATO_PLANO: 'Zapato plano',
  BOTA: 'Bota', TENIS: 'Tenis', SANDALIA: 'Sandalia',
  BOLSO: 'Bolso', CARTERA: 'Cartera', COLLAR: 'Collar',
  ARETES: 'Aretes', CINTURON: 'Cinturón', OTRO: 'Otro',
}

export const FILTROS_CATEGORIA = [
  { value: '', label: 'Todo' },
  { value: 'BLUSA,CAMISETA,CAMISA', label: 'Tops' },
  { value: 'PANTALON,JEAN,LEGGINS,SHORT', label: 'Pantalones' },
  { value: 'VESTIDO,FALDA', label: 'Vestidos' },
  { value: 'ZAPATO_TACO,ZAPATO_PLANO,BOTA,TENIS,SANDALIA', label: 'Zapatos' },
  { value: 'BOLSO,CARTERA,COLLAR,ARETES,CINTURON', label: 'Accesorios' },
]
