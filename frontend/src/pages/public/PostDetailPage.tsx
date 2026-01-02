import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
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
      <div className="section-padding">
        <div className="container">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="section-padding">
        <div className="container">
          <p className="text-muted-foreground mb-6">{error || t('common.error')}</p>
          <Link
            to="/posts"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" />
            {t('common.back')}
          </Link>
        </div>
      </div>
    )
  }

  const title = getLocalizedField(post, 'title', lang)
  const content = getLocalizedField(post, 'content', lang)

  return (
    <article className="section-padding">
      <div className="container">
        <div className="max-w-3xl">
          <Link
            to="/posts"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={14} className="mr-2" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <p className="text-sm text-muted-foreground mb-4">
              {formatDate(post.created_at, lang)}
            </p>
            <h1 className="text-fluid-3xl font-medium tracking-tight leading-tight">
              {title}
            </h1>
          </header>

          {post.thumbnail_url && (
            <div className="aspect-video mb-12 bg-muted overflow-hidden">
              <img
                src={post.thumbnail_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
            {content.split('\n').map((paragraph, index) =>
              paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
