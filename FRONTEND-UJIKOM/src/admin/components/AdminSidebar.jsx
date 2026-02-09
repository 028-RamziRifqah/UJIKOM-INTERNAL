import { NavLink, useNavigate } from "react-router-dom"

export default function AdminSidebar() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    const navLinkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-lg transition-all duration-300 ${isActive
            ? "bg-accent text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            : "text-gray-400 hover:bg-navy-800 hover:text-white"
        }`

    return (
        <aside className="w-64 bg-navy-900 border-r border-navy-700 p-6 flex flex-col min-h-screen">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="text-accent">Admin</span>
                <span className="text-white">Panel</span>
                <span className="text-xl animate-pulse">💎</span>
            </h1>

            <div className="space-y-2 flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">Menu</p>
                <NavLink to="/admin/products" className={navLinkClass}>Produk</NavLink>
                <NavLink to="/admin/categories" className={navLinkClass}>Kategori Game</NavLink>
                <NavLink to="/admin/transactions" className={navLinkClass}>Transaksi</NavLink>
                <NavLink to="/admin/sales-report" className={navLinkClass}>Laporan Penjualan</NavLink>
                <NavLink to="/admin/events" className={navLinkClass}>Acara</NavLink>
            </div>

            <button onClick={logout} className="mt-6 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all w-full text-left flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
            </button>
        </aside>
    )
}
