import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS } from '../data/constants'
import { formatPrice, formatContextLength } from '../utils/priceUtils'

export default function CompareView({ models }) {
  const { currency } = useCurrency()
  const [selectedModels, setSelectedModels] = useState([])
  const [sortBy, setSortBy] = useState('input') // input / output / avg

  function convertPrice(cny) {
    return currency === CURRENCY.USD ? cny / 7.25 : cny
  }

  function toggleModel(id) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  // 获取选中模型的数据
  const comparedModels = useMemo(() => {
    return models
      .filter((m) => selectedModels.includes(m.id))
      .map((model) => {
        // 收集所有平台价格
        const platformPrices = Object.entries(model.prices).map(([platformId, price]) => {
          const platform = PLATFORMS.find((p) => p.id === platformId)
          return {
            platformId,
            platformName: platform?.nameCn || platformId,
            platformColor: platform?.color || '#999',
            input: convertPrice(price.input),
            output: convertPrice(price.output),
            cache: price.cache !== null ? convertPrice(price.cache) : null,
            avg: (convertPrice(price.input) + convertPrice(price.output)) / 2,
          }
        })

        // 找到最便宜的平台
        const cheapest = platformPrices.sort((a, b) => a[sortBy] - b[sortBy])[0]

        return {
          ...model,
          platformPrices,
          cheapest,
          minInput: Math.min(...platformPrices.map((p) => p.input)),
          minOutput: Math.min(...platformPrices.map((p) => p.output)),
        }
      })
      .sort((a, b) => {
        if (sortBy === 'input') return a.minInput - b.minInput
        if (sortBy === 'output') return a.minOutput - b.minOutput
        return (a.minInput + a.minOutput) - (b.minInput + b.minOutput)
      })
  }, [selectedModels, models, sortBy, currency])

  return (
    <div className="space-y-4">
      {/* 模型选择器 */}
      <div className="card p-4">
        <p className="text-sm font-medium text-dx-gray-700 mb-3">选择要对比的模型（点击选择/取消）</p>
        <div className="flex flex-wrap gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                selectedModels.includes(model.id)
                  ? 'bg-dx-red text-white border-dx-red'
                  : 'bg-white text-dx-gray-600 border-dx-gray-200 hover:border-dx-gray-300'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* 排序控件 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-dx-gray-500">排序方式:</span>
        {[
          { value: 'input', label: '输入价' },
          { value: 'output', label: '输出价' },
          { value: 'avg', label: '综合价' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`px-2 py-1 rounded text-xs font-medium ${
              sortBy === opt.value ? 'bg-dx-gray-800 text-white' : 'text-dx-gray-500 hover:bg-dx-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-dx-gray-300 mx-1">|</span>
        <span className="text-xs text-dx-gray-400">
          已选 {selectedModels.length} 个模型
          {selectedModels.length > 0 && (
            <button onClick={() => setSelectedModels([])} className="ml-2 text-dx-red hover:underline">
              清空
            </button>
          )}
        </span>
      </div>

      {/* 对比表格 */}
      {comparedModels.length > 0 ? (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium sticky left-0 bg-dx-gray-50">模型</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">厂商</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">定位</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">最低输入价</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">最低输出价</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">上下文</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">最便宜平台</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">各平台明细</th>
                </tr>
              </thead>
              <tbody>
                {comparedModels.map((model) => (
                  <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                    <td className="px-4 py-2.5 font-semibold text-dx-gray-900 sticky left-0 bg-white">{model.name}</td>
                    <td className="px-4 py-2.5 text-dx-gray-500">{model.provider}</td>
                    <td className="px-4 py-2.5">
                      <ModelTag tag={model.tag} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-dx-red">
                      {formatPrice(model.minInput, currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-dx-red">
                      {formatPrice(model.minOutput, currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                      {formatContextLength(model.contextLength)}
                    </td>
                    <td className="px-4 py-2.5">
                      {model.cheapest && (
                        <span className="badge-green badge">
                          {model.cheapest.platformName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {model.platformPrices.map((pp) => (
                          <span
                            key={pp.platformId}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-dx-gray-50"
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: pp.platformColor }}></span>
                            {pp.platformName}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center text-dx-gray-400">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-sm">选择上方的模型开始对比</p>
          <p className="text-xs mt-1">提示: 可以多选，支持按输入价/输出价/综合价排序</p>
        </div>
      )}
    </div>
  )
}

function ModelTag({ tag }) {
  const info = MODEL_TAGS[tag]
  if (!info) return null
  const colorMap = {
    red: 'badge-red',
    blue: 'badge-blue',
    green: 'badge-green',
    purple: 'badge-blue bg-purple-50 text-purple-700',
    emerald: 'badge-green bg-emerald-50 text-emerald-700',
  }
  return <span className={`badge ${colorMap[info.color] || 'badge-gray'}`}>{info.label}</span>
}
