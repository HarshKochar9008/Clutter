import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady, loading } = useAuth()
  if (!authReady || loading) {
    return null
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
