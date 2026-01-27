import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await api.post("/auth/register", {
            name,
            email,
            password,
        });

        const res = await api.post("/auth/login", {
        email,
        password,
        })

        localStorage.setItem("token", res.data.token)
        const decoded = jwtDecode(res.data.token)
        setUser(decoded)

        navigate("/");
        } catch (err) {
        alert("Register gagal: " + (err.response?.data?.message || err.message))
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy px-4">
        <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-sm p-6 rounded-xl space-y-4"
        >
            <h1 className="text-2xl font-bold text-center text-navy">
            Register RainStore.id💎
            </h1>

            <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />

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
            {loading ? "Loading..." : "Register"}
            </button>

            <p className="text-center text-sm">
            Sudah punya akun?{" "}
            <span
                onClick={() => navigate("/login")}
                className="text-accent cursor-pointer font-semibold"
            >
                Login
            </span>
            </p>
        </form>
        </div>
    );
}
