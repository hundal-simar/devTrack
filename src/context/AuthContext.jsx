import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes — fires on login, logout, and page refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe // cleanup on unmount
  }, [])

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
  }

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (name?.trim()) {
    await updateProfile(userCredential.user, {
      displayName: name.trim(),
    })
  }
  return userCredential
}

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }

  // Don't render children until Firebase has checked if a user is logged in
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <p className="text-gray-400 text-sm">Loading...</p>
  //     </div>
  //   )
  // }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — this is how any component accesses the user
export function useAuth() {
  return useContext(AuthContext)
}

//to add style and loading spinner later