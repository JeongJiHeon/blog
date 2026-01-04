import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { getLocalizedField, type Language } from '@/lib/utils'
import type { ServiceListItem } from '@/types'
import * as LucideIcons from 'lucide-react'

interface ServicePreviewSectionProps {
  services: ServiceListItem[]
  lang: Language
  isLoading?: boolean
}

export function ServicePreviewSection({
  services,
  lang,
  isLoading,
}: ServicePreviewSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section id="services" className="section-padding bg-card border-t border-border">
      <div className="container">
        <div ref={ref} className={isInView ? 'animate-fade-up' : 'opacity-0'}>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
                Services
              </p>
              <h2 className="text-fluid-3xl font-medium tracking-tight leading-tight">
                전문 행정 서비스
              </h2>
            </div>
            <Link
              to="/service"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 border border-border rounded-lg animate-pulse"
                >
                  <div className="h-6 w-6 bg-muted rounded mb-4" />
                  <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const IconComponent = service.icon
                  ? (LucideIcons as Record<string, LucideIcons.LucideIcon>)[
                      service.icon
                    ]
                  : LucideIcons.FileText
                const title = getLocalizedField(service, 'title', lang)
                const description = getLocalizedField(service, 'description', lang)

                return (
                  <div
                    key={service.id}
                    className="p-6 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    {IconComponent && (
                      <IconComponent
                        size={24}
                        className="mb-4 text-muted-foreground"
                      />
                    )}
                    <h3 className="text-lg font-medium mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {description}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="py-12 text-muted-foreground text-center">
              등록된 서비스가 없습니다.
            </p>
          )}

          <Link
            to="/service"
            className="md:hidden flex items-center justify-center gap-2 mt-8 py-3 border border-border rounded text-sm hover:bg-muted transition-colors"
          >
            View All Services
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
