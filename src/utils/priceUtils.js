/**
 * 价格工具函数
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
 * 格式化价格（每百万Token）
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
 * 格式化价格带单位
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
 * 简化版：按上下文长度和价格计算
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
