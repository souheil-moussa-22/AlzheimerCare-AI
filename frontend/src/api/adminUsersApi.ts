import type { UserRole } from '../types'
import { requestJson, type AuthTokenAdapter } from './client'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface AdminUserItem {
  keycloak_id: string
  email: string
  enabled: boolean
  roles: string[]
}

export const adminUsersApi = {
  list(auth: AuthTokenAdapter) {
    return requestJson<AdminUserItem[]>(`${baseUrl}/api/auth/admin/users/`, { method: 'GET' }, auth)
  },
  create(payload: { email: string; role: Extract<UserRole, 'patient' | 'doctor'>; temporary_password?: string }, auth: AuthTokenAdapter) {
    return requestJson<AdminUserItem>(
      `${baseUrl}/api/auth/admin/users/`,
      { method: 'POST', body: JSON.stringify(payload) },
      auth,
    )
  },
  toggleEnabled(keycloakId: string, enabled: boolean, auth: AuthTokenAdapter) {
    return requestJson<{ detail: string }>(
      `${baseUrl}/api/auth/admin/users/${keycloakId}/`,
      { method: 'PATCH', body: JSON.stringify({ enabled }) },
      auth,
    )
  },
  changeRole(keycloakId: string, role: Extract<UserRole, 'patient' | 'doctor'>, auth: AuthTokenAdapter) {
    return requestJson<{ detail: string }>(
      `${baseUrl}/api/auth/admin/users/${keycloakId}/`,
      { method: 'PATCH', body: JSON.stringify({ role }) },
      auth,
    )
  },
}
