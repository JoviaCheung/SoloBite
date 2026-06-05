import { Home, Gift, ShoppingCart, Heart } from 'lucide-react'

const tabs = [
  { id: 'home', label: '今日推荐', icon: Home },
  { id: 'mysterybox', label: '盲盒订制', icon: Gift },
  { id: 'shopping', label: '采购清单', icon: ShoppingCart },
  { id: 'favorites', label: '我的收藏', icon: Heart },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-light border-t border-cream-dark/20 safe-area-pb z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 ${
                isActive ? 'scale-105' : 'opacity-60'
              }`}
            >
              <Icon
                size={24}
                className={`mb-1 transition-colors ${
                  isActive ? 'text-avocado-dark' : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-avocado-dark' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-avocado-light" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
