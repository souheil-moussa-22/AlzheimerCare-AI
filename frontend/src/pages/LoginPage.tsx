import { LogIn } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

const registrationUrl = import.meta.env.VITE_KEYCLOAK_REGISTRATION_URL ?? 'http://localhost:8080/realms/alzheimercare/login-actions/registration'
const forgotPasswordUrl = import.meta.env.VITE_KEYCLOAK_FORGOT_PASSWORD_URL ?? 'http://localhost:8080/realms/alzheimercare/login-actions/reset-credentials'

export const LoginPage = () => {
  const { isAuthenticated, user, login, register } = useAuth()

  useEffect(() => {
    void login()
  }, [login])

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4">
      <Card className="w-full max-w-md" title="Connexion AlzheimerCare AI">
        <p className="mb-5 text-sm text-text-muted">Authentification sécurisée via Keycloak.</p>
        <Button className="w-full" onClick={() => void login()}>
          <LogIn size={16} className="mr-2" aria-hidden="true" />
          Se connecter
        </Button>

        <div className="mt-4 flex items-center justify-between text-xs">
          <button type="button" onClick={() => void register()} className="text-brand-blue underline">
            Create account
          </button>
          <a href={forgotPasswordUrl} className="text-brand-blue underline">
            Forgot password
          </a>
        </div>
      </Card>
    </main>
  )
}
