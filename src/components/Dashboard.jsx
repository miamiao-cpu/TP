import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS } from '../data/constants'
import { formatPrice, formatContextLength } from '../utils/priceUtils'

export default function Dashboard({ models, platforms }) {
  const { currency } = useCurrency()
  const [sortField, setSortField] = useState('input') // input / output / context
  const [sortDir, setSortDir] = useState('asc') // asc / desc

  // 统计数据
  const totalModels = models.length
  const totalPlatforms = new Set(models.flatMap((m) => Object.keys(m.prices))).size
  const freeModels = models.filter((m) =>
    Object.values(m.prices).some((p) => p.input === 0 && p.output === 0)
  ).length

  // 找最便宜的模型
  const cheapestModel = models
    .filter((m) => getAvgPrice(m) > 0)
    .sort((a, b) => getAvgPrice(a) - getAvgPrice(b))[0]

  function getAvgPrice(model) {
    const prices = Object.values(model.prices)
    if (!prices.length) return 0
    const avg = prices.reduce((sum, p) => sum + (p.input + p.output) / 2, 0) / prices.length
    return convertPrice(avg)
  }

  function convertPrice(cny) {
    if (currency === CURRENCY.USD) return cny / 7.25
    return cny
  }

  // 排序后的模型列表
  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      let aVal, bVal
      const aCheap = getCheapestPrice(a)
      const bCheap = getCheapestPrice(b)
      if (sortField === 'input') {
        aVal = convertPrice(aCheap.input)
        bVal = convertPrice(bCheap.input)
      } else if (sortField === 'output') {
        aVal = convertPrice(aCheap.output)
        bVal = convertPrice(bCheap.output)
      } else {
        aVal = a.contextLength || 0
        bVal = b.contextLength || 0
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [models, sortField, sortDir, currency])

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <span className="text-dx-gray-300 ml-0.5">↕</span>
    return <span className="text-dx-red ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  // 最近价格变动（模拟数据）
  const recentChanges = [
    { model: 'GPT-5.6 Luna', change: '-80%', type: 'down', date: '2026-08-03' },
    { model: 'DeepSeek V4 Flash', change: '-50%', type: 'down', date: '2026-07-31' },
    { model: 'Claude Fable 5', change: 'New', type: 'new', date: '2026-07-28' },
    { model: 'Gemini 3.6 Flash', change: '-30%', type: 'down', date: '2026-07-25' },
    { model: 'Doubao Seed 2.1 Pro', change: 'New', type: 'new', date: '2026-07-20' },
  ]

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="覆盖模型" value={totalModels} suffix="个" icon="🧠" />
        <StatCard label="覆盖平台" value={totalPlatforms} suffix="家" icon="🏢" />
        <StatCard label="免费模型" value={freeModels} suffix="个" icon="🆓" />
        <StatCard
          label="最便宜"
          value={cheapestModel?.name || '-'}
          suffix={cheapestModel ? `¥${getAvgPrice(cheapestModel).toFixed(2)}/M` : ''}
          icon="💰"
          small
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* TOP20 价格速览 */}
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-red text-white font-semibold text-sm">
            TOP20 模型价格速览
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模型</th>
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">定位</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('input')}>
                    输入价 <SortIcon field="input" />
                  </th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('output')}>
                    输出价 <SortIcon field="output" />
                  </th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('context')}>
                    上下文 <SortIcon field="context" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model) => {
                  const cheapest = getCheapestPrice(model)
                  return (
                     <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50 transition-colors">
                       <td className="px-4 py-2.5 font-medium text-dx-gray-900 whitespace-nowrap">{model.name}</td>
                       <td className="px-4 py-2.5">
                         <ModelTag tag={model.tag} />
                       </td>
                       <td className="px-4 py-2.5 text-right font-mono text-dx-gray-700">
                         {formatPrice(convertPrice(cheapest.input), currency)}
                         <SourceHint source={cheapest.source} />
                       </td>
                       <td className="px-4 py-2.5 text-right font-mono text-dx-gray-700">
                         {formatPrice(convertPrice(cheapest.output), currency)}
                       </td>
                       <td className="px-4 py-2.5 text-right text-dx-gray-500 font-mono">
                         {formatContextLength(model.contextLength)}
                       </td>
                     </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 最近价格变动 */}
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-gray-800 text-white font-semibold text-sm">
            最近价格变动
          </div>
          <div className="divide-y divide-dx-gray-100">
            {recentChanges.map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-dx-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item.type === 'down' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                  <span className="font-medium text-dx-gray-900 text-sm">{item.model}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold font-mono ${item.type === 'down' ? 'text-green-600' : 'text-blue-600'}`}>
                    {item.change}
                  </span>
                  <span className="text-xs text-dx-gray-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 平台覆盖一览 */}
          <div className="px-4 py-3 bg-dx-gray-50 border-t border-dx-gray-100">
            <p className="text-xs text-dx-gray-500 mb-2 font-medium">已覆盖平台</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-white border border-dx-gray-200"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }}></span>
                  {p.nameCn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, suffix, icon, small }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-dx-gray-400 text-xs mb-1">
        <span>{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-bold text-dx-gray-900 ${small ? 'text-base' : 'text-2xl'}`}>
          {value}
        </span>
        <span className="text-xs text-dx-gray-400">{suffix}</span>
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

function getCheapestPrice(model) {
  const entries = Object.values(model.prices)
  if (!entries.length) return { input: 0, output: 0 }
  // 返回输入价最低的平台
  const sorted = entries.sort((a, b) => a.input - b.input)
  return sorted[0]
}

function SourceHint({ source }) {
  if (!source) return null
  const config = {
    verified: { symbol: '✓', title: 'Playwright验证采集', color: 'text-blue-500' },
    auto: { symbol: '⟳', title: 'API自动采集', color: 'text-green-500' },
    manual: { symbol: '✎', title: '手动录入', color: 'text-gray-400' },
  }
  const c = config[source] || config.manual
  return <span className={`ml-1 text-xs ${c.color}`} title={c.title}>{c.symbol}</span>
}
