import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  const router = useRouter()
  useEffect(() => {
    const initAuth = () => {
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('accessToken');
      localStorage.removeItem('activeTab')

      if (userData && token) {
        setLoading(false);
        setUser(JSON.parse(userData));
        console.log("User data loaded from localStorage");
      } else {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        console.log("No user data found in localStorage");
        router.push('/login')
      }
    };
    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      setUser(null)
      localStorage.removeItem('userData')
      localStorage.removeItem('accessToken')
      router.push('/login')
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }
  const values = {
    user,
    loading,
    setLoading,
    logout: handleLogout
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }