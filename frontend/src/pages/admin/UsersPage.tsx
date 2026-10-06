import { useEffect, useMemo, useState } from 'react'
import { adminUsersApi, type AdminUserItem } from '../../api/adminUsersApi'
import { AppShell } from '../../components/layout/AppShell'
import { Button, Card } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'

export const AdminUsersPage = () => {
  const auth = useAuth()
  const adapter = useMemo(
    () => ({
      getAccessToken: auth.getAccessToken,
      refreshAccessToken: auth.refreshAccessToken,
    }),
    [auth.getAccessToken, auth.refreshAccessToken],
  )

  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')

  const loadUsers = async () => {
    const data = await adminUsersApi.list(adapter)
    setUsers(data)
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleCreate = async () => {
    if (!email) {
      return
    }
    await adminUsersApi.create({ email, role }, adapter)
    setEmail('')
    await loadUsers()
  }

  return (
    <AppShell>
      <Card title="Admin - Users">
        <div className="mb-4 flex gap-2">
          <input
            className="rounded border px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <select
            className="rounded border px-3 py-2"
            value={role}
            onChange={(event) => setRole(event.target.value as 'patient' | 'doctor')}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <Button onClick={() => void handleCreate()}>Create user</Button>
        </div>

        <div className="space-y-2">
          {users.map((user) => {
            const mappedRole = user.roles.includes('doctor') ? 'doctor' : 'patient'
            return (
              <div key={user.keycloak_id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-text-muted">{user.roles.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => void adminUsersApi.toggleEnabled(user.keycloak_id, !user.enabled, adapter).then(loadUsers)}
                  >
                    {user.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      void adminUsersApi
                        .changeRole(user.keycloak_id, mappedRole === 'doctor' ? 'patient' : 'doctor', adapter)
                        .then(loadUsers)
                    }
                  >
                    Toggle role
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </AppShell>
  )
}
