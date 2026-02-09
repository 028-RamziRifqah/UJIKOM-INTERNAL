import { useNavigate } from "react-router-dom"

export default function GameCard({ game }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="group relative cursor-pointer"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
      <div className="relative h-full w-full bg-navy-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 group-hover:-translate-y-2">
        <div className="relative h-48 overflow-hidden">
          <img
            src={`http://localhost:3000/uploads/${game.image}`}
            alt={game.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-60"></div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors truncate">
            {game.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400 bg-navy-700 px-2 py-1 rounded-full">Automatis</span>
            <span className="text-sm text-green-400 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}