import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types'

export const ProtectedRoute = ({
  allowedRole,
  children,
}: {
  allowedRole: UserRole
  children: ReactNode
}) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return <>{children}</>
}

export const RoleLandingRedirect = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={`/${user.role}/dashboard`} replace />
}
