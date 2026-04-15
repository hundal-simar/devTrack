import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AuthForm from "../components/AuthForm"

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
      setFirebaseError("Google sign-in failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setFirebaseError("")
      setLoading(true)

      if (isRegister) {
        await registerWithEmail(data.email, data.password)
      } else {
        await loginWithEmail(data.email, data.password)
      }

      navigate("/dashboard")
    } catch (err) {
      if (err.code === "auth/user-not-found")
        setFirebaseError("No account found with this email.")
      else if (err.code === "auth/wrong-password")
        setFirebaseError("Incorrect password.")
      else if (err.code === "auth/email-already-in-use")
        setFirebaseError("Email already registered.")
      else if (err.code === "auth/invalid-credential")
        setFirebaseError("Invalid email or password.")
      else setFirebaseError("Something went wrong. Try again.")
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