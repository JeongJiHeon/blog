import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { postsApi, adminApi } from '@/lib/api'
import type { PostCreate, Post } from '@/types'

export function PostEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<PostCreate>({
    title_ko: '',
    title_en: '',
    title_zh: '',
    content_ko: '',
    content_en: '',
    content_zh: '',
    thumbnail_url: '',
    is_public: true,
  })

  useEffect(() => {
    if (id) {
      postsApi
        .getById(parseInt(id, 10))
        .then((post: Post) => {
          setFormData({
            title_ko: post.title_ko,
            title_en: post.title_en || '',
            title_zh: post.title_zh || '',
            content_ko: post.content_ko,
            content_en: post.content_en || '',
            content_zh: post.content_zh || '',
            thumbnail_url: post.thumbnail_url || '',
            is_public: post.is_public,
          })
        })
        .catch(() => {
          navigate('/admin/posts')
        })
        .finally(() => setIsLoading(false))
    }
  }, [id, navigate])

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)')
      return false
    }
    return true
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!validateFile(file)) return null

    setIsUploading(true)
    try {
      const result = await adminApi.uploadFile(file)
      const fullUrl = result.url.startsWith('http') 
        ? result.url 
        : `${window.location.origin}${result.url}`
      setUploadedImages((prev) => [...prev, fullUrl])
      return fullUrl
    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드에 실패했습니다.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const insertImageAtCursor = (imageUrl: string, useHtml: boolean = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentContent = formData.content_ko
    const imageCode = useHtml
      ? `<img src="${imageUrl}" alt="이미지" style="max-width: 100%; height: auto;" />`
      : `![이미지](${imageUrl})`
    
    const newContent = 
      currentContent.substring(0, start) + 
      '\n\n' + imageCode + '\n\n' + 
      currentContent.substring(end)
    
    setFormData({
      ...formData,
      content_ko: newContent,
    })

    // 커서 위치 조정
    setTimeout(() => {
      const newCursorPos = start + imageCode.length + 4
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleFileSelect = async (file: File) => {
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      insertImageAtCursor(imageUrl, false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    for (const file of files) {
      await handleFileSelect(file)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          await handleFileSelect(file)
        }
        break
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing && id) {
        await postsApi.update(parseInt(id, 10), formData)
      } else {
        await postsApi.create(formData)
      }
      navigate('/admin/posts')
    } catch (error) {
      console.error(error)
      alert(t('common.error'))
    } finally {
      setIsSaving(false)
    }
  }

  const removeUploadedImage = (url: string) => {
    setUploadedImages((prev) => prev.filter((img) => img !== url))
  }

  if (isLoading) {
    return <LoadingSpinner className="py-24" size="lg" />
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/posts"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? t('admin.posts.edit') : t('admin.posts.create')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <Label htmlFor="title_ko">제목 *</Label>
              <Input
                id="title_ko"
                value={formData.title_ko}
                onChange={(e) =>
                  setFormData({ ...formData, title_ko: e.target.value })
                }
                placeholder="글 제목을 입력하세요"
                required
                className="text-lg"
              />
            </div>

            {/* 내용 에디터 - 드래그 앤 드롭 지원 */}
            <div>
              <Label htmlFor="content_ko">내용 *</Label>
              <div
                ref={dropZoneRef}
                className={`relative border-2 border-dashed rounded-lg transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragOver && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                    <div className="text-center">
                      <Upload size={48} className="mx-auto mb-2 text-primary" />
                      <p className="text-lg font-medium">이미지를 놓으세요</p>
                    </div>
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  id="content_ko"
                  value={formData.content_ko}
                  onChange={(e) =>
                    setFormData({ ...formData, content_ko: e.target.value })
                  }
                  onPaste={handlePaste}
                  rows={20}
                  required
                  className="border-0 resize-none focus-visible:ring-0"
                  placeholder="내용을 입력하세요. 이미지를 드래그 앤 드롭하거나 붙여넣기(Ctrl+V)로 추가할 수 있습니다."
                />
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Upload size={14} />
                <span>이미지를 드래그 앤 드롭하거나 클릭하여 선택하세요</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="ml-auto h-auto p-1 text-xs"
                >
                  {isUploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-1" />
                      업로드 중...
                    </>
                  ) : (
                    '이미지 선택'
                  )}
                </Button>
              </div>
            </div>

            {/* 업로드된 이미지 미리보기 */}
            {uploadedImages.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>업로드된 이미지 ({uploadedImages.length}개)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-muted-foreground"
                  >
                    모두 지우기
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => insertImageAtCursor(url, false)}
                          title="Markdown 형식으로 삽입"
                        >
                          <ImageIcon size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => insertImageAtCursor(url, true)}
                          title="HTML 형식으로 삽입"
                        >
                          HTML
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeUploadedImage(url)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 썸네일 */}
            <div>
              <Label htmlFor="thumbnail_url">썸네일 URL (선택사항)</Label>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                placeholder="https://... 또는 업로드된 이미지 URL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                게시글 목록에 표시될 썸네일 이미지 URL입니다.
              </p>
            </div>

            {/* 공개 설정 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_public: checked as boolean })
                }
              />
              <Label htmlFor="is_public" className="cursor-pointer">
                {t('admin.posts.public')}
              </Label>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSaving} size="lg">
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
              <Link to="/admin/posts">
                <Button type="button" variant="outline" size="lg">
                  {t('common.cancel')}
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
