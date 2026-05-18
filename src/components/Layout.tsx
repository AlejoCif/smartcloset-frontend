import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
  title?: string
  headerRight?: ReactNode
}

export default function Layout({ children, title, headerRight }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {title && (
        <header className="sticky top-0 z-30 bg-background border-b border-surface px-5 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-light text-primary tracking-wide">{title}</h1>
          {headerRight && <div>{headerRight}</div>}
        </header>
      )}
      <main className="flex-1 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
