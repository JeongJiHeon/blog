import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { adminApi, servicesApi } from '@/lib/api'
import type { ServiceListItem } from '@/types'

export function ServicesManagePage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [services, setServices] = useState<ServiceListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchServices = () => {
    setIsLoading(true)
    adminApi
      .getAllServices(currentPage, 10)
      .then((response) => {
        setServices(response.items)
        setTotalPages(response.total_pages)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchServices()
  }, [currentPage])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.services.confirmDelete', '이 서비스를 삭제하시겠습니까?'))) return

    try {
      await servicesApi.delete(id)
      fetchServices()
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
        <h1 className="text-2xl font-semibold">{t('admin.services.title', 'Services')}</h1>
        <Link to="/admin/services/new">
          <Button className="gap-2">
            <Plus size={16} />
            {t('admin.services.new', 'New Service')}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-24" size="lg" />
      ) : services.length > 0 ? (
        <>
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {service.is_published ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-muted-foreground" />
                        )}
                        {service.is_featured && (
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        )}
                        <h3 className="font-semibold truncate">{service.title_ko}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {service.description_ko}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link to={`/admin/services/${service.id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(service.id)}
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
          {t('common.noData', '데이터가 없습니다.')}
        </div>
      )}
    </div>
  )
}
