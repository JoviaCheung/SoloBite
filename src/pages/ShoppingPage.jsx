import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, ShoppingCart } from 'lucide-react'

export default function ShoppingPage() {
  const [items, setItems] = useState([])
  const [inputText, setInputText] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('shoppingList')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const syncToStorage = (newItems) => {
    setItems(newItems)
    localStorage.setItem('shoppingList', JSON.stringify(newItems))
  }

  const addItem = () => {
    if (inputText.trim()) {
      const newItem = {
        id: `manual-${Date.now()}`,
        text: inputText.trim(),
        done: false,
        recipeId: null,
        recipeName: null
      }
      syncToStorage([...items, newItem])
      setInputText('')
    }
  }

  const toggleItem = (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    syncToStorage(newItems)
  }

  const deleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id)
    syncToStorage(newItems)
  }

  const clearDone = () => {
    const newItems = items.filter((item) => !item.done)
    syncToStorage(newItems)
  }

  const doneCount = items.filter((i) => i.done).length
  const groupedItems = items.reduce((acc, item) => {
    const key = item.recipeName || '手动添加'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <header className="bg-gradient-to-b from-avocado-light/20 to-transparent px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">采购清单</h1>
        <p className="text-gray-500 text-sm">
          {doneCount}/{items.length} 已完成
        </p>
      </header>

      <main className="px-5">
        {/* Add Item Input */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
          <div className="flex items-center gap-3 p-4">
            <input
              type="text"
              value={inputText}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => { setIsComposing(false); setInputText(e.target.value); }}
              onChange={(e) => { if (!isComposing) setInputText(e.target.value); }}
              onKeyDown={(e) => {
                if (isComposing) return
                if (e.key === 'Enter') addItem()
              }}
              placeholder="添加食材..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={addItem}
              className="w-10 h-10 bg-avocado-dark text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Grouped Items */}
        {Object.keys(groupedItems).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([groupName, groupItems]) => (
              <div key={groupName} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {groupName !== '手动添加' && (
                  <div className="px-4 py-2 bg-cream border-b border-gray-100">
                    <span className="text-xs text-gray-500">来自: {groupName}</span>
                  </div>
                )}
                <ul className="divide-y divide-gray-50">
                  {groupItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.done
                            ? 'bg-avocado-dark border-avocado-dark'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.done && <Check size={14} className="text-white" />}
                      </button>
                      <span
                        className={`flex-1 ${
                          item.done ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">清单为空</p>
            <p className="text-sm text-gray-400 mt-1">从菜谱中添加食材或手动添加</p>
          </div>
        )}

        {/* Clear Done Button */}
        {doneCount > 0 && (
          <button
            onClick={clearDone}
            className="w-full mt-4 py-3 text-avocado-dark text-sm font-medium bg-avocado-light/10 rounded-xl"
          >
            清除已完成 ({doneCount})
          </button>
        )}
      </main>
    </div>
  )
}
