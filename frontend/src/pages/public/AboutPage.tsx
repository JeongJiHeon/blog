import { useTranslation } from 'react-i18next'
import { Clock, MapPin, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-lg text-muted-foreground mb-8">{t('about.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                {t('about.hours.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>{t('about.hours.weekday')}</p>
              <p>{t('about.hours.saturday')}</p>
              <p>{t('about.hours.sunday')}</p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-primary" size={20} />
                {t('about.location.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{t('about.location.address')}</p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="text-primary" size={20} />
                {t('about.contact.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>044-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@sejong-admin.kr</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map placeholder */}
        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
              {/* TODO: Add actual map integration (Google Maps, Kakao Map, etc.) */}
              <p>Map Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
