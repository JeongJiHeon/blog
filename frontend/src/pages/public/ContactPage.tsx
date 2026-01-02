import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { contactsApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { Contact, ContactCreate } from '@/types'

export function ContactPage() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const lang = i18n.language as Language

  const [contacts, setContacts] = useState<Contact[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState<ContactCreate>({
    name: '',
    contact: '',
    message: '',
    is_secret: false,
    secret_password: '',
  })

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchContacts = () => {
    contactsApi
      .getList(currentPage, 10)
      .then((response) => {
        setContacts(response.items)
        setTotalPages(response.total_pages)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchContacts()
  }, [currentPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await contactsApi.create(formData)
      setSubmitSuccess(true)
      setFormData({
        name: '',
        contact: '',
        message: '',
        is_secret: false,
        secret_password: '',
      })
      fetchContacts()
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch {
      alert(t('contact.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
  }

  return (
    <div className="section-padding">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Form */}
          <div>
            <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
              Inquiry
            </p>
            <h1 className="text-fluid-3xl font-medium tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-muted-foreground mb-10">
              {t('contact.subtitle')}
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-muted text-foreground rounded text-sm">
                {t('contact.success')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('contact.form.name')} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('contact.form.namePlaceholder')}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contact" className="text-sm font-medium">
                  {t('contact.form.contact')} *
                </Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder={t('contact.form.contactPlaceholder')}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  {t('contact.form.message')} *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  required
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="secret"
                  checked={formData.is_secret}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_secret: checked as boolean })
                  }
                />
                <Label htmlFor="secret" className="text-sm cursor-pointer">
                  {t('contact.form.secret')}
                </Label>
              </div>

              {formData.is_secret && (
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('contact.form.secretPassword')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.secret_password}
                    onChange={(e) =>
                      setFormData({ ...formData, secret_password: e.target.value })
                    }
                    placeholder={t('contact.form.secretPasswordPlaceholder')}
                    className="mt-2"
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </Button>
            </form>
          </div>

          {/* Right column - List */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-8">
              {t('contact.list.title')}
            </h2>

            {isLoading ? (
              <LoadingSpinner className="py-12" />
            ) : contacts.length > 0 ? (
              <>
                <div className="space-y-0">
                  {contacts.map((contact) => (
                    <Link
                      key={contact.id}
                      to={`/contact/${contact.id}`}
                      className="group flex items-center justify-between py-4 border-t border-border hover:bg-muted/30 transition-colors -mx-4 px-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {contact.is_secret && (
                          <Lock size={14} className="text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate">{contact.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          contact.has_reply
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {contact.has_reply ? t('contact.list.replied') : t('contact.list.waiting')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(contact.created_at, lang)}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <p className="py-12 text-muted-foreground">
                {t('contact.list.empty')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
