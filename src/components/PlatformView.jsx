import { useState, useMemo } from 'react'
import { useCurrency, CURRENCY } from './CurrencyContext'
import { MODEL_TAGS } from '../data/constants'
import { formatPrice, formatContextLength } from '../utils/priceUtils'
import DiscountPanel from './DiscountPanel'

export default function PlatformView({ models, platforms }) {
  const { currency } = useCurrency()
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  // 统计每个平台覆盖的模型
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
            platform: { id: platformId, nameCn: platformId, color: '#999', type: 'unknown', region: 'unknown' },
            models: [],
          }
        }
        map[platformId].models.push({ ...model, price })
      }
    }
    return Object.values(map).sort((a, b) => b.models.length - a.models.length)
  }, [models, platforms])

  function convertPrice(cny) {
    return currency === CURRENCY.USD ? cny / 7.25 : cny
  }

  const activePlatformData = selectedPlatform
    ? platformModels.find((p) => p.platform.id === selectedPlatform)
    : null

  return (
    <div className="space-y-4">
      {/* 平台选择 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {platformModels.map(({ platform, models: pModels }) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id === selectedPlatform ? null : platform.id)}
            className={`card p-3 text-left transition-all hover:shadow-md ${
              selectedPlatform === platform.id ? 'ring-2 ring-dx-red border-dx-red' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ background: platform.color }}></span>
              <span className="font-semibold text-sm text-dx-gray-900 truncate">{platform.nameCn}</span>
            </div>
            <div className="text-2xl font-bold text-dx-gray-900">{pModels.length}</div>
            <div className="text-xs text-dx-gray-400">个模型</div>
            <div className="mt-2 flex gap-1">
              <span className={`badge ${platform.region === 'china' ? 'badge-red' : 'badge-blue'}`}>
                {platform.region === 'china' ? '国内' : '海外'}
              </span>
              <span className="badge-gray badge">
                {platform.type === 'official' ? '官方' : '代理'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 选中平台的模型列表 */}
      {activePlatformData ? (
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: activePlatformData.platform.color + '15' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: activePlatformData.platform.color }}></span>
            <span className="font-semibold text-sm text-dx-gray-900">
              {activePlatformData.platform.nameCn}
            </span>
            <span className="text-sm text-dx-gray-500">
              — {activePlatformData.models.length} 个模型
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dx-gray-100 bg-dx-gray-50">
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">模型</th>
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">厂商</th>
                  <th className="text-left px-4 py-2 text-dx-gray-500 font-medium">定位</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输入价</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">输出价</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">缓存价</th>
                  <th className="text-right px-4 py-2 text-dx-gray-500 font-medium">上下文</th>
                </tr>
              </thead>
              <tbody>
                {activePlatformData.models
                  .sort((a, b) => a.price.input - b.price.input)
                  .map((model) => (
                    <tr key={model.id} className="border-b border-dx-gray-50 hover:bg-dx-gray-50">
                      <td className="px-4 py-2.5 font-medium text-dx-gray-900">{model.name}</td>
                      <td className="px-4 py-2.5 text-dx-gray-500">{model.provider}</td>
                      <td className="px-4 py-2.5">
                        <ModelTag tag={model.tag} />
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                        {formatPrice(convertPrice(model.price.input), currency)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-dx-gray-900">
                        {formatPrice(convertPrice(model.price.output), currency)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                        {model.price.cache !== null ? formatPrice(convertPrice(model.price.cache), currency) : '-'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-dx-gray-500">
                        {formatContextLength(model.contextLength)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* 平台折扣 */}
          <div className="px-4 pt-3">
            <DiscountPanel platformId={selectedPlatform} />
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center text-dx-gray-400">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-sm">选择上方平台查看该平台所有模型报价</p>
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
