import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ServiceCard } from '@/components/services/ServiceCard'
import { servicesApi } from '@/lib/api'
import type { Language } from '@/lib/utils'
import type { ServiceListItem } from '@/types'

export function ServicePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [services, setServices] = useState<ServiceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    servicesApi
      .getList(1, 50)
      .then((response) => {
        setServices(response.items)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="section-padding">
      <div className="container">
        <div className="max-w-3xl mb-16">
          <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
            Services
          </p>
          <h1 className="text-fluid-3xl font-medium tracking-tight">
            {t('services.title', '전문 행정 서비스')}
          </h1>
          <p className="text-muted-foreground mt-4">
            {t(
              'services.description',
              '세종행정사사무소에서 제공하는 전문 행정 서비스를 확인하세요.'
            )}
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-16" size="lg" />
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-muted-foreground">
            {t('services.empty', '등록된 서비스가 없습니다.')}
          </p>
        )}
      </div>
    </div>
  )
}
