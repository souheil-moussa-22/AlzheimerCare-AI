import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { renderWithProviders } from './testUtils'

describe('Dashboard pages', () => {
  it('renders patient dashboard main sections', async () => {
    renderWithProviders(<App />)

    await userEvent.click(screen.getByRole('button', { name: /entrer comme patient/i }))

    expect(await screen.findByTestId('patient-chart')).toBeInTheDocument()
    expect(screen.getByTestId('patient-games')).toBeInTheDocument()
    expect(screen.getByTestId('patient-appointments')).toBeInTheDocument()
    expect(screen.getByTestId('patient-notifications')).toBeInTheDocument()
  })

  it('renders doctor dashboard main sections', async () => {
    renderWithProviders(<App />)

    await userEvent.click(screen.getByRole('button', { name: /entrer comme médecin/i }))

    expect(await screen.findByTestId('doctor-stats')).toBeInTheDocument()
    expect(screen.getByTestId('doctor-patients')).toBeInTheDocument()
    expect(screen.getByTestId('doctor-alerts')).toBeInTheDocument()
    expect(screen.getByTestId('doctor-consultations')).toBeInTheDocument()
    expect(screen.getByTestId('doctor-reports')).toBeInTheDocument()
    expect(screen.getByTestId('doctor-prediction')).toBeInTheDocument()
  })
})
