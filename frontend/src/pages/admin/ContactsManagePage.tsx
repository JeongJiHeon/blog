import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Trash2, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/common/Pagination'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { adminApi } from '@/lib/api'
import { formatDate, type Language } from '@/lib/utils'
import type { ContactDetail } from '@/types'

export function ContactsManagePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [searchParams, setSearchParams] = useSearchParams()

  const [contacts, setContacts] = useState<ContactDetail[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactDetail | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyIsPublic, setReplyIsPublic] = useState(true)
  const [isReplying, setIsReplying] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchContacts = () => {
    setIsLoading(true)
    adminApi
      .getAllContacts(currentPage, 10)
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

  const handleSelectContact = (contact: ContactDetail) => {
    setSelectedContact(contact)
    setReplyText(contact.admin_reply || '')
    setReplyIsPublic(contact.reply_is_public)
  }

  const handleReply = async () => {
    if (!selectedContact || !replyText.trim()) return

    setIsReplying(true)
    try {
      const updated = await adminApi.replyToContact(
        selectedContact.id,
        replyText,
        replyIsPublic
      )
      setContacts(
        contacts.map((c) => (c.id === updated.id ? updated : c))
      )
      setSelectedContact(updated)
    } catch (error) {
      console.error(error)
    } finally {
      setIsReplying(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.posts.confirmDelete'))) return

    try {
      await adminApi.deleteContact(id)
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
      fetchContacts()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('admin.contacts.title')}</h1>

      {isLoading ? (
        <LoadingSpinner className="py-24" size="lg" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact List */}
          <div className="space-y-4">
            {contacts.length > 0 ? (
              <>
                {contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {contact.is_secret && (
                            <Lock size={14} className="text-muted-foreground" />
                          )}
                          <span className="font-medium">{contact.name}</span>
                          {!contact.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.admin_reply ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <Clock size={16} className="text-orange-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(contact.id)
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(contact.created_at, lang)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {t('common.noData')}
              </div>
            )}
          </div>

          {/* Contact Detail */}
          <div>
            {selectedContact ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    {t('contact.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{selectedContact.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Message</p>
                    <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">
                      {t('admin.contacts.reply')}
                    </h4>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('admin.contacts.replyPlaceholder')}
                      rows={5}
                    />

                    <div className="flex items-center space-x-2 mt-3">
                      <Checkbox
                        id="reply_public"
                        checked={replyIsPublic}
                        onCheckedChange={(checked) =>
                          setReplyIsPublic(checked as boolean)
                        }
                      />
                      <Label htmlFor="reply_public" className="cursor-pointer">
                        {t('admin.contacts.replyPublic')}
                      </Label>
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={handleReply}
                      disabled={isReplying || !replyText.trim()}
                    >
                      {isReplying ? t('common.loading') : t('admin.contacts.submitReply')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Select a contact to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
