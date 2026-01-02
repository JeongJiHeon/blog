import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi } from '@/lib/api'
import { getLocalizedField, formatDate, type Language } from '@/lib/utils'
import type { PostListItem } from '@/types'

export function PostsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<PostListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    setIsLoading(true)
    postsApi
      .getList(currentPage, 10)
      .then((response) => {
        setPosts(response.items)
        setTotalPages(response.total_pages)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="section-padding">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-fluid-3xl font-medium tracking-tight mb-16">
            {t('posts.title')}
          </h1>

          {isLoading ? (
            <LoadingSpinner className="py-16" size="lg" />
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-0">
                {posts.map((post) => {
                  const title = getLocalizedField(post, 'title', lang)
                  return (
                    <Link
                      key={post.id}
                      to={`/posts/${post.id}`}
                      className="group flex items-center justify-between py-6 border-t border-border hover:bg-muted/30 transition-colors -mx-6 px-6"
                    >
                      <div className="flex-1 min-w-0 mr-8">
                        <p className="text-sm text-muted-foreground mb-1">
                          {formatDate(post.created_at, lang)}
                        </p>
                        <h2 className="text-fluid-lg font-medium group-hover:text-primary transition-colors truncate">
                          {title}
                        </h2>
                      </div>
                      <ArrowRight
                        size={18}
                        className="flex-shrink-0 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  )
                })}
              </div>

              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <p className="py-16 text-muted-foreground">
              {t('posts.empty')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
