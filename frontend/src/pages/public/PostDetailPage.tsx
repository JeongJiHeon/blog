import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Calendar, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi } from '@/lib/api'
import { getLocalizedField, formatDate, type Language } from '@/lib/utils'
import type { Post } from '@/types'

export function PostDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lang = i18n.language as Language

  useEffect(() => {
    if (!id) return

    setIsLoading(true)
    postsApi
      .getById(parseInt(id, 10))
      .then((data) => {
        setPost(data)
      })
      .catch(() => {
        setError(t('common.error'))
      })
      .finally(() => setIsLoading(false))
  }, [id, t])

  if (isLoading) {
    return (
      <div className="container py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground mb-4">{error || t('common.error')}</p>
        <Link to="/posts">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
    )
  }

  const title = getLocalizedField(post, 'title', lang)
  const content = getLocalizedField(post, 'content', lang)

  return (
    <article className="container py-8 md:py-12 max-w-4xl">
      <Link to="/posts" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back')}
      </Link>

      {post.thumbnail_url && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-muted">
          <img
            src={post.thumbnail_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.created_at, lang)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{post.view_count} {t('posts.views')}</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate max-w-none">
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
