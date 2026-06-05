import { Home, Gift, ShoppingCart, Heart } from 'lucide-react'

const tabs = [
  { id: 'home', label: '今日推荐', icon: Home },
  { id: 'custom', label: '盲盒订制', icon: Gift },
  { id: 'list', label: '采购清单', icon: ShoppingCart },
  { id: 'favorite', label: '我的收藏', icon: Heart },
]

export default function ViewportContainer({ children, activeTab, onTabChange, showNav = true }) {
  return (
    <div className="min-h-screen bg-[#FEFDF5] flex items-center justify-center p-0 sm:p-4">
      {/* 移动端: 100% 宽度 | PC端: 居中显示, 最大宽度 420px */}
      <div className="w-full h-screen sm:h-[85vh] sm:max-w-[420px] bg-[#FEFDF5] sm:rounded-3xl shadow-lg sm:shadow-black/20 overflow-hidden flex flex-col">
        {/* 主内容区 - 可滚动 */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* 底部固定导航栏 */}
        <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-gray-100 shadow-lg transition-opacity duration-500 ${showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex justify-around items-center h-16 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                    isActive ? 'scale-105' : 'opacity-60'
                  }`}
                >
                  <Icon
                    size={22}
                    className={`mb-1 transition-colors ${
                      isActive ? 'text-avocado-dark' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive ? 'text-avocado-dark' : 'text-gray-500'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-avocado-dark" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
