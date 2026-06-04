export interface User {
  id: number
  email: string
  nombre: string
  fotoUrl: string | null
  temporadaColor: string | null
  paletaColores: string[] | null
  coloresEvitar: string[] | null
  tonosFavoritos: string[] | null
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
  prendaAnclaId?: number
  considerarColorimetria?: boolean
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

export interface OutfitMetadata {
  score: number
  scoreRazon: string
  razonamiento: string
  explicacion?: {
    color: string
    silueta: string
    ocasion: string
    temporada: string
    mejoras?: string
  }
  armoniaColor?: {
    colorScore: number
    colorReason: string
    coloresDominantes: string[]
    coloresNeutros: string[]
    coloresAcento: string[]
  }
  warnings: string[]
  prendaFaltante?: string
  estiloClimatico?: string
}

export interface OutfitGuardado {
  id: number
  nombre: string
  prendas: OutfitPrenda[]
  estilo: string
  metadata?: OutfitMetadata
  createdAt: string
}

export interface MiOutfitItem {
  id: number
  fotoUrl: string
  calificacion: number
  resumen: string
  puntosPositivos: string[]
  sugerencias: string[]
  createdAt: string
}

export interface AnalizarCompraResponse {
  fotoUrl: string
  veredicto: 'NECESARIO' | 'UTIL' | 'INNECESARIO' | 'NO_RECOMENDADO'
  titulo: string
  explicacion: string
  prendaSimilarId?: number
  prendaSimilarUrl?: string
  consejo: string
}

export interface InspirationImage {
  imageUrl: string
  thumbnailUrl: string
  titulo: string
  fuente: string
  sourceUrl: string
}

export interface InspirationAnalisisResponse {
  descripcionLook: string
  prendaIds: number[]
  prendas: OutfitPrenda[]
  similitud: number
  consejo: string
}

export interface AnalizarLookResponse {
  calificacion: number
  resumen: string
  puntosPositivos: string[]
  sugerencias: string[]
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
  'VESTIDO', 'FALDA', 'FALDA_CORTA', 'FALDA_LARGA', 'BLAZER', 'ABRIGO', 'CHAQUETA', 'SACO',
  'ZAPATO_TACO', 'ZAPATO_PLANO', 'BOTA', 'TENIS', 'SANDALIA', 'BOLSO', 'CARTERA',
  'COLLAR', 'ARETES', 'BALACA', 'TURBANTE', 'CINTURON', 'OTRO',
] as const

export const CATEGORIAS_BEBE = [
  'MAMELUCO', 'BODY', 'PETO', 'CONJUNTO',
  'VESTIDO', 'CHAQUETA', 'ABRIGO', 'SACO',
  'ZAPATITO', 'SANDALIA',
  'GORRO', 'MEDIAS', 'BABERO', 'BALACA', 'TURBANTE', 'PIJAMA', 'OTRO',
] as const

export const CATEGORIAS_NINO = [
  'CAMISETA', 'PANTALON', 'JEAN', 'SHORT', 'LEGGINS',
  'VESTIDO', 'FALDA', 'PETO', 'CONJUNTO',
  'CHAQUETA', 'ABRIGO', 'SACO',
  'TENIS', 'SANDALIA', 'BOTA',
  'GORRO', 'MEDIAS', 'BALACA', 'TURBANTE', 'PIJAMA', 'MOCHILA',
  'DISFRAZ', 'UNIFORME', 'OTRO',
] as const

export const ESTILOS: { value: Estilo; label: string }[] = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'ELEGANTE', label: 'Elegante' },
  { value: 'DEPORTIVO', label: 'Deportivo' },
  { value: 'TRABAJO', label: 'Trabajo' },
  { value: 'SALIDA_NOCTURNA', label: 'Salida nocturna' },
]

export const CATEGORIA_LABELS: Record<string, string> = {
  // Adulto
  BLUSA: 'Blusa', CAMISETA: 'Camiseta', CAMISA: 'Camisa',
  PANTALON: 'Pantalón', JEAN: 'Jean', LEGGINS: 'Leggings',
  SHORT: 'Short', VESTIDO: 'Vestido', FALDA: 'Falda',
  FALDA_CORTA: 'Falda corta', FALDA_LARGA: 'Falda larga',
  BLAZER: 'Blazer', ABRIGO: 'Abrigo', CHAQUETA: 'Chaqueta', SACO: 'Saco',
  ZAPATO_TACO: 'Zapato de tacón', ZAPATO_PLANO: 'Zapato plano',
  BOTA: 'Bota', TENIS: 'Tenis', SANDALIA: 'Sandalia',
  BOLSO: 'Bolso', CARTERA: 'Cartera', COLLAR: 'Collar',
  ARETES: 'Aretes', BALACA: 'Balaca', TURBANTE: 'Turbante', CINTURON: 'Cinturón',
  // Bebé
  MAMELUCO: 'Mameluco', BODY: 'Body', PELELE: 'Pelele',
  ZAPATITO: 'Zapatito', BABERO: 'Babero',
  // Bebé y niño
  PETO: 'Peto', CONJUNTO: 'Conjunto',
  GORRO: 'Gorro', MEDIAS: 'Medias', PIJAMA: 'Pijama',
  // Niño
  MOCHILA: 'Mochila', DISFRAZ: 'Disfraz', UNIFORME: 'Uniforme',
  OTRO: 'Otro',
}

export const FILTROS_CATEGORIA = [
  { value: '', label: 'Todo' },
  { value: 'BLUSA,CAMISETA,CAMISA', label: 'Tops' },
  { value: 'PANTALON,JEAN,LEGGINS,SHORT', label: 'Pantalones' },
  { value: 'VESTIDO,FALDA,FALDA_CORTA,FALDA_LARGA', label: 'Vestidos y faldas' },
  { value: 'ZAPATO_TACO,ZAPATO_PLANO,BOTA,TENIS,SANDALIA', label: 'Zapatos' },
  { value: 'BOLSO,CARTERA,COLLAR,ARETES,BALACA,TURBANTE,CINTURON', label: 'Accesorios' },
]

export const FILTROS_CATEGORIA_BEBE = [
  { value: '', label: 'Todo' },
  { value: 'MAMELUCO,BODY,PETO,CONJUNTO', label: 'Enterizos' },
  { value: 'VESTIDO,CHAQUETA,ABRIGO,SACO', label: 'Prendas' },
  { value: 'ZAPATITO,SANDALIA', label: 'Calzado' },
  { value: 'GORRO,MEDIAS,BABERO,BALACA,TURBANTE', label: 'Accesorios' },
  { value: 'PIJAMA', label: 'Dormir' },
]

export const FILTROS_CATEGORIA_NINO = [
  { value: '', label: 'Todo' },
  { value: 'CAMISETA,PANTALON,JEAN,SHORT,LEGGINS', label: 'Ropa' },
  { value: 'VESTIDO,FALDA,PETO,CONJUNTO', label: 'Conjuntos' },
  { value: 'CHAQUETA,ABRIGO,SACO', label: 'Abrigos' },
  { value: 'TENIS,SANDALIA,BOTA', label: 'Calzado' },
  { value: 'GORRO,MEDIAS,MOCHILA,BALACA,TURBANTE', label: 'Accesorios' },
]

// ── Secciones de categorías para selectores con separadores ──

export interface CategoriaSeccion {
  label: string
  items: readonly string[]
}

export const SECCIONES_ADULTO: CategoriaSeccion[] = [
  { label: 'Ropa', items: ['BLUSA', 'CAMISETA', 'CAMISA', 'PANTALON', 'JEAN', 'LEGGINS', 'SHORT', 'VESTIDO', 'FALDA', 'FALDA_CORTA', 'FALDA_LARGA', 'BLAZER', 'ABRIGO', 'CHAQUETA', 'SACO'] },
  { label: 'Calzado', items: ['ZAPATO_TACO', 'ZAPATO_PLANO', 'BOTA', 'TENIS', 'SANDALIA'] },
  { label: 'Bolsos', items: ['BOLSO', 'CARTERA'] },
  { label: 'Accesorios', items: ['COLLAR', 'ARETES', 'BALACA', 'TURBANTE', 'CINTURON'] },
  { label: 'Otro', items: ['OTRO'] },
]

export const SECCIONES_BEBE: CategoriaSeccion[] = [
  { label: 'Ropa', items: ['MAMELUCO', 'BODY', 'PETO', 'CONJUNTO', 'VESTIDO'] },
  { label: 'Abrigos', items: ['CHAQUETA', 'ABRIGO', 'SACO'] },
  { label: 'Calzado', items: ['ZAPATITO', 'SANDALIA'] },
  { label: 'Accesorios', items: ['GORRO', 'MEDIAS', 'BABERO', 'BALACA', 'TURBANTE'] },
  { label: 'Dormir', items: ['PIJAMA'] },
  { label: 'Otro', items: ['OTRO'] },
]

export const SECCIONES_NINO: CategoriaSeccion[] = [
  { label: 'Ropa', items: ['CAMISETA', 'PANTALON', 'JEAN', 'SHORT', 'LEGGINS', 'VESTIDO', 'FALDA', 'PETO', 'CONJUNTO'] },
  { label: 'Abrigos', items: ['CHAQUETA', 'ABRIGO', 'SACO'] },
  { label: 'Calzado', items: ['TENIS', 'SANDALIA', 'BOTA'] },
  { label: 'Accesorios', items: ['GORRO', 'MEDIAS', 'BALACA', 'TURBANTE', 'MOCHILA'] },
  { label: 'Otro', items: ['DISFRAZ', 'UNIFORME', 'PIJAMA', 'OTRO'] },
]
