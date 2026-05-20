import { useEffect } from 'react'

interface PhotoGuideProps {
  onConfirm: () => void
  onClose: () => void
}

const rules = [
  {
    ok: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
      </svg>
    ),
    title: 'Fondo liso',
    desc: 'Pared blanca, beige o gris. Sin muebles ni objetos detrás.',
  },
  {
    ok: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
    title: 'Prenda extendida',
    desc: 'Cuélgala o extiéndela completamente. Sin doblar ni arrugar.',
  },
  {
    ok: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
    title: 'Luz natural',
    desc: 'Cerca de una ventana con luz de día. Sin flash directo.',
  },
  {
    ok: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
      </svg>
    ),
    title: 'Encuadre completo',
    desc: 'La prenda debe verse entera, sin cortes en los bordes.',
  },
  {
    ok: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: 'Sin filtros',
    desc: 'Foto natural, sin filtros de Instagram ni edición de color.',
  },
  {
    ok: false,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M4.93 4.93l14.14 14.14"/>
      </svg>
    ),
    title: 'Evita sombras',
    desc: 'No pongas la prenda contra luz directa del sol, genera sombras duras.',
  },
]

function GoodExample() {
  return (
    <svg viewBox="0 0 120 150" className="w-full h-full">
      {/* Fondo limpio */}
      <rect width="120" height="150" fill="#F2EBE0" rx="8"/>
      {/* Prenda (camiseta simple) centrada */}
      <g transform="translate(20, 25)">
        {/* Cuerpo */}
        <rect x="15" y="20" width="50" height="55" rx="4" fill="#C4956A" opacity="0.8"/>
        {/* Manga izquierda */}
        <path d="M15 20 L0 35 L10 42 L15 35 Z" fill="#C4956A" opacity="0.8"/>
        {/* Manga derecha */}
        <path d="M65 20 L80 35 L70 42 L65 35 Z" fill="#C4956A" opacity="0.8"/>
        {/* Cuello */}
        <path d="M28 20 Q40 30 52 20" fill="#FAF7F2" stroke="#C4956A" strokeWidth="1" opacity="0.6"/>
      </g>
      {/* Indicador de centrado */}
      <line x1="60" y1="5" x2="60" y2="145" stroke="#6B8F5E" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
      <line x1="5" y1="75" x2="115" y2="75" stroke="#6B8F5E" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
    </svg>
  )
}

function BadExample() {
  return (
    <svg viewBox="0 0 120 150" className="w-full h-full">
      {/* Fondo desordenado */}
      <rect width="120" height="150" fill="#E8E0D8" rx="8"/>
      {/* Líneas de fondo (muebles/desorden) */}
      <line x1="0" y1="110" x2="120" y2="110" stroke="#B0A090" strokeWidth="8"/>
      <rect x="70" y="60" width="60" height="90" fill="#C8B8A8" opacity="0.5"/>
      <rect x="0" y="80" width="40" height="70" fill="#B8A898" opacity="0.4"/>
      {/* Prenda cortada y arrugada */}
      <g transform="translate(10, 10)">
        <rect x="15" y="20" width="50" height="55" rx="4" fill="#9E9690" opacity="0.7"/>
        <path d="M15 20 L0 35 L10 42 L15 35 Z" fill="#9E9690" opacity="0.7"/>
        {/* Cortada arriba (fuera del encuadre) */}
        <rect x="10" y="0" width="60" height="25" fill="#E8E0D8"/>
        {/* Arrugas */}
        <line x1="20" y1="35" x2="55" y2="38" stroke="#7A6E68" strokeWidth="1" opacity="0.5"/>
        <line x1="22" y1="45" x2="58" y2="42" stroke="#7A6E68" strokeWidth="1" opacity="0.5"/>
      </g>
      {/* Sombra dura */}
      <ellipse cx="55" cy="130" rx="30" ry="8" fill="#8A7A6A" opacity="0.3"/>
    </svg>
  )
}

export default function PhotoGuide({ onConfirm, onClose }: PhotoGuideProps) {
  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'rgba(74,52,32,0.5)' }}>
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        className="relative mt-auto rounded-t-3xl overflow-y-auto"
        style={{ backgroundColor: '#FAF7F2', maxHeight: '92vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D4BFA4' }} />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-2 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="font-display text-[1.8rem] font-light leading-tight" style={{ color: '#4A3420' }}>
              Cómo tomar la<br /><span className="italic">foto perfecta</span>
            </h2>
            <p className="font-body text-xs mt-2 leading-snug" style={{ color: '#9E9690' }}>
              Sigue estos pasos para que nuestra IA reconozca tu prenda correctamente
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#F2EBE0', color: '#9E9690' }}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Reglas */}
        <div className="px-6 pt-2 pb-4 flex flex-col gap-3">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: '#F2EBE0' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: rule.ok ? 'rgba(107,143,94,0.12)' : 'rgba(196,97,74,0.10)',
                  color: rule.ok ? '#6B8F5E' : '#C4614A',
                }}
              >
                {rule.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-body font-semibold" style={{ color: rule.ok ? '#6B8F5E' : '#C4614A' }}>
                    {rule.ok ? '✅' : '❌'}
                  </span>
                  <p className="font-body text-sm font-semibold" style={{ color: '#4A3420' }}>
                    {rule.title}
                  </p>
                </div>
                <p className="font-body text-xs leading-snug" style={{ color: '#9E9690' }}>
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ejemplos visuales */}
        <div className="px-6 pb-4">
          <p className="font-body text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: '#9E9690' }}>
            Ejemplos
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #6B8F5E' }}>
              <div className="h-36">
                <GoodExample />
              </div>
              <div className="px-3 py-2" style={{ backgroundColor: 'rgba(107,143,94,0.08)' }}>
                <p className="font-body text-xs font-semibold text-center" style={{ color: '#6B8F5E' }}>
                  Así sí ✅
                </p>
                <p className="font-body text-[10px] text-center mt-0.5" style={{ color: '#6B8F5E' }}>
                  Fondo limpio, prenda completa
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #C4614A' }}>
              <div className="h-36">
                <BadExample />
              </div>
              <div className="px-3 py-2" style={{ backgroundColor: 'rgba(196,97,74,0.06)' }}>
                <p className="font-body text-xs font-semibold text-center" style={{ color: '#C4614A' }}>
                  Así no ❌
                </p>
                <p className="font-body text-[10px] text-center mt-0.5" style={{ color: '#C4614A' }}>
                  Fondo sucio, prenda cortada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-10 pt-2">
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-xl font-body font-medium text-sm tracking-wide transition-opacity active:opacity-80"
            style={{ backgroundColor: '#C4956A', color: '#fff' }}
          >
            Entendido, subir foto
          </button>
        </div>
      </div>
    </div>
  )
}
