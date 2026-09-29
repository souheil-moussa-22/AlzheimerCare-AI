import { LogIn } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

export const LoginPage = () => {
  const { loginAs, user } = useAuth()

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4">
      <Card className="w-full max-w-md" title="Connexion AlzheimerCare AI">
        <p className="mb-5 text-sm text-text-muted">
          Choisissez un rôle pour accéder à l’interface de démonstration.
        </p>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => loginAs('patient')}>
            <LogIn size={16} className="mr-2" aria-hidden="true" />
            Entrer comme patient
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => loginAs('doctor')}>
            <LogIn size={16} className="mr-2" aria-hidden="true" />
            Entrer comme médecin
          </Button>
        </div>
      </Card>
    </main>
  )
}
