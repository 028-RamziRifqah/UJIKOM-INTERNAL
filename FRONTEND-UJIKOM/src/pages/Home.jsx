import { useEffect, useState } from "react"
import api from "../services/api"
import GameCard from "../components/GameCard"
import Navbar from "../components/Navbar"

export default function Home() {
  const [games, setGames] = useState([])

  useEffect(() => {
    api.get("/categories").then(res => {
      setGames(res.data.data)
    })
  }, [])

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </>
  )
}