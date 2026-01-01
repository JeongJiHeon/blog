import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.title')}</CardTitle>
            <p className="text-muted-foreground">{t('contact.subtitle')}</p>
          </CardHeader>
          <CardContent>
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                {t('contact.success')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('contact.form.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('contact.form.namePlaceholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact">{t('contact.form.contact')}</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder={t('contact.form.contactPlaceholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">{t('contact.form.message')}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  required
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
                <Label htmlFor="secret" className="cursor-pointer">
                  {t('contact.form.secret')}
                </Label>
              </div>

              {formData.is_secret && (
                <div>
                  <Label htmlFor="password">{t('contact.form.secretPassword')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.secret_password}
                    onChange={(e) =>
                      setFormData({ ...formData, secret_password: e.target.value })
                    }
                    placeholder={t('contact.form.secretPasswordPlaceholder')}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('contact.list.title')}</h2>

          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : contacts.length > 0 ? (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <Link
                  key={contact.id}
                  to={`/contact/${contact.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {contact.is_secret && (
                            <Lock size={14} className="text-muted-foreground" />
                          )}
                          <span className="font-medium">{contact.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {contact.has_reply ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle size={14} />
                              {t('contact.list.replied')}
                            </span>
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock size={14} />
                              {t('contact.list.waiting')}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(contact.created_at, lang)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {t('contact.list.empty')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
