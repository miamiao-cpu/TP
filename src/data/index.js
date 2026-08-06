/**
 * TP 数据层（v3 - 文本/图像/视频三类 + 国家区域）
 *
 * 数据流:
 *   daily-fetch.mjs → prices.json (L1 自动采集)
 *   models.js       → 手动维护数据 (L2 国内平台 + 海外官方价)
 *   discounts.js    → 手动维护折扣信息
 */

import rawPrices from './prices.json'
import MANUAL_MODELS from './models'
import DISCOUNTS from './discounts'
import { PLATFORMS, COUNTRIES, REGIONS, MODALITIES, CHANGE_TYPES } from './constants'

// ============================================================
// 平台地域映射（从 PLATFORMS 常量自动获取）
// ============================================================

const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map(p => [p.id, p]))

function getPlatformCountry(platformId) {
  return PLATFORM_MAP[platformId]?.country || 'US'
}

function getPlatformRegion(platformId) {
  const country = getPlatformCountry(platformId)
  return COUNTRIES[country]?.region || 'na'
}

// ============================================================
// 从 prices.json + models.js 合并构建完整模型列表
// ============================================================

function buildModels() {
  const autoData = rawPrices.prices || {}
  const modelMap = {}

  // 1. 从手动数据构建基础
  for (const model of MANUAL_MODELS) {
    modelMap[model.id] = {
      ...model,
      pricingUnit: model.pricingUnit || 'per_million_tokens',
      modality: model.modality || 'text->text',
      country: model.country || PLATFORM_MAP[Object.keys(model.prices || {})[0]]?.country || 'US',
      _dataSource: 'manual',
    }
  }

  // 2. 合并 prices.json 自动采集数据（覆盖 auto 来源的平台）
  for (const [modelId, platformPrices] of Object.entries(autoData)) {
    if (modelMap[modelId]) {
      const mergedPrices = { ...modelMap[modelId].prices }
      for (const [platformId, priceInfo] of Object.entries(platformPrices)) {
        if (priceInfo.source === 'auto') {
          mergedPrices[platformId] = priceInfo
        }
      }
      modelMap[modelId].prices = mergedPrices
      modelMap[modelId]._dataSource = 'hybrid'
    } else {
      const firstPid = Object.keys(platformPrices)[0]
      modelMap[modelId] = {
        id: modelId,
        name: modelId,
        provider: guessProvider(modelId),
        tag: guessTag(modelId, platformPrices),
        modality: 'text->text',
        pricingUnit: 'per_million_tokens',
        contextLength: guessContextLength(modelId),
        country: getPlatformCountry(firstPid),
        prices: platformPrices,
        _dataSource: 'auto',
      }
    }
  }

  return Object.values(modelMap)
}

// ============================================================
// 辅助函数
// ============================================================

function guessProvider(id) {
  if (id.startsWith('gpt-') || id.startsWith('o4-') || id.startsWith('o3-')) return 'OpenAI'
  if (id.startsWith('claude-')) return 'Anthropic'
  if (id.startsWith('gemini-')) return 'Google'
  if (id.startsWith('deepseek-')) return 'DeepSeek'
  if (id.startsWith('grok-')) return 'xAI'
  if (id.startsWith('mistral-')) return 'Mistral'
  if (id.startsWith('glm-')) return '智谱AI'
  if (id.startsWith('qwen')) return '阿里云'
  if (id.startsWith('doubao-')) return '字节跳动'
  if (id.startsWith('hunyuan-')) return '腾讯云'
  if (id.startsWith('minimax-')) return 'MiniMax'
  if (id.startsWith('step-')) return '阶跃星辰'
  if (id.startsWith('yi-')) return '零一万物'
  if (id.startsWith('kimi')) return '月之暗面'
  if (id.startsWith('ernie')) return '百度'
  return 'Unknown'
}

function guessTag(id, platformPrices) {
  const prices = Object.values(platformPrices)
  const avgInput = prices.reduce((s, p) => s + (p.input || 0), 0) / prices.length
  if (id.includes('flash') || id.includes('air') || id.includes('lite') || id.includes('luna')) return 'small'
  if (avgInput === 0) return 'free'
  if (avgInput > 30) return 'flagship'
  if (avgInput > 5) return 'balanced'
  return 'small'
}

function guessContextLength(id) {
  if (id.includes('5.6') || id.includes('v4-flash') || id.includes('3.6')) return 1049000
  if (id.includes('opus') || id.includes('sonnet') || id.includes('fable')) return 1000000
  if (id.includes('3.1-pro')) return 1049000
  if (id.includes('grok')) return 256000
  if (id.includes('evolving')) return 256000
  if (id.includes('128k') || id.includes('code-128k')) return 128000
  if (id.includes('32k')) return 32000
  return 128000
}

// ============================================================
// 导出 API
// ============================================================

// 获取数据更新时间
export function getLastUpdate() {
  const meta = rawPrices._meta
  return meta?.generatedAt || '2026-08-06'
}

// 获取所有模型
export function getModels() {
  return buildModels()
}

// 获取指定模型
export function getModel(modelId) {
  return getModels().find(m => m.id === modelId) || null
}

// 按 modality 筛选
export function getModelsByModality(modality) {
  if (!modality || modality === 'all') return getModels()
  return getModels().filter(m => m.modality === modality)
}

// 获取所有 modality 类型及计数
export function getModalityCounts() {
  const models = getModels()
  const counts = {}
  for (const m of models) {
    const key = m.modality || 'text->text'
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

// 按国家分组（用于地域分布展示）
export function getModelsByCountry() {
  const models = getModels()
  const groups = {}
  for (const c of Object.values(COUNTRIES)) {
    groups[c.id] = { ...c, models: [] }
  }
  for (const m of models) {
    const country = m.country || 'US'
    if (!groups[country]) {
      groups[country] = { id: country, label: country, flag: '🏳️', region: 'na', models: [] }
    }
    groups[country].models.push(m)
  }
  return Object.values(groups).filter(g => g.models.length > 0)
}

// 按区域分组
export function getModelsByRegion() {
  const models = getModels()
  const groups = {}
  for (const r of Object.values(REGIONS)) {
    groups[r.id] = { ...r, models: [] }
  }
  for (const m of models) {
    const country = m.country || 'US'
    const region = COUNTRIES[country]?.region || 'na'
    if (!groups[region]) groups[region] = { id: region, label: region, color: 'gray', models: [] }
    groups[region].models.push(m)
  }
  return Object.values(groups).filter(g => g.models.length > 0)
}

// 按国家/区域拆分模型价格（模型详情页使用）
export function getModelPricesByRegion(model) {
  const byCountry = {}
  for (const [platformId, price] of Object.entries(model.prices || {})) {
    const country = getPlatformCountry(platformId)
    if (!byCountry[country]) byCountry[country] = {}
    byCountry[country][platformId] = price
  }
  return byCountry
}

// 获取折扣信息
export function getDiscounts(platformId) {
  if (platformId) {
    const found = DISCOUNTS.find(d => d.platformId === platformId)
    return found?.discounts || []
  }
  return DISCOUNTS
}

// 获取所有已覆盖的平台ID
export function getCoveredPlatforms() {
  const models = getModels()
  const platformIds = new Set()
  for (const model of models) {
    for (const pid of Object.keys(model.prices || {})) {
      platformIds.add(pid)
    }
  }
  return [...platformIds]
}

// 获取指定平台的所有模型（用于"按平台查询"页面展示完整模型列表）
export function getModelsByPlatform(platformId) {
  return getModels().filter(m => m.prices && m.prices[platformId])
}

// 获取统计摘要（用于总览页）
export function getStats() {
  const models = getModels()
  const total = models.length
  const modalityCounts = getModalityCounts()
  const coveredPlatforms = getCoveredPlatforms()
  const platformCount = coveredPlatforms.length
  const textModels = models.filter(m => m.pricingUnit === 'per_million_tokens' && m.modality === 'text->text')
  const cheapestOutput = textModels.length > 0
    ? Math.min(...textModels.map(m => {
        const prices = Object.values(m.prices)
        return Math.min(...prices.map(p => p.output || Infinity))
      }))
    : 0
  return { total, platformCount, modalityCounts, cheapestOutput }
}

// 获取最近价格变化（新进榜/涨价/降价），用于首页 logo 展示
// 说明：数据仅记录 updated 日期，变化类型由简单规则推断（此处以"更新日期"为维度列出近期变动）
export function getRecentChanges(limit = 8) {
  const models = getModels()
  const changes = []
  for (const m of models) {
    const prices = Object.values(m.prices || {})
    if (prices.length === 0) continue
    const latestDate = prices.reduce((max, p) => {
      if (!p.updated) return max
      return (!max || p.updated > max) ? p.updated : max
    }, null)
    if (latestDate) {
      // 简单规则：更新日期越新视为"新进榜/近期变动"（auto 来源标注为新进，否则按更新展示）
      const isNew = prices.some(p => p.source === 'auto' && p.updated === latestDate)
      changes.push({
        model: m.name,
        modelId: m.id,
        country: m.country,
        modality: m.modality,
        tag: m.tag,
        date: latestDate,
        changeType: isNew ? 'new' : 'down', // 手动录入默认视为价格刷新（绿色），可后续接入真实涨跌
      })
    }
  }
  return changes.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

export default getModels
