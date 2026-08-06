/**
 * 价格工具函数（v2 - 支持多计价单位）
 */

// 汇率（可后续接入实时汇率 API）
const EXCHANGE_RATE = 7.25 // 1 USD = 7.25 CNY

/**
 * 美元转人民币
 */
export function usdToCny(usd) {
  return usd * EXCHANGE_RATE
}

/**
 * 人民币转美元
 */
export function cnyToUsd(cny) {
  return cny / EXCHANGE_RATE
}

/**
 * 获取汇率
 */
export function getExchangeRate() {
  return EXCHANGE_RATE
}

/**
 * 格式化价格
 * @param {number} price - 价格数值
 * @param {'cny'|'usd'} currency - 货币单位
 * @param {number} digits - 小数位数
 */
export function formatPrice(price, currency = 'cny', digits = 2) {
  if (price === 0) return '免费'
  if (price === null || price === undefined) return '-'
  const symbol = currency === 'cny' ? '¥' : '$'
  return `${symbol}${price.toFixed(digits)}`
}

/**
 * 格式化价格带完整单位标签
 * @param {number} price - 价格数值（人民币）
 * @param {'cny'|'usd'} currency - 目标货币
 * @param {string} pricingUnit - 计价单位ID (from PRICING_UNITS)
 */
export function formatPriceFull(price, currency = 'cny', pricingUnit = 'per_million_tokens') {
  if (price === 0) return '免费'
  if (price === null || price === undefined) return '-'
  const converted = currency === 'usd' ? price / EXCHANGE_RATE : price
  const symbol = currency === 'cny' ? '¥' : '$'
  const unitLabels = {
    per_million_tokens: currency === 'cny' ? '/百万Token' : '/1M tok',
    per_image: '/张',
    per_second: '/秒',
    per_minute: '/分钟',
    per_1k_chars: '/千字符',
  }
  const unit = unitLabels[pricingUnit] || ''
  return `${symbol}${converted.toFixed(2)}${unit}`
}

/**
 * 获取计价单位简称
 */
export function getPricingUnitShort(pricingUnit, currency = 'cny') {
  const unitLabels = {
    per_million_tokens: currency === 'cny' ? '¥/百万Token' : '$/1M tok',
    per_image: currency === 'cny' ? '¥/张' : '$/img',
    per_second: currency === 'cny' ? '¥/秒' : '$/sec',
    per_minute: currency === 'cny' ? '¥/分钟' : '$/min',
    per_1k_chars: currency === 'cny' ? '¥/千字符' : '$/1K char',
  }
  return unitLabels[pricingUnit] || '¥/百万Token'
}

/**
 * 格式化价格带单位（兼容旧调用）
 */
export function formatPriceWithUnit(price, currency = 'cny') {
  if (price === 0) return '免费'
  if (price === null || price === undefined) return '-'
  const symbol = currency === 'cny' ? '¥' : '$'
  const unit = currency === 'cny' ? '元/百万Token' : '$/1M tokens'
  return `${symbol}${price.toFixed(2)} ${unit}`
}

/**
 * OpenRouter API 返回的价格是每 token 的美元价格
 * 转换为每百万Token的人民币价格
 */
export function openRouterPriceToCny(pricePerToken) {
  if (!pricePerToken || pricePerToken === '0') return 0
  const usdPerMillion = parseFloat(pricePerToken) * 1_000_000
  return usdToCny(usdPerMillion)
}

/**
 * 计算性价比分数（输出质量/价格比，归一化）
 */
export function calcValueScore(model) {
  if (!model.inputPrice && !model.outputPrice) return 0
  const avgPrice = ((model.inputPrice || 0) + (model.outputPrice || 0)) / 2
  if (avgPrice === 0) return 100 // 免费模型
  const contextFactor = Math.log10(Math.max(model.contextLength || 1, 1)) / 6
  return Math.round(Math.min(100, (contextFactor / avgPrice) * 10))
}

/**
 * 格式化上下文长度
 */
export function formatContextLength(tokens) {
  if (!tokens) return '-'
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`
  return tokens.toString()
}

/**
 * 获取折扣百分比描述
 */
export function formatDiscount(original, discounted) {
  if (!original || !discounted || original === 0) return null
  const pct = Math.round((1 - discounted / original) * 100)
  if (pct <= 0) return null
  return `-${pct}%`
}

/**
 * 格式化大数字（如模型参数量）
 */
export function formatBigNumber(num) {
  if (!num) return '-'
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return num.toString()
}

/**
 * 获取模型最便宜的平台价格
 */
export function getCheapestPrice(model) {
  const entries = Object.values(model.prices || {})
  if (!entries.length) return { input: 0, output: 0, platformId: null }
  let cheapest = null
  let minInput = Infinity
  for (const [pid, price] of Object.entries(model.prices || {})) {
    if ((price.input || 0) < minInput && price.input !== null) {
      minInput = price.input
      cheapest = { ...price, platformId: pid }
    }
  }
  return cheapest || { input: 0, output: 0, platformId: null }
}

/**
 * 通用价格转换（人民币 → 目标货币）
 */
export function convertPrice(cny, currency = 'cny') {
  if (cny === null || cny === undefined) return null
  return currency === 'usd' ? cny / EXCHANGE_RATE : cny
}
