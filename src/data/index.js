/**
 * TP 数据层
 * 优先读取自动采集的 prices.json，手动数据作为 fallback/补充
 * 
 * 数据流:
 *   daily-fetch.mjs → prices.json (L1自动 + L2部分) 
 *   models.js       → 手动维护的补充数据 (L2国内平台 + L3折扣)
 *   discounts.js    → 手动维护的折扣信息
 */

import rawPrices from './prices.json'
import MANUAL_MODELS from './models'
import DISCOUNTS from './discounts'
import { PLATFORMS } from './constants'

// 从 prices.json 构建自动采集的模型映射
function buildAutoModels() {
  const autoData = rawPrices.prices || {}
  const meta = rawPrices._meta || {}
  
  const modelMap = {}
  
  for (const [modelId, platformPrices] of Object.entries(autoData)) {
    // 检查是否已有手动数据
    const manualModel = MANUAL_MODELS.find(m => m.id === modelId)
    
    if (manualModel) {
      // 合并：verified/auto 来源覆盖手动数据中同平台条目
      const mergedPrices = { ...manualModel.prices }
      for (const [platformId, priceInfo] of Object.entries(platformPrices)) {
        if (priceInfo.source === 'auto' || priceInfo.source === 'verified') {
          mergedPrices[platformId] = priceInfo
        }
      }
      modelMap[modelId] = {
        ...manualModel,
        prices: mergedPrices,
        _dataSource: 'hybrid', // 混合来源
      }
    } else {
      // 纯自动数据，构建基本模型结构
      modelMap[modelId] = {
        id: modelId,
        name: formatModelName(modelId),
        provider: guessProvider(modelId),
        tag: guessTag(modelId, platformPrices),
        contextLength: guessContextLength(modelId),
        modality: 'text->text',
        prices: platformPrices,
        _dataSource: 'auto',
      }
    }
  }
  
  // 添加只在手动数据中存在的模型
  for (const model of MANUAL_MODELS) {
    if (!modelMap[model.id]) {
      modelMap[model.id] = { ...model, _dataSource: 'manual' }
    }
  }
  
  return Object.values(modelMap)
}

// 格式化模型名称
function formatModelName(id) {
  const map = {
    'gpt-5.6': 'GPT-5.6',
    'gpt-5.6-luna': 'GPT-5.6 Luna',
    'gpt-5-mini': 'GPT-5 mini',
    'o4-mini': 'o4-mini',
    'claude-opus-5': 'Claude Opus 5',
    'claude-sonnet-5': 'Claude Sonnet 5',
    'claude-haiku-4.5': 'Claude Haiku 4.5',
    'claude-fable-5': 'Claude Fable 5',
    'gemini-3.1-pro': 'Gemini 3.1 Pro',
    'gemini-3.6-flash': 'Gemini 3.6 Flash',
    'deepseek-v4-flash': 'DeepSeek V4 Flash',
    'deepseek-v4-pro': 'DeepSeek V4 Pro',
    'deepseek-v3.2': 'DeepSeek V3.2',
    'grok-4': 'Grok 4',
    'mistral-large-3': 'Mistral Large 3',
    'glm-5.2': 'GLM-5.2',
    'glm-4-plus': 'GLM-4-Plus',
    'glm-4-flash': 'GLM-4-Flash',
    'qwen-max': 'Qwen-Max',
    'qwen-plus': 'Qwen-Plus',
    'qwen3.5-397b': 'Qwen3.5-397B',
    'doubao-seed-2.1-pro': 'Doubao Seed 2.1 Pro',
    'doubao-seed-2.1-turbo': 'Doubao Seed 2.1 Turbo',
    'doubao-seed-evolving': 'Doubao Seed Evolving',
    'doubao-seed-2.0-pro-32k': 'Doubao Seed 2.0 Pro 32K',
    'doubao-seed-2.0-lite-32k': 'Doubao Seed 2.0 Lite 32K',
    'doubao-seed-2.0-mini-32k': 'Doubao Seed 2.0 Mini 32K',
    'doubao-seed-2.0-code-128k': 'Doubao Seed 2.0 Code 128K',
    'hunyuan-pro': '混元-Pro',
    'hunyuan-a13b': 'Hunyuan-A13B',
    'minimax-m2.5': 'MiniMax-M2.5',
  }
  return map[id] || id
}

function guessProvider(id) {
  if (id.startsWith('gpt-') || id.startsWith('o4-')) return 'OpenAI'
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
  return 'Unknown'
}

function guessTag(id, platformPrices) {
  // 根据价格判断定位
  const prices = Object.values(platformPrices)
  const avgInput = prices.reduce((s, p) => s + (p.input || 0), 0) / prices.length
  
  if (id.includes('flash') || id.includes('air') || id.includes('lite')) return 'small'
  if (avgInput === 0) return 'free'
  if (avgInput > 30) return 'flagship'
  if (avgInput > 5) return 'balanced'
  return 'small'
}

function guessContextLength(id) {
  // 粗略推断
  if (id.includes('5.6') || id.includes('v4-flash') || id.includes('3.6')) return 1049000
  if (id.includes('opus') || id.includes('sonnet') || id.includes('fable')) return 1000000
  if (id.includes('3.1-pro')) return 1049000
  if (id.includes('grok')) return 256000
  if (id.includes('evolving')) return 256000
  if (id.includes('128k') || id.includes('code-128k')) return 128000
  if (id.includes('32k')) return 32000
  return 128000
}

// 获取数据更新时间
export function getLastUpdate() {
  const meta = rawPrices._meta
  return meta?.generatedAt || '2026-08-03'
}

// 获取所有模型
export function getModels() {
  return buildAutoModels()
}

// 获取指定模型
export function getModel(modelId) {
  const models = getModels()
  return models.find(m => m.id === modelId)
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

export default getModels
