import { Clock, ChefHat, Heart } from 'lucide-react'

export default function RecipeCard({ recipe, onFavorite }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite(recipe.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart size={16} className="text-avocado-dark" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{recipe.name}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat size={14} />
            {recipe.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-avocado-light/10 text-avocado-dark text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
