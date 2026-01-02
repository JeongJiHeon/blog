import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getLocalizedField, formatDate, type Language } from '@/lib/utils'
import type { PostListItem as PostListItemType } from '@/types'

interface PostListItemProps {
  post: PostListItemType
}

export function PostListItem({ post }: PostListItemProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as Language

  const title = getLocalizedField(post, 'title', lang)

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex items-center justify-between py-3 px-2 -mx-2 rounded hover:bg-muted/50 transition-colors group"
    >
      <span className="text-foreground group-hover:text-primary transition-colors truncate mr-4">
        {title}
      </span>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(post.created_at, lang)}
      </span>
    </Link>
  )
}
