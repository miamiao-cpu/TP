/**
 * TP 每日自动采集脚本（真实数据 v3.1）
 *
 * 数据架构:
 *   L1 - OpenRouter API（自动，每日）: 海外模型代理价
 *   L2 - 国内平台价格（手动维护）: 见 src/data/models.js
 *   L3 - 折扣信息（手动维护）: 见 src/data/discounts.js
 *
 * 本脚本职责:
 *   1. 刷新 L1 OpenRouter 价 → 写入 src/data/prices.json（仅 L1）
 *   2. 基于"站点真实展示数据"（getModels 全量合并）生成当日真实快照
 *      → price-history/YYYY-MM-DD.json（含 L1+L2，完整、无模拟）
 *   3. 快照为历史对比唯一真实来源：详情页曲线、首页涨跌均读它
 *
 * 用法:
 *   node scripts/daily-fetch.mjs                      # 采集 + 今日快照
 *   TP_SNAPSHOT_DATE=2026-08-06 TP_FORCE=1 node ...   # 回填/覆盖某日基线
 *
 * CI: GitHub Actions 每日 UTC 00:00 执行
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getModels } from '../src/data/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')
const HISTORY_DIR = resolve(__dirname, '../price-history')
const EXCHANGE_RATE = 7.25

// 环境覆盖（用于基线回填）
const SNAPSHOT_DATE = process.env.TP_SNAPSHOT_DATE || new Date().toISOString().split('T')[0]
const FORCE = process.env.TP_FORCE === '1'

function today() {
  return new Date().toISOString().split('T')[0]
}

// ============================================================
// L1: OpenRouter API（纯 fetch）
// ============================================================

const OR_TARGET_MODELS = {
  // OpenAI
  'openai/gpt-5.5-pro': 'gpt-5.5-pro',
  'openai/gpt-5.4': 'gpt-5.4',
  'openai/gpt-5': 'gpt-5',
  'openai/gpt-4o': 'gpt-4o',
  'openai/gpt-4o-mini': 'gpt-4o-mini',
  'openai/o3': 'o3',
  'openai/o4-mini': 'o4-mini',
  // Anthropic
  'anthropic/claude-opus-5': 'claude-opus-5',
  'anthropic/claude-fable-5': 'claude-fable-5',
  'anthropic/claude-sonnet-4.6': 'claude-sonnet-4.6',
  'anthropic/claude-sonnet-4.5': 'claude-sonnet-4.6',
  'anthropic/claude-haiku-4.5': 'claude-haiku-4.5',
  // Google
  'google/gemini-2.5-pro': 'gemini-2.5-pro',
  'google/gemini-2.5-flash': 'gemini-2.5-flash',
  // xAI
  'x-ai/grok-4.3': 'grok-4.3',
  // Mistral
  'mistralai/mistral-large-2512': 'mistral-large-3',
  // DeepSeek
  'deepseek/deepseek-v4-pro': 'deepseek-v4-pro',
  '~deepseek/deepseek-v4-flash-latest': 'deepseek-v4-flash',
  'deepseek/deepseek-v4-flash': 'deepseek-v4-flash',
  // Kimi
  'moonshotai/kimi-k3': 'kimi-k3',
  // Perplexity
  'perplexity/sonar-pro': 'sonar-pro',
  // 图像模型
  'openai/gpt-5.4-image-2': 'gpt-image-2',
  'google/gemini-imagen-4': 'gemini-imagen-4',
  // 视频模型
  'google/veo-4': 'veo-4',
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
      const internalId = OR_TARGET_MODELS[model.id]
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
// 保留现有 prices.json 中的非 openrouter 平台价
// ============================================================

function readExistingPrices() {
  try {
    const path = resolve(DATA_DIR, 'prices.json')
    if (!existsSync(path)) return { prices: {} }
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return { prices: {} }
  }
}

function mergePrices(l1Data, existingPrices) {
  const merged = {}
  for (const [modelId, platformPrices] of Object.entries(existingPrices)) {
    for (const [platformId, price] of Object.entries(platformPrices)) {
      if (platformId !== 'openrouter') {
        if (!merged[modelId]) merged[modelId] = {}
        merged[modelId][platformId] = price
      }
    }
  }
  for (const [modelId, price] of Object.entries(l1Data)) {
    if (!merged[modelId]) merged[modelId] = {}
    merged[modelId]['openrouter'] = { ...price, updated: price.updated }
  }
  return merged
}

// ============================================================
// 基于站点真实展示数据生成完整快照（L1+L2）
// ============================================================

function buildFullSnapshot() {
  const models = getModels()
  const prices = {}
  for (const m of models) {
    if (!m.prices) continue
    prices[m.id] = {}
    for (const [pid, p] of Object.entries(m.prices)) {
      prices[m.id][pid] = {
        input: p.input ?? null,
        output: p.output ?? null,
        cache: p.cache ?? null,
        batch: p.batch ?? null,
        contextLength: p.contextLength ?? m.contextLength ?? null,
        source: p.source || 'manual',
        updated: p.updated || SNAPSHOT_DATE,
      }
    }
  }
  return {
    _meta: {
      generatedAt: new Date().toISOString(),
      snapshotDate: SNAPSHOT_DATE,
      sources: ['openrouter', 'manual'],
      exchangeRate: EXCHANGE_RATE,
      currency: 'CNY/百万Token',
      version: 3.1,
      snapshotType: 'full',
    },
    prices,
  }
}

// ============================================================
// 主流程
// ============================================================

async function main() {
  console.log('='.repeat(60))
  console.log('TP 每日价格采集（真实快照 v3.1）')
  console.log(`时间: ${new Date().toISOString()}  快照日: ${SNAPSHOT_DATE}${FORCE ? ' (强制覆盖)' : ''}`)
  console.log('='.repeat(60))

  const existing = readExistingPrices()
  const existingPrices = existing.prices || {}
  const l1Data = await fetchOpenRouter()
  const merged = mergePrices(l1Data, existingPrices)

  // 1. 写回 L1 prices.json
  const outputPath = resolve(DATA_DIR, 'prices.json')
  writeFileSync(outputPath, JSON.stringify({
    _meta: {
      generatedAt: new Date().toISOString(),
      sources: ['openrouter'],
      exchangeRate: EXCHANGE_RATE,
      currency: 'CNY/百万Token',
      version: 3.1,
    },
    prices: merged,
  }, null, 2), 'utf-8')

  // 2. 生成完整真实快照
  if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true })
  const historyPath = resolve(HISTORY_DIR, `${SNAPSHOT_DATE}.json`)
  if (existsSync(historyPath) && !FORCE) {
    console.log(`[TP-HISTORY] ${SNAPSHOT_DATE}.json 已存在，跳过（用 TP_FORCE=1 覆盖）`)
  } else {
    const snapshot = buildFullSnapshot()
    writeFileSync(historyPath, JSON.stringify(snapshot, null, 2), 'utf-8')
    console.log(`[TP-HISTORY] 完整快照已保存: ${historyPath}（${Object.keys(snapshot.prices).length} 个模型）`)
  }

  // 3. 清理 90 天前的旧快照
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  try {
    for (const file of readdirSync(HISTORY_DIR)) {
      if (file.endsWith('.json') && file.replace('.json', '') < cutoffStr) {
        writeFileSync(resolve(HISTORY_DIR, file), JSON.stringify({ _archived: true, archivedAt: new Date().toISOString() }), 'utf-8')
        console.log(`[TP-HISTORY] 归档旧快照: ${file}`)
      }
    }
  } catch (err) {
    console.warn('[TP-HISTORY] 清理旧快照失败:', err.message)
  }

  const covered = new Set(Object.keys(merged).flatMap((id) => Object.keys(merged[id])))
  console.log(`\n[TP] prices.json 已写: ${outputPath}`)
  console.log(`[TP] 共 ${Object.keys(merged).length} 个模型, 覆盖 ${covered.size} 个平台`)
  console.log('='.repeat(60))
  console.log('采集完成')
}

main().catch((err) => {
  console.error('[TP] 采集失败:', err)
  process.exit(1)
})
