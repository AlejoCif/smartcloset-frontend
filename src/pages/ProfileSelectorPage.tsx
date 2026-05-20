import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { createProfile } from '../api/profiles'
import type { Profile } from '../api/profiles'

function ProfileAvatar({ profile, size = 80, onClick }: { profile: Profile; size?: number; onClick?: () => void }) {
  const isKid = profile.tipo === 'NINO'
  const emoji = isKid ? '👧' : '👤'

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.3)',
        backgroundColor: isKid ? 'rgba(196,149,106,0.3)' : 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {profile.fotoUrl
          ? <img src={profile.fotoUrl} alt={profile.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: size * 0.45 }}>{emoji}</span>
        }
      </div>
      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {profile.nombre}
      </p>
      {profile.tipo === 'NINO' && profile.edad && (
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '-6px 0 0' }}>
          {profile.edad} años
        </p>
      )}
    </button>
  )
}

function CreateProfileModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Profile) => void }) {
  const [nombre,  setNombre]  = useState('')
  const [tipo,    setTipo]    = useState<'ADULTO' | 'NINO'>('ADULTO')
  const [edad,    setEdad]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleCrear = async () => {
    if (!nombre.trim()) { setError('Escribe un nombre'); return }
    setLoading(true)
    try {
      const res = await createProfile(nombre.trim(), tipo, edad ? parseInt(edad) : undefined)
      onCreated(res.data)
    } catch {
      setError('No pudimos crear el perfil. Intenta de nuevo.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 32px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '24px', padding: '28px 24px' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '36px', height: '4px', backgroundColor: '#E0D5C8', borderRadius: '2px', margin: '0 auto 20px' }} />
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#1A1A1A', textAlign: 'center', margin: '0 0 20px' }}>Nuevo perfil</h3>

        {/* Tipo */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {(['ADULTO', 'NINO'] as const).map(t => (
            <button key={t} onClick={() => setTipo(t)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `2px solid ${tipo === t ? '#C4956A' : '#E0D5C8'}`, backgroundColor: tipo === t ? 'rgba(196,149,106,0.08)' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '24px' }}>{t === 'ADULTO' ? '👤' : '👧'}</span>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: tipo === t ? '#C4956A' : '#4A3420' }}>{t === 'ADULTO' ? 'Adulta' : 'Niña / Niño'}</span>
            </button>
          ))}
        </div>

        {/* Nombre */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Nombre</p>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder={tipo === 'ADULTO' ? 'María' : 'Sofía'} style={{ width: '100%', border: '1.5px solid #E0D5C8', borderRadius: '12px', padding: '12px 14px', fontFamily: 'Jost, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Edad (solo niños) */}
        {tipo === 'NINO' && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 600, color: '#9E9690', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Edad</p>

            {/* Selector rápido bebé / niño */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {[
                { label: '👶 Bebé', sub: '0–11 meses', val: '0' },
                { label: '🧒 Niño/a', sub: '1–17 años', val: '' },
              ].map(op => (
                <button key={op.label} type="button"
                  onClick={() => setEdad(op.val)}
                  style={{ flex: 1, padding: '10px 6px', borderRadius: '10px', border: `1.5px solid ${edad === op.val ? '#C4956A' : '#E0D5C8'}`, backgroundColor: edad === op.val ? 'rgba(196,149,106,0.08)' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '18px' }}>{op.label.split(' ')[0]}</span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 500, color: edad === op.val ? '#C4956A' : '#4A3420' }}>{op.label.split(' ')[1]}</span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: '#9E9690' }}>{op.sub}</span>
                </button>
              ))}
            </div>

            {/* Input numérico solo si eligió "Niño/a" */}
            {edad !== '0' && (
              <div>
                <input
                  type="number" min="1" max="17"
                  value={edad}
                  onChange={e => setEdad(e.target.value)}
                  placeholder="Ej: 8"
                  style={{ width: '100%', border: '1.5px solid #E0D5C8', borderRadius: '12px', padding: '12px 14px', fontFamily: 'Jost, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#9E9690', margin: '5px 0 0', textAlign: 'center' }}>
                  ¿Tiene menos de 1 año? Selecciona 👶 Bebé arriba
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#E05555', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}

        <button onClick={handleCrear} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: '#C4956A', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creando...' : 'Crear perfil'}
        </button>
      </div>
    </div>
  )
}

export default function ProfileSelectorPage() {
  const navigate  = useNavigate()
  const { profiles, setActiveProfile, setProfiles } = useProfile()
  const [showCreate, setShowCreate] = useState(false)

  const handleSeleccionar = (profile: Profile) => {
    setActiveProfile(profile)
    navigate('/home', { replace: true })
  }

  const handleCreado = (p: Profile) => {
    const updated = [...profiles, p]
    setProfiles(updated)
    setShowCreate(false)
    setActiveProfile(p)
    navigate('/home', { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #1C0F08 0%, #3D2B1F 50%, #2A1810 100%)',
      padding: '32px 24px',
    }}>
      {showCreate && <CreateProfileModal onClose={() => setShowCreate(false)} onCreated={handleCreado} />}

      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300, color: '#fff', margin: '0 0 6px', lineHeight: 1 }}>
          Smart<span style={{ fontStyle: 'italic', color: '#C4956A' }}>Closet</span>
        </h1>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.1em' }}>
          ¿Quién se viste hoy?
        </p>
      </div>

      {/* Perfiles */}
      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        {profiles.map(p => (
          <ProfileAvatar key={p.id} profile={p} size={88} onClick={() => handleSeleccionar(p)} />
        ))}

        {/* Agregar perfil */}
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Agregar
          </p>
        </button>
      </div>

      {/* Gestionar perfiles */}
      <button
        onClick={() => navigate('/perfil')}
        style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
      >
        Gestionar perfiles
      </button>
    </div>
  )
}
