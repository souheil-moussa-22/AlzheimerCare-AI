import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DoctorDashboard } from './pages/doctor/Dashboard'
import { PatientDashboard } from './pages/patient/Dashboard'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProtectedRoute, RoleLandingRedirect } from './routes/RouteGuards'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleLandingRedirect />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/tests"
        element={
          <ProtectedRoute allowedRole="patient">
            <PlaceholderPage title="My tests" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/games"
        element={
          <ProtectedRoute allowedRole="patient">
            <PlaceholderPage title="Cognitive games" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/progress"
        element={
          <ProtectedRoute allowedRole="patient">
            <PlaceholderPage title="My progress" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <PlaceholderPage title="Appointments" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute allowedRole="doctor">
            <PlaceholderPage title="My patients" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/consultations"
        element={
          <ProtectedRoute allowedRole="doctor">
            <PlaceholderPage title="Consultations" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/predictions"
        element={
          <ProtectedRoute allowedRole="doctor">
            <PlaceholderPage title="AI predictions" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/reports"
        element={
          <ProtectedRoute allowedRole="doctor">
            <PlaceholderPage title="Medical reports" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
