import type { AuthUser } from '../types'

export const mockUsers: Record<'patient' | 'doctor', AuthUser> = {
  patient: {
    id: 'u-patient-1',
    fullName: 'Ahmed Rahmani',
    role: 'patient',
    email: 'ahmed@example.com',
  },
  doctor: {
    id: 'u-doctor-1',
    fullName: 'Dr. Benali',
    role: 'doctor',
    email: 'dr.benali@example.com',
  },
}
