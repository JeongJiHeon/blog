import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi } from '@/lib/api'
import type { PostCreate, Post } from '@/types'

export function PostEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<PostCreate>({
    title_ko: '',
    title_en: '',
    title_zh: '',
    content_ko: '',
    content_en: '',
    content_zh: '',
    thumbnail_url: '',
    is_public: true,
  })

  useEffect(() => {
    if (id) {
      // Fetch existing post for editing
      postsApi
        .getById(parseInt(id, 10))
        .then((post: Post) => {
          setFormData({
            title_ko: post.title_ko,
            title_en: post.title_en || '',
            title_zh: post.title_zh || '',
            content_ko: post.content_ko,
            content_en: post.content_en || '',
            content_zh: post.content_zh || '',
            thumbnail_url: post.thumbnail_url || '',
            is_public: post.is_public,
          })
        })
        .catch(() => {
          navigate('/admin/posts')
        })
        .finally(() => setIsLoading(false))
    }
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing && id) {
        await postsApi.update(parseInt(id, 10), formData)
      } else {
        await postsApi.create(formData)
      }
      navigate('/admin/posts')
    } catch (error) {
      console.error(error)
      alert(t('common.error'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner className="py-24" size="lg" />
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/posts"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? t('admin.posts.edit') : t('admin.posts.create')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Korean */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">한국어</h3>
              <div>
                <Label htmlFor="title_ko">제목 *</Label>
                <Input
                  id="title_ko"
                  value={formData.title_ko}
                  onChange={(e) =>
                    setFormData({ ...formData, title_ko: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="content_ko">내용 *</Label>
                <Textarea
                  id="content_ko"
                  value={formData.content_ko}
                  onChange={(e) =>
                    setFormData({ ...formData, content_ko: e.target.value })
                  }
                  rows={8}
                  required
                />
              </div>
            </div>

            {/* English */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">English</h3>
              <div>
                <Label htmlFor="title_en">Title</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="content_en">Content</Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) =>
                    setFormData({ ...formData, content_en: e.target.value })
                  }
                  rows={8}
                />
              </div>
            </div>

            {/* Chinese */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">中文</h3>
              <div>
                <Label htmlFor="title_zh">标题</Label>
                <Input
                  id="title_zh"
                  value={formData.title_zh}
                  onChange={(e) =>
                    setFormData({ ...formData, title_zh: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="content_zh">内容</Label>
                <Textarea
                  id="content_zh"
                  value={formData.content_zh}
                  onChange={(e) =>
                    setFormData({ ...formData, content_zh: e.target.value })
                  }
                  rows={8}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            {/* Public */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_public: checked as boolean })
                }
              />
              <Label htmlFor="is_public" className="cursor-pointer">
                {t('admin.posts.public')}
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t('common.loading') : t('common.save')}
              </Button>
              <Link to="/admin/posts">
                <Button type="button" variant="outline">
                  {t('common.cancel')}
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
