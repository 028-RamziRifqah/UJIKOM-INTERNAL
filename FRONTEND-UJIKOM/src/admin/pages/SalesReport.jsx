import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function SalesReport() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dates, setDates] = useState({
        startDate: '',
        endDate: ''
    })

    const fetchData = () => {
        setLoading(true)
        const params = {};
        if (dates.startDate) params.startDate = dates.startDate;
        if (dates.endDate) params.endDate = dates.endDate;

        api.get("/transactions/report", { params })
            .then(res => {
                setData(res.data.data)
            })
            .catch(err => {
                console.error(err)
                alert("Gagal memuat laporan")
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
    }

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Laporan Penjualan 📈</h1>

                <div className="flex flex-wrap gap-2 bg-navy-800 p-2 rounded-xl border border-navy-700">
                    <input
                        type="date"
                        className="bg-navy-900 border border-navy-600 text-white p-2 rounded-lg focus:outline-none focus:border-accent"
                        value={dates.startDate}
                        onChange={e => setDates({ ...dates, startDate: e.target.value })}
                    />
                    <span className="text-gray-400 self-center">-</span>
                    <input
                        type="date"
                        className="bg-navy-900 border border-navy-600 text-white p-2 rounded-lg focus:outline-none focus:border-accent"
                        value={dates.endDate}
                        onChange={e => setDates({ ...dates, endDate: e.target.value })}
                    />
                    <button
                        onClick={fetchData}
                        className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-accent/20"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            )}

            {data && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                            <h3 className="text-gray-400 font-medium mb-2 relative z-10">Total Pendapatan</h3>
                            <p className="text-4xl font-bold text-green-400 relative z-10">{formatCurrency(data.summary.totalRevenue)}</p>
                        </div>
                        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                            <h3 className="text-gray-400 font-medium mb-2 relative z-10">Total Transaksi Berhasil</h3>
                            <p className="text-4xl font-bold text-accent relative z-10">{data.summary.totalTransactions}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-accent rounded-full"></span>
                                Harian
                            </h3>
                            <div className="overflow-auto max-h-80 custom-scrollbar">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-navy-900 text-gray-400 sticky top-0">
                                        <tr>
                                            <th className="p-3 rounded-tl-lg">Tanggal</th>
                                            <th className="p-3">Transaksi</th>
                                            <th className="p-3 rounded-tr-lg">Pendapatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-700 text-gray-300">
                                        {data.daily.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-navy-700/50 transition-colors">
                                                <td className="p-3">{item.date}</td>
                                                <td className="p-3">{item.count}</td>
                                                <td className="p-3 text-green-400">{formatCurrency(item.revenue)}</td>
                                            </tr>
                                        ))}
                                        {data.daily.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-500">Tidak ada data</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                                Bulanan
                            </h3>
                            <div className="overflow-auto max-h-80 custom-scrollbar">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-navy-900 text-gray-400 sticky top-0">
                                        <tr>
                                            <th className="p-3 rounded-tl-lg">Bulan</th>
                                            <th className="p-3">Transaksi</th>
                                            <th className="p-3 rounded-tr-lg">Pendapatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-700 text-gray-300">
                                        {data.monthly.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-navy-700/50 transition-colors">
                                                <td className="p-3">{item.month}</td>
                                                <td className="p-3">{item.count}</td>
                                                <td className="p-3 text-green-400">{formatCurrency(item.revenue)}</td>
                                            </tr>
                                        ))}
                                        {data.monthly.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-500">Tidak ada data</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
                            Tahunan
                        </h3>
                        <div className="overflow-auto max-h-80 custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-navy-900 text-gray-400 sticky top-0">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Tahun</th>
                                        <th className="p-3">Transaksi</th>
                                        <th className="p-3 rounded-tr-lg">Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700 text-gray-300">
                                    {data.yearly.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-navy-700/50 transition-colors">
                                            <td className="p-3">{item.year}</td>
                                            <td className="p-3">{item.count}</td>
                                            <td className="p-3 text-green-400">{formatCurrency(item.revenue)}</td>
                                        </tr>
                                    ))}
                                    {data.yearly.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-500">Tidak ada data</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
