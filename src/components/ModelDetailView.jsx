import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES } from '../data/constants'
import { formatPrice, formatContextLength, convertPrice, getPricingUnitShort } from '../utils/priceUtils'
import { getModelPricesByRegion } from '../data/index'
import DiscountPanel from './DiscountPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ModelDetailView({ models }) {
  const { currency } = useCurrency()
  const [search, setSearch] = useState('')
  const [selectedModel, setSelectedModel] = useState(null)

  // 搜索
  const filteredModels = useMemo(() => {
    if (!search) return models
    return models.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase())
    )
  }, [models, search])

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="card p-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dx-gray-400">🔍</span>
          <input
            type="text"
            placeholder="搜索模型名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-dx-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dx-red/20 focus:border-dx-red"
          />
        </div>
        {search && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filteredModels.slice(0, 20).map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedModel(m); setSearch('') }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  selectedModel?.id === m.id
                    ? 'bg-dx-red text-white border-dx-red'
                    : 'bg-white text-dx-gray-600 border-dx-gray-200 hover:border-dx-red'
                }`}
              >
                {m.name}
              </button>
            ))}
            {filteredModels.length > 20 && (
              <span className="text-xs text-dx-gray-400 self-center">...还有 {filteredModels.length - 20} 个</span>
            )}
          </div>
        )}
      </div>

      {/* 模型详情内容 */}
      {selectedModel ? (
        <ModelDetailPage model={selectedModel} currency={currency} />
      ) : (
        <div className="card p-12 text-center text-dx-gray-400">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-sm">搜索并选择模型，查看详细价格走势和平台对比</p>
        </div>
      )}
    </div>
  )
}

function ModelDetailPage({ model, currency }) {
  const { domestic, overseas } = getModelPricesByRegion(model)
  const pricingUnitShort = getPricingUnitShort(model.pricingUnit, currency === CURRENCY.USD ? 'usd' : 'cny')
  const modInfo = MODALITIES[model.modality]

  // 为价格对比图准备数据
  const chartData = useMemo(() => {
    const data = []
    for (const [platformId, price] of Object.entries(model.prices)) {
      const platform = PLATFORMS.find(p => p.id === platformId)
      data.push({
        platform: platform?.nameCn || platformId,
        input: convertPrice(price.input, currency),
        output: convertPrice(price.output, currency),
        cache: price.cache !== null ? convertPrice(price.cache, currency) : undefined,
        batch: price.batch !== null ? convertPrice(price.batch, currency) : undefined,
        fill: platform?.color || '#999',
      })
    }
    return data.sort((a, b) => a.input - b.input)
  }, [model, currency])

  return (
    <div className="space-y-6">
      {/* 模型信息卡 */}
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-dx-gray-900">{model.name}</h2>
            <p className="text-sm text-dx-gray-500 mt-1">{model.provider}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ModelTag tag={model.tag} />
            {modInfo && <span className="badge-blue badge">{modInfo.icon} {modInfo.label}</span>}
          </div>
        </div>
        <div className="mt-4 flex gap-6 text-sm text-dx-gray-500 flex-wrap">
          <div>
            <span className="text-dx-gray-400">上下文长度</span>
            <p className="font-mono font-bold text-dx-gray-900 mt-0.5">{formatContextLength(model.contextLength)}</p>
          </div>
          <div>
            <span className="text-dx-gray-400">计价单位</span>
            <p className="font-mono font-bold text-dx-gray-900 mt-0.5">{pricingUnitShort}</p>
          </div>
          <div>
            <span className="text-dx-gray-400">覆盖平台</span>
            <p className="font-mono font-bold text-dx-gray-900 mt-0.5">{Object.keys(model.prices).length} 家</p>
          </div>
          <div>
            <span className="text-dx-gray-400">最低输入价</span>
            <p className="font-mono font-bold text-dx-red mt-0.5">
              {formatPrice(Math.min(...chartData.map(d => d.input)), currency)}
            </p>
          </div>
          <div>
            <span className="text-dx-gray-400">最低输出价</span>
            <p className="font-mono font-bold text-dx-red mt-0.5">
              {formatPrice(Math.min(...chartData.map(d => d.output)), currency)}
            </p>
          </div>
        </div>
      </div>

      {/* 各平台价格对比柱状图 */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-dx-gray-700 mb-4">各平台价格对比</h3>
        {chartData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  formatter={(value) => formatPrice(value, currency)}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="input" fill="#E60012" name="输入价" radius={[4, 4, 0, 0]} />
                <Bar dataKey="output" fill="#1F2937" name="输出价" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cache" fill="#10B981" name="缓存价" radius={[4, 4, 0, 0]} />
                <Bar dataKey="batch" fill="#6366F1" name="Batch价" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-dx-gray-400 py-8 text-center">暂无价格数据</p>
        )}
      </div>

      {/* 平台价格明细表 */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 bg-dx-gray-100 text-sm font-semibold text-dx-gray-700 flex items-center gap-2">
          <span>各平台报价明细</span>
          <span className="text-xs font-normal text-dx-gray-400">（{pricingUnitShort}）</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">平台</th>
                <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">区域</th>
                <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输入价</th>
                <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输出价</th>
                <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">缓存价</th>
                <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">Batch价</th>
                <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">来源</th>
                <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">更新</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(model.prices).map(([platformId, price]) => {
                const platform = PLATFORMS.find(p => p.id === platformId)
                return (
                  <tr key={platformId} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: platform?.color || '#999' }}></span>
                        <span className="font-medium">{platform?.nameCn || platformId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`badge ${platform?.region === 'china' ? 'badge-red' : 'badge-blue'}`}>
                        {platform?.region === 'china' ? '国内' : '海外'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-dx-gray-900">
                      {formatPrice(convertPrice(price.input, currency), currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-dx-gray-900">
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
                    <td className="px-4 py-2.5 text-center text-xs text-dx-gray-400 font-mono">
                      {price.updated || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 优惠信息 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-dx-gray-700 mb-2">优惠与折扣</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.keys(model.prices).map((platformId) => (
            <DiscountPanel key={platformId} platformId={platformId} />
          ))}
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
    verified: { label: '验证', cls: 'badge-blue' },
    auto: { label: '自动', cls: 'badge-green' },
    manual: { label: '手动', cls: 'badge-gray' },
  }
  const { label, cls } = config[source] || config.manual
  return <span className={`badge ${cls}`}>{label}</span>
}