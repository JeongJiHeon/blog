import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Lock, User, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { contactsApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { ContactDetail } from '@/types'

export function ContactDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const lang = i18n.language as Language

  const [contact, setContact] = useState<ContactDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    if (!id) return

    setIsLoading(true)
    contactsApi
      .getById(parseInt(id, 10))
      .then((data) => {
        setContact(data)
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          setNeedsPassword(true)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      const data = await contactsApi.verifyPassword(parseInt(id, 10), password)
      setContact(data)
      setNeedsPassword(false)
      setPasswordError(false)
    } catch {
      setPasswordError(true)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (needsPassword) {
    return (
      <div className="container py-12 max-w-md">
        <Link
          to="/contact"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          {t('common.back')}
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              {t('contact.list.secret')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('contact.detail.enterPassword')}
                  className={passwordError ? 'border-destructive' : ''}
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">
                    {t('admin.login.error')}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {t('contact.detail.verify')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground mb-4">{t('common.error')}</p>
        <Link to="/contact">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <Link
        to="/contact"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back')}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('contact.title')}</CardTitle>
            {contact.is_secret && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Lock size={14} />
                {t('contact.list.secret')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(contact.created_at, lang)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <span className="font-medium">{contact.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground" />
              <span>{contact.contact}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-muted-foreground" />
              <span className="font-medium">{t('contact.form.message')}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>

          {contact.admin_reply && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">{t('contact.detail.reply')}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {contact.replied_at && formatDate(contact.replied_at, lang)}
              </p>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg whitespace-pre-wrap">
                {contact.admin_reply}
              </div>
            </div>
          )}

          {!contact.admin_reply && (
            <div className="border-t pt-6 text-center text-muted-foreground">
              <p>{t('contact.detail.noReply')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
