import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, MessageSquare, Eye, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { adminApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { DashboardData } from '@/types'

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingSpinner className="py-24" size="lg" />
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        {t('common.error')}
      </div>
    )
  }

  const stats = [
    {
      label: t('admin.dashboard.stats.totalPosts'),
      value: data.stats.total_posts,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: t('admin.dashboard.stats.publicPosts'),
      value: data.stats.public_posts,
      icon: Eye,
      color: 'text-green-600',
    },
    {
      label: t('admin.dashboard.stats.totalContacts'),
      value: data.stats.total_contacts,
      icon: MessageSquare,
      color: 'text-purple-600',
    },
    {
      label: t('admin.dashboard.stats.unrepliedContacts'),
      value: data.stats.unreplied_contacts,
      icon: AlertCircle,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('admin.dashboard.recentPosts')}</CardTitle>
              <Link
                to="/admin/posts"
                className="text-sm text-primary hover:underline"
              >
                {t('posts.readMore')}
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recent_posts.length > 0 ? (
              <div className="space-y-3">
                {data.recent_posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/admin/posts/${post.id}/edit`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{post.title_ko}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.is_public
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.is_public ? t('admin.posts.public') : t('admin.posts.private')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.created_at, lang)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('common.noData')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('admin.dashboard.recentContacts')}</CardTitle>
              <Link
                to="/admin/contacts"
                className="text-sm text-primary hover:underline"
              >
                {t('posts.readMore')}
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recent_contacts.length > 0 ? (
              <div className="space-y-3">
                {data.recent_contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    to="/admin/contacts"
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contact.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          contact.admin_reply
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {contact.admin_reply
                          ? t('contact.list.replied')
                          : t('contact.list.waiting')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.message}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('common.noData')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
