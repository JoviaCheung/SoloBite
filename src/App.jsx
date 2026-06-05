import { useEffect, useMemo, useState } from 'react'
import ViewportContainer from './components/ViewportContainer'
import RecipeDetailModal from './components/RecipeDetailModal'
import HomeView from './pages/HomeView'
import CustomView from './pages/CustomView'
import ListView from './pages/ListView'
import FavoriteView from './pages/FavoriteView'
import { recipesData as defaultRecipes } from './data/recipesData'
import { Soup } from 'lucide-react'

const SHOPPING_STORAGE_KEY = 'shoppingData'
const MERGED_RECIPES_STORAGE_KEY = 'mergedRecipes'
const DELETED_RECIPES_STORAGE_KEY = 'deletedRecipeIds'
const RITUAL_SESSION_KEY = 'ritualSeen'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [ritualPhase, setRitualPhase] = useState(() => {
    try {
      return sessionStorage.getItem(RITUAL_SESSION_KEY) ? 'hidden' : 'boiling'
    } catch {
      return 'hidden'
    }
  })
  const [showNav, setShowNav] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [shoppingData, setShoppingData] = useState(() => {
    const saved = localStorage.getItem(SHOPPING_STORAGE_KEY)
    if (saved) return JSON.parse(saved)

    const legacySaved = localStorage.getItem('shoppingList')
    if (legacySaved) {
      try {
        const legacy = JSON.parse(legacySaved)
        if (Array.isArray(legacy)) {
          const recipeCounts = {}
          const manualCounts = {}
          const doneCandidates = {}

          legacy.forEach((item) => {
            const name = item?.text?.trim()
            if (!name) return

            if (item.recipeId) {
              recipeCounts[item.recipeId] = recipeCounts[item.recipeId] || 1
            } else {
              manualCounts[name] = (manualCounts[name] || 0) + 1
            }

            if (!doneCandidates[name]) doneCandidates[name] = []
            doneCandidates[name].push(Boolean(item.done))
          })

          const done = Object.fromEntries(
            Object.entries(doneCandidates).map(([name, flags]) => [name, flags.every(Boolean)])
          )

          return { recipeCounts, manualCounts, done, hidden: {} }
        }
      } catch {
      }
    }

    return { recipeCounts: {}, manualCounts: {}, done: {}, hidden: {} }
  })
  // 自定义菜谱数据（编辑后的菜谱）
  const [customRecipes, setCustomRecipes] = useState(() => {
    const saved = localStorage.getItem('customRecipes')
    return saved ? JSON.parse(saved) : []
  })
  const [deletedRecipeIds, setDeletedRecipeIds] = useState(() => {
    const saved = localStorage.getItem(DELETED_RECIPES_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'customRecipes') {
        const next = e.newValue ? JSON.parse(e.newValue) : []
        setCustomRecipes(Array.isArray(next) ? next : [])
      }
      if (e.key === DELETED_RECIPES_STORAGE_KEY) {
        const next = e.newValue ? JSON.parse(e.newValue) : []
        setDeletedRecipeIds(Array.isArray(next) ? next : [])
      }
    }

    const handleCustomRecipesUpdated = () => {
      const saved = localStorage.getItem('customRecipes')
      const next = saved ? JSON.parse(saved) : []
      setCustomRecipes(Array.isArray(next) ? next : [])
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('customRecipesUpdated', handleCustomRecipesUpdated)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('customRecipesUpdated', handleCustomRecipesUpdated)
    }
  }, [])

  const recipes = useMemo(() => {
    const deletedSet = new Set(deletedRecipeIds)
    const defaultIdSet = new Set(defaultRecipes.map(r => r.id))

    const customMap = customRecipes.reduce((acc, recipe) => {
      acc[recipe.id] = recipe
      return acc
    }, {})

    const extraRecipes = customRecipes
      .filter(r => !defaultIdSet.has(r.id))
      .filter(r => !deletedSet.has(r.id))

    const mappedDefaults = defaultRecipes
      .filter(r => !deletedSet.has(r.id))
      .map(recipe => customMap[recipe.id] || recipe)

    return [...extraRecipes, ...mappedDefaults]
  }, [customRecipes, deletedRecipeIds])

  useEffect(() => {
    localStorage.setItem(MERGED_RECIPES_STORAGE_KEY, JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    if (ritualPhase !== 'boiling') return
    const ms = 3000 + Math.floor(Math.random() * 2001)
    const t = window.setTimeout(() => setRitualPhase('ready'), ms)
    return () => window.clearTimeout(t)
  }, [ritualPhase])

  useEffect(() => {
    if (ritualPhase !== 'hidden') {
      setShowNav(false)
      return
    }
    setShowNav(false)
    const t = window.setTimeout(() => setShowNav(true), 50)
    return () => window.clearTimeout(t)
  }, [ritualPhase])

  const handleFavorite = (recipeId) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const handleAddToList = (recipe) => {
    setShoppingData((prev) => {
      const nextHidden = { ...(prev.hidden || {}) }
      const nextDone = { ...(prev.done || {}) }
      recipe.ingredients.forEach((ing) => {
        delete nextHidden[ing]
        delete nextDone[ing]
      })
      const next = {
        ...prev,
        recipeCounts: {
          ...prev.recipeCounts,
          [recipe.id]: (prev.recipeCounts[recipe.id] || 0) + 1
        },
        hidden: nextHidden,
        done: nextDone
      }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleSaveRecipe = (updatedRecipe) => {
    setCustomRecipes((prev) => {
      const existingIndex = prev.findIndex(r => r.id === updatedRecipe.id)
      let nextCustomRecipes
      if (existingIndex >= 0) {
        nextCustomRecipes = [...prev]
        nextCustomRecipes[existingIndex] = updatedRecipe
      } else {
        nextCustomRecipes = [...prev, updatedRecipe]
      }

      try {
        localStorage.setItem('customRecipes', JSON.stringify(nextCustomRecipes))
      } catch (e) {
        window.alert('保存失败：本地存储空间不足。建议使用网络图片链接，或上传更小的图片。')
      }

      window.dispatchEvent(new Event('customRecipesUpdated'))
      return nextCustomRecipes
    })

    setSelectedRecipe(updatedRecipe)
  }

  const handleCreateRecipe = (newRecipe) => {
    setCustomRecipes((prev) => {
      const nextCustomRecipes = [newRecipe, ...prev]
      try {
        localStorage.setItem('customRecipes', JSON.stringify(nextCustomRecipes))
      } catch (e) {
        window.alert('保存失败：本地存储空间不足。建议使用网络图片链接，或上传更小的图片。')
      }
      window.dispatchEvent(new Event('customRecipesUpdated'))
      return nextCustomRecipes
    })

    setDeletedRecipeIds((prev) => {
      const nextDeleted = prev.filter(id => id !== newRecipe.id)
      localStorage.setItem(DELETED_RECIPES_STORAGE_KEY, JSON.stringify(nextDeleted))
      return nextDeleted
    })
  }

  const handleDeleteRecipe = (recipeId) => {
    const nextCustomRecipes = customRecipes.filter(r => r.id !== recipeId)
    const nextDeleted = deletedRecipeIds.includes(recipeId)
      ? deletedRecipeIds
      : [recipeId, ...deletedRecipeIds]

    const nextFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : favorites

    setCustomRecipes(nextCustomRecipes)
    setDeletedRecipeIds(nextDeleted)
    setFavorites(nextFavorites)
    localStorage.setItem('customRecipes', JSON.stringify(nextCustomRecipes))
    localStorage.setItem(DELETED_RECIPES_STORAGE_KEY, JSON.stringify(nextDeleted))
    localStorage.setItem('favorites', JSON.stringify(nextFavorites))
    window.dispatchEvent(new Event('customRecipesUpdated'))

    if (selectedRecipe?.id === recipeId) setSelectedRecipe(null)

    setShoppingData((prev) => {
      const nextRecipeCounts = { ...(prev.recipeCounts || {}) }
      if (nextRecipeCounts[recipeId]) delete nextRecipeCounts[recipeId]
      const next = { ...prev, recipeCounts: nextRecipeCounts }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleAddRecipeToBag = (recipeId) => {
    setShoppingData((prev) => {
      const recipe = recipes.find(r => r.id === recipeId)
      const nextHidden = { ...(prev.hidden || {}) }
      const nextDone = { ...(prev.done || {}) }
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          delete nextHidden[ing]
          delete nextDone[ing]
        })
      }
      const next = {
        ...prev,
        recipeCounts: {
          ...prev.recipeCounts,
          [recipeId]: (prev.recipeCounts[recipeId] || 0) + 1
        },
        hidden: nextHidden,
        done: nextDone
      }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleRemoveRecipeFromBag = (recipeId) => {
    setShoppingData((prev) => {
      const current = prev.recipeCounts[recipeId] || 0
      if (current <= 0) return prev
      const nextRecipeCounts = { ...prev.recipeCounts, [recipeId]: current - 1 }
      if (nextRecipeCounts[recipeId] <= 0) delete nextRecipeCounts[recipeId]

      const next = { ...prev, recipeCounts: nextRecipeCounts }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleToggleIngredientDone = (name) => {
    setShoppingData((prev) => {
      const nextDone = { ...(prev.done || {}) }
      nextDone[name] = !nextDone[name]
      const next = {
        ...prev,
        done: nextDone
      }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleAddManualCount = (name, count) => {
    if (!name || !count) return
    setShoppingData((prev) => {
      const nextHidden = { ...(prev.hidden || {}) }
      const nextDone = { ...(prev.done || {}) }
      delete nextHidden[name]
      delete nextDone[name]
      const next = {
        ...prev,
        manualCounts: {
          ...prev.manualCounts,
          [name]: (prev.manualCounts[name] || 0) + count
        },
        hidden: nextHidden,
        done: nextDone
      }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleDeleteManualIngredient = (name) => {
    if (!name) return
    setShoppingData((prev) => {
      const nextManualCounts = { ...(prev.manualCounts || {}) }
      const nextDone = { ...(prev.done || {}) }
      const nextHidden = { ...(prev.hidden || {}) }
      delete nextManualCounts[name]
      delete nextDone[name]
      delete nextHidden[name]
      const next = { ...prev, manualCounts: nextManualCounts, done: nextDone, hidden: nextHidden }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleClearDoneItems = () => {
    setShoppingData((prev) => {
      const nextManualCounts = { ...(prev.manualCounts || {}) }
      const nextHidden = { ...(prev.hidden || {}) }
      const nextDone = { ...(prev.done || {}) }

      Object.entries(nextDone).forEach(([name, isDone]) => {
        if (!isDone) return
        if (nextManualCounts[name]) delete nextManualCounts[name]
        nextHidden[name] = true
        delete nextDone[name]
      })

      const next = { ...prev, manualCounts: nextManualCounts, hidden: nextHidden, done: nextDone }
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const renderPage = () => {
    const commonProps = {
      favorites,
      onFavorite: handleFavorite,
      onAddToList: handleAddToList,
      onOpenRecipe: setSelectedRecipe
    }

    switch (activeTab) {
      case 'home':
        return <HomeView {...commonProps} recipes={recipes} onCreateRecipe={handleCreateRecipe} onDeleteRecipe={handleDeleteRecipe} />
      case 'custom':
        return <CustomView {...commonProps} recipes={recipes} />
      case 'list':
        return (
          <ListView
            recipes={recipes}
            shoppingData={shoppingData}
            onAddRecipe={handleAddRecipeToBag}
            onRemoveRecipe={handleRemoveRecipeFromBag}
            onToggleIngredientDone={handleToggleIngredientDone}
            onAddManual={handleAddManualCount}
            onDeleteManual={handleDeleteManualIngredient}
            onClearDone={handleClearDoneItems}
          />
        )
      case 'favorite':
        return (
          <FavoriteView
            {...commonProps}
            recipes={recipes}
            onRemoveFavorite={handleFavorite}
          />
        )
      default:
        return <HomeView {...commonProps} recipes={recipes} />
    }
  }

  return (
    <>
      {ritualPhase !== 'hidden' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/0">
          <style>{`
            @keyframes ritualWobble { 0%,100%{ transform: rotate(-1.5deg) } 50%{ transform: rotate(1.5deg) } }
            @keyframes ritualLid { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
            @keyframes ritualSteam { 0%{ transform: translateY(10px) scale(0.9); opacity: 0 } 20%{ opacity: 0.9 } 100%{ transform: translateY(-42px) scale(1.25); opacity: 0 } }
            @keyframes ritualFadeIn { from{ opacity: 0; transform: translateY(6px) } to{ opacity: 1; transform: translateY(0) } }
            @keyframes ritualExit { from{ opacity: 1; transform: translateY(0) } to{ opacity: 0; transform: translateY(-28px) } }
          `}</style>
          <div
            className={`relative w-full h-screen sm:h-[85vh] sm:max-w-[420px] bg-[#FEFDF5] sm:rounded-3xl shadow-lg overflow-hidden flex flex-col items-center justify-center ${
              ritualPhase === 'exiting' ? '' : ''
            }`}
            style={ritualPhase === 'exiting' ? { animation: 'ritualExit 600ms ease forwards' } : undefined}
          >
            <div
              className="relative flex flex-col items-center justify-center"
              style={ritualPhase === 'boiling' ? { animation: 'ritualWobble 900ms ease-in-out infinite' } : { animation: 'ritualWobble 1800ms ease-in-out infinite' }}
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-avocado-dark/15 border border-avocado-dark/20"
                  style={ritualPhase === 'boiling' ? { animation: 'ritualLid 700ms ease-in-out infinite' } : { animation: 'ritualLid 2000ms ease-in-out infinite' }}
                />
                <Soup size={84} className="text-avocado-dark" strokeWidth={1.6} />

                <span
                  className="absolute -top-2 left-7 w-2.5 h-2.5 rounded-full bg-avocado-light/35"
                  style={ritualPhase === 'boiling' ? { animation: 'ritualSteam 1300ms ease-in-out infinite' } : { animation: 'ritualSteam 2600ms ease-in-out infinite' }}
                />
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-avocado-light/30"
                  style={ritualPhase === 'boiling' ? { animation: 'ritualSteam 1500ms ease-in-out infinite 200ms' } : { animation: 'ritualSteam 2800ms ease-in-out infinite 400ms' }}
                />
                <span
                  className="absolute -top-2 right-7 w-3 h-3 rounded-full bg-avocado-light/25"
                  style={ritualPhase === 'boiling' ? { animation: 'ritualSteam 1400ms ease-in-out infinite 500ms' } : { animation: 'ritualSteam 3000ms ease-in-out infinite 700ms' }}
                />
              </div>

              {ritualPhase === 'boiling' && (
                <p className="mt-6 text-sm text-gray-400">美味正在酝酿中...</p>
              )}

              {ritualPhase !== 'boiling' && (
                <div className="mt-6 flex flex-col items-center" style={{ animation: 'ritualFadeIn 520ms ease forwards' }}>
                  <button
                    onClick={() => {
                      setRitualPhase('exiting')
                      window.setTimeout(() => {
                        try {
                          sessionStorage.setItem(RITUAL_SESSION_KEY, '1')
                        } catch {
                        }
                        setRitualPhase('hidden')
                      }, 620)
                    }}
                    className="px-8 py-4 bg-avocado-dark text-white rounded-2xl font-semibold shadow-lg shadow-avocado-dark/20 active:scale-[0.98] transition-transform"
                  >
                    今日吃咩嘢
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {ritualPhase === 'hidden' && (
        <ViewportContainer activeTab={activeTab} onTabChange={setActiveTab} showNav={showNav}>
          {renderPage()}
        </ViewportContainer>
      )}

      {/* Modal - 渲染在 ViewportContainer 外部，但宽度约束相同 */}
      {ritualPhase === 'hidden' && selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onFavorite={handleFavorite}
          onAddToList={(recipe) => {
            handleAddToList(recipe)
            setSelectedRecipe(null)
          }}
          isFavorited={favorites.includes(selectedRecipe.id)}
          onSaveRecipe={handleSaveRecipe}
        />
      )}
    </>
  )
}
