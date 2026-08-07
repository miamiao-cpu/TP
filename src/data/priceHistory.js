/**
 * TP 真实价格历史数据层（v3.1 - 真实快照驱动）
 *
 * 数据来源：price-history/YYYY-MM-DD.json（每日采集脚本自动产出）
 * 原则：只用真实快照，无任何模拟/推断数据。
 *   - 无历史快照的模型 → 前端显"数据积累中"
 *   - 只有≥2份快照才能计算真实涨价/降价/新进榜
 *
 * 构建时通过 import.meta.glob 将所有快照打包进产物。
 */



// 构建时打包 price-history/ 下所有真实快照（Vite 专属，浏览器端使用）
// daily-fetch 脚本不走本模块，有独立快照逻辑
const snapshotModules = import.meta.glob('/price-history/*.json', {
  eager: true,
  import: 'default',
})

function parseDate(filePath) {
  const m = filePath.match(/(\d{4}-\d{2}-\d{2})\.json$/)
  return m ? m[1] : null
}

// 排序后的真实快照列表 [{ date, data }]
const SNAPSHOTS = Object.entries(snapshotModules)
  .map(([filePath, data]) => ({ date: parseDate(filePath), data }))
  .filter((s) => s.date && s.data && !s.data._archived && s.data.prices)
  .sort((a, b) => a.date.localeCompare(b.date))

export function getHistoryDates() {
  return SNAPSHOTS.map((s) => s.date)
}

export function getSnapshotCount() {
  return SNAPSHOTS.length
}

/**
 * 取某模型在某平台上的真实价格序列（按日期升序）
 * @param {string} modelId
 * @param {string} platformId
 * @param {string} field output/input/cache
 * @returns {Array<{date:string, value:number|null}>}
 */
export function getModelHistory(modelId, platformId, field = 'output') {
  return SNAPSHOTS.map((s) => {
    const price = s.data.prices?.[modelId]?.[platformId]
    return {
      date: s.date,
      value: price ? (price[field] ?? null) : null,
    }
  })
}

// 按"月"下采样（取每月首个快照），用于曲线展示
export function downsampleMonthly(series) {
  const map = new Map()
  for (const point of series) {
    if (point.value == null) continue
    const month = point.date.slice(0, 7) // YYYY-MM
    if (!map.has(month)) map.set(month, point)
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * 对比最近两份真实快照，计算真实涨跌/新进榜
 * 返回 [{ modelId, changeType, prev, curr, pct, date }]
 * changeType: new | up | down
 */
export function getRecentChanges(limit = 8) {
  if (SNAPSHOTS.length < 2) return []
  const cur = SNAPSHOTS[SNAPSHOTS.length - 1]
  const prev = SNAPSHOTS[SNAPSHOTS.length - 2]
  const prevModels = prev.data.prices || {}
  const changes = []

  for (const [modelId, platforms] of Object.entries(cur.data.prices || {})) {
    const curOuts = Object.values(platforms)
      .map((p) => p.output)
      .filter((v) => v != null)
    if (curOuts.length === 0) continue
    const curMin = Math.min(...curOuts)

    const prevEntry = prevModels[modelId]
    if (!prevEntry) {
      changes.push({
        modelId,
        changeType: 'new',
        prev: null,
        curr: curMin,
        pct: null,
        date: cur.date,
      })
      continue
    }
    const prevOuts = Object.values(prevEntry)
      .map((p) => p.output)
      .filter((v) => v != null)
    if (prevOuts.length === 0) continue
    const prevMin = Math.min(...prevOuts)
    if (curMin === prevMin) continue
    const pct = ((curMin - prevMin) / prevMin) * 100
    changes.push({
      modelId,
      changeType: pct > 0 ? 'up' : 'down',
      prev: prevMin,
      curr: curMin,
      pct,
      date: cur.date,
    })
  }

  return changes
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, limit)
}
