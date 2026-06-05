import { useState } from 'react'
import { Sparkles, ChefHat, Clock, Flame } from 'lucide-react'
import { recipesData } from '../data/recipesData'
import RecipeDetailModal from '../components/RecipeDetailModal'

const preferenceOptions = {
  '🌾 主食': ['藜麦', '全麦吐司', '荞麦面', '燕麦', '南瓜', '紫薯', '糙米饭', '意面', '米饭', '马铃薯'],
  '🥬 蔬菜': ['牛油果', '西兰花', '菠菜', '生菜', '番茄', '黄瓜', '胡萝卜', '圣女果', '芦笋', '羽衣甘蓝', '玉米粒', '紫甘蓝', '西葫芦', '彩椒', '蘑菇', '洋葱'],
  '🥩 肉类': ['鸡胸肉', '虾仁', '牛肉', '三文鱼', '龙利鱼', '金枪鱼'],
  '🥚 蛋奶': ['鸡蛋', '水煮蛋', '希腊酸奶', '芝士片', '牛奶', '芝士'],
  '🍎 水果': ['草莓', '蓝莓', '香蕉', '奇异果', '苹果'],
  '🥜 点缀': ['坚果碎', '奇亚籽', '巴旦木', '黑胡椒', '橄榄油', '坚果', '沙拉酱', '低脂蛋黄酱', '蜂蜜', '柠檬', '海苔', '芝麻']
}

export default function MysteryBoxPage({ onFavorite, onAddToList }) {
  const [selectedPreferences, setSelectedPreferences] = useState([])
  const [generatedRecipes, setGeneratedRecipes] = useState([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const togglePreference = (pref) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    )
  }

  const calculateMatchScore = (recipe, selectedPrefs) => {
    if (selectedPrefs.length === 0) return 0
    let score = 0
    recipe.ingredients.forEach(ing => {
      selectedPrefs.forEach(pref => {
        if (ing.includes(pref) || pref.includes(ing)) {
          score += 10
        }
      })
    })
    // 晚餐偏好加成
    if (selectedPrefs.some(p => preferenceOptions['🥩 肉类'].includes(p))) {
      if (recipe.category === '晚餐') score += 5
    }
    // 蔬菜类加成
    if (selectedPrefs.some(p => preferenceOptions['🥬 蔬菜'].includes(p))) {
      score += 3
    }
    return score
  }

  const handleGenerate = () => {
    setHasGenerated(true)
    if (selectedPreferences.length === 0) {
      const shuffled = [...recipesData].sort(() => Math.random() - 0.5)
      setGeneratedRecipes(shuffled.slice(0, 2))
      return
    }
    const scoredRecipes = recipesData.map(recipe => ({
      ...recipe,
      score: calculateMatchScore(recipe, selectedPreferences)
    }))
    scoredRecipes.sort((a, b) => b.score - a.score)
    const matched = scoredRecipes.slice(0, 2)
    setGeneratedRecipes(matched)
  }

  const handleFavorite = (recipeId) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    onFavorite(recipeId)
  }

  const PreferenceGroup = ({ title, options }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-avocado-dark" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedPreferences.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => togglePreference(opt)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-avocado-dark text-white shadow-md'
                  : 'bg-cream text-gray-600 border border-gray-200 hover:border-avocado-light'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <header className="bg-gradient-to-b from-avocado-light/20 to-transparent px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">盲盒订制</h1>
        <p className="text-gray-500 text-sm">勾选食材偏好，开启专属轻食之旅</p>
      </header>

      <main className="px-5">
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-avocado-light/20 flex items-center justify-center">
              <ChefHat size={20} className="text-avocado-dark" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">选择你的偏好食材</h2>
              <p className="text-xs text-gray-400">可单选或多选</p>
            </div>
          </div>

          <PreferenceGroup title="🌾 主食" options={preferenceOptions['🌾 主食']} />
          <PreferenceGroup title="🥬 蔬菜" options={preferenceOptions['🥬 蔬菜']} />
          <PreferenceGroup title="🥩 肉类" options={preferenceOptions['🥩 肉类']} />
          <PreferenceGroup title="🥚 蛋奶" options={preferenceOptions['🥚 蛋奶']} />
          <PreferenceGroup title="🍎 水果" options={preferenceOptions['🍎 水果']} />
          <PreferenceGroup title="🥜 点缀" options={preferenceOptions['🥜 点缀']} />

          {selectedPreferences.length > 0 && (
            <div className="mb-4 p-3 bg-avocado-light/10 rounded-xl">
              <p className="text-xs text-avocado-dark font-medium">
                已选: {selectedPreferences.join(' · ')}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-avocado-dark to-avocado-light text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-avocado-dark/20"
          >
            <Sparkles size={20} />
            生成我的独家轻食
          </button>
        </div>

        {hasGenerated && generatedRecipes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">为你量身定制</h2>
              <span className="text-xs text-gray-400">根据您的偏好智能匹配</span>
            </div>

            <div className="space-y-4">
              {generatedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-avocado-dark text-white text-xs font-medium rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{recipe.name}</h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={16} className="text-avocado-light" />
                        <span className="text-sm">{recipe.time}分钟</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Flame size={16} className="text-avocado-light" />
                        <span className="text-sm">{recipe.calories} kcal</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">主要食材</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.ingredients.slice(0, 4).map((ing) => (
                          <span
                            key={ing}
                            className="px-2 py-1 bg-cream text-gray-600 text-xs rounded-lg"
                          >
                            {ing}
                          </span>
                        ))}
                        {recipe.ingredients.length > 4 && (
                          <span className="px-2 py-1 bg-cream text-gray-400 text-xs rounded-lg">
                            +{recipe.ingredients.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-2">制作步骤</p>
                      <ol className="space-y-1">
                        {recipe.steps.slice(0, 2).map((step, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-avocado-dark font-medium">{i + 1}.</span>
                            <span className="flex-1 line-clamp-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="text-xs text-avocado-dark mt-2">
                        点击查看全部 {recipe.steps.length} 步 →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasGenerated && generatedRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
              <ChefHat size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">未找到匹配的菜谱</p>
            <p className="text-sm text-gray-400 mt-1">试试选择其他食材</p>
          </div>
        )}
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
