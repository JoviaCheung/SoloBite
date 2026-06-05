import { useRef, useState } from 'react'
import { Heart, Clock, Flame, Plus, Trash2, X, Upload, Link2, Check } from 'lucide-react'

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

export default function HomeView({ favorites, onFavorite, onAddToList, onOpenRecipe, recipes, onCreateRecipe, onDeleteRecipe }) {
  const [isCreating, setIsCreating] = useState(false)
  const [createCategory, setCreateCategory] = useState('早餐')
  const [createIngredients, setCreateIngredients] = useState([])
  const ingredientInputRef = useRef(null)

  const [imageMode, setImageMode] = useState('upload')
  const [uploadedImage, setUploadedImage] = useState('')
  const [imageUrlPreview, setImageUrlPreview] = useState('')
  const [imageUploadError, setImageUploadError] = useState('')

  const titleRef = useRef(null)
  const timeRef = useRef(null)
  const caloriesRef = useRef(null)
  const imageUrlRef = useRef(null)
  const fileInputRef = useRef(null)

  const resetCreateForm = () => {
    if (titleRef.current) titleRef.current.value = ''
    if (timeRef.current) timeRef.current.value = ''
    if (caloriesRef.current) caloriesRef.current.value = ''
    if (ingredientInputRef.current) ingredientInputRef.current.value = ''
    if (imageUrlRef.current) imageUrlRef.current.value = ''
    setCreateCategory('早餐')
    setCreateIngredients([])
    setImageMode('upload')
    setUploadedImage('')
    setImageUrlPreview('')
    setImageUploadError('')
  }

  const handleAddIngredient = () => {
    const value = ingredientInputRef.current?.value?.trim()
    if (!value) return
    setCreateIngredients(prev => (prev.includes(value) ? prev : [...prev, value]))
    ingredientInputRef.current.value = ''
  }

  const handleRemoveIngredient = (name) => {
    setCreateIngredients(prev => prev.filter(i => i !== name))
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
      setUploadedImage(dataUrl)
    } catch {
      setImageUploadError('图片读取失败，请重试')
    }
  }

  const handleSaveNewRecipe = () => {
    const title = titleRef.current?.value?.trim()
    if (!title) return

    const time = Math.max(1, Number(timeRef.current?.value || 0) || 10)
    const calories = Math.max(0, Number(caloriesRef.current?.value || 0) || 200)

    const imageFromUrl = imageUrlRef.current?.value?.trim()
    const image = imageMode === 'upload'
      ? (uploadedImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80')
      : (imageFromUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80')

    const newRecipe = {
      id: `user-${Date.now()}`,
      title,
      category: createCategory,
      time,
      calories,
      image,
      ingredients: createIngredients,
      steps: []
    }

    onCreateRecipe?.(newRecipe)
    setIsCreating(false)
    resetCreateForm()
  }

  const handleDelete = (recipeId, e) => {
    e.stopPropagation()
    const ok = window.confirm('确定要删除这道菜谱吗？此操作无法撤销。')
    if (!ok) return
    onDeleteRecipe?.(recipeId)
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-avocado-light/30 to-transparent px-5 pt-12 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-700 mb-1">今日推荐</h1>
            <p className="text-gray-500 text-sm">发现健康美味的轻食菜谱</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="w-10 h-10 rounded-xl bg-white/80 text-avocado-dark flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <main className="px-5 space-y-4 -mt-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onOpenRecipe(recipe)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
          >
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-44 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-avocado-dark text-white text-xs font-medium rounded-full">
                  {recipe.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite(recipe.id)
                  }}
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <Heart
                    size={18}
                    className={favorites.includes(recipe.id) ? 'text-avocado-dark fill-avocado-dark' : 'text-gray-400'}
                  />
                </button>
                <button
                  onClick={(e) => handleDelete(recipe.id, e)}
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <Trash2 size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-3">{recipe.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-avocado-light" />
                  {recipe.time}分钟
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame size={16} className="text-avocado-light" />
                  {recipe.calories}kcal
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0" onClick={() => { setIsCreating(false); resetCreateForm() }} />
          <div className="relative w-full sm:max-w-[420px] sm:mx-auto h-[90vh] sm:h-[85vh] bg-[#FEFDF5] sm:rounded-t-3xl sm:rounded-b-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => { setIsCreating(false); resetCreateForm() }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700">新建菜谱</span>
              <button
                onClick={handleSaveNewRecipe}
                className="px-4 py-1.5 text-sm bg-avocado-dark text-white rounded-lg flex items-center gap-1"
              >
                <Check size={14} />
                保存
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">菜品名称</p>
                <input
                  ref={titleRef}
                  type="text"
                  placeholder="例如：牛油果鸡胸沙拉"
                  className="w-full px-3 py-2 text-sm bg-white text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-avocado-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">分类</p>
                  <select
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-avocado-light"
                  >
                    <option value="早餐">早餐</option>
                    <option value="午餐">午餐</option>
                    <option value="晚餐">晚餐</option>
                    <option value="万能">万能</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">时间（分钟）</p>
                  <input
                    ref={timeRef}
                    type="number"
                    placeholder="10"
                    className="w-full px-3 py-2 text-sm bg-white text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-avocado-light"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-xs text-gray-500">热量（kcal）</p>
                  <input
                    ref={caloriesRef}
                    type="number"
                    placeholder="300"
                    className="w-full px-3 py-2 text-sm bg-white text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-avocado-light"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-500">菜谱图片</p>
                <div className="flex gap-2">
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

                {imageMode === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-avocado-light rounded-xl flex items-center justify-center gap-2 hover:bg-avocado-light/5 transition-colors"
                    >
                      <Upload size={18} className="text-avocado-dark" />
                      <span className="text-sm text-avocado-dark font-medium">点击选择图片（≤2MB）</span>
                    </button>
                    {imageUploadError && (
                      <p className="text-xs text-red-500">{imageUploadError}</p>
                    )}
                    {uploadedImage && (
                      <img src={uploadedImage} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                    )}
                  </div>
                )}

                {imageMode === 'url' && (
                  <div className="space-y-2">
                    <input
                      ref={imageUrlRef}
                      type="text"
                      placeholder="粘贴 Unsplash 图片链接..."
                      onInput={(e) => setImageUrlPreview(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-avocado-light"
                    />
                    {imageUrlPreview && (
                      <img src={imageUrlPreview} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">食材</p>
                  <span className="text-[10px] text-gray-400">回车添加</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={ingredientInputRef}
                    type="text"
                    placeholder="输入食材名称..."
                    className="flex-1 px-3 py-2 text-sm bg-white text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-avocado-light"
                    onKeyDown={(e) => {
                      if (e.nativeEvent?.isComposing || e.keyCode === 229) return
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddIngredient()
                      }
                    }}
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="w-10 h-10 bg-avocado-dark text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {createIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1.5 bg-avocado-light/20 text-avocado-dark text-sm rounded-lg flex items-center gap-1"
                    >
                      {ing}
                      <button
                        onClick={() => handleRemoveIngredient(ing)}
                        className="w-4 h-4 rounded-full bg-avocado-dark/20 flex items-center justify-center hover:bg-avocado-dark/40 transition-colors"
                      >
                        <X size={10} className="text-avocado-dark" />
                      </button>
                    </span>
                  ))}
                  {createIngredients.length === 0 && (
                    <span className="text-sm text-gray-400">请添加至少 1 个食材</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
