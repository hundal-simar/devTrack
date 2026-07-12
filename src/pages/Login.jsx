import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthForm from "../components/AuthForm"

function Login() {
  const { loginWithEmail, registerWithEmail } = useAuth()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const [loading, setLoading] = useState(false)

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
      setFirebaseError(err.message || "Authentication failed")
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
    />
  )
}

export default Login

//add forgot password and email verification later