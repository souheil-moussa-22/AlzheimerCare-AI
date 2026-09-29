import { screen } from '@testing-library/react'
import App from '../App'
import { mockUsers } from '../mocks/auth'
import { renderWithProviders } from './testUtils'

describe('Role-based route guards', () => {
  it('redirects patient away from doctor route', async () => {
    renderWithProviders(<App />, '/doctor/dashboard', mockUsers.patient)

    expect(await screen.findByText(/bonjour ahmed/i)).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', async () => {
    renderWithProviders(<App />, '/patient/dashboard')

    expect(await screen.findByText(/connexion alzheimercare ai/i)).toBeInTheDocument()
  })
})
