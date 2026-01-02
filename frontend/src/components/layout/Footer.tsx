import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="footer" className="section-padding-sm border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-5">
            <Link to="/" className="text-lg font-medium tracking-tight">
              {t('site.name')}
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
              외국인 등록, 비자 연장, 체류자격 변경 등 전문적인 행정 서비스를 제공합니다.
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium mb-4">Contact</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>044-123-4567</p>
              <p>info@sejong-admin.kr</p>
            </div>
          </div>

          {/* Hours */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium mb-4">Hours</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Mon-Fri: 09-18</p>
              <p>Sat: 10-14</p>
              <p>Sun: Closed</p>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium mb-4">Location</h4>
            <p className="text-sm text-muted-foreground">
              세종시 조치원읍<br />
              행정중심로 123
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('site.name')}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  )
}
