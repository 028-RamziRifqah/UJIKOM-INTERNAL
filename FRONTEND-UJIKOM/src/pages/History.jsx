import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function History() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get("/transactions/me")
            .then((res) => {
                setTransactions(res.data.data);
            })
            .catch(() => {
                alert("Gagal mengambil data transaksi");
            })
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
    }

    return (
        <div className="min-h-screen bg-navy-900 pb-20">
            <Navbar />
            <div className="pt-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                    Riwayat Top Up
                    <span className="text-xl animate-pulse">📜</span>
                </h1>

                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    </div>
                )}

                {!loading && transactions.length === 0 && (
                    <div className="text-center py-12 glass-card">
                        <p className="text-gray-400 text-lg">Belum ada riwayat transaksi.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {transactions.map((trx) => (
                        <div
                            key={trx.id}
                            className="glass-card p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:border-accent/50 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    🎮
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white group-hover:text-accent transition-colors">
                                        {trx.game_name}
                                    </p>
                                    <p className="text-accent font-medium">
                                        {trx.diamond_amount} Diamond 💎
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 bg-navy-900 px-2 py-0.5 rounded">ID: {trx.game_user_id}</span>
                                        <span className="text-xs text-gray-500">{new Date(trx.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 md:mt-0 text-right">
                                <p className="font-bold text-xl text-white mb-2">{formatCurrency(trx.total_price)}</p>

                                <span
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                        ${trx.status === "success"
                                            ? "bg-green-500/20 text-green-400"
                                            : trx.status === "failed"
                                                ? "bg-red-500/20 text-red-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                        }
                    `}
                                >
                                    {trx.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full py-4 rounded-xl mt-5 font-bold text-lg transition-all duration-300 bg-accent hover:bg-accent-hover text-white shadow-lg hover:shadow-accent/50 transform hover:-translate-y-1"
                >
                    Kembali Ke Beranda
                </button>
            </div>
        </div>
    );
}
