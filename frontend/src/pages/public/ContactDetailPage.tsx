import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      <div className="container py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (needsPassword) {
    return (
      <div className="container py-10 md:py-16">
        <div className="max-w-sm">
          <Link
            to="/contact"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={14} className="mr-1" />
            {t('common.back')}
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-muted-foreground" />
            <h1 className="text-lg font-medium">{t('contact.list.secret')}</h1>
          </div>

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
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="container py-16">
        <p className="text-muted-foreground mb-4">{t('common.error')}</p>
        <Link to="/contact" className="text-primary hover:underline">
          {t('common.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-2xl">
        <Link
          to="/contact"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={14} className="mr-1" />
          {t('common.back')}
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-medium">{contact.name}</h1>
            {contact.is_secret && (
              <Lock size={14} className="text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {contact.contact} &middot; {formatDate(contact.created_at, lang)}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            {t('contact.form.message')}
          </h2>
          <div className="p-4 bg-muted rounded whitespace-pre-wrap">
            {contact.message}
          </div>
        </div>

        {contact.admin_reply ? (
          <div className="pt-6 border-t">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              {t('contact.detail.reply')}
              {contact.replied_at && (
                <span className="ml-2 font-normal">
                  {formatDate(contact.replied_at, lang)}
                </span>
              )}
            </h2>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded whitespace-pre-wrap">
              {contact.admin_reply}
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t text-muted-foreground">
            <p>{t('contact.detail.noReply')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
