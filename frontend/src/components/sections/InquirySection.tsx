import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useInView } from '@/hooks/useInView'
import { contactsApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { Contact, ContactCreate } from '@/types'

export function InquirySection() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const { ref, isInView } = useInView({ threshold: 0.1 })

  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState<ContactCreate>({
    name: '',
    contact: '',
    message: '',
    is_secret: false,
    secret_password: '',
  })

  useEffect(() => {
    contactsApi
      .getList(1, 5)
      .then((response) => {
        setContacts(response.items)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

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
      // Refresh list
      const response = await contactsApi.getList(1, 5)
      setContacts(response.items)
      setTimeout(() => {
        setSubmitSuccess(false)
        setIsModalOpen(false)
      }, 2000)
    } catch {
      alert(t('contact.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section id="inquiry" className="section-padding bg-card border-t border-border">
        <div className="container">
          <div
            ref={ref}
            className={isInView ? 'animate-fade-up' : 'opacity-0'}
          >
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-fluid-sm text-muted-foreground mb-3 tracking-wide uppercase">
                  Inquiry
                </p>
                <h2 className="text-fluid-3xl font-medium tracking-tight leading-tight">
                  문의하기
                </h2>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:flex"
              >
                문의 작성
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-4 border-t border-border animate-pulse">
                    <div className="h-4 w-32 bg-muted rounded mb-2" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : contacts.length > 0 ? (
              <div className="space-y-0">
                {contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    to={`/contact/${contact.id}`}
                    className="group flex items-center justify-between py-4 border-t border-border hover:bg-muted/30 transition-colors -mx-6 px-6"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {contact.is_secret && (
                        <Lock size={14} className="text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="font-medium truncate">{contact.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        contact.has_reply
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {contact.has_reply ? '답변완료' : '대기중'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground flex-shrink-0 ml-4">
                      {formatDate(contact.created_at, lang)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-12 text-muted-foreground">
                {t('contact.list.empty')}
              </p>
            )}

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View All Inquiries
              </Link>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden"
              >
                문의 작성
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-background border border-border rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-xl font-medium">문의하기</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {submitSuccess ? (
                <div className="py-12 text-center">
                  <p className="text-lg font-medium mb-2">문의가 접수되었습니다</p>
                  <p className="text-muted-foreground">빠른 시일 내에 답변 드리겠습니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="modal-name" className="text-sm font-medium">
                      이름 *
                    </Label>
                    <Input
                      id="modal-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="이름을 입력하세요"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="modal-contact" className="text-sm font-medium">
                      연락처 *
                    </Label>
                    <Input
                      id="modal-contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="전화번호 또는 이메일"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="modal-message" className="text-sm font-medium">
                      문의 내용 *
                    </Label>
                    <Textarea
                      id="modal-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="문의 내용을 입력하세요"
                      rows={5}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modal-secret"
                      checked={formData.is_secret}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_secret: checked as boolean })
                      }
                    />
                    <Label htmlFor="modal-secret" className="text-sm cursor-pointer">
                      비밀글로 작성
                    </Label>
                  </div>

                  {formData.is_secret && (
                    <div>
                      <Label htmlFor="modal-password" className="text-sm font-medium">
                        비밀번호
                      </Label>
                      <Input
                        id="modal-password"
                        type="password"
                        value={formData.secret_password}
                        onChange={(e) =>
                          setFormData({ ...formData, secret_password: e.target.value })
                        }
                        placeholder="비밀글 열람용 비밀번호"
                        className="mt-2"
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? '전송 중...' : '문의하기'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
