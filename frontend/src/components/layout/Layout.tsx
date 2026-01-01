import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { KakaoFloatingButton } from '@/components/common/KakaoFloatingButton'

interface LayoutProps {
  children: ReactNode
  showKakaoButton?: boolean
}

export function Layout({ children, showKakaoButton = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {showKakaoButton && <KakaoFloatingButton />}
    </div>
  )
}
