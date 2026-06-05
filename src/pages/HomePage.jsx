import { useState } from 'react'
import { Heart, Clock, Flame } from 'lucide-react'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { recipesData } from '../data/recipesData'

export default function HomePage({ onFavorite, onAddToList }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [favorites, setFavorites] = useState([])

  const handleFavorite = (recipeId) => {
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
    onFavorite(recipeId)
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <header className="bg-gradient-to-b from-avocado-light/20 to-transparent px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">今日推荐</h1>
        <p className="text-gray-500 text-sm">发现健康美味的轻食菜谱</p>
      </header>

      <main className="px-5 grid grid-cols-1 gap-4">
        {recipesData.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
          >
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleFavorite(recipe.id)
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
              >
                <Heart
                  size={16}
                  className={favorites.includes(recipe.id) || localStorage.getItem('favorites')?.includes(recipe.id) ? 'text-avocado-dark fill-avocado-dark' : 'text-gray-400'}
                />
              </button>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 bg-avocado-dark/80 text-white text-xs rounded-full">
                  {recipe.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{recipe.name}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {recipe.time}分钟
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={14} />
                  {recipe.calories}kcal
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.slice(0, 3).map((tag) => (
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
        ))}
      </main>

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onFavorite={handleFavorite}
          onAddToList={(recipe) => {
            onAddToList(recipe)
            setSelectedRecipe(null)
          }}
          isFavorited={favorites.includes(selectedRecipe.id)}
        />
      )}
    </div>
  )
}
