import { useInView } from '@/hooks/useInView'
import { FileCheck, UserPlus, RefreshCw, FileText, Scale, Globe } from 'lucide-react'

const services = [
  {
    icon: FileCheck,
    title: '비자 연장',
    titleEn: 'Visa Extension',
    description: '각종 비자(D-2, D-4, E-7 등) 연장 신청을 대행합니다. 서류 준비부터 접수까지 원스톱 서비스를 제공합니다.',
  },
  {
    icon: UserPlus,
    title: '외국인 등록',
    titleEn: 'Foreigner Registration',
    description: '외국인등록증 신규 발급 및 재발급 업무를 처리합니다. 분실, 훼손, 정보 변경 시 신속하게 대응합니다.',
  },
  {
    icon: RefreshCw,
    title: '체류자격 변경',
    titleEn: 'Status Change',
    description: '유학에서 취업, 결혼 등 체류자격 변경 신청을 도와드립니다. 복잡한 요건을 명확하게 안내합니다.',
  },
  {
    icon: FileText,
    title: '귀화 신청',
    titleEn: 'Naturalization',
    description: '대한민국 국적 취득을 위한 귀화 신청 절차를 안내하고 대행합니다.',
  },
  {
    icon: Scale,
    title: '영주권 신청',
    titleEn: 'Permanent Residency',
    description: 'F-5 영주권 취득을 위한 자격 검토 및 신청 대행 서비스를 제공합니다.',
  },
  {
    icon: Globe,
    title: '기타 행정 업무',
    titleEn: 'Other Services',
    description: '초청장 발급, 출입국 관련 민원 등 기타 행정 업무를 지원합니다.',
  },
]

export function ServiceSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section id="services" className="section-padding bg-card border-t border-border">
      <div className="container">
        <div
          ref={ref}
          className={isInView ? 'animate-fade-up' : 'opacity-0'}
        >
          <div className="max-w-xl mb-16">
            <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
              Services
            </p>
            <h2 className="text-fluid-3xl font-medium tracking-tight leading-tight">
              전문 행정 서비스
            </h2>
          </div>

          <div className="space-y-0">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-border first:border-t-0 hover:bg-muted/30 transition-colors -mx-6 px-6"
                >
                  <div className="md:col-span-1 flex items-start">
                    <Icon size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="text-fluid-lg font-medium">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.titleEn}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
