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

// ── Tipos nuevos para outfits avanzados ──────────────────

export interface ClimaInput {
  temperatura?: number
  condicion?: string
  ciudad?: string
}

export interface EventoInput {
  nombreEvento?: string
  descripcion?: string
  fecha?: string
  hora?: string
  lugar?: string
  nivelFormalidad?: string
}

export interface SugerirRequest {
  estilo: Estilo
  limit?: number
  clima?: ClimaInput
  evento?: EventoInput
  useMultimodal?: boolean
  prendaIdsExcluir?: number[]
  prendaAnclaId?: number;
}

export interface GrupoVisual {
  parteSuperior: OutfitPrenda[]
  parteInferior: OutfitPrenda[]
  calzado: OutfitPrenda[]
  abrigo: OutfitPrenda[]
  accesorios: OutfitPrenda[]
  bolso: OutfitPrenda[]
  opcionales: OutfitPrenda[]
}

export interface ExplicacionOutfit {
  color: string
  silueta: string
  ocasion: string
  temporada: string
  mejoras?: string
}

export interface ArmoniaColor {
  colorScore: number
  colorReason: string
  coloresDominantes: string[]
  coloresNeutros: string[]
  coloresAcento: string[]
}

export interface OutfitSugerido {
  nombre: string
  prendaIds: number[]
  prendas: OutfitPrenda[]
  grupoVisual: GrupoVisual
  score: number
  scoreRazon: string
  razonamiento: string
  explicacion: ExplicacionOutfit
  armoniaColor: ArmoniaColor
  warnings: string[]
  prendaFaltante?: string
  estiloClimatico?: string
  estilo: string
}

export interface CapsuleResponse {
  prendasEsencialesFaltantes: string[]
  prendasVersatilesIds: number[]
  prendasVersatiles: OutfitPrenda[]
  combinacionesBase: string[]
  coloresQueSeRepiten: string[]
  recomendacionesCompra: string[]
  puntuacionCloset: number
  resumen: string
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
  'VESTIDO', 'FALDA', 'FALDA_CORTA', 'FALDA_LARGA', 'BLAZER', 'ABRIGO', 'CHAQUETA', 'ZAPATO_TACO',
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
  FALDA_CORTA: 'Falda corta', FALDA_LARGA: 'Falda larga',
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
  { value: 'VESTIDO,FALDA,FALDA_CORTA,FALDA_LARGA', label: 'Vestidos y faldas' },
  { value: 'ZAPATO_TACO,ZAPATO_PLANO,BOTA,TENIS,SANDALIA', label: 'Zapatos' },
  { value: 'BOLSO,CARTERA,COLLAR,ARETES,CINTURON', label: 'Accesorios' },
]
