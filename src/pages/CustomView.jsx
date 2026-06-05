import { useEffect, useRef, useState } from 'react'
import { Sparkles, ChefHat, Clock, Flame, Settings, Plus, X, Check } from 'lucide-react'

const DEFAULT_PREFERENCE_OPTIONS = {
  '🌾 主食': ['藜麦', '全麦吐司', '荞麦面', '燕麦', '南瓜', '紫薯', '糙米饭', '意面', '米饭', '马铃薯'],
  '🥬 蔬菜': ['牛油果', '西兰花', '菠菜', '生菜', '番茄', '黄瓜', '胡萝卜', '圣女果', '芦笋', '羽衣甘蓝', '玉米粒', '紫甘蓝', '西葫芦', '彩椒', '蘑菇', '洋葱'],
  '🥩 肉类': ['鸡胸肉', '虾仁', '牛肉', '三文鱼', '龙利鱼', '金枪鱼'],
  '🥚 蛋奶': ['鸡蛋', '水煮蛋', '希腊酸奶', '芝士片', '牛奶', '芝士'],
  '🍎 水果': ['草莓', '蓝莓', '香蕉', '奇异果', '苹果'],
  '🥜 点缀': ['坚果碎', '奇亚籽', '巴旦木', '黑胡椒', '橄榄油', '坚果', '沙拉酱', '低脂蛋黄酱', '蜂蜜', '柠檬', '海苔', '芝麻']
}

const STORAGE_KEY = 'customPreferenceOptions'

export default function CustomView({ favorites, onFavorite, onAddToList, onOpenRecipe, recipes }) {
  const [preferenceOptions, setPreferenceOptions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCE_OPTIONS
  })
  const [selectedPreferences, setSelectedPreferences] = useState([])
  const [generatedRecipes, setGeneratedRecipes] = useState([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isManaging, setIsManaging] = useState(false)
  const [addingToCategory, setAddingToCategory] = useState(null)
  const ingredientInputRef = useRef(null)

  useEffect(() => {
    if (!addingToCategory) return
    requestAnimationFrame(() => ingredientInputRef.current?.focus())
  }, [addingToCategory])

  const togglePreference = (pref) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    )
  }

  const handleDeleteIngredient = (category, ingredient) => {
    setPreferenceOptions(prev => ({
      ...prev,
      [category]: prev[category].filter(i => i !== ingredient)
    }))
    // 同时从已选偏好中移除
    setSelectedPreferences(prev => prev.filter(p => p !== ingredient))
  }

  const handleAddIngredient = (category) => {
    const inputValue = ingredientInputRef.current?.value?.trim()
    if (!inputValue) return

    setPreferenceOptions(prev => ({
      ...prev,
      [category]: [...prev[category], inputValue]
    }))

    if (ingredientInputRef.current) ingredientInputRef.current.value = ''
    setAddingToCategory(null)
  }

  const handleSaveAndExit = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferenceOptions))
    setIsManaging(false)
    setAddingToCategory(null)
    if (ingredientInputRef.current) ingredientInputRef.current.value = ''
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
    // 蔬菜类加成
    if (selectedPrefs.some(p => preferenceOptions['🥬 蔬菜']?.includes(p))) {
      score += 3
    }
    return score
  }

  const handleGenerate = () => {
    setHasGenerated(true)
    if (selectedPreferences.length === 0) {
      const shuffled = [...recipes].sort(() => Math.random() - 0.5)
      setGeneratedRecipes(shuffled.slice(0, 2))
      return
    }
    const scoredRecipes = recipes.map(recipe => ({
      ...recipe,
      score: calculateMatchScore(recipe, selectedPreferences)
    }))
    scoredRecipes.sort((a, b) => b.score - a.score)
    setGeneratedRecipes(scoredRecipes.slice(0, 2))
  }

  const PreferenceGroup = ({ title, category, options }) => (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-avocado-dark" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedPreferences.includes(opt)
          return (
            <div key={opt} className="relative group">
              <button
                onClick={() => !isManaging && togglePreference(opt)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isManaging
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : isSelected
                      ? 'bg-avocado-light/30 text-avocado-dark border border-avocado-light'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-avocado-light'
                }`}
              >
                {opt}
              </button>
              {isManaging && (
                <button
                  onClick={() => handleDeleteIngredient(category, opt)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          )
        })}
        {isManaging && (
          <div className="relative">
            {addingToCategory === category ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  ref={ingredientInputRef}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddIngredient(category)
                    }
                    if (e.key === 'Escape') {
                      setAddingToCategory(null)
                      if (ingredientInputRef.current) ingredientInputRef.current.value = ''
                    }
                  }}
                  placeholder="食材名"
                  className="w-20 px-2 py-1.5 text-sm border border-avocado-light rounded-full focus:outline-none focus:ring-1 focus:ring-avocado-light"
                  autoFocus
                />
                <button
                  onClick={() => handleAddIngredient(category)}
                  className="w-6 h-6 bg-avocado-dark text-white rounded-full flex items-center justify-center hover:bg-avocado-light transition-colors"
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingToCategory(category)}
                className="px-3 py-2 rounded-full text-sm border border-dashed border-gray-300 text-gray-400 hover:border-avocado-light hover:text-avocado-dark transition-colors flex items-center gap-1"
              >
                <Plus size={12} />
                添加
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      {/* 顶部渐变区域 */}
      <div className="bg-gradient-to-b from-avocado-light/30 to-transparent px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-700 mb-1">盲盒订制</h1>
            <p className="text-gray-500 text-sm">勾选食材偏好，开启专属轻食之旅</p>
          </div>
          <button
            onClick={() => isManaging ? handleSaveAndExit() : setIsManaging(true)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isManaging
                ? 'bg-avocado-dark text-white'
                : 'bg-white/80 text-gray-500 hover:text-avocado-dark'
            }`}
          >
            {isManaging ? <Check size={20} /> : <Settings size={20} />}
          </button>
        </div>
        {isManaging && (
          <p className="text-xs text-avocado-dark mt-2 bg-avocado-light/20 px-3 py-1.5 rounded-full inline-block">
            管理模式：删除或添加食材后，点击右上角 ✓ 保存
          </p>
        )}
      </div>

      <main className="px-5 -mt-2">
        {/* 偏好选择白色卡片 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
          {/* 顶部标题区 - 牛油果绿图标 */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <div className="w-11 h-11 rounded-xl bg-avocado-light/20 flex items-center justify-center">
              <ChefHat size={22} className="text-avocado-dark" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">选择你的偏好食材</h2>
              <p className="text-xs text-gray-400">
                {isManaging ? '管理模式' : '可单选或多选'}
              </p>
            </div>
          </div>

          <PreferenceGroup title="🌾 主食" category="🌾 主食" options={preferenceOptions['🌾 主食']} />
          <PreferenceGroup title="🥬 蔬菜" category="🥬 蔬菜" options={preferenceOptions['🥬 蔬菜']} />
          <PreferenceGroup title="🥩 肉类" category="🥩 肉类" options={preferenceOptions['🥩 肉类']} />
          <PreferenceGroup title="🥚 蛋奶" category="🥚 蛋奶" options={preferenceOptions['🥚 蛋奶']} />
          <PreferenceGroup title="🍎 水果" category="🍎 水果" options={preferenceOptions['🍎 水果']} />
          <PreferenceGroup title="🥜 点缀" category="🥜 点缀" options={preferenceOptions['🥜 点缀']} />

          {selectedPreferences.length > 0 && !isManaging && (
            <div className="mb-4 p-3 bg-avocado-light/10 rounded-xl">
              <p className="text-xs text-avocado-dark font-medium">
                已选: {selectedPreferences.join(' · ')}
              </p>
            </div>
          )}

          {!isManaging && (
            <button
              onClick={handleGenerate}
              className="w-full py-3.5 bg-avocado-dark text-white rounded-xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
            >
              <Sparkles size={18} />
              生成我的独家轻食
            </button>
          )}
        </div>

        {hasGenerated && generatedRecipes.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">为你量身定制</h2>
            <div className="space-y-4">
              {generatedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onOpenRecipe(recipe)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-avocado-dark text-white text-xs font-medium rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{recipe.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} className="text-avocado-light" />
                        <span className="text-xs">{recipe.time}分钟</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Flame size={14} className="text-avocado-light" />
                        <span className="text-xs">{recipe.calories} kcal</span>
                      </div>
                    </div>
                    <p className="text-xs text-avocado-dark">
                      点击查看详情和步骤 →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
