import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('site.name')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('site.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('about.hours.title')}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('about.hours.weekday')}</p>
              <p>{t('about.hours.saturday')}</p>
              <p>{t('about.hours.sunday')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('about.contact.title')}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('about.contact.phone')}</p>
              <p>{t('about.contact.email')}</p>
              <p className="pt-2">{t('about.location.address')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('site.name')}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
