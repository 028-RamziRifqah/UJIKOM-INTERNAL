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
        <h1 className="text-xl font-bold mb-4">Transactions</h1>

        <table className="w-full bg-white">
            <thead>
            <tr>
                <th>User</th>
                <th>Game</th>
                <th>Diamond</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            {data.map(t => (
                <tr key={t.id}>
                <td>{t.user_name}</td>
                <td>{t.game_name}</td>
                <td>{t.diamond_amount}</td>
                <td>{t.status}</td>
                <td>
                    <button onClick={() => updateStatus(t.id,"success")}
                    className="bg-green-500 text-white px-2 py-1 mr-2">
                    Success
                    </button>
                    <button onClick={() => updateStatus(t.id,"failed")}
                    className="bg-red-500 text-white px-2 py-1">
                    Failed
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </AdminLayout>
    )
}
