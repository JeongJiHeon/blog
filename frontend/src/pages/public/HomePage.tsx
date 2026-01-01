import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, FileCheck, UserPlus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard } from '@/components/posts/PostCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi } from '@/lib/api'
import type { PostListItem } from '@/types'

export function HomePage() {
  const { t } = useTranslation()
  const [recentPosts, setRecentPosts] = useState<PostListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    postsApi
      .getList(1, 3)
      .then((response) => {
        setRecentPosts(response.items)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const services = [
    {
      icon: FileCheck,
      title: t('home.services.visa.title'),
      description: t('home.services.visa.description'),
    },
    {
      icon: UserPlus,
      title: t('home.services.registration.title'),
      description: t('home.services.registration.description'),
    },
    {
      icon: RefreshCw,
      title: t('home.services.change.title'),
      description: t('home.services.change.description'),
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 whitespace-pre-line max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <Link to="/contact">
            <Button size="lg" className="gap-2">
              {t('home.hero.cta')}
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('home.services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t('home.recentPosts')}</h2>
            <Link to="/posts">
              <Button variant="outline" className="gap-2">
                {t('posts.readMore')}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {t('posts.empty')}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
