import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES, COUNTRIES } from '../data/constants'
import { formatPrice, formatContextLength, convertPrice } from '../utils/priceUtils'

export default function CompareView({ models }) {
  const { currency } = useCurrency()
  const [selectedModels, setSelectedModels] = useState([])
  const [sortBy, setSortBy] = useState('output')
  // 条件筛选标签
  const [modalityFilter, setModalityFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')

  // 筛选后的模型选择池
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const matchModality = modalityFilter === 'all' || m.modality === modalityFilter
      const matchTag = tagFilter === 'all' || m.tag === tagFilter
      const matchRegion = regionFilter === 'all' || m.country === regionFilter
      return matchModality && matchTag && matchRegion
    })
  }, [models, modalityFilter, tagFilter, regionFilter])

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
        const pricesByCountry = {}
        for (const [platformId, price] of Object.entries(model.prices)) {
          const platform = PLATFORMS.find((p) => p.id === platformId)
          const country = platform?.country || 'US'
          if (!pricesByCountry[country]) pricesByCountry[country] = []
          pricesByCountry[country].push({
            platformId,
            platformName: platform?.nameCn || platformId,
            platformColor: platform?.color || '#999',
            country,
            input: price.input !== null ? convertPrice(price.input, currency) : null,
            output: price.output !== null ? convertPrice(price.output, currency) : null,
            cache: price.cache !== null ? convertPrice(price.cache, currency) : null,
          })
        }
        const allPrices = Object.values(pricesByCountry).flat()
        const cheapest = allPrices.sort((a, b) => (a[sortBy] || Infinity) - (b[sortBy] || Infinity))[0]
        return {
          ...model,
          pricesByCountry,
          allPrices,
          cheapest,
          minInput: Math.min(...allPrices.map((p) => p.input || Infinity)),
          minOutput: Math.min(...allPrices.map((p) => p.output || Infinity)),
        }
      })
      .sort((a, b) => {
        if (sortBy === 'input') return (a.minInput || Infinity) - (b.minInput || Infinity)
        if (sortBy === 'output') return (a.minOutput || Infinity) - (b.minOutput || Infinity)
        return (a.minOutput || Infinity) - (b.minOutput || Infinity)
      })
  }, [selectedModels, models, sortBy, currency])

  // 获取可以作为筛选条件的国家列表
  const availableCountries = useMemo(() => {
    const countries = new Set(models.map(m => m.country).filter(Boolean))
    return [...countries].map(c => COUNTRIES[c] || { id: c, label: c, flag: '🏳️' })
  }, [models])

  return (
    <div className="space-y-4">
      {/* 条件筛选标签 */}
      <div className="card p-4 space-y-3">
        <p className="text-sm font-medium text-dx-gray-700">条件筛选</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dx-gray-400">模态:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[{ value: 'all', label: '全部' }, ...Object.entries(MODALITIES).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setModalityFilter(opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    modalityFilter === opt.value ? 'bg-dx-red text-white' : 'bg-dx-gray-50 text-dx-gray-500 hover:bg-dx-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dx-gray-400">定位:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[{ value: 'all', label: '全部' }, ...Object.entries(MODEL_TAGS).map(([k, v]) => ({ value: k, label: v.label }))].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTagFilter(opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    tagFilter === opt.value ? 'bg-dx-gray-800 text-white' : 'bg-dx-gray-50 text-dx-gray-500 hover:bg-dx-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dx-gray-400">区域:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[{ value: 'all', label: '全部' }, ...availableCountries.map((c) => ({ value: c.id, label: `${c.flag} ${c.label}` }))].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRegionFilter(opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    regionFilter === opt.value ? 'bg-dx-gray-800 text-white' : 'bg-dx-gray-50 text-dx-gray-500 hover:bg-dx-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 模型选择器 */}
      <div className="card p-4">
        <p className="text-sm font-medium text-dx-gray-700 mb-3">
          选择要对比的模型
          <span className="text-xs text-dx-gray-400 ml-2">（点击选择/取消，已筛选 {filteredModels.length} 个）</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {filteredModels.map((model) => (
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
          {filteredModels.length === 0 && (
            <p className="text-xs text-dx-gray-400">当前筛选条件无匹配模型</p>
          )}
        </div>
      </div>

      {/* 排序控件 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-dx-gray-500">排序方式:</span>
        {[
          { value: 'input', label: '输入价' },
          { value: 'output', label: '输出价' },
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
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">国家</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">模态</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">最低输入价</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">最低输出价</th>
                  <th className="text-right px-4 py-2.5 text-dx-gray-500 font-medium">上下文</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">最便宜平台</th>
                  <th className="text-left px-4 py-2.5 text-dx-gray-500 font-medium">覆盖平台</th>
                </tr>
              </thead>
              <tbody>
                {comparedModels.map((model) => {
                  const modInfo = MODALITIES[model.modality]
                  const country = COUNTRIES[model.country]
                  return (
                    <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                      <td className="px-4 py-2.5 font-semibold text-dx-gray-900 sticky left-0 bg-white whitespace-nowrap">{model.name}</td>
                      <td className="px-4 py-2.5 text-dx-gray-500">{model.provider}</td>
                      <td className="px-4 py-2.5">
                        <ModelTag tag={model.tag} />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs">{country?.flag || '🏳️'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span title={modInfo?.label || model.modality}>{modInfo?.icon || '📝'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        <span className="text-dx-gray-700">{model.minInput !== Infinity ? formatPrice(model.minInput, currency) : '-'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-dx-red">
                        {model.minOutput !== Infinity ? formatPrice(model.minOutput, currency) : '-'}
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
                          {Object.entries(model.pricesByCountry).map(([country, prices]) => {
                            const ci = COUNTRIES[country]
                            return (
                              <span key={country} className={`badge text-xs ${country === 'CN' ? 'badge-red' : 'badge-blue'}`}>
                                {ci?.flag} {prices.length}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center text-dx-gray-400">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-sm">选择上方的模型开始对比</p>
          <p className="text-xs mt-1">提示: 使用筛选标签可快速定位目标模型，支持多选对比</p>
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