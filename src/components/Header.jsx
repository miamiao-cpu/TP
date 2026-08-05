import { useCurrency, CURRENCY } from './CurrencyContext'

export default function Header() {
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="bg-white border-b border-dx-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + 标题 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-dx-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">TP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-dx-gray-900 leading-tight">
                TokenPrice
              </h1>
              <p className="text-xs text-dx-gray-400 leading-tight">
                大模型实时价格追踪
              </p>
            </div>
          </div>

          {/* 右侧控件 */}
          <div className="flex items-center gap-3">
            {/* 货币切换 */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dx-gray-200 bg-white hover:bg-dx-gray-50 transition-colors text-sm"
              title="切换计价货币"
            >
              <span className={`font-mono font-semibold ${currency === CURRENCY.CNY ? 'text-dx-red' : 'text-blue-600'}`}>
                {currency === CURRENCY.CNY ? '¥' : '$'}
              </span>
              <span className="text-dx-gray-600">
                {currency === CURRENCY.CNY ? '人民币/百万Token' : '$/1M tokens'}
              </span>
            </button>

            {/* 数据源标识 */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-dx-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              实时
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
