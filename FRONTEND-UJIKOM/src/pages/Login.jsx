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
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-navy">
          Login RainStore.id💎
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-2 rounded hover:bg-slate-800 transition disabled:opacity-60"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/Register")}
            className="text-accent cursor-pointer font-semibold"
          >
            Daftar
          </span>
        </p>
      </form>
    </div>
  )
}