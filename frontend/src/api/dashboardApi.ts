import { doctorDashboardMock } from '../mocks/doctorDashboard'
import { patientDashboardMock } from '../mocks/patientDashboard'
import type { DoctorDashboardData, PatientDashboardData } from '../types'
import { apiClient } from './client'

export const dashboardApi = {
  getPatientDashboard(): Promise<PatientDashboardData> {
    return apiClient.get(() => patientDashboardMock)
  },
  getDoctorDashboard(): Promise<DoctorDashboardData> {
    return apiClient.get(() => doctorDashboardMock)
  },
}
