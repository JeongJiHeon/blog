import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, Calendar } from 'lucide-react'
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
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="aspect-video bg-muted overflow-hidden">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl text-primary/30">📄</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {truncateText(title, 60)}
          </h3>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.created_at, lang)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{post.view_count} {t('posts.views')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
