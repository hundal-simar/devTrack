import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
 

  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
    </div>
  )
}


  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute