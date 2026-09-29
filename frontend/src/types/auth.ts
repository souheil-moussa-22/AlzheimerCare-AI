export type UserRole = 'patient' | 'doctor'

export interface AuthUser {
  id: string
  fullName: string
  role: UserRole
  email: string
}
