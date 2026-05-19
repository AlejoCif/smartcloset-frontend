import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  title?: string
  headerRight?: ReactNode
}

function HomeButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      className="p-2 -mr-1 text-primary/40 hover:text-primary transition-colors"
      aria-label="Inicio"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    </button>
  )
}

export default function Layout({ children, title, headerRight }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {title && (
        <header className="sticky top-0 z-30 bg-background border-b border-surface px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HomeButton />
            <h1 className="font-display text-2xl font-light text-primary tracking-wide">{title}</h1>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </header>
      )}
      <main className="flex-1 pb-8">
        {children}
      </main>
    </div>
  )
}
