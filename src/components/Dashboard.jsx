import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES, COUNTRIES, REGIONS, CHANGE_TYPES } from '../data/constants'
import { getModelsByCountry, getRecentChanges } from '../data/index'
import { formatPrice, formatContextLength, convertPrice, getCheapestOutput, getCheapestPrice, getPricingUnitShort } from '../utils/priceUtils'

export default function Dashboard({ models, platforms }) {
  const { currency } = useCurrency()
  const [sortField, setSortField] = useState('output')
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

  // 按国家分布
  const countryGroups = useMemo(() => getModelsByCountry(), [models])

  // 按区域分布
  const regionCounts = useMemo(() => {
    const counts = {}
    for (const g of countryGroups) {
      const region = COUNTRIES[g.id]?.region || 'na'
      counts[region] = (counts[region] || 0) + g.models.length
    }
    return counts
  }, [countryGroups])

  // 按tag统计
  const tagCounts = useMemo(() => {
    const counts = {}
    for (const m of models) {
      const tag = m.tag || 'unknown'
      counts[tag] = (counts[tag] || 0) + 1
    }
    return counts
  }, [models])

  // 最便宜的文本模型（以输出价为主）
  const cheapestTextModel = useMemo(() => {
    return models
      .filter((m) => {
        const out = getCheapestOutput(m).output
        return out > 0 && m.pricingUnit === 'per_million_tokens'
      })
      .sort((a, b) => getCheapestOutput(a).output - getCheapestOutput(b).output)[0]
  }, [models])

  // 价格区间分布（文本模型输出价，紧凑版）
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
      const cheapest = getCheapestOutput(m)
      if (cheapest.output === 0) { ranges[0].count++; continue }
      for (const r of ranges.slice(1)) {
        if (cheapest.output >= r.min && cheapest.output < r.max) { r.count++; break }
      }
    }
    const maxCount = Math.max(...ranges.map(r => r.count), 1)
    return ranges.map(r => ({ ...r, pct: Math.round(r.count / maxCount * 100) }))
  }, [models])

  // 按模态分组 + 按输出价排序
  const textModels = useMemo(() => {
    return [...models.filter(m => m.modality === 'text->text')]
      .sort((a, b) => getCheapestOutput(a).output - getCheapestOutput(b).output)
  }, [models])

  const imageModels = useMemo(() => {
    return [...models.filter(m => m.modality === 'text->image')]
      .sort((a, b) => getCheapestOutput(a).output - getCheapestOutput(b).output)
  }, [models])

  const videoModels = useMemo(() => {
    return [...models.filter(m => m.modality === 'text->video')]
      .sort((a, b) => getCheapestOutput(a).output - getCheapestOutput(b).output)
  }, [models])

  // 最近价格变动
  const recentChanges = useMemo(() => getRecentChanges(8), [models])

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
        return { id: pid, name: p?.nameCn || pid, color: p?.color || '#999', country: p?.country, count }
      })
      .sort((a, b) => b.count - a.count)
  }, [models])

  // 各平台 top 模型名称
  const platformTopModels = useMemo(() => {
    const map = {}
    for (const m of models) {
      for (const pid of Object.keys(m.prices)) {
        if (!map[pid]) map[pid] = []
        if (map[pid].length < 3) map[pid].push(m.name)
      }
    }
    return map
  }, [models])

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="收录模型" value={totalModels} suffix="个" color="red" />
        <StatCard label="覆盖平台" value={totalPlatforms} suffix="家" color="blue" />
        <StatCard label="免费模型" value={freeModels} suffix="个" color="green" />
        <StatCard
          label="最低输出价"
          value={cheapestTextModel ? formatPrice(convertPrice(getCheapestOutput(cheapestTextModel).output, currency), currency) : '-'}
          suffix={cheapestTextModel ? `/百万Tok` : ''}
          sub={cheapestTextModel?.name || ''}
          color="orange"
        />
      </div>

      {/* 第二行：国家/区域 + 模态/定位 + 价格区间（紧凑三列） */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* 国家分布 */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">国家 / 区域分布</h3>
          <div className="space-y-2">
            {Object.entries(REGIONS).map(([rid, r]) => (
              <div key={rid} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${REGION_COLOR[r.color] || 'bg-gray-500'}`}></span>
                  <span className="text-xs text-dx-gray-600">{r.label}</span>
                  <span className="text-xs text-dx-gray-400">({regionCounts[rid] || 0})</span>
                </div>
              </div>
            ))}
            <div className="border-t border-dx-gray-100 pt-2 space-y-1">
              {countryGroups.map((g) => (
                <div key={g.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>{g.flag}</span>
                    <span className="text-xs text-dx-gray-500">{g.label}</span>
                  </div>
                  <span className="text-xs font-mono text-dx-gray-600 font-bold">{g.models.length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 模态分类 + 模型定位（合并） */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">模态分类</h3>
          <div className="flex flex-wrap gap-2 mb-3">
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
          <h4 className="text-xs font-semibold text-dx-gray-500 mb-2">模型定位</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(tagCounts).map(([tag, count]) => {
              const info = MODEL_TAGS[tag]
              const colorMap = { red: 'badge-red', blue: 'badge-blue', green: 'badge-green', purple: 'badge-blue bg-purple-50 text-purple-700', emerald: 'badge-green bg-emerald-50 text-emerald-700' }
              return (
                <span key={tag} className={`badge ${colorMap[info?.color] || 'badge-gray'}`}>
                  {info?.label || tag} {count}
                </span>
              )
            })}
          </div>
        </div>

        {/* 价格区间分布（紧凑型，原全宽卡片移入此处） */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-dx-gray-700 mb-3">输出价格区间</h3>
          <div className="space-y-1.5">
            {priceDistribution.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-dx-gray-500 w-8 text-right font-mono">{r.label}</span>
                <div className="flex-1 h-4 bg-dx-gray-50 rounded overflow-hidden">
                  <div className={`h-full ${r.color} rounded transition-all duration-500`} style={{ width: `${Math.max(r.pct, r.count > 0 ? 4 : 0)}%` }}></div>
                </div>
                <span className="text-xs font-mono text-dx-gray-600 w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 第三行：按模态分三段展示价格速览（各自标注计价单位） */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ModalityTable
          title="文本模型"
          unit={getPricingUnitShort('per_million_tokens', currency === CURRENCY.USD ? 'usd' : 'cny')}
          models={textModels}
          currency={currency}
          showContext={true}
          icon="📝"
        />
        <ModalityTable
          title="图像模型"
          unit={getPricingUnitShort('per_image', currency === CURRENCY.USD ? 'usd' : 'cny')}
          models={imageModels}
          currency={currency}
          showContext={false}
          icon="🎨"
        />
        <ModalityTable
          title="视频模型"
          unit={getPricingUnitShort('per_second', currency === CURRENCY.USD ? 'usd' : 'cny')}
          models={videoModels}
          currency={currency}
          showContext={false}
          icon="🎬"
        />
      </div>

      {/* 第四行：平台排行 + 最近更新 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-gray-100 text-sm font-semibold text-dx-gray-700 flex items-center justify-between">
            <span>最近价格变动</span>
            <span className="text-xs font-normal text-dx-gray-400">真实快照对比</span>
          </div>
          {recentChanges.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs text-dx-gray-400">数据积累中</p>
              <p className="text-xs text-dx-gray-400 mt-0.5">每日采集真实快照，次日即可显示涨跌</p>
            </div>
          ) : (
            <div className="divide-y divide-dx-gray-50">
              {recentChanges.map((item, i) => {
                const ch = CHANGE_TYPES[item.changeType] || CHANGE_TYPES.down
                const pctText = item.changeType === 'new'
                  ? '新进'
                  : `${item.pct > 0 ? '+' : ''}${item.pct.toFixed(1)}%`
                return (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-dx-gray-50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${ch.bg} ${ch.color} text-xs font-medium shrink-0`}>
                        <span>{ch.icon}</span>
                        <span>{ch.label}</span>
                      </span>
                      <span className="text-sm font-medium text-dx-gray-900 truncate">{item.model}</span>
                      {item.tag && <ModelTag tag={item.tag} />}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-semibold text-dx-gray-700">{pctText}</span>
                      <span className="text-xs text-dx-gray-400 font-mono">{item.date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-dx-gray-800 text-white font-semibold text-sm">
            TOP50 平台模型覆盖排行
          </div>
          <div className="p-4 space-y-2">
            {platformRanking.slice(0, 10).map((p, i) => {
              const c = COUNTRIES[p.country]
              const topModels = platformTopModels[p.id] || []
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs text-dx-gray-400 w-4 text-right font-mono">{i + 1}</span>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }}></span>
                  <span className="text-sm font-medium text-dx-gray-900 flex-1 truncate">{p.name}</span>
                  {topModels.length > 0 && (
                    <span className="text-xs text-dx-gray-400 hidden lg:inline truncate max-w-[120px]">{topModels.join('、')}</span>
                  )}
                  <span className="text-xs shrink-0" title={c?.label}>{c?.flag || '🏳️'}</span>
                  <span className="text-sm font-mono font-bold text-dx-gray-900 w-8 text-right shrink-0">{p.count}</span>
                </div>
              )
            })}
          </div>
        </div>


      </div>
    </div>
  )
}

// ========== 模态价格速览子组件 ==========

function ModalityTable({ title, unit, models, currency, showContext, icon }) {
  return (
    <div className="card p-0 overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-dx-red text-white font-semibold text-sm flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5">
          <span>{icon}</span>
          <span>{title}</span>
        </span>
        <span className="text-xs font-normal opacity-75">{unit}</span>
      </div>
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
              <th className="text-left px-3 py-2 text-dx-gray-500 font-medium">模型</th>
              <th className="text-left px-3 py-2 text-dx-gray-500 font-medium">定位</th>
              <th className="text-right px-3 py-2 text-dx-gray-500 font-medium">最低输出价</th>
              {showContext && <th className="text-right px-3 py-2 text-dx-gray-500 font-medium">上下文</th>}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const cheapestOut = getCheapestOutput(model)
              const modInfo = MODALITIES[model.modality]
              return (
                <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <div className="font-medium text-dx-gray-900 whitespace-nowrap text-xs">{model.name}</div>
                    <div className="text-xs text-dx-gray-400">{model.provider}</div>
                  </td>
                  <td className="px-3 py-2">
                    <ModelTag tag={model.tag} />
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-dx-gray-700 font-semibold text-xs">
                    {formatPrice(convertPrice(cheapestOut.output, currency), currency)}
                  </td>
                  {showContext && (
                    <td className="px-3 py-2 text-right text-dx-gray-500 font-mono text-xs">
                      {formatContextLength(model.contextLength)}
                    </td>
                  )}
                </tr>
              )
            })}
            {models.length === 0 && (
              <tr>
                <td colSpan={showContext ? 4 : 3} className="px-4 py-8 text-center text-dx-gray-400 text-xs">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ========== 子组件 ==========

const REGION_COLOR = { na: 'bg-indigo-500', eu: 'bg-blue-500', apac: 'bg-dx-red' }

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