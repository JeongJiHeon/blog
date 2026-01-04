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
import { servicesApi } from '@/lib/api'
import type { ServiceCreate, Service } from '@/types'

const ICON_OPTIONS = [
  'FileCheck',
  'UserPlus',
  'RefreshCw',
  'FileText',
  'Scale',
  'Globe',
  'Briefcase',
  'Building',
  'Users',
  'Shield',
  'Key',
  'Award',
]

export function ServiceEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ServiceCreate>({
    title_ko: '',
    title_en: '',
    title_zh: '',
    description_ko: '',
    description_en: '',
    description_zh: '',
    icon: 'FileText',
    is_published: true,
    is_featured: false,
    order: 0,
  })

  useEffect(() => {
    if (id) {
      servicesApi
        .getById(parseInt(id, 10))
        .then((service: Service) => {
          setFormData({
            title_ko: service.title_ko,
            title_en: service.title_en || '',
            title_zh: service.title_zh || '',
            description_ko: service.description_ko,
            description_en: service.description_en || '',
            description_zh: service.description_zh || '',
            icon: service.icon || 'FileText',
            is_published: service.is_published,
            is_featured: service.is_featured,
            order: service.order,
          })
        })
        .catch(() => {
          navigate('/admin/services')
        })
        .finally(() => setIsLoading(false))
    }
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing && id) {
        await servicesApi.update(parseInt(id, 10), formData)
      } else {
        await servicesApi.create(formData)
      }
      navigate('/admin/services')
    } catch (error) {
      console.error(error)
      alert(t('common.error', '오류가 발생했습니다.'))
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
        to="/admin/services"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back', '뒤로')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing
              ? t('admin.services.edit', 'Edit Service')
              : t('admin.services.create', 'New Service')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Korean */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">한국어</h3>
              <div>
                <Label htmlFor="title_ko">서비스명 *</Label>
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
                <Label htmlFor="description_ko">설명 *</Label>
                <Textarea
                  id="description_ko"
                  value={formData.description_ko}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ko: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* English */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">English</h3>
              <div>
                <Label htmlFor="title_en">Service Name</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description_en">Description</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* Chinese */}
            <div className="space-y-4">
              <h3 className="font-medium text-base text-muted-foreground">中文</h3>
              <div>
                <Label htmlFor="title_zh">服务名称</Label>
                <Input
                  id="title_zh"
                  value={formData.title_zh}
                  onChange={(e) =>
                    setFormData({ ...formData, title_zh: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description_zh">描述</Label>
                <Textarea
                  id="description_zh"
                  value={formData.description_zh}
                  onChange={(e) =>
                    setFormData({ ...formData, description_zh: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* Icon */}
            <div>
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                }
                min={0}
              />
            </div>

            {/* Published */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_published: checked as boolean })
                }
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                {t('admin.services.published', 'Published')}
              </Label>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked as boolean })
                }
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                {t('admin.services.featured', 'Featured on Home')}
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t('common.loading', 'Loading...') : t('common.save', 'Save')}
              </Button>
              <Link to="/admin/services">
                <Button type="button" variant="outline">
                  {t('common.cancel', 'Cancel')}
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
