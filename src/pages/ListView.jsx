import { useMemo, useRef } from 'react'
import { Plus, X, Check, ShoppingCart } from 'lucide-react'

const parseManual = (raw) => {
  const text = (raw || '').trim()
  if (!text) return null
  const m = text.match(/^(.+?)(?:\s*[x×]\s*(\d+))?$/i)
  const name = (m?.[1] || '').trim()
  const count = Math.max(1, Number(m?.[2] || 1))
  if (!name) return null
  return { name, count }
}

export default function ListView({
  recipes,
  shoppingData,
  onAddRecipe,
  onRemoveRecipe,
  onToggleIngredientDone,
  onAddManual,
  onDeleteManual,
  onClearDone
}) {
  const manualInputRef = useRef(null)
  const recipeMap = useMemo(() => new Map(recipes.map(r => [r.id, r])), [recipes])

  const selectedRecipeEntries = useMemo(() => {
    return Object.entries(shoppingData.recipeCounts || {})
      .map(([id, count]) => ({ recipe: recipeMap.get(id), id, count }))
      .filter((x) => x.recipe)
  }, [recipeMap, shoppingData.recipeCounts])

  const ingredientEntries = useMemo(() => {
    const counts = {}

    Object.entries(shoppingData.recipeCounts || {}).forEach(([recipeId, recipeCount]) => {
      const recipe = recipeMap.get(recipeId)
      if (!recipe) return
      recipe.ingredients.forEach((ing) => {
        counts[ing] = (counts[ing] || 0) + Number(recipeCount || 0)
      })
    })

    Object.entries(shoppingData.manualCounts || {}).forEach(([name, count]) => {
      counts[name] = (counts[name] || 0) + Number(count || 0)
    })

    return Object.entries(counts)
      .filter(([name, count]) => count > 0 && !shoppingData.hidden?.[name])
      .sort(([a], [b]) => a.localeCompare(b, 'zh-Hans-CN'))
      .map(([name, count]) => ({
        name,
        count,
        done: Boolean(shoppingData.done?.[name]),
        isManual: Number(shoppingData.manualCounts?.[name] || 0) > 0
      }))
  }, [recipeMap, shoppingData.done, shoppingData.hidden, shoppingData.manualCounts, shoppingData.recipeCounts])

  const doneCount = ingredientEntries.filter(i => i.done).length

  const handleManualAdd = () => {
    const parsed = parseManual(manualInputRef.current?.value)
    if (!parsed) return
    onAddManual(parsed.name, parsed.count)
    manualInputRef.current.value = ''
  }

  return (
    <div>
      <header className="bg-gradient-to-b from-avocado-light/20 to-transparent px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">采购清单</h1>
        <p className="text-gray-500 text-sm">
          {doneCount}/{ingredientEntries.length} 已完成
        </p>
      </header>

      <main className="px-5 space-y-5 pb-28">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">快捷添加食谱</p>
            <p className="text-xs text-gray-400 mt-1">点一下添加到食谱袋</p>
          </div>
          <div className="px-4 py-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onAddRecipe(recipe.id)}
                  className="px-3 py-2 bg-cream text-gray-700 rounded-xl text-sm border border-gray-100 hover:border-avocado-light transition-colors max-w-[220px]"
                >
                  <span className="line-clamp-1">{recipe.title}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedRecipeEntries.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-400 mb-2">已选待购食谱</p>
              <div className="flex flex-wrap gap-2">
                {selectedRecipeEntries.map(({ recipe, id, count }) => (
                  <div
                    key={id}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-avocado-light/10 text-avocado-dark rounded-full border border-avocado-light/30 max-w-full"
                  >
                    <span className="text-sm line-clamp-1">{recipe.title}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-avocado-dark text-white rounded-full">
                      x{count}
                    </span>
                    <button
                      onClick={() => onRemoveRecipe(id)}
                      className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X size={12} className="text-avocado-dark" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {ingredientEntries.some(i => i.done) && (
          <div className="flex justify-end">
            <button
              onClick={onClearDone}
              className="px-3 py-2 text-xs bg-avocado-light/15 text-avocado-dark rounded-full border border-avocado-light/30 hover:bg-avocado-light/25 transition-colors"
            >
              清除已购项
            </button>
          </div>
        )}

        {ingredientEntries.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50">
              {ingredientEntries.map((item) => (
                <li key={item.name} className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => onToggleIngredientDone(item.name)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.done ? 'bg-avocado-dark border-avocado-dark' : 'border-gray-300'
                    }`}
                  >
                    {item.done && <Check size={14} className="text-white" />}
                  </button>
                  <span
                    className={`flex-1 ${
                      item.done ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-avocado-light/20 text-avocado-dark rounded-full border border-avocado-light/30">
                    x{item.count}
                  </span>
                  {item.isManual && (
                    <button
                      onClick={() => onDeleteManual(item.name)}
                      className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10">
            <ShoppingCart size={44} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">清单为空</p>
            <p className="text-sm text-gray-400 mt-1">从菜谱中添加，或手动补充临时采购项</p>
          </div>
        )}

        <div className="sticky bottom-16 z-50 pointer-events-auto">
          <div className="bg-[#FEFDF5] pt-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden pointer-events-auto">
              <div className="flex items-center gap-3 p-4 pointer-events-auto">
                <input
                  ref={manualInputRef}
                  type="text"
                  placeholder="手动添加（例如：抽纸 x1）"
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 pointer-events-auto"
                  onKeyDown={(e) => {
                    if (e.nativeEvent?.isComposing || e.keyCode === 229) return
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleManualAdd()
                    }
                  }}
                />
                <button
                  onClick={handleManualAdd}
                  className="w-10 h-10 bg-avocado-dark text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform pointer-events-auto"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
