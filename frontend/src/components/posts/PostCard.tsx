import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { getLocalizedField, formatDate, truncateText, type Language } from '@/lib/utils'
import type { PostListItem } from '@/types'

interface PostCardProps {
  post: PostListItem
}

export function PostCard({ post }: PostCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  const title = getLocalizedField(post, 'title', lang)

  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-sm transition-shadow">
        <div className="aspect-video bg-muted overflow-hidden">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors">
            {truncateText(title, 60)}
          </h3>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDate(post.created_at, lang)}</span>
          <span>{post.view_count} {t('posts.views')}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
