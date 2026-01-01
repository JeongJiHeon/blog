import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'

// TODO: Replace with actual KakaoTalk open chat URL
const KAKAO_CHAT_URL = 'https://open.kakao.com/o/gXXXXXXX'

export function KakaoFloatingButton() {
  const { t } = useTranslation()

  return (
    <a
      href={KAKAO_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
      title={t('kakao.chat')}
    >
      <MessageCircle className="w-7 h-7 text-[#3C1E1E]" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {t('kakao.chat')}
      </span>
    </a>
  )
}
