import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function Dashboard() {
    const [stats, setStats] = useState({})

    useEffect(() => {
        api.get("/admin/stats").then(res => setStats(res.data))
    }, [])

    return (
        <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Selamat Datang di Dashboard Admin!</h1>
        </AdminLayout>
    )
    }

    
