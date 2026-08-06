import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES, COUNTRIES, PRICING_UNITS } from '../data/constants'
import { formatPrice, formatContextLength, convertPrice, getPricingUnitShort, getCheapestOutput, getCheapestPrice } from '../utils/priceUtils'
import { getModelPricesByRegion } from '../data/index'
import DiscountPanel from './DiscountPanel'
import PLATFORM_DISCOUNTS from '../data/discounts'

export default function ModelView({ models }) {
  const { currency } = useCurrency()
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [listSort, setListSort] = useState('price-asc') // price-asc | price-desc | new | old
  const [selectedModel, setSelectedModel] = useState(null)

  // 模型最新更新日期（取最大日期）
  function latestUpdated(model) {
    const dates = Object.values(model.prices || {}).map(p => p.updated).filter(Boolean)
    return dates.length ? dates.reduce((a, b) => a > b ? a : b) : '0000-00-00'
  }

  // 模型最早更新日期（取最小日期）
  function earliestUpdated(model) {
    const dates = Object.values(model.prices || {}).map(p => p.updated).filter(Boolean)
    return dates.length ? dates.reduce((a, b) => a < b ? a : b) : '9999-99-99'
  }

  // 筛选 + 排序模型
  const filteredModels = useMemo(() => {
    const filtered = models.filter((m) => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase())
      const matchTag = tagFilter === 'all' || m.tag === tagFilter
      const matchModality = modalityFilter === 'all' || m.modality === modalityFilter
      return matchSearch && matchTag && matchModality
    })
    return [...filtered].sort((a, b) => {
      if (listSort === 'new') {
        const diff = latestUpdated(b).localeCompare(latestUpdated(a))
        return diff !== 0 ? diff : b.id.localeCompare(a.id) // 日期相同则按 ID 逆序（最新添加优先）
      }
      if (listSort === 'old') {
        const diff = earliestUpdated(a).localeCompare(earliestUpdated(b))
        return diff !== 0 ? diff : a.id.localeCompare(b.id) // 日期相同则按 ID 顺序（最早添加优先）
      }
      const aOut = convertPrice(getCheapestOutput(a).output, currency) || Infinity
      const bOut = convertPrice(getCheapestOutput(b).output, currency) || Infinity
      return listSort === 'price-desc' ? bOut - aOut : aOut - bOut
    })
  }, [models, search, tagFilter, modalityFilter, listSort, currency])

  const sortButtons = [
    { value: 'price-asc', label: '价格↑' },
    { value: 'price-desc', label: '价格↓' },
    { value: 'new', label: '最新' },
    { value: 'old', label: '最旧' },
  ]

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="card p-4 space-y-3">
        {/* 搜索框 + 标签筛选 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dx-gray-400">🔍</span>
            <input
              type="text"
              placeholder="搜索模型名称或厂商..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-dx-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dx-red/20 focus:border-dx-red"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: '全部' },
              { value: 'flagship', label: '旗舰' },
              { value: 'balanced', label: '平衡' },
              { value: 'small', label: '轻量' },
              { value: 'reasoning', label: '推理' },
              { value: 'free', label: '免费' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTagFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tagFilter === opt.value
                    ? 'bg-dx-red text-white'
                    : 'bg-dx-gray-100 text-dx-gray-600 hover:bg-dx-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* 模态分类筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-dx-gray-400 font-medium">模态:</span>
          <div className="flex gap-1.5 flex-wrap">
            {[{ value: 'all', label: '全部', icon: null }, ...Object.entries(MODALITIES).map(([k, v]) => ({ value: k, label: v.label, icon: v.icon }))].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setModalityFilter(opt.value)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  modalityFilter === opt.value
                    ? 'bg-dx-gray-800 text-white'
                    : 'bg-dx-gray-50 text-dx-gray-500 hover:bg-dx-gray-100'
                }`}
              >
                {opt.icon && <span className="mr-1">{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* 列表排序 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-dx-gray-400 font-medium">排序:</span>
          <div className="flex gap-1.5 flex-wrap">
            {sortButtons.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setListSort(opt.value)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  listSort === opt.value
                    ? 'bg-dx-red text-white'
                    : 'bg-dx-gray-50 text-dx-gray-500 hover:bg-dx-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模型列表 + 详情 */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* 模型列表 */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-gray-800 text-white text-sm font-semibold flex items-center justify-between">
            <span>模型列表</span>
            <span className="text-xs font-normal opacity-75">{filteredModels.length} 个</span>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-dx-gray-100">
            {filteredModels.map((model) => {
              const cheapestOut = getCheapestOutput(model)
              const country = COUNTRIES[model.country]
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`w-full px-4 py-3 text-left hover:bg-dx-gray-50 transition-colors ${
                    selectedModel?.id === model.id ? 'bg-dx-red/5 border-l-2 border-dx-red' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-dx-gray-900 truncate">{model.name}</span>
                        <span className="text-xs" title={model.modality}>{MODALITIES[model.modality]?.icon || ''}</span>
                        <span title={country?.label}>{country?.flag || ''}</span>
                      </div>
                      <div className="text-xs text-dx-gray-400 mt-0.5 flex items-center gap-2">
                        <span>{model.provider}</span>
                        <span className="text-dx-gray-300">|</span>
                        <span className="font-mono font-medium text-dx-gray-600">
                          {formatPrice(convertPrice(cheapestOut.output, currency), currency)}
                        </span>
                        <span className="text-dx-gray-300">|</span>
                        <span>{getPricingUnitShort(model.pricingUnit, currency === CURRENCY.USD ? 'usd' : 'cny')}</span>
                      </div>
                    </div>
                    <ModelTag tag={model.tag} />
                  </div>
                </button>
              )
            })}
            {filteredModels.length === 0 && (
              <div className="px-4 py-8 text-center text-dx-gray-400 text-sm">
                未找到匹配的模型
              </div>
            )}
          </div>
        </div>

        {/* 模型详情 */}
        <div className="lg:col-span-3">
          {selectedModel ? (
            <ModelDetail model={selectedModel} currency={currency} />
          ) : (
            <div className="card p-12 text-center text-dx-gray-400">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-sm">选择左侧模型查看各平台价格详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ModelDetail({ model, currency }) {
  const byCountry = getModelPricesByRegion(model)
  const pricingUnitShort = getPricingUnitShort(model.pricingUnit, currency === CURRENCY.USD ? 'usd' : 'cny')
  const countryInfo = COUNTRIES[model.country]
  const countryEntries = Object.entries(byCountry)

  return (
    <div className="space-y-4">
      {/* 模型信息卡 */}
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-dx-gray-900">{model.name}</h2>
            <p className="text-sm text-dx-gray-500 mt-1">{model.provider}</p>
          </div>
          <div className="flex gap-2">
            {countryInfo && <span className="badge-blue badge">{countryInfo.flag} {countryInfo.label}</span>}
            <ModelTag tag={model.tag} />
            <ModalityBadge modality={model.modality} />
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-dx-gray-500 flex-wrap">
          <span>上下文: <span className="font-mono font-medium text-dx-gray-700">{formatContextLength(model.contextLength)}</span></span>
          <span>计价: <span className="font-medium text-dx-gray-700">{pricingUnitShort}</span></span>
          <span>平台数: <span className="font-medium text-dx-gray-700">{Object.keys(model.prices).length}</span></span>
        </div>
      </div>

      {/* 按国家分组展示各平台价格 */}
      {countryEntries.map(([country, prices]) => {
        const ci = COUNTRIES[country]
        return (
          <div key={country} className="card p-0 overflow-hidden">
            <div className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 ${ci && country === 'CN' ? 'bg-dx-red-50 text-dx-red' : 'bg-blue-50 text-blue-800'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              {ci?.flag} {ci?.label || country} 平台报价
            </div>
            <PriceTable prices={prices} currency={currency} pricingUnit={model.pricingUnit} />
          </div>
        )
      })}

      {/* 各平台折扣信息 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-dx-gray-700 mb-2">优惠与折扣</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.keys(model.prices).map((platformId) => (
            <DiscountPanel key={platformId} platformId={platformId} />
          ))}
          {Object.keys(model.prices).filter((pid) =>
            PLATFORM_DISCOUNTS.some(d => d.platformId === pid)
          ).length === 0 && (
            <p className="text-xs text-dx-gray-400 col-span-2">当前模型在各平台暂无收录优惠信息</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PriceTable({ prices, currency, pricingUnit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
            <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">平台</th>
            <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输入价</th>
            <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输出价</th>
            <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">缓存价</th>
            <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">Batch价</th>
            <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">来源</th>
            <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">更新</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices).map(([platformId, price]) => {
            const platform = PLATFORMS.find((p) => p.id === platformId)
            return (
              <tr key={platformId} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: platform?.color || '#999' }}></span>
                    <span className="font-medium">{platform?.nameCn || platformId}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                  {formatPrice(convertPrice(price.input, currency), currency)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                  {formatPrice(convertPrice(price.output, currency), currency)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                  {price.cache !== null ? formatPrice(convertPrice(price.cache, currency), currency) : '-'}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                  {price.batch !== null ? formatPrice(convertPrice(price.batch, currency), currency) : '-'}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <SourceBadge source={price.source} />
                </td>
                <td className="px-4 py-2.5 text-center text-xs text-dx-gray-400">
                  {price.updated || '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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

function ModalityBadge({ modality }) {
  const info = MODALITIES[modality]
  if (!info) return null
  const colorMap = { blue: 'badge-blue', purple: 'badge-blue bg-purple-50 text-purple-700', pink: 'badge-red bg-pink-50 text-pink-700', orange: 'badge-red bg-orange-50 text-orange-700', green: 'badge-green', teal: 'badge-green bg-teal-50 text-teal-700' }
  return <span className={`badge ${colorMap[info.color] || 'badge-gray'}`}>{info.icon} {info.label}</span>
}

function SourceBadge({ source }) {
  const config = {
    verified: { label: '验证', cls: 'badge-blue' },
    auto: { label: '自动', cls: 'badge-green' },
    manual: { label: '手动', cls: 'badge-gray' },
  }
  const { label, cls } = config[source] || config.manual
  return <span className={`badge ${cls}`}>{label}</span>
}
