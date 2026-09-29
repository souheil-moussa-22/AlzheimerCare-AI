import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'
import { mockUsers } from '../mocks/auth'
import type { AuthUser, UserRole } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  loginAs: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
}) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginAs: (role) => setUser(mockUsers[role]),
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
