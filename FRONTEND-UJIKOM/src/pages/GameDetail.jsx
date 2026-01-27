import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"
import Navbar from "../components/Navbar"

export default function GameDetail() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [selected, setSelected] = useState(null)
  const [gameUserId, setGameUserId] = useState("")

  useEffect(() => {
    api.get(`/categories/${id}/products`).then(res => {
      setGame(res.data)
    })
  }, [id])

  const handleBuy = async () => {
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
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-navy">{game.name}</h1>

        <input
          placeholder="ID Game"
          className="w-full border p-2 rounded"
          type="number"
          value={gameUserId}
          onChange={e => setGameUserId(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          {game.products.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className={`border p-3 rounded cursor-pointer hover:scale-105 ${
                selected?.id === p.id ? "border-accent bg-accent/10" : ""
              }`}
            >
              <p>{p.diamond_amount} Diamond💎</p>
              <p className="font-semibold">Rp {p.price}</p>
            </div>
          ))}
        </div>

        {selected && (
          <button
            onClick={handleBuy}
            className="w-full bg-navy text-white py-2 rounded"
          >
            Beli Rp {selected.price}
          </button>
        )}
      </div>
    </>
  )
}