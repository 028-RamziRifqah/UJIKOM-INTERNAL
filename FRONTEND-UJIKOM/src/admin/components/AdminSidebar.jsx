import { NavLink, useNavigate } from "react-router-dom"

export default function AdminSidebar() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <aside className="w-64 bg-navy text-white p-6 space-y-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        <NavLink to="/admin" className="block">Dashboard</NavLink>
        <NavLink to="/admin/products" className="block">Products</NavLink>
        <NavLink to="/admin/categories" className="block">Categories</NavLink>
        <NavLink to="/admin/transactions" className="block">Transactions</NavLink>

        <button onClick={logout} className="mt-6 bg-red-600 px-4 py-2 rounded">
            Logout
        </button>
        </aside>
    )
}
