import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicePreviewSection } from '@/components/sections/ServicePreviewSection'
import { BoardPreviewSection } from '@/components/sections/BoardPreviewSection'
import { InquirySection } from '@/components/sections/InquirySection'
import { homeApi } from '@/lib/api'
import type { HomeData } from '@/types'
import type { Language } from '@/lib/utils'

export function HomePage() {
  const { i18n } = useTranslation()
  const lang = i18n.language as Language
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    homeApi
      .getData()
      .then(setHomeData)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <main>
      <HeroSection />
      <ServicePreviewSection
        services={homeData?.featured_services || []}
        lang={lang}
        isLoading={isLoading}
      />
      <BoardPreviewSection
        posts={homeData?.latest_posts || []}
        lang={lang}
        isLoading={isLoading}
      />
      <InquirySection />
    </main>
  )
}
