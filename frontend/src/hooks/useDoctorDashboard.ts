import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const useDoctorDashboard = () =>
  useQuery({
    queryKey: ['dashboard', 'doctor'],
    queryFn: dashboardApi.getDoctorDashboard,
  })
