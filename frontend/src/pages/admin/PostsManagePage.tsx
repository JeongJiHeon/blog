import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { adminApi, postsApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { PostListItem } from '@/types'

export function PostsManagePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [searchParams, setSearchParams] = useSearchParams()

  const [posts, setPosts] = useState<PostListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchPosts = () => {
    setIsLoading(true)
    adminApi
      .getAllPosts(currentPage, 10)
      .then((response) => {
        setPosts(response.items)
        setTotalPages(response.total_pages)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.posts.confirmDelete'))) return

    try {
      await postsApi.delete(id)
      fetchPosts()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('admin.posts.title')}</h1>
        <Link to="/admin/posts/new">
          <Button className="gap-2">
            <Plus size={16} />
            {t('admin.posts.new')}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-24" size="lg" />
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.is_public ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-muted-foreground" />
                        )}
                        <h3 className="font-semibold truncate">{post.title_ko}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(post.created_at, lang)} · {post.view_count}{' '}
                        {t('posts.views')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link to={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          {t('common.noData')}
        </div>
      )}
    </div>
  )
}
