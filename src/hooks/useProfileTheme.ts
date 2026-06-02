import { useProfile } from '../context/ProfileContext'

// adult | baby-{boy|girl|neutral} | child-{boy|girl|neutral}
export type ThemeMode =
  | 'adult'
  | 'baby-boy' | 'baby-girl' | 'baby-neutral'
  | 'child-boy' | 'child-girl' | 'child-neutral'

export interface ThemeColors {
  bg: string
  accent: string
  primary: string
  surface: string
  tabActive: string
}

export function isBabyTheme(m: ThemeMode)  { return m.startsWith('baby') }
export function isChildTheme(m: ThemeMode) { return m.startsWith('child') }
export function isKidTheme(m: ThemeMode)   { return m !== 'adult' }

export function useProfileTheme(): ThemeMode {
  const { activeProfile } = useProfile()
  if (!activeProfile || activeProfile.tipo === 'ADULTO') return 'adult'

  const isBaby  = activeProfile.edad == null || activeProfile.edad <= 1
  const genero  = (activeProfile as { genero?: string }).genero ?? 'NEUTRO'
  const suffix  = genero === 'MASCULINO' ? 'boy' : genero === 'FEMENINO' ? 'girl' : 'neutral'

  return isBaby ? (`baby-${suffix}` as ThemeMode) : (`child-${suffix}` as ThemeMode)
}

export function getThemeColors(mode: ThemeMode): ThemeColors {
  switch (mode) {
    case 'baby-boy':     return { bg: '#EEF7FF', accent: '#5BA4CF', primary: '#1A3A5C', surface: '#C8E4F5', tabActive: '#3A7EAB' }
    case 'baby-girl':    return { bg: '#FFF5FA', accent: '#F06292', primary: '#6B2A4E', surface: '#FFD6E8', tabActive: '#C2185B' }
    case 'baby-neutral': return { bg: '#FFFDF0', accent: '#FFB74D', primary: '#5D4A10', surface: '#FFF3C4', tabActive: '#E65100' }
    case 'child-boy':    return { bg: '#EFF8FF', accent: '#42A5F5', primary: '#0D2B4E', surface: '#BBDEFB', tabActive: '#1976D2' }
    case 'child-girl':   return { bg: '#FBF0FF', accent: '#BA68C8', primary: '#4A1A5C', surface: '#E1BEE7', tabActive: '#7B1FA2' }
    case 'child-neutral':return { bg: '#F2FFF5', accent: '#66BB6A', primary: '#1B4A25', surface: '#C8E6C9', tabActive: '#388E3C' }
    default:             return { bg: '#FAF7F2', accent: '#C4956A', primary: '#4A3420', surface: '#F2EBE0', tabActive: '#3D2B1F' }
  }
}

export function getThemeEmojis(mode: ThemeMode): string[] {
  switch (mode) {
    case 'baby-boy':     return ['☁️','🐋','☁️','🦆','☁️','🐳','🐻','☁️','🦆','🐋']
    case 'baby-girl':    return ['🌸','🦋','🌺','🌸','🦋','🌸','🌺','🦋','🌸','🌺']
    case 'baby-neutral': return ['🦆','🐻','🦆','🐰','🌟','🦆','🐻','🐰','🦆','🐻']
    case 'child-boy':    return ['⭐','🚀','⚽','⭐','🎮','🚀','⭐','⚽','🌟','🚀']
    case 'child-girl':   return ['🌟','🌈','🦋','🌟','💜','🌈','🌟','🦋','🌈','🌟']
    case 'child-neutral':return ['⭐','🌈','🎨','⭐','🌟','🌈','⭐','🎨','🌟','🌈']
    default:             return []
  }
}

// Título y subtítulo para el header de cada página
export function getThemeHeader(mode: ThemeMode, nombre?: string | null) {
  const n = nombre ?? (isBabyTheme(mode) ? 'bebé' : 'niño/a')
  switch (mode) {
    case 'baby-boy':     return { emoji: '🍼', title: `Look de ${n}`, sub: `Outfits perfectos para ${n} 🐋`, headerEmoji: '👶' }
    case 'baby-girl':    return { emoji: '🍼', title: `Look de ${n}`, sub: `Outfits perfectos para ${n} 🌸`, headerEmoji: '👶' }
    case 'baby-neutral': return { emoji: '🍼', title: `Look de ${n}`, sub: `Outfits perfectos para ${n} 🦆`, headerEmoji: '👶' }
    case 'child-boy':    return { emoji: '⚽', title: `¡Looks de ${n}!`, sub: '¡La IA crea outfits súper chidos para ti! 🚀', headerEmoji: '👦' }
    case 'child-girl':   return { emoji: '🌟', title: `¡Looks de ${n}!`, sub: '¡La IA crea outfits súper chidos para ti! 🌈', headerEmoji: '👧' }
    case 'child-neutral':return { emoji: '✨', title: `¡Looks de ${n}!`, sub: '¡La IA crea outfits súper chidos para ti! 🌈', headerEmoji: '🧒' }
    default:             return { emoji: '✦', title: 'Outfits', sub: 'Tu IA personal crea looks únicos con tu ropa y tu estilo.', headerEmoji: '👤' }
  }
}
