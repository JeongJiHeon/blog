import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { KakaoFloatingButton } from '@/components/common/KakaoFloatingButton'

interface LayoutProps {
  children: ReactNode
  showKakaoButton?: boolean
}

export function Layout({ children, showKakaoButton = true }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${!isHomePage ? 'pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
      {showKakaoButton && <KakaoFloatingButton />}
    </div>
  )
}
