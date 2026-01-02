import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServiceSection } from '@/components/sections/ServiceSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { InquirySection } from '@/components/sections/InquirySection'

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <BlogSection />
      <InquirySection />
    </main>
  )
}
