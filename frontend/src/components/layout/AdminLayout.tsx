import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Briefcase,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation()
  const { admin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { path: '/admin/dashboard', label: t('admin.dashboard.title'), icon: LayoutDashboard },
    { path: '/admin/services', label: t('admin.services.title', 'Services'), icon: Briefcase },
    { path: '/admin/posts', label: t('admin.posts.title'), icon: FileText },
    { path: '/admin/contacts', label: t('admin.contacts.title'), icon: MessageSquare },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span className="font-semibold">{t('nav.admin')}</span>
        <div className="w-6" />
      </header>

      <div className="flex">
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-background border-r transition-transform lg:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to="/admin/dashboard" className="font-semibold text-primary">
              {t('nav.admin')}
            </Link>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <div className="mb-4 text-sm text-muted-foreground">
              {admin?.username}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              {t('admin.logout')}
            </Button>
            <Link to="/" className="block mt-2">
              <Button variant="ghost" size="sm" className="w-full">
                {t('nav.home')}
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
