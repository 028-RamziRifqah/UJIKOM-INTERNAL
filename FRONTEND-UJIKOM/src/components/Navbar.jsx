import { useNavigate, useLocation } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer flex items-center gap-2 group"
        >
          <span className="text-accent group-hover:text-white transition-colors">RainStore</span>
          <span className="text-white group-hover:text-accent transition-colors">.Id</span>
          <span className="text-xl animate-pulse">💎</span>
        </h1>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="hidden md:block text-gray-300 font-medium">Hello, <span className="text-accent">{user.name}</span></span>

              <button
                onClick={() => navigate("/history")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/history')
                    ? 'bg-accent/20 text-accent border border-accent/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                History
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate("/events")}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                Acara
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}