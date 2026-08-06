import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { PLATFORMS, MODEL_TAGS, MODALITIES, COUNTRIES } from '../data/constants'
import { formatPrice, formatContextLength, convertPrice, getPricingUnitShort } from '../utils/priceUtils'
import DiscountPanel from './DiscountPanel'

export default function PlatformView({ models, platforms }) {
  const { currency } = useCurrency()
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [tagFilter, setTagFilter] = useState('all')
  const [searchFilter, setSearchFilter] = useState('')

  // 统计每个平台覆盖的模型 + 丰富信息
  const platformModels = useMemo(() => {
    const map = {}
    for (const platform of platforms) {
      map[platform.id] = {
        platform,
        models: [],
      }
    }
    for (const model of models) {
      for (const [platformId, price] of Object.entries(model.prices)) {
        if (!map[platformId]) {
          map[platformId] = {
            platform: { id: platformId, nameCn: platformId, name: platformId, color: '#999', type: 'unknown', region: 'unknown' },
            models: [],
          }
        }
        map[platformId].models.push({ ...model, price })
      }
    }
    return Object.values(map).sort((a, b) => b.models.length - a.models.length)
  }, [models, platforms])

  const activePlatformData = selectedPlatform
    ? platformModels.find((p) => p.platform.id === selectedPlatform)
    : null

  // 筛选当前平台的模型
  const filteredPlatformModels = useMemo(() => {
    if (!activePlatformData) return []
    return activePlatformData.models.filter((m) => {
      const matchTag = tagFilter === 'all' || m.tag === tagFilter
      const matchSearch = !searchFilter || m.name.toLowerCase().includes(searchFilter.toLowerCase()) || m.provider.toLowerCase().includes(searchFilter.toLowerCase())
      return matchTag && matchSearch
    })
  }, [activePlatformData, tagFilter, searchFilter])

  // 各平台丰富信息
  const platformInfo = useMemo(() => {
    const info = {}
    for (const { platform, models: pModels } of platformModels) {
      // 价格范围
      const inputs = pModels.map(m => m.price.input).filter(v => v > 0)
      const outputs = pModels.map(m => m.price.output).filter(v => v > 0)

      // 模态分布
      const modalitySet = new Set(pModels.map(m => m.modality))
      const modalityIcons = [...modalitySet].map(k => MODALITIES[k]?.icon || '📝').join(' ')

      // 最低价模型
      const cheapestForOutput = [...pModels].sort((a, b) => (a.price.output || Infinity) - (b.price.output || Infinity))[0]
      const cheapestForInput = [...pModels].sort((a, b) => (a.price.input || Infinity) - (b.price.input || Infinity))[0]

      // 免费模型数
      const freeCount = pModels.filter(m => m.price.input === 0 && m.price.output === 0).length

      // 平台 logic 中本地模型数 vs 代理模型数
      const localCount = pModels.filter(m => m.country === platform.country).length

      // Top 模型名（最多 3 个）
      const topNames = pModels.sort((a, b) => (a.price.output || Infinity) - (b.price.output || Infinity))
        .slice(0, 3).map(m => m.name).join('、')

      info[platform.id] = {
        minInput: inputs.length ? Math.min(...inputs) : 0,
        maxInput: inputs.length ? Math.max(...inputs) : 0,
        minOutput: outputs.length ? Math.min(...outputs) : 0,
        maxOutput: outputs.length ? Math.max(...outputs) : 0,
        modalityIcons,
        freeCount,
        localCount,
        topNames,
        cheapestForOutput,
        cheapestForInput,
      }
    }
    return info
  }, [platformModels])

  return (
    <div className="space-y-4">
      {/* 平台选择 — 单行横向滚动 + 紧凑卡片 */}
      <div className="card p-3">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
          {platformModels.map(({ platform, models: pModels }) => {
            const info = platformInfo[platform.id]
            return (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id === selectedPlatform ? null : platform.id)
                  setTagFilter('all')
                  setSearchFilter('')
                }}
                className={`flex-shrink-0 w-44 p-2.5 rounded-lg text-left transition-all hover:shadow-sm border group ${
                  selectedPlatform === platform.id
                    ? 'ring-2 ring-dx-red border-dx-red shadow-sm'
                    : 'border-dx-gray-100 hover:border-dx-gray-200'
                }`}
              >
                {/* 平台名称 + 模型数 */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: platform.color }}></span>
                  <span className="font-semibold text-xs text-dx-gray-900 truncate">{platform.nameCn}</span>
                  <span className="text-xs font-mono font-bold text-dx-red ml-auto">{pModels.length}</span>
                </div>

                {/* 价格范围 */}
                <div className="text-xs text-dx-gray-400 mb-1">
                  <span className="font-mono text-dx-gray-600">{formatPrice(convertPrice(info.minInput, currency), currency)}</span>
                  <span className="mx-0.5">~</span>
                  <span className="font-mono text-dx-gray-600">{formatPrice(convertPrice(info.maxInput, currency), currency)}</span>
                </div>

                {/* 标签行 */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="badge-gray badge text-[10px]">{COUNTRIES[platform.country]?.flag} {COUNTRIES[platform.country]?.label || platform.country}</span>
                  {info.freeCount > 0 && <span className="badge-green badge text-[10px]">{info.freeCount}免费</span>}
                  <span className="text-[10px] text-dx-gray-400">{info.modalityIcons}</span>
                </div>

                {/* Top 模型（hover 才显示） */}
                <div className="mt-1 text-[10px] text-dx-gray-400 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {info.topNames}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 选中平台的模型列表 */}
      {activePlatformData ? (
        <div className="space-y-4">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: activePlatformData.platform.color + '15' }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: activePlatformData.platform.color }}></span>
                <span className="font-semibold text-sm text-dx-gray-900">
                  {activePlatformData.platform.nameCn}
                </span>
                <span className="text-sm text-dx-gray-500">
                  — {activePlatformData.models.length} 个模型
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-3 py-1 rounded border border-dx-gray-200 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-dx-red/30"
                />
                <div className="flex gap-1">
                  {[{ value: 'all', label: '全部' }, { value: 'flagship', label: '旗舰' }, { value: 'small', label: '轻量' }, { value: 'free', label: '免费' }].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTagFilter(opt.value)}
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        tagFilter === opt.value ? 'bg-dx-gray-800 text-white' : 'bg-dx-gray-100 text-dx-gray-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                    <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模型</th>
                    <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">厂商</th>
                    <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">定位</th>
                    <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模态</th>
                    <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输入价</th>
                    <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输出价</th>
                    <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">缓存价</th>
                    <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">Batch价</th>
                    <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">上下文</th>
                    <th className="text-center px-4 py-2 text-dx-gray-500 font-medium">来源</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlatformModels
                    .sort((a, b) => a.price.input - b.price.input)
                    .map((model) => {
                      const modInfo = MODALITIES[model.modality]
                      return (
                        <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                          <td className="px-4 py-2.5 font-medium text-dx-gray-900 whitespace-nowrap">{model.name}</td>
                          <td className="px-4 py-2.5 text-dx-gray-500">{model.provider}</td>
                          <td className="px-4 py-2.5">
                            <ModelTag tag={model.tag} />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span title={modInfo?.label || model.modality}>{modInfo?.icon || '📝'}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                            {formatPrice(convertPrice(model.price.input, currency), currency)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                            {formatPrice(convertPrice(model.price.output, currency), currency)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                            {model.price.cache !== null ? formatPrice(convertPrice(model.price.cache, currency), currency) : '-'}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                            {model.price.batch !== null ? formatPrice(convertPrice(model.price.batch, currency), currency) : '-'}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                            {formatContextLength(model.contextLength)}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <SourceBadge source={model.price.source} />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {filteredPlatformModels.length === 0 && (
                <div className="py-8 text-center text-dx-gray-400 text-sm">无匹配模型</div>
              )}
            </div>

            <div className="px-4 pt-3 border-t border-dx-gray-100">
              <DiscountPanel platformId={selectedPlatform} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center text-dx-gray-400">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-sm">选择上方平台查看该平台所有模型报价</p>
          <p className="text-xs mt-1">向左滚动可查看更多平台</p>
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

function SourceBadge({ source }) {
  const config = {
    verified: { label: '验证', cls: 'badge-blue' },
    auto: { label: '自动', cls: 'badge-green' },
    manual: { label: '手动', cls: 'badge-gray' },
  }
  const { label, cls } = config[source] || config.manual
  return <span className={`badge ${cls}`}>{label}</span>
}