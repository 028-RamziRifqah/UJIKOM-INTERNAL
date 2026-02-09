import { useEffect, useState } from "react"
import api from "../services/api"
import GameCard from "../components/GameCard"
import Navbar from "../components/Navbar"

export default function Home() {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/categories").then(res => {
      setGames(res.data.data)
      setFilteredGames(res.data.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const results = games.filter(game =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredGames(results)
  }, [searchTerm, games])

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Top Up Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Termurah</span> & <span className="text-white">Tercepat</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 animate-slide-up">
            Platform top up game terpercaya dengan proses otomatis 24/7.
            Dapatkan harga terbaik untuk game favoritmu sekarang juga!
          </p>

          <div className="max-w-xl mx-auto relative group animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari game favoritmu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-800 text-white px-6 py-4 rounded-full border border-navy-700 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 placeholder-gray-500 shadow-xl transition-all"
              />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-accent rounded-full"></span>
          Game Populer
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-navy-800 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredGames.length > 0 ? (
              filteredGames.map((game, idx) => (
                <div key={game.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <GameCard game={game} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">Game tidak ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}