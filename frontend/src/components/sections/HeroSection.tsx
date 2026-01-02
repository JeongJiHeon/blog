import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  const { t } = useTranslation()

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="min-h-[90vh] flex flex-col justify-center relative"
    >
      <div className="container">
        <div className="max-w-4xl">
          <p className="text-fluid-sm text-muted-foreground mb-4 tracking-wide uppercase">
            Sejong Administrative Office
          </p>
          <h1 className="text-fluid-5xl font-medium tracking-tight leading-[1.1] mb-6">
            {t('site.name')}
          </h1>
          <p className="text-fluid-lg text-muted-foreground max-w-xl leading-relaxed">
            외국인 등록, 비자 연장, 체류자격 변경 등 전문적인 행정 서비스를 제공합니다.
            신뢰할 수 있는 파트너로서 함께하겠습니다.
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to about section"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </button>

      {/* Subtle decorative element */}
      <div className="absolute top-1/4 right-[10%] w-32 h-32 border border-border/50 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute bottom-1/3 right-[15%] w-16 h-16 border border-border/50 opacity-20 hidden lg:block" />
    </section>
  )
}
