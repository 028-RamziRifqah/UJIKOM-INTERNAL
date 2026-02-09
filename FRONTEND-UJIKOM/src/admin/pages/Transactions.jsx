import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function Transactions() {
    const [data, setData] = useState([])

    useEffect(() => {
        api.get("/transactions/all").then(res => setData(res.data.data))
    }, [])

    const updateStatus = async (id, status) => {
        await api.put(`/transactions/${id}/status`, { status })
        setData(data.map(t => t.id === id ? { ...t, status } : t))
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8 text-white">Transactions Log 📜</h1>

            <div className="bg-navy-800 rounded-xl shadow-xl overflow-hidden border border-navy-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-900 text-gray-400">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Game</th>
                                <th className="p-4">Diamond</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {data.map(t => (
                                <tr key={t.id} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="p-4 font-medium text-white">{t.user_name}</td>
                                    <td className="p-4 text-gray-300">{t.game_name}</td>
                                    <td className="p-4 text-accent">{t.diamond_amount} 💎</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                            t.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateStatus(t.id, "success")}
                                                className="bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium border border-green-600/30"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(t.id, "failed")}
                                                className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium border border-red-600/30"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Belum ada transaksi yang tercatat.
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
