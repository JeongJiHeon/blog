import { getLocalizedField, type Language } from '@/lib/utils'
import type { ServiceListItem } from '@/types'
import * as LucideIcons from 'lucide-react'

interface ServiceCardProps {
  service: ServiceListItem
  lang: Language
}

export function ServiceCard({ service, lang }: ServiceCardProps) {
  const title = getLocalizedField(service, 'title', lang)
  const description = getLocalizedField(service, 'description', lang)

  // Dynamic icon loading from lucide-react
  const IconComponent = service.icon
    ? (LucideIcons as Record<string, LucideIcons.LucideIcon>)[service.icon]
    : LucideIcons.FileText

  return (
    <div className="p-6 border border-border rounded-lg hover:bg-muted/30 transition-colors">
      {IconComponent && (
        <IconComponent size={24} className="mb-4 text-muted-foreground" />
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
    </div>
  )
}
