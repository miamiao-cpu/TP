import { useState } from 'react'
import PLATFORM_DISCOUNTS from '../data/discounts'
import { PLATFORMS } from '../data/constants'

const TYPE_MAP = {
  subscription: { label: '订阅套餐', color: 'badge-blue bg-blue-50 text-blue-700' },
  promo: { label: '限时优惠', color: 'badge-red' },
  'free-tier': { label: '免费额度', color: 'badge-green bg-emerald-50 text-emerald-700' },
}

export default function DiscountPanel({ platformId }) {
  const [expanded, setExpanded] = useState(false)
  
  const platformDiscount = PLATFORM_DISCOUNTS.find(d => d.platformId === platformId)
  if (!platformDiscount || platformDiscount.discounts.length === 0) return null

  const platform = PLATFORMS.find(p => p.id === platformId)
  const discounts = platformDiscount.discounts
  const activeCount = discounts.filter(d => !d.validTo || d.validTo >= new Date().toISOString().split('T')[0]).length

  return (
    <div className="mt-3 border border-amber-200 bg-amber-50/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">🏷️</span>
          <span className="text-xs font-semibold text-amber-700">
            {activeCount} 个优惠可用
          </span>
        </div>
        <span className="text-xs text-amber-500">{expanded ? '收起' : '展开'}</span>
      </button>
      
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {discounts.map((d, i) => {
            const typeInfo = TYPE_MAP[d.type] || { label: d.type, color: 'badge-gray' }
            return (
              <div key={i} className="bg-white rounded-md p-2.5 border border-amber-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`badge ${typeInfo.color} text-[10px]`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs font-semibold text-dx-gray-900">{d.name}</span>
                    </div>
                    <p className="text-[11px] text-dx-gray-500 leading-tight">{d.description}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 whitespace-nowrap">
                    {d.discount}
                  </span>
                </div>
                {d.validFrom && (
                  <p className="text-[10px] text-dx-gray-400 mt-1">
                    有效期: {d.validFrom} 起{d.validTo ? ` 至 ${d.validTo}` : ' (长期)'}
                  </p>
                )}
              </div>
            )
          })}
          <p className="text-[10px] text-amber-400 text-center pt-1">
            优惠信息仅供参考，请以 {platform?.nameCn || platformId} 官方为准
          </p>
        </div>
      )}
    </div>
  )
}
