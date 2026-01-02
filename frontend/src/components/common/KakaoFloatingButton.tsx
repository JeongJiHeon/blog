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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-[#FEE500] rounded-full shadow-md hover:shadow-lg transition-shadow"
      title={t('kakao.chat')}
    >
      <MessageCircle className="w-6 h-6 text-[#3C1E1E]" />
    </a>
  )
}
