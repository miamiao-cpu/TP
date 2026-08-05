import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS } from '../data/constants'
import { formatPrice, formatContextLength } from '../utils/priceUtils'
import DiscountPanel from './DiscountPanel'
import PLATFORM_DISCOUNTS from '../data/discounts'

export default function ModelView({ models }) {
  const { currency } = useCurrency()
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')
  const [selectedModel, setSelectedModel] = useState(null)

  // 筛选模型
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase())
      const matchTag = tagFilter === 'all' || m.tag === tagFilter
      return matchSearch && matchTag
    })
  }, [models, search, tagFilter])

  function convertPrice(cny) {
    return currency === CURRENCY.USD ? cny / 7.25 : cny
  }

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 搜索框 */}
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
          {/* 标签筛选 */}
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
      </div>

      {/* 模型列表 + 详情 */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* 模型列表 */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-gray-800 text-white text-sm font-semibold">
            模型列表 ({filteredModels.length})
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-dx-gray-100">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`w-full px-4 py-3 text-left hover:bg-dx-gray-50 transition-colors ${
                  selectedModel?.id === model.id ? 'bg-dx-red/5 border-l-2 border-dx-red' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-dx-gray-900">{model.name}</div>
                    <div className="text-xs text-dx-gray-400 mt-0.5">{model.provider}</div>
                  </div>
                  <ModelTag tag={model.tag} />
                </div>
              </button>
            ))}
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
            <ModelDetail model={selectedModel} currency={currency} convertPrice={convertPrice} />
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

function ModelDetail({ model, currency, convertPrice }) {
  const priceEntries = Object.entries(model.prices)

  return (
    <div className="space-y-4">
      {/* 模型信息卡 */}
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-dx-gray-900">{model.name}</h2>
            <p className="text-sm text-dx-gray-500 mt-1">{model.provider}</p>
          </div>
          <ModelTag tag={model.tag} />
        </div>
        <div className="mt-3 flex gap-4 text-xs text-dx-gray-500">
          <span>上下文: <span className="font-mono font-medium text-dx-gray-700">{formatContextLength(model.contextLength)}</span></span>
          <span>模态: <span className="font-medium text-dx-gray-700">{model.modality}</span></span>
          <span>平台数: <span className="font-medium text-dx-gray-700">{priceEntries.length}</span></span>
        </div>
      </div>

      {/* 各平台价格 */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 bg-dx-gray-100 text-sm font-semibold text-dx-gray-700">
          各平台报价对比
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
              <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">平台</th>
              <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输入价</th>
              <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输出价</th>
              <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">缓存价</th>
              <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">Batch价</th>
              <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">来源</th>
              <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">更新日期</th>
            </tr>
          </thead>
          <tbody>
            {priceEntries.map(([platformId, price]) => {
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
                    {formatPrice(convertPrice(price.input), currency)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                    {formatPrice(convertPrice(price.output), currency)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                    {price.cache !== null ? formatPrice(convertPrice(price.cache), currency) : '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                    {price.batch !== null ? formatPrice(convertPrice(price.batch), currency) : '-'}
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

      {/* 各平台折扣信息 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-dx-gray-700 mb-2">优惠与折扣</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {priceEntries.map(([platformId]) => (
            <DiscountPanel key={platformId} platformId={platformId} />
          ))}
          {priceEntries.filter(([pid]) => 
            PLATFORM_DISCOUNTS.some(d => d.platformId === pid)
          ).length === 0 && (
            <p className="text-xs text-dx-gray-400 col-span-2">当前模型在各平台暂无收录优惠信息</p>
          )}
        </div>
      </div>
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

function SourceBadge({ source }) {
  const config = {
    verified: { label: '验证采集', cls: 'badge-blue' },
    auto: { label: '自动采集', cls: 'badge-green' },
    manual: { label: '手动录入', cls: 'badge-gray' },
  }
  const { label, cls } = config[source] || config.manual
  return <span className={`badge ${cls}`}>{label}</span>
}
