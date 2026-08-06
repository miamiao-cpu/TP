import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES } from '../data/constants'
import { formatPrice, formatContextLength, convertPrice, getCheapestPrice } from '../utils/priceUtils'

export default function Dashboard({ models, platforms }) {
  const { currency } = useCurrency()
  const [sortField, setSortField] = useState('input')
  const [sortDir, setSortDir] = useState('asc')

  // ========== 统计数据 ==========
  const totalModels = models.length
  const totalPlatforms = new Set(models.flatMap((m) => Object.keys(m.prices))).size
  const freeModels = models.filter((m) =>
    Object.values(m.prices).some((p) => p.input === 0 && p.output === 0)
  ).length

  // modality 分布
  const modalityCounts = useMemo(() => {
    const counts = {}
    for (const m of models) {
      const key = m.modality || 'text->text'
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [models])

  // 国内外模型分布
  const regionCounts = useMemo(() => {
    let domestic = 0
    let overseas = 0
    for (const m of models) {
      const prices = Object.entries(m.prices)
      const hasChina = prices.some(([pid]) => {
        const p = PLATFORMS.find(x => x.id === pid)
        return p?.region === 'china'
      })
      const hasOverseas = prices.some(([pid]) => {
        const p = PLATFORMS.find(x => x.id === pid)
        return p?.region === 'overseas'
      })
      if (hasChina) domestic++
      if (hasOverseas) overseas++
    }
    return { domestic, overseas }
  }, [models])

  // 按tag统计
  const tagCounts = useMemo(() => {
    const counts = {}
    for (const m of models) {
      const tag = m.tag || 'unknown'
      counts[tag] = (counts[tag] || 0) + 1
    }
    return counts
  }, [models])

  // 最便宜的文本模型
  const cheapestTextModel = useMemo(() => {
    return models
      .filter((m) => {
        const prices = Object.values(m.prices)
        const avg = prices.reduce((s, p) => s + (p.input + p.output) / 2, 0) / prices.length
        return avg > 0 && m.pricingUnit === 'per_million_tokens'
      })
      .sort((a, b) => {
        const aAvg = Object.values(a.prices).reduce((s, p) => s + (p.input + p.output) / 2, 0) / Object.values(a.prices).length
        const bAvg = Object.values(b.prices).reduce((s, p) => s + (p.input + p.output) / 2, 0) / Object.values(b.prices).length
        return aAvg - bAvg
      })[0]
  }, [models])

  // 最贵的文本模型
  const mostExpensiveModel = useMemo(() => {
    return models
      .filter((m) => {
        const prices = Object.values(m.prices)
        const avg = prices.reduce((s, p) => s + (p.input + p.output) / 2, 0) / prices.length
        return avg > 0 && m.pricingUnit === 'per_million_tokens'
      })
      .sort((a, b) => {
        const aAvg = Object.values(a.prices).reduce((s, p) => s + (p.input + p.output) / 2, 0) / Object.values(a.prices).length
        const bAvg = Object.values(b.prices).reduce((s, p) => s + (p.input + p.output) / 2, 0) / Object.values(b.prices).length
        return bAvg - aAvg
      })[0]
  }, [models])

  // 价格区间分布（文本模型输入价）
  const priceDistribution = useMemo(() => {
    const ranges = [
      { label: '免费', min: 0, max: 0, count: 0, color: 'bg-green-500' },
      { label: '0-2', min: 0.01, max: 2, count: 0, color: 'bg-green-400' },
      { label: '2-5', min: 2, max: 5, count: 0, color: 'bg-blue-400' },
      { label: '5-10', min: 5, max: 10, count: 0, color: 'bg-blue-500' },
      { label: '10-20', min: 10, max: 20, count: 0, color: 'bg-yellow-400' },
      { label: '20-50', min: 20, max: 50, count: 0, color: 'bg-orange-400' },
      { label: '50+', min: 50, max: Infinity, count: 0, color: 'bg-red-500' },
    ]
    for (const m of models) {
      if (m.pricingUnit !== 'per_million_tokens') continue
      const cheapest = getCheapestPrice(m)
      if (cheapest.input === 0) { ranges[0].count++; continue }
      for (const r of ranges.slice(1)) {
        if (cheapest.input >= r.min && cheapest.input < r.max) { r.count++; break }
      }
    }
    const maxCount = Math.max(...ranges.map(r => r.count), 1)
    return ranges.map(r => ({ ...r, pct: Math.round(r.count / maxCount * 100) }))
  }, [models])

  // 排序后的模型列表
  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      const aCheap = getCheapestPrice(a)
      const bCheap = getCheapestPrice(b)
      let aVal, bVal
      if (sortField === 'input') {
        aVal = convertPrice(aCheap.input, currency)
        bVal = convertPrice(bCheap.input, currency)
      } else if (sortField === 'output') {
        aVal = convertPrice(aCheap.output, currency)
        bVal = convertPrice(bCheap.output, currency)
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

  // 最近价格变动（基于模型数据）
  const recentChanges = useMemo(() => {
    const changes = []
    for (const m of models) {
      const prices = Object.values(m.prices)
      if (prices.length === 0) continue
      const latestDate = prices.reduce((max, p) => {
        if (!p.updated) return max
        return (!max || p.updated > max) ? p.updated : max
      }, null)
      if (latestDate) {
        changes.push({ model: m.name, date: latestDate, tag: m.tag })
      }
    }
    return changes.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  }, [models])

  // 平台模型覆盖排行
  const platformRanking = useMemo(() => {
    const counts = {}
    for (const m of models) {
      for (const pid of Object.keys(m.prices)) {
        counts[pid] = (counts[pid] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([pid, count]) => {
        const p = PLATFORMS.find(x => x.id === pid)
        return { id: pid, name: p?.nameCn || pid, color: p?.color || '#999', region: p?.region, count }
      })
      .sort((a, b) => b.count - a.count)
  }, [models])

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="覆盖模型" value={totalModels} suffix="个" color="red" />
        <StatCard label="覆盖平台" value={totalPlatforms} suffix="家" color="blue" />
        <StatCard label="免费模型" value={freeModels} suffix="个" color="green" />
        <StatCard
          label="最低输入价"
          value={cheapestTextModel ? formatPrice(convertPrice(getCheapestPrice(cheapestTextModel).input, currency), currency) : '-'}
          suffix={cheapestTextModel ? `/百万Tok` : ''}
          sub={cheapestTextModel?.name || ''}
          color="orange"
        />
      </div>

      {/* 第二行统计：国内/海外 + 模态分布 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* 国内外模型分布 */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">地域分布</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-dx-red"></span>
                <span className="text-sm text-dx-gray-600">国内平台</span>
              </div>
              <span className="font-bold text-dx-gray-900 font-mono">{regionCounts.domestic}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-dx-gray-600">海外平台</span>
              </div>
              <span className="font-bold text-dx-gray-900 font-mono">{regionCounts.overseas}</span>
            </div>
          </div>
        </div>

        {/* 模态分类 */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">模态分类</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(modalityCounts).map(([key, count]) => {
              const info = MODALITIES[key]
              return (
                <span key={key} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-dx-gray-50 text-xs font-medium">
                  <span>{info?.icon || '📝'}</span>
                  <span className="text-dx-gray-700">{info?.label || key}</span>
                  <span className="text-dx-gray-400 ml-0.5">{count}</span>
                </span>
              )
            })}
          </div>
        </div>

        {/* 模型定位分布 */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">模型定位</h3>
          <div className="space-y-2">
            {Object.entries(tagCounts).map(([tag, count]) => {
              const info = MODEL_TAGS[tag]
              const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500' }
              const pct = Math.round(count / totalModels * 100)
              return (
                <div key={tag} className="flex items-center gap-2">
                  <span className="text-xs text-dx-gray-500 w-8">{info?.label || tag}</span>
                  <div className="flex-1 h-2 bg-dx-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colorMap[info?.color] || 'bg-gray-500'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-xs font-mono text-dx-gray-600 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 价格区间分布 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">输入价格区间分布（¥/百万Token，最低平台价）</h3>
        <div className="space-y-2">
          {priceDistribution.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-dx-gray-500 w-10 text-right font-mono">{r.label}</span>
              <div className="flex-1 h-5 bg-dx-gray-50 rounded overflow-hidden">
                <div
                  className={`h-full ${r.color} rounded transition-all duration-500`}
                  style={{ width: `${Math.max(r.pct, r.count > 0 ? 4 : 0)}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-dx-gray-600 w-8">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 模型价格速览表 */}
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-red text-white font-semibold text-sm flex items-center justify-between">
            <span>模型价格速览</span>
            <span className="text-xs font-normal opacity-75">{models.length} 个模型</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模型</th>
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">定位</th>
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模态</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('input')}>
                    输入价 {sortField === 'input' && <SortArrow dir={sortDir} />}
                  </th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('output')}>
                    输出价 {sortField === 'output' && <SortArrow dir={sortDir} />}
                  </th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium cursor-pointer select-none hover:text-dx-red transition-colors" onClick={() => handleSort('context')}>
                    上下文 {sortField === 'context' && <SortArrow dir={sortDir} />}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model) => {
                  const cheapest = getCheapestPrice(model)
                  const modInfo = MODALITIES[model.modality]
                  return (
                    <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-dx-gray-900 whitespace-nowrap">{model.name}</div>
                        <div className="text-xs text-dx-gray-400">{model.provider}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <ModelTag tag={model.tag} />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs" title={model.modality}>{modInfo?.icon || '📝'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-dx-gray-700">
                        {formatPrice(convertPrice(cheapest.input, currency), currency)}
                        <SourceHint source={cheapest.source} />
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-dx-gray-700">
                        {formatPrice(convertPrice(cheapest.output, currency), currency)}
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

        <div className="space-y-6">
          {/* 平台覆盖排行 */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 bg-dx-gray-800 text-white font-semibold text-sm">
              平台模型覆盖排行
            </div>
            <div className="p-4 space-y-2">
              {platformRanking.slice(0, 10).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs text-dx-gray-400 w-4 text-right font-mono">{i + 1}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }}></span>
                  <span className="text-sm font-medium text-dx-gray-900 flex-1">{p.name}</span>
                  <span className={`badge ${p.region === 'china' ? 'badge-red' : 'badge-blue'}`}>
                    {p.region === 'china' ? '国内' : '海外'}
                  </span>
                  <span className="text-sm font-mono font-bold text-dx-gray-900 w-8 text-right">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 最近数据更新 */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 bg-dx-gray-100 text-sm font-semibold text-dx-gray-700">
              最近数据更新
            </div>
            <div className="divide-y divide-dx-gray-50">
              {recentChanges.map((item, i) => (
                <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-dx-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dx-gray-900">{item.model}</span>
                    {item.tag && <ModelTag tag={item.tag} />}
                  </div>
                  <span className="text-xs text-dx-gray-400 font-mono">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== 子组件 ==========

function StatCard({ label, value, suffix, sub, color }) {
  const borderColor = {
    red: 'border-l-dx-red',
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    orange: 'border-l-orange-500',
  }
  return (
    <div className={`card p-4 border-l-4 ${borderColor[color] || ''}`}>
      <div className="text-xs text-dx-gray-400 mb-1 font-medium">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-dx-gray-900 text-2xl">{value}</span>
        <span className="text-xs text-dx-gray-400">{suffix}</span>
      </div>
      {sub && <div className="text-xs text-dx-gray-400 mt-0.5 truncate">{sub}</div>}
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

function SortArrow({ dir }) {
  return <span className="text-dx-red ml-0.5 text-xs">{dir === 'asc' ? '↑' : '↓'}</span>
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
