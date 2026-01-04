import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { getLocalizedField, formatDate, type Language } from '@/lib/utils'
import type { PostListItem } from '@/types'

interface BoardPreviewSectionProps {
  posts: PostListItem[]
  lang: Language
  isLoading?: boolean
}

export function BoardPreviewSection({
  posts,
  lang,
  isLoading,
}: BoardPreviewSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section id="board" className="section-padding border-t border-border">
      <div className="container">
        <div ref={ref} className={isInView ? 'animate-fade-up' : 'opacity-0'}>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
                Board
              </p>
              <h2 className="text-fluid-3xl font-medium tracking-tight leading-tight">
                최근 소식
              </h2>
            </div>
            <Link
              to="/board"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-6 border-t border-border animate-pulse">
                  <div className="h-4 w-24 bg-muted rounded mb-3" />
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-0">
              {posts.map((post) => {
                const title = getLocalizedField(post, 'title', lang)
                return (
                  <Link
                    key={post.id}
                    to={`/board/${post.id}`}
                    className="group block py-6 border-t border-border hover:bg-muted/30 transition-colors -mx-6 px-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.created_at, lang)}
                        </p>
                      </div>
                      <div className="md:col-span-10">
                        <h3 className="text-fluid-lg font-medium group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                        <p className="text-muted-foreground mt-1 line-clamp-1">
                          외국인 체류 관련 최신 정보와 안내사항을 확인하세요.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 md:mt-0 md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span className="hidden md:inline">Read</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="py-12 text-muted-foreground text-center">
              등록된 게시글이 없습니다.
            </p>
          )}

          <Link
            to="/board"
            className="md:hidden flex items-center justify-center gap-2 mt-8 py-3 border border-border rounded text-sm hover:bg-muted transition-colors"
          >
            View All Posts
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
