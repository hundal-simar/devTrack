import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in by verifying local token
  useEffect(() => {
    const bootstrapAuth = async () => {
      
      
        try {
          const profile = await api.get('/auth/me');
          setUser({
            uid: profile._id,
            displayName: profile.name,
            email: profile.email,
          });
        } catch (error) {
          console.error('Failed to load user profile with current token:', error.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      
      const userData = {
        uid: data._id,
        displayName: data.name,
        email: data.email,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      // Re-throw with custom code if expected by frontend utils, 
      // or just standard Error that Login.jsx can catch
      throw error;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    try {
      const data = await api.post('/auth/register', { email, password, name });
      
      const userData = {
        uid: data._id,
        displayName: data.name,
        email: data.email,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    // Google Sign-In is a Firebase feature. We mock this locally by signing in or 
    // registering a mock developer account on our server to keep the UI button working.
    try {
      const googleMockUser = {
        email: 'google_developer@example.com',
        name: 'Google Dev',
        password: 'GoogleMockAuthPassword123!',
      };

      let data;
      try {
        data = await api.post('/auth/login', {
          email: googleMockUser.email,
          password: googleMockUser.password,
        });
      } catch (err) {
        // If account doesn't exist yet, register it
        data = await api.post('/auth/register', googleMockUser);
      }

      
      const userData = {
        uid: data._id,
        displayName: data.name,
        email: data.email,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Mock Google Auth failed:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}