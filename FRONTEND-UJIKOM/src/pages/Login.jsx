import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { jwtDecode } from "jwt-decode"
import { AuthContext } from "../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      const decoded = jwtDecode(res.data.token)
      setUser(decoded)
      if (decoded.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      alert("Login gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 relative overflow-hidden px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 shadow-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back 💎</h1>
            <p className="text-gray-400">Login untuk lanjut top up game favoritmu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-navy-900 border border-navy-700 rounded-lg p-3 text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : "Login Sekarang"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/Register")}
                className="text-accent cursor-pointer hover:underline font-semibold"
              >
                Daftar Gratis
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}