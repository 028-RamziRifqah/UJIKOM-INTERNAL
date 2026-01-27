import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function History() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <>
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-navy mb-4">Riwayat Transaksi</h1>

            {loading && <p className="text-center text-gray-500">Loading...</p>}

            {!loading && transactions.length === 0 && (
            <p className="text-center text-gray-500">Belum ada transaksi</p>
            )}

            <div className="space-y-3">
            {transactions.map((trx) => (
                <div
                key={trx.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center"
                >
                <div>
                    <p className="font-semibold text-navy">
                    {trx.game_name} — {trx.diamond_amount} Diamond
                    </p>
                    <p className="text-sm text-gray-500">
                    ID Game: {trx.game_user_id}
                    </p>
                    <p className="text-sm text-gray-500">
                    {new Date(trx.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="mt-2 md:mt-0 text-right">
                    <p className="font-bold">Rp {trx.total_price}</p>

                    <span
                    className={`inline-block mt-1 px-3 py-1 text-sm rounded-full
                        ${
                        trx.status === "success"
                            ? "bg-green-100 text-green-700"
                            : trx.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                    `}
                    >
                    {trx.status}
                    </span>
                </div>
                </div>
            ))}
            </div>
        </div>
        </>
    );
}
