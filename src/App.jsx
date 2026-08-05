import { useState, useMemo } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ModelView from './components/ModelView'
import PlatformView from './components/PlatformView'
import CompareView from './components/CompareView'
import { CurrencyProvider } from './components/CurrencyContext'
import getModels, { getLastUpdate } from './data/index'
import { PLATFORMS } from './data/constants'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const models = useMemo(() => getModels(), [])
  const lastUpdate = useMemo(() => {
    const iso = getLastUpdate()
    return iso.split('T')[0]
  }, [])

  const tabs = [
    { id: 'dashboard', label: '总览', icon: '📊' },
    { id: 'model', label: '按模型查询', icon: '🔍' },
    { id: 'platform', label: '按平台查询', icon: '🏢' },
    { id: 'compare', label: '价格对比', icon: '⚖️' },
  ]

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-dx-gray-50">
        <Header />
        
        {/* 导航标签栏 */}
        <div className="bg-white border-b border-dx-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex space-x-8" aria-label="主导航">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'tab-active'
                      : 'tab-inactive'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 内容区域 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'dashboard' && <Dashboard models={models} platforms={PLATFORMS} />}
          {activeTab === 'model' && <ModelView models={models} />}
          {activeTab === 'platform' && <PlatformView models={models} platforms={PLATFORMS} />}
          {activeTab === 'compare' && <CompareView models={models} />}
        </main>

        {/* 底部 */}
        <footer className="bg-white border-t border-dx-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-dx-gray-400">
            <p>TP (tokenPrice) — 大模型实时价格追踪平台 | 数据仅供参考，请以各平台官方定价为准</p>
            <p className="mt-1">最后数据更新: {lastUpdate} | 覆盖 {PLATFORMS.length} 个平台 · {models.length} 个模型</p>
          </div>
        </footer>
      </div>
    </CurrencyProvider>
  )
}

export default App
