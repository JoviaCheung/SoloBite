import { useState, useEffect } from 'react'
import { Heart, Clock, Flame, Plus } from 'lucide-react'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { recipesData } from '../data/recipesData'

export default function FavoritesPage({ onAddToList }) {
  const [favorites, setFavorites] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const favoriteRecipes = recipesData.filter((r) => favorites.includes(r.id))

  const handleRemoveFavorite = (recipeId) => {
    const newFavorites = favorites.filter((id) => id !== recipeId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const handleAddToList = (recipe) => {
    onAddToList(recipe)
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <header className="bg-gradient-to-b from-avocado-light/20 to-transparent px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">我的收藏</h1>
        <p className="text-gray-500 text-sm">共 {favoriteRecipes.length} 道收藏菜谱</p>
      </header>

      <main className="px-5">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {favoriteRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart size={16} className="text-avocado-dark fill-avocado-dark" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 bg-avocado-dark/80 text-white text-xs rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {recipe.time}分钟
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Flame size={10} />
                      {recipe.calories}kcal
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">还没有收藏菜谱</p>
            <p className="text-sm text-gray-400 mt-1">去今日推荐看看吧</p>
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onFavorite={(id) => {
            handleRemoveFavorite(id)
            setSelectedRecipe(null)
          }}
          onAddToList={(recipe) => {
            handleAddToList(recipe)
            setSelectedRecipe(null)
          }}
          isFavorited={true}
        />
      )}
    </div>
  )
}
