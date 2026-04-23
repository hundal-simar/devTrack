import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthForm from "../components/AuthForm"
import { getAuthErrorMessage } from "../utils/authUtils"

function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setFirebaseError("")
      setLoading(true)
      await loginWithGoogle()
      navigate("/dashboard")
    } catch (err) {
      setFirebaseError(getAuthErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setFirebaseError("")
      setLoading(true)

      if (isRegister) {
        await registerWithEmail(data.email, data.password, data.name)
      } else {
        await loginWithEmail(data.email, data.password)
      }

      navigate("/dashboard")
    } catch (err) {
      setFirebaseError(getAuthErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = () => {
    setIsRegister((prev) => !prev)
    setFirebaseError("")
  }

  return (
    <AuthForm
      isRegister={isRegister}
      onSubmit={onSubmit}
      loading={loading}
      firebaseError={firebaseError}
      onToggle={handleToggleMode}
      onGoogleLogin={handleGoogleLogin}
    />
  )
}

export default Login

//add forgot password and email verification later