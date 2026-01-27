import { jwtDecode } from "jwt-decode"
import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decoded = jwtDecode(token)

        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        })

      } catch (err) {
        localStorage.removeItem("token")
        setUser(null)
      }
    }

    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
