import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo crema -->
  <rect width="1200" height="630" fill="#FAF7F2"/>

  <!-- Línea decorativa izquierda -->
  <rect x="60" y="160" width="3" height="310" fill="#C4956A" opacity="0.5"/>

  <!-- Punto decorativo cobre arriba -->
  <circle cx="100" cy="130" r="6" fill="#C4956A"/>
  <circle cx="120" cy="130" r="4" fill="#C4956A" opacity="0.5"/>
  <circle cx="136" cy="130" r="3" fill="#C4956A" opacity="0.3"/>

  <!-- Círculo decorativo fondo derecha -->
  <circle cx="980" cy="315" r="280" fill="#C4956A" opacity="0.05"/>
  <circle cx="980" cy="315" r="180" fill="#C4956A" opacity="0.05"/>

  <!-- Ícono percha (decorativo, derecha) -->
  <g transform="translate(840, 180) scale(3.2)" opacity="0.12" fill="none" stroke="#C4956A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  </g>

  <!-- Separador horizontal decorativo -->
  <line x1="90" y1="235" x2="340" y2="235" stroke="#D4BFA4" stroke-width="1.5"/>

  <!-- "Smart" — Cormorant Garamond aproximado con Georgia -->
  <text x="90" y="330"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="120"
    font-weight="400"
    fill="#4A3420"
    letter-spacing="-2">Smart</text>

  <!-- "Closet" en cursiva -->
  <text x="90" y="450"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="120"
    font-style="italic"
    font-weight="400"
    fill="#C4956A"
    letter-spacing="-2">Closet</text>

  <!-- Separador debajo del título -->
  <line x1="90" y1="478" x2="680" y2="478" stroke="#D4BFA4" stroke-width="1.5"/>

  <!-- Subtítulo -->
  <text x="90" y="530"
    font-family="Arial, Helvetica, sans-serif"
    font-size="32"
    font-weight="300"
    fill="#9E9690"
    letter-spacing="4">Tu guardarropa inteligente ✦</text>

  <!-- URL discreta abajo derecha -->
  <text x="1110" y="600"
    font-family="Arial, Helvetica, sans-serif"
    font-size="20"
    font-weight="300"
    fill="#C4956A"
    opacity="0.6"
    text-anchor="end">smartcloset.fashion</text>
</svg>
`

const outPath = resolve(__dirname, '../public/og-image.jpg')

await sharp(Buffer.from(svg))
  .jpeg({ quality: 95 })
  .toFile(outPath)

console.log('✓ og-image.jpg generada en /public/og-image.jpg')
