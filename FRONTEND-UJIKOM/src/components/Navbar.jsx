import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  return (
    <nav className="bg-navy text-white px-6 py-4 flex justify-between items-center">
      <h1
        onClick={() => navigate("/")}
        className="font-bold text-lg cursor-pointer"
      >
        RainStore.Id💎
      </h1>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="font-medium">{user.name}</span>
            <button
              onClick={() => navigate("/history")}
              className="bg-accent text-navy px-4 py-2 rounded-md font-medium hover:bg-blue-400 transition"
            >
              History
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-accent text-navy px-4 py-2 rounded-md font-medium hover:bg-blue-400 transition"
            >
              Masuk
            </button>
          </>
        )}
      </div>
    </nav>
  )
}