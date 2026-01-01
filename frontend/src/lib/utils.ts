import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Language = 'ko' | 'en' | 'zh'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(
  obj: any,
  field: string,
  lang: Language,
  fallbackLang: Language = 'ko'
): string {
  const localizedField = `${field}_${lang}`
  const fallbackField = `${field}_${fallbackLang}`

  const value = obj[localizedField]
  if (value && typeof value === 'string') {
    return value
  }

  const fallbackValue = obj[fallbackField]
  if (fallbackValue && typeof fallbackValue === 'string') {
    return fallbackValue
  }

  return ''
}

export function formatDate(date: string | Date, lang: Language = 'ko'): string {
  const d = new Date(date)
  const locales: Record<Language, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    zh: 'zh-CN'
  }

  return d.toLocaleDateString(locales[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
