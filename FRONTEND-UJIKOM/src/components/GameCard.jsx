import { useNavigate } from "react-router-dom"

export default function GameCard({ game }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:scale-105 transition p-4 text-center"
    >
      <img
        src={`http://localhost:3000/uploads/${game.image}`}
        alt={game.name}
        className="w-full object-cover rounded"
      />
      <h3 className="mt-3 font-semibold text-navy">
        {game.name}
      </h3>
    </div>
  )
}