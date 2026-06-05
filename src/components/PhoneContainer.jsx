import { Home, Gift, ShoppingCart, Heart } from 'lucide-react'

const tabs = [
  { id: 'home', label: '今日推荐', icon: Home },
  { id: 'custom', label: '盲盒订制', icon: Gift },
  { id: 'list', label: '采购清单', icon: ShoppingCart },
  { id: 'favorite', label: '我的收藏', icon: Heart },
]

export default function PhoneContainer({ children, activeTab, onTabChange }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* 手机外壳容器 */}
      <div className="relative w-full max-w-[393px] h-[852px] bg-[#FEFDF5] rounded-[50px] shadow-2xl shadow-black/20 overflow-hidden border-[12px] border-gray-800">
        {/* 屏幕内容区 */}
        <div className="h-full flex flex-col overflow-hidden">
          {/* 主内容区 - 可滚动 */}
          <div className="flex-1 overflow-y-auto pb-24">
            {children}
          </div>

          {/* 底部固定导航栏 */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
            <div className="flex justify-around items-center h-16 max-w-[393px] mx-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                      isActive ? 'scale-110' : 'opacity-60'
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

          {/* 刘海区域 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-2xl" />
        </div>
      </div>
    </div>
  )
}
