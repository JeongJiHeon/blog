import { useInView } from '@/hooks/useInView'

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="container">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 ${
            isInView ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          {/* Left column - heading */}
          <div>
            <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
              About Us
            </p>
            <h2 className="text-fluid-3xl font-medium tracking-tight leading-tight">
              전문성과 신뢰를 바탕으로<br />
              함께 성장합니다
            </h2>
          </div>

          {/* Right column - content */}
          <div className="space-y-6">
            <p className="text-fluid-base text-muted-foreground leading-relaxed">
              세종 행정사무소는 2010년 설립 이래, 외국인 고객분들께 전문적이고
              신뢰할 수 있는 행정 서비스를 제공해 왔습니다. 복잡한 행정 절차를
              간소화하고, 고객의 시간과 노력을 절약해 드립니다.
            </p>
            <p className="text-fluid-base text-muted-foreground leading-relaxed">
              다년간의 경험과 전문 지식을 바탕으로, 비자 연장, 체류자격 변경,
              외국인등록 등 다양한 행정 업무를 신속하고 정확하게 처리해 드립니다.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
              <div>
                <p className="text-fluid-2xl font-medium">14+</p>
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-fluid-2xl font-medium">5,000+</p>
                <p className="text-sm text-muted-foreground mt-1">Cases Handled</p>
              </div>
              <div>
                <p className="text-fluid-2xl font-medium">98%</p>
                <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
