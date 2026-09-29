import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const usePatientDashboard = () =>
  useQuery({
    queryKey: ['dashboard', 'patient'],
    queryFn: dashboardApi.getPatientDashboard,
  })
