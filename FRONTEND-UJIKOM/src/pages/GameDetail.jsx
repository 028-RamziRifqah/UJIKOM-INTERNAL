import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import api from "../services/api"
import Navbar from "../components/Navbar"
import { AuthContext } from "../context/AuthContext"

export default function GameDetail() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [selected, setSelected] = useState(null)
  const [gameUserId, setGameUserId] = useState("")
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/categories/${id}/products`).then(res => {
      setGame(res.data)
    })
  }, [id])

  const handleBuy = async () => {
    if (!user) {
      alert("Untuk melakukan pembelian harap login terlebih dahulu!")
      navigate("/login")
      return
    }

    if (!gameUserId || !selected) {
      alert("Lengkapi data!")
      return
    }

    await api.post("/transactions", {
      product_id: selected.id,
      game_user_id: gameUserId
    })

    alert("Transaksi berhasil (status pending)")
  }

  if (!game) return null

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      <Navbar />

      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent z-10"></div>
        <img
          src={`http://localhost:3000/uploads/${game.image}`}
          alt={game.name}
          className="w-full h-full object-cover blur-sm opacity-50"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 container mx-auto flex items-end gap-6">
          <img
            src={`http://localhost:3000/uploads/${game.image}`}
            alt={game.name}
            className="w-32 h-32 object-cover rounded-2xl shadow-2xl border-4 border-navy-800"
          />
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
            <p className="text-gray-400">Proses Otomatis • Layanan 24 Jam</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 flex items-center justify-center bg-accent text-navy font-bold rounded-full">1</span>
              <h2 className="text-xl font-bold">Masukkan User ID</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Masukkan ID Game"
                className="w-full bg-navy-900 border border-navy-600 p-4 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                type="number"
                value={gameUserId}
                onChange={e => setGameUserId(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Contoh: 12345678</p>
          </div>

          <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 flex items-center justify-center bg-accent text-navy font-bold rounded-full">2</span>
              <h2 className="text-xl font-bold">Pilih Nominal Top Up</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {game.products.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selected?.id === p.id
                    ? "bg-accent/10 border-accent shadow-[0_0_15px_rgba(14,165,233,0.3)] transform -translate-y-1"
                    : "bg-navy-900 border-navy-700 hover:border-gray-500 hover:bg-navy-800"
                    }`}
                >
                  {selected?.id === p.id && (
                    <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                  <p className="font-bold text-lg mb-1">{p.diamond_amount} Diamond💎</p>
                  <p className="text-sm text-gray-400">Rp {parseInt(p.price).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 flex items-center justify-center bg-accent text-navy font-bold rounded-full">3</span>
              <h2 className="text-xl font-bold">Beli Sekarang</h2>
            </div>

            <div className="p-4 bg-navy-900 rounded-xl border border-navy-700 mb-6 flex justify-between items-center">
              <span className="text-gray-400">Total Pembayaran</span>
              <span className="text-2xl font-bold text-accent">
                {selected ? `Rp ${parseInt(selected.price).toLocaleString('id-ID')}` : 'Rp 0'}
              </span>
            </div>

            <button
              onClick={handleBuy}
              disabled={!selected}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${!selected
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-accent hover:bg-accent-hover text-white shadow-lg hover:shadow-accent/50 transform hover:-translate-y-1"
                }`}
            >
              Konfirmasi Top Up
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-xl mt-5 font-bold text-lg transition-all duration-300 bg-accent hover:bg-accent-hover text-white shadow-lg hover:shadow-accent/50 transform hover:-translate-y-1"
            >
              Kembali Ke Beranda
            </button>
          </div>

        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 sticky top-24">
            <h3 className="text-lg font-bold mb-4">Cara Top Up</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-400 text-sm">
              <li>Masukkan <span className="text-white">User ID</span> akun game kamu.</li>
              <li>Pilih nominal Diamond yang kamu inginkan.</li>
              <li>Selesaikan pembayaran.</li>
              <li>Diamond akan masuk otomatis ke akun kamu.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>

  )
}