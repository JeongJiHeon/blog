import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/posts', label: t('nav.posts') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/about', label: t('nav.about') },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">{t('site.name')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          <Link to="/admin/login">
            <Button variant="outline" size="sm">
              {t('nav.admin')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t flex items-center justify-between">
              <LanguageSwitcher />
              <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm">
                  {t('nav.admin')}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
