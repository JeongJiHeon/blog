import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setIsLoading(true)

    const success = await login(username, password)

    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError(true)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t('admin.login.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t('admin.login.username')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">{t('admin.login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{t('admin.login.error')}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {t('admin.login.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
