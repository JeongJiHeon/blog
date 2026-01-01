import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PostCard } from '@/components/posts/PostCard'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi } from '@/lib/api'
import type { PostListItem } from '@/types'

export function PostsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<PostListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    setIsLoading(true)
    postsApi
      .getList(currentPage, 9)
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
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">{t('posts.title')}</h1>

      {isLoading ? (
        <LoadingSpinner className="py-24" size="lg" />
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-muted-foreground py-24">
          {t('posts.empty')}
        </p>
      )}
    </div>
  )
}
