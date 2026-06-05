import { useState, useEffect, useRef } from 'react'
import { X, Heart, ShoppingCart, Clock, Flame, ChefHat, Edit3, Check, Plus, Upload, Link2 } from 'lucide-react'

// 食材属性字典
const ingredientRuleMap = {
  '鸡胸肉': { calories: 150, time: 8, difficulty: '中等', steps: ['将鸡胸肉切丁少许盐腌制', '热锅下油将鸡胸肉煎至两面金黄'] },
  '虾仁': { calories: 80, time: 4, difficulty: '简单', steps: ['虾仁去虾线备用', '热锅将虾仁翻炒至变红'] },
  '牛肉': { calories: 200, time: 12, difficulty: '困难', steps: ['牛肉切薄片用料酒腌制', '热锅大火爆炒至变色'] },
  '三文鱼': { calories: 180, time: 10, difficulty: '困难', steps: ['三文鱼切块抹盐腌制', '热锅下油煎至两面金黄'] },
  '鳕鱼': { calories: 120, time: 8, difficulty: '简单', steps: ['鳕鱼切块用料酒腌制', '清蒸8分钟或煎至金黄'] },
  '鸡蛋': { calories: 70, time: 5, difficulty: '简单', steps: ['鸡蛋打散备用', '热锅摊成蛋饼或煮熟'] },
  '金枪鱼': { calories: 100, time: 3, difficulty: '简单', steps: ['金枪鱼罐头沥水', '可直接食用或拌沙拉'] },
  '西兰花': { calories: 30, time: 3, difficulty: '简单', steps: ['西兰花切小朵洗净', '放入沸水中焯水2分钟捞出'] },
  '菠菜': { calories: 20, time: 2, difficulty: '简单', steps: ['菠菜洗净去根', '焯水30秒沥干'] },
  '生菜': { calories: 15, time: 2, difficulty: '简单', steps: ['生菜叶洗净沥干', '可直接食用或垫底'] },
  '番茄': { calories: 25, time: 3, difficulty: '简单', steps: ['番茄洗净切块', '可直接食用或炒制'] },
  '黄瓜': { calories: 15, time: 2, difficulty: '简单', steps: ['黄瓜洗净切丝或切片', '可直接食用或凉拌'] },
  '胡萝卜': { calories: 25, time: 3, difficulty: '简单', steps: ['胡萝卜去皮切丝', '可生食或炒制'] },
  '紫甘蓝': { calories: 20, time: 3, difficulty: '简单', steps: ['紫甘蓝切丝泡冰水', '沥干后可直接食用'] },
  '牛油果': { calories: 80, time: 3, difficulty: '简单', steps: ['牛油果去皮切块', '可直接食用或压泥'] },
  '藜麦': { calories: 120, time: 15, difficulty: '简单', steps: ['藜麦淘洗干净', '加入1.5倍水蒸熟备用'] },
  '全麦吐司': { calories: 80, time: 2, difficulty: '简单', steps: ['吐司取出备用', '可烤制或直接食用'] },
  '荞麦面': { calories: 100, time: 10, difficulty: '简单', steps: ['荞麦面煮熟过冷水', '沥干后拌酱汁食用'] },
  '燕麦': { calories: 90, time: 5, difficulty: '简单', steps: ['燕麦用热水冲泡', '加入配料搅拌均匀'] },
  '南瓜': { calories: 40, time: 5, difficulty: '简单', steps: ['南瓜去皮切块', '可蒸熟或烤制'] },
  '蘑菇': { calories: 15, time: 3, difficulty: '简单', steps: ['蘑菇洗净切片', '热锅翻炒至软'] },
  '玉米粒': { calories: 30, time: 2, difficulty: '简单', steps: ['玉米粒洗净沥干', '可直接食用或炒制'] },
  '圣女果': { calories: 20, time: 2, difficulty: '简单', steps: ['圣女果洗净对半切开', '可直接食用'] },
  '小番茄': { calories: 20, time: 2, difficulty: '简单', steps: ['小番茄洗净', '可直接食用'] },
  '苹果': { calories: 50, time: 2, difficulty: '简单', steps: ['苹果去皮切块', '可直接食用'] },
  '香蕉': { calories: 60, time: 2, difficulty: '简单', steps: ['香蕉去皮切片', '可直接食用'] },
  '蓝莓': { calories: 30, time: 2, difficulty: '简单', steps: ['蓝莓洗净', '可直接食用'] },
  '草莓': { calories: 25, time: 2, difficulty: '简单', steps: ['草莓洗净去蒂', '可直接食用'] },
  '坚果': { calories: 50, time: 1, difficulty: '简单', steps: ['坚果剥壳', '可直接食用或撒在食物上'] },
  '鹰嘴豆': { calories: 70, time: 10, difficulty: '简单', steps: ['鹰嘴豆提前泡发', '煮熟备用'] },
  '柠檬': { calories: 5, time: 1, difficulty: '简单', steps: ['柠檬切片或挤汁', '可调味或装饰'] },
  '海苔': { calories: 10, time: 1, difficulty: '简单', steps: ['海苔撕碎', '可直接食用或调味'] },
  '芝麻': { calories: 15, time: 1, difficulty: '简单', steps: ['芝麻炒香', '撒在食物上提香'] },
  '葱花': { calories: 5, time: 1, difficulty: '简单', steps: ['葱切碎', '撒在食物上装饰'] },
  '蒜': { calories: 5, time: 1, difficulty: '简单', steps: ['蒜切末', '爆香后使用'] },
  '洋葱': { calories: 20, time: 3, difficulty: '简单', steps: ['洋葱切丝', '热锅炒香'] },
  '西葫芦': { calories: 15, time: 3, difficulty: '简单', steps: ['西葫芦切片', '可炒制或烤制'] },
  '彩椒': { calories: 20, time: 3, difficulty: '简单', steps: ['彩椒切块', '可炒制或生食'] },
  '椰奶': { calories: 40, time: 1, difficulty: '简单', steps: ['椰奶打开', '可直接饮用或入菜'] },
  '希腊酸奶': { calories: 50, time: 1, difficulty: '简单', steps: ['酸奶取出', '可直接食用'] },
  '牛奶': { calories: 40, time: 1, difficulty: '简单', steps: ['牛奶加热', '可冲泡燕麦或饮用'] },
  '奶油': { calories: 50, time: 2, difficulty: '简单', steps: ['奶油切块融化', '可用于烹饪'] },
  '鸡汤': { calories: 20, time: 1, difficulty: '简单', steps: ['鸡汤加热', '可用于煮汤或调味'] },
  '橄榄油': { calories: 30, time: 1, difficulty: '简单', steps: ['橄榄油倒入锅中', '可用于烹饪'] },
  '酱油': { calories: 10, time: 1, difficulty: '简单', steps: ['酱油取出', '可用于调味'] },
  '蒸鱼豉油': { calories: 10, time: 1, difficulty: '简单', steps: ['豉油取出', '用于蒸鱼调味'] },
  '蚝油': { calories: 10, time: 1, difficulty: '简单', steps: ['蚝油取出', '可用于调味'] },
  '醋': { calories: 5, time: 1, difficulty: '简单', steps: ['醋取出', '可用于凉拌调味'] },
  '蜂蜜': { calories: 30, time: 1, difficulty: '简单', steps: ['蜂蜜取出', '可用于调味'] },
  '芥末': { calories: 5, time: 1, difficulty: '简单', steps: ['芥末取出', '可用于调味'] },
  '肉桂粉': { calories: 5, time: 1, difficulty: '简单', steps: ['肉桂粉撒入', '可用于调味'] },
  '薄荷': { calories: 3, time: 1, difficulty: '简单', steps: ['薄荷叶洗净', '可用于装饰或调味'] },
  '葡萄干': { calories: 25, time: 1, difficulty: '简单', steps: ['葡萄干取出', '可直接食用或入菜'] },
  '核桃': { calories: 40, time: 1, difficulty: '简单', steps: ['核桃剥壳切碎', '可直接食用或入菜'] },
  '椰片': { calories: 20, time: 1, difficulty: '简单', steps: ['椰片取出', '可直接食用或装饰'] },
  '沙拉酱': { calories: 40, time: 1, difficulty: '简单', steps: ['沙拉酱取出', '拌入沙拉食用'] },
  '低脂蛋黄酱': { calories: 30, time: 1, difficulty: '简单', steps: ['蛋黄酱取出', '涂在吐司上食用'] },
  '意大利面': { calories: 130, time: 12, difficulty: '中等', steps: ['意大利面煮熟', '捞出沥干拌酱'] },
  '马铃薯': { calories: 70, time: 10, difficulty: '简单', steps: ['马铃薯去皮切块', '可煮熟或烤制'] },
}

// 可用于添加的食材选项
const availableIngredients = Object.keys(ingredientRuleMap)

// MAX_FILE_SIZE = 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024

const compressImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxSide = 900
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * ratio))
        const height = Math.max(1, Math.round(img.height * ratio))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas not supported'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Image decode failed'))
      img.src = String(reader.result || '')
    }
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}

// 计算食材总览
const calculateFromIngredients = (ingredients) => {
  let totalCalories = 0
  let totalTime = 0
  let hasHardIngredient = false
  const allSteps = []

  ingredients.forEach(ing => {
    const rule = ingredientRuleMap[ing]
    if (rule) {
      totalCalories += rule.calories
      totalTime += rule.time
      if (rule.difficulty === '困难') hasHardIngredient = true
      allSteps.push(...rule.steps)
    }
  })

  const uniqueSteps = [...new Set(allSteps)]

  let difficulty = '简单'
  if (hasHardIngredient) {
    difficulty = '困难'
  } else if (ingredients.some(ing => ingredientRuleMap[ing]?.difficulty === '中等')) {
    difficulty = '中等'
  }

  return {
    calories: totalCalories,
    time: totalTime,
    difficulty,
    steps: uniqueSteps.slice(0, 8)
  }
}

export default function RecipeDetailModal({ recipe, onClose, onFavorite, onAddToList, isFavorited, onSaveRecipe }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editIngredients, setEditIngredients] = useState([])
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')
  const [imageMode, setImageMode] = useState('url') // 'url' | 'upload'
  const [isComposing, setIsComposing] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (recipe) {
      setEditTitle(recipe.title)
      setEditImage(recipe.image)
      setEditIngredients([...recipe.ingredients])
      setImageError(false)
      setImageUploadError('')
    }
  }, [recipe])

  if (!recipe) return null

  const calculatedInfo = calculateFromIngredients(editIngredients)

  const handleDeleteIngredient = (ing) => {
    setEditIngredients(prev => prev.filter(i => i !== ing))
  }

  const handleAddIngredient = (ing) => {
    if (!editIngredients.includes(ing)) {
      setEditIngredients(prev => [...prev, ing])
    }
    setShowIngredientDropdown(false)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setImageUploadError('图片大小不能超过 2MB')
      return
    }

    setImageUploadError('')
    try {
      const dataUrl = await compressImageFile(file)
      setEditImage(dataUrl)
      setImageError(false)
    } catch {
      setImageUploadError('图片读取失败，请重试')
    }
  }

  const handleImageUrlChange = (url) => {
    setEditImage(url)
    setImageError(false)
    setImageUploadError('')
  }

  const handleSave = () => {
    if (!editImage) return

    const updatedRecipe = {
      ...recipe,
      title: editTitle,
      image: editImage,
      ingredients: editIngredients,
      calories: calculatedInfo.calories,
      time: calculatedInfo.time,
      steps: calculatedInfo.steps
    }

    onSaveRecipe(updatedRecipe)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(recipe.title)
    setEditImage(recipe.image)
    setEditIngredients([...recipe.ingredients])
    setImageError(false)
    setImageUploadError('')
    setImageMode('url')
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-[420px] sm:mx-auto h-[90vh] sm:h-[85vh] bg-[#FEFDF5] sm:rounded-t-3xl sm:rounded-b-3xl overflow-hidden flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X size={18} className="text-gray-600" />
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!editImage}
                className="px-4 py-1.5 text-sm bg-avocado-dark text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
              >
                <Check size={14} />
                保存
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm bg-avocado-light/20 text-avocado-dark rounded-lg flex items-center gap-1"
            >
              <Edit3 size={14} />
              编辑
            </button>
          )}
        </div>

        {/* 主内容区 */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Header Image */}
          <div className="relative h-52">
            <img
              src={editImage}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={() => {
                if (imageMode === 'url') setImageError(true)
              }}
            />
            {!editImage && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">请上传图片或输入链接</span>
              </div>
            )}
            {imageError && imageMode === 'url' && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center flex-col gap-1">
                <span className="text-red-500 text-sm">图片链接无效</span>
                <span className="text-xs text-gray-400">请尝试其他链接</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-3 py-1 bg-avocado-dark text-white text-xs font-medium rounded-full mb-2 inline-block">
                {recipe.category}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => { setIsComposing(false); setEditTitle(e.target.value); }}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (isComposing && e.key === 'Enter') e.preventDefault()
                  }}
                  className="w-full px-3 py-2 text-sm bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-lg border border-avocado-light/50 focus:outline-none focus:border-avocado-dark"
                  placeholder="输入菜品名称"
                />
              ) : (
                <h2 className="text-white font-bold text-xl">{recipe.title}</h2>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* 编辑模式：图片编辑 */}
            {isEditing && (
              <div className="mb-5 p-4 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">更换图片</h3>

                {/* 切换按钮 */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      imageMode === 'upload'
                        ? 'bg-avocado-dark text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Upload size={14} />
                    上传本地
                  </button>
                  <button
                    onClick={() => setImageMode('url')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      imageMode === 'url'
                        ? 'bg-avocado-dark text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Link2 size={14} />
                    网络链接
                  </button>
                </div>

                {/* 方式A：上传本地图片 */}
                {imageMode === 'upload' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-avocado-light rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-avocado-light/5 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-avocado-light/20 flex items-center justify-center">
                        <Upload size={24} className="text-avocado-dark" />
                      </div>
                      <span className="text-sm text-avocado-dark font-medium">点击选择图片</span>
                      <span className="text-xs text-gray-400">支持 JPG、PNG，最大 2MB</span>
                    </button>
                    {imageUploadError && (
                      <p className="text-xs text-red-500">{imageUploadError}</p>
                    )}
                    {editImage && editImage.startsWith('data:') && (
                      <p className="text-xs text-avocado-dark flex items-center gap-1">
                        <Check size={12} />
                        本地图片已选择
                      </p>
                    )}
                  </div>
                )}

                {/* 方式B：网络链接 */}
                {imageMode === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editImage.startsWith('data:') ? '' : editImage}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={(e) => { setIsComposing(false); handleImageUrlChange(e.target.value); }}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (isComposing && e.key === 'Enter') e.preventDefault()
                      }}
                      placeholder="粘贴 Unsplash 图片链接..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-avocado-light"
                    />
                    <p className="text-xs text-gray-400">建议使用 w=600&q=80 参数获取高清图片</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-avocado-light/20 flex items-center justify-center">
                  <Clock size={18} className="text-avocado-dark" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">制作时间</p>
                  <p className="font-semibold text-gray-800">{calculatedInfo.time} 分钟</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-avocado-light/20 flex items-center justify-center">
                  <Flame size={18} className="text-avocado-dark" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">热量</p>
                  <p className="font-semibold text-gray-800">{calculatedInfo.calories} kcal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-avocado-light/20 flex items-center justify-center">
                  <ChefHat size={18} className="text-avocado-dark" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">难度</p>
                  <p className="font-semibold text-gray-800">{calculatedInfo.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">主要食材</h3>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editIngredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-3 py-1.5 bg-avocado-light/20 text-avocado-dark text-sm rounded-lg flex items-center gap-1"
                      >
                        {ing}
                        <button
                          onClick={() => handleDeleteIngredient(ing)}
                          className="w-4 h-4 rounded-full bg-avocado-dark/20 flex items-center justify-center hover:bg-avocado-dark/40 transition-colors"
                        >
                          <X size={10} className="text-avocado-dark" />
                        </button>
                      </span>
                    ))}
                    {editIngredients.length === 0 && (
                      <span className="text-sm text-gray-400">请添加食材</span>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowIngredientDropdown(!showIngredientDropdown)}
                      className="w-full px-3 py-2 text-sm border border-dashed border-avocado-light text-avocado-dark rounded-lg flex items-center justify-center gap-1 hover:bg-avocado-light/10 transition-colors"
                    >
                      <Plus size={14} />
                      添加食材
                    </button>

                    {showIngredientDropdown && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                        {availableIngredients
                          .filter(ing => !editIngredients.includes(ing))
                          .map(ing => (
                            <button
                              key={ing}
                              onClick={() => handleAddIngredient(ing)}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-avocado-light/10 transition-colors flex items-center justify-between"
                            >
                              <span>{ing}</span>
                              <span className="text-xs text-gray-400">
                                +{ingredientRuleMap[ing]?.calories}kcal
                              </span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1.5 bg-white text-gray-600 text-sm rounded-xl border border-gray-100"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">制作步骤</h3>
              <ol className="space-y-3">
                {calculatedInfo.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-avocado-dark text-white text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons - 非编辑模式显示 */}
            {!isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={() => onFavorite(recipe.id)}
                  className={`flex-1 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    isFavorited
                      ? 'bg-avocado-dark text-white'
                      : 'bg-white text-avocado-dark border border-avocado-dark'
                  }`}
                >
                  <Heart size={18} className={isFavorited ? 'fill-white' : ''} />
                  {isFavorited ? '已收藏' : '收藏'}
                </button>
                <button
                  onClick={() => onAddToList(recipe)}
                  className="flex-1 py-3.5 bg-avocado-light text-white rounded-xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                  <ShoppingCart size={18} />
                  加入清单
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
