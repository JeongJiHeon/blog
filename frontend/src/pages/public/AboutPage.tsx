import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="section-padding">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column */}
          <div>
            <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
              About
            </p>
            <h1 className="text-fluid-3xl font-medium tracking-tight leading-tight mb-8">
              {t('about.title')}
            </h1>
            <p className="text-fluid-base text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4">
                {t('about.hours.title')}
              </h2>
              <div className="text-muted-foreground space-y-2">
                <p>{t('about.hours.weekday')}</p>
                <p>{t('about.hours.saturday')}</p>
                <p>{t('about.hours.sunday')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4">
                {t('about.location.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('about.location.address')}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4">
                {t('about.contact.title')}
              </h2>
              <div className="text-muted-foreground space-y-2">
                <p>044-123-4567</p>
                <p>info@sejong-admin.kr</p>
              </div>
            </section>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-20 pt-20 border-t border-border">
          <div className="aspect-[21/9] bg-muted flex items-center justify-center text-muted-foreground text-sm">
            Map
          </div>
        </div>
      </div>
    </div>
  )
}
