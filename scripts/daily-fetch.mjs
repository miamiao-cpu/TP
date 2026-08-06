/**
 * TP 每日自动采集脚本（纯 L1: OpenRouter API）
 * 
 * 数据架构:
 *   L1 - OpenRouter API（自动，每日）: 海外模型代理价
 *   L2 - 国内平台价格（手动维护）: 见 src/data/models.js
 *   L3 - 折扣信息（手动维护）: 见 src/data/discounts.js
 * 
 * 用法: node scripts/daily-fetch.mjs
 * CI:   GitHub Actions 每日 UTC 00:00 执行
 * 
 * 输出: src/data/prices.json（仅 L1 OpenRouter 数据）
 * 国内平台价格: 请编辑 src/data/models.js 手工维护
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')
const HISTORY_DIR = resolve(__dirname, '../price-history')
const EXCHANGE_RATE = 7.25

// ============================================================
// 工具函数
// ============================================================

function today() {
  return new Date().toISOString().split('T')[0]
}

// ============================================================
// L1: OpenRouter API（纯 fetch，始终可用）
// ============================================================

// OpenRouter 模型 ID → 内部模型 ID 映射
const OR_TARGET_MODELS = {
  // OpenAI
  'openai/gpt-5.6': 'gpt-5.6',
  'openai/gpt-5.6-luna': 'gpt-5.6-luna',
  'openai/gpt-5-mini': 'gpt-5-mini',
  'openai/o4-mini': 'o4-mini',
  // Anthropic
  'anthropic/claude-opus-5': 'claude-opus-5',
  'anthropic/claude-sonnet-5': 'claude-sonnet-5',
  'anthropic/claude-haiku-4.5': 'claude-haiku-4.5',
  'anthropic/claude-fable-5': 'claude-fable-5',
  // Google
  'google/gemini-3.1-pro-preview': 'gemini-3.1-pro',
  'google/gemini-3.6-flash': 'gemini-3.6-flash',
  // DeepSeek
  '~deepseek/deepseek-v4-flash-latest': 'deepseek-v4-flash',
  'deepseek/deepseek-v4-flash': 'deepseek-v4-flash',
  'deepseek/deepseek-v3.2': 'deepseek-v3.2',
  // xAI
  'x-ai/grok-4.3': 'grok-4',
  // Mistral
  'mistralai/mistral-large-2512': 'mistral-large-3',
}

async function fetchOpenRouter() {
  console.log('[TP-L1] 正在从 OpenRouter API 获取价格...')

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const allModels = data.data || []
    const results = {}

    for (const model of allModels) {
      const orId = model.id
      const internalId = OR_TARGET_MODELS[orId]
      if (!internalId) continue

      const pricing = model.pricing || {}
      const inputCNY = parseFloat(pricing.prompt || '0') * 1_000_000 * EXCHANGE_RATE
      const outputCNY = parseFloat(pricing.completion || '0') * 1_000_000 * EXCHANGE_RATE
      const cacheCNY = parseFloat(pricing.input_cache_read || '0') * 1_000_000 * EXCHANGE_RATE

      results[internalId] = {
        input: Math.round(inputCNY * 100) / 100,
        output: Math.round(outputCNY * 100) / 100,
        cache: cacheCNY > 0 ? Math.round(cacheCNY * 100) / 100 : null,
        batch: null,
        contextLength: model.context_length,
        source: 'auto',
        updated: today(),
      }
    }

    console.log(`[TP-L1] OpenRouter: ${Object.keys(results).length} 个模型`)
    return results
  } catch (err) {
    console.error('[TP-L1] OpenRouter 失败:', err.message)
    return {}
  }
}

// ============================================================
// 读取现有 prices.json（保留国内平台数据用）
// ============================================================

function readExistingPrices() {
  try {
    const path = resolve(DATA_DIR, 'prices.json')
    if (!existsSync(path)) return { prices: {} }
    const content = readFileSync(path, 'utf-8')
    const data = JSON.parse(content)
    return data
  } catch (err) {
    console.warn('[TP] 读取现有 prices.json 失败:', err.message)
    return { prices: {} }
  }
}

// ============================================================
// 合并策略: L1 覆盖 openrouter 平台，保留国内平台数据
// ============================================================

function mergePrices(l1Data, existingPrices) {
  const merged = {}

  // 1. 从现有数据中提取国内平台条目（非 openrouter）
  for (const [modelId, platformPrices] of Object.entries(existingPrices)) {
    for (const [platformId, price] of Object.entries(platformPrices)) {
      if (platformId !== 'openrouter') {
        if (!merged[modelId]) merged[modelId] = {}
        merged[modelId][platformId] = price
      }
    }
  }

  // 2. L1 OpenRouter 数据（覆盖 openrouter 平台）
  for (const [modelId, price] of Object.entries(l1Data)) {
    if (!merged[modelId]) merged[modelId] = {}
    merged[modelId]['openrouter'] = {
      input: price.input,
      output: price.output,
      cache: price.cache || null,
      batch: null,
      contextLength: price.contextLength || null,
      source: 'auto',
      updated: price.updated,
    }
  }

  return merged
}

// ============================================================
// 主流程
// ============================================================

async function main() {
  console.log('='.repeat(60))
  console.log('TP 每日价格采集（纯 L1: OpenRouter）')
  console.log(`时间: ${new Date().toISOString()}`)
  console.log('='.repeat(60))

  // 读取现有数据（保留国内平台手动录入的价格）
  const existing = readExistingPrices()
  const existingPrices = existing.prices || {}
  console.log(`[TP] 现有数据: ${Object.keys(existingPrices).length} 个模型`)

  // L1: OpenRouter API
  const l1Data = await fetchOpenRouter()

  // 合并
  const merged = mergePrices(l1Data, existingPrices)

  // 输出摘要
  const modelIds = Object.keys(merged).sort()
  console.log('\n' + '-'.repeat(60))
  console.log('合并结果（¥/百万Token）:')
  console.log('-'.repeat(60))

  for (const modelId of modelIds) {
    const platforms = merged[modelId]
    const platformNames = Object.keys(platforms).join(', ')
    const cheapestInput = Math.min(...Object.values(platforms).map(p => p.input || Infinity))
    console.log(`${modelId}: [${platformNames}] 最低输入¥${cheapestInput}`)
  }

  // 写入 JSON
  const outputPath = resolve(DATA_DIR, 'prices.json')
  const now = new Date()
  const dateStr = today()

  const outputData = {
    _meta: {
      generatedAt: now.toISOString(),
      sources: ['openrouter'],
      exchangeRate: EXCHANGE_RATE,
      currency: 'CNY/百万Token',
      version: 3,
    },
    prices: merged,
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }

  writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8')

  // ============================================================
  // 保存历史价格快照（price-history/YYYY-MM-DD.json）
  // 仅保留最近90天，避免仓库膨胀
  // ============================================================
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true })
  }

  // 保存今日快照
  const historyPath = resolve(HISTORY_DIR, `${dateStr}.json`)
  if (!existsSync(historyPath)) {
    writeFileSync(historyPath, JSON.stringify(outputData, null, 2), 'utf-8')
    console.log(`[TP-HISTORY] 快照已保存: ${historyPath}`)
  } else {
    console.log(`[TP-HISTORY] 今日快照已存在，跳过`)
  }

  // 清理 90 天前的旧快照
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  try {
    const files = readdirSync(HISTORY_DIR)
    for (const file of files) {
      if (file.endsWith('.json') && file.replace('.json', '') < cutoffStr) {
        const filePath = resolve(HISTORY_DIR, file)
        writeFileSync(filePath, JSON.stringify({ _archived: true, archivedAt: now.toISOString() }), 'utf-8')
        console.log(`[TP-HISTORY] 归档旧快照: ${file}`)
      }
    }
  } catch (err) {
    console.warn('[TP-HISTORY] 清理旧快照失败:', err.message)
  }

  const coveredPlatforms = new Set(modelIds.flatMap(id => Object.keys(merged[id])))
  console.log(`\n[TP] 价格数据已写入: ${outputPath}`)
  console.log(`[TP] 共 ${modelIds.length} 个模型, 覆盖 ${coveredPlatforms.size} 个平台`)
  console.log(`[TP] L1(OpenRouter): ${Object.keys(l1Data).length} 个`)

  console.log('\n' + '='.repeat(60))
  console.log('采集完成')
  console.log('国内平台价格通过 src/data/models.js 手工维护')
  console.log('='.repeat(60))
}

main().catch(err => {
  console.error('[TP] 采集失败:', err)
  process.exit(1)
})