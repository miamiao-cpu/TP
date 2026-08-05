/**
 * TP 多源数据采集脚本
 * 
 * 数据源分层：
 *   Layer 1 - OpenRouter API（自动，每日）: 海外模型代理最低价 + 各Provider端点价
 *   Layer 2 - 各平台文档爬取（半自动，每周）: 国内官方定价 + 基础价格
 *   Layer 3 - 优惠/折扣信息（手动，按需）: 套餐、限时活动、新用户赠送等
 * 
 * 用法:
 *   node scripts/fetch-prices.mjs              # 全量采集
 *   node scripts/fetch-prices.mjs --openrouter  # 仅采集 OpenRouter
 *   node scripts/fetch-prices.mjs --endpoints   # 采集 OpenRouter 端点详情
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')

// ============================================================
// Layer 1: OpenRouter 采集
// ============================================================

const OPENROUTER_API = 'https://openrouter.ai/api/v1/models'
const EXCHANGE_RATE = 7.25 // USD → CNY

// 目标模型 ID 列表（OpenRouter 格式）
const TARGET_MODELS = [
  'openai/gpt-5.6',
  'openai/gpt-5.6-luna',
  'openai/gpt-5-mini',
  'openai/o4-mini',
  'anthropic/claude-opus-5',
  'anthropic/claude-sonnet-5',
  'anthropic/claude-haiku-4.5',
  'anthropic/claude-fable-5',
  'google/gemini-3.1-pro',
  'google/gemini-3.6-flash',
  'deepseek/deepseek-v4-flash-latest',
  'deepseek/deepseek-v3.2',
  'xai/grok-4',
  'mistralai/mistral-large-3',
]

async function fetchOpenRouterModels() {
  console.log('[TP-L1] 正在从 OpenRouter 获取模型列表...')
  
  const res = await fetch(OPENROUTER_API)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  
  const data = await res.json()
  const allModels = data.data || []
  console.log(`[TP-L1] 获取到 ${allModels.length} 个模型`)
  
  const results = {}
  
  for (const model of allModels) {
    const isTarget = TARGET_MODELS.some(t => 
      model.id === t || model.id.startsWith(t.replace(/-latest$/, ''))
    )
    if (!isTarget) continue
    
    const pricing = model.pricing || {}
    
    // OpenRouter 价格: $/token → 转 ¥/百万Token
    results[model.id] = {
      id: model.id,
      name: model.name,
      contextLength: model.context_length,
      modality: model.architecture?.modality,
      // OpenRouter 代理价（最低Provider价）
      openrouter: {
        inputCNY: parseFloat(pricing.prompt || '0') * 1_000_000 * EXCHANGE_RATE,
        outputCNY: parseFloat(pricing.completion || '0') * 1_000_000 * EXCHANGE_RATE,
        cacheCNY: parseFloat(pricing.input_cache_read || '0') * 1_000_000 * EXCHANGE_RATE,
        inputUSD: parseFloat(pricing.prompt || '0') * 1_000_000,
        outputUSD: parseFloat(pricing.completion || '0') * 1_000_000,
        cacheUSD: parseFloat(pricing.input_cache_read || '0') * 1_000_000,
      },
      updated: new Date().toISOString().split('T')[0],
      source: 'openrouter-auto',
    }
  }
  
  console.log(`[TP-L1] 匹配到 ${Object.keys(results).length} 个目标模型`)
  return results
}

// ============================================================
// Layer 1+: OpenRouter 端点详情（各Provider独立报价）
// ============================================================

async function fetchOpenRouterEndpoints(modelId) {
  try {
    const res = await fetch(`https://openrouter.ai/api/v1/models/${encodeURIComponent(modelId)}/endpoints`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []).map(ep => ({
      provider: ep.provider_name || ep.id,
      inputCNY: parseFloat(ep.pricing?.prompt || '0') * 1_000_000 * EXCHANGE_RATE,
      outputCNY: parseFloat(ep.pricing?.completion || '0') * 1_000_000 * EXCHANGE_RATE,
      cacheCNY: parseFloat(ep.pricing?.input_cache_read || '0') * 1_000_000 * EXCHANGE_RATE,
      discount: ep.pricing?.discount || 0,
      uptime: ep.top_provider?.uptime || 0,
    }))
  } catch {
    return []
  }
}

// ============================================================
// Layer 2: 国内平台文档爬取（占位 - 需按平台实现）
// ============================================================

/**
 * 各平台采集策略说明:
 * 
 * 百炼(阿里云):
 *   - 无定价API，需爬取 https://help.aliyun.com/zh/model-studio/getting-started/models
 *   - 价格以HTML表格呈现，可用 cheerio 解析
 *   - 频率: 每周
 * 
 * 火山引擎:
 *   - 无定价API，需爬取 https://www.volcengine.com/docs/82379/1544681
 *   - 频率: 每周
 * 
 * 硅基流动:
 *   - 无定价API，需爬取 https://siliconflow.cn/pricing
 *   - 注意: 有分时定价(平时/高峰)，需两个字段
 *   - 频率: 每日
 * 
 * 智谱AI:
 *   - 爬取 https://open.bigmodel.cn/pricing
 *   - 频率: 每周
 * 
 * DeepSeek:
 *   - 爬取 https://platform.deepseek.com/api-docs/pricing
 *   - 有峰谷定价
 *   - 频率: 每周
 * 
 * 腾讯云混元:
 *   - 爬取腾讯云官网定价页
 *   - 频率: 每周
 */

console.log('[TP-L2] 国内平台爬取功能待实现（需安装 cheerio 等依赖）')
console.log('[TP-L2] 当前策略: 数据由 src/data/models.js 手动维护，每周人工更新')

// ============================================================
// Layer 3: 折扣/优惠信息（手动维护）
// ============================================================

/**
 * 折扣数据结构（与 models.js 分离，独立维护）
 * 
 * {
 *   platformId: 'bailian',
 *   discounts: [
 *     {
 *       type: 'subscription',    // subscription=订阅套餐 / promo=限时活动 / free-tier=免费额度
 *       name: 'Token Plan 个人版',
 *       description: '夜间调用2折起',
 *       discount: '2折',         // 人类可读折扣
 *       validFrom: '2026-07-01',
 *       validTo: null,            // null=长期有效
 *       appliesTo: ['qwen-max', 'qwen-plus'],  // 适用的模型ID
 *       source: 'manual',
 *     },
 *     {
 *       type: 'free-tier',
 *       name: '新用户赠送',
 *       description: '注册送100万Token免费额度',
 *       discount: '免费100万Token',
 *       validFrom: '2026-01-01',
 *       validTo: null,
 *       appliesTo: ['*'],  // * = 全部模型
 *       source: 'manual',
 *     },
 *   ]
 * }
 */

const PLATFORM_DISCOUNTS = [
  {
    platformId: 'bailian',
    discounts: [
      { type: 'subscription', name: 'Token Plan 夜间折扣', description: '夜间(22:00-08:00)调用低至2折', discount: '2折', validFrom: '2026-07-01', validTo: null, appliesTo: ['*'], source: 'manual' },
      { type: 'subscription', name: 'Coding Plan', description: '编程场景包月订阅', discount: '包月¥29.9起', validFrom: '2026-06-01', validTo: null, appliesTo: ['qwen-coder'], source: 'manual' },
      { type: 'free-tier', name: '新用户赠送', description: '注册即送100万Token', discount: '免费100万Token', validFrom: '2026-01-01', validTo: null, appliesTo: ['*'], source: 'manual' },
    ],
  },
  {
    platformId: 'volcengine',
    discounts: [
      { type: 'subscription', name: 'Agent Plan', description: '积分制订阅，适合高频Agent场景', discount: '按量积分', validFrom: '2026-07-01', validTo: null, appliesTo: ['*'], source: 'manual' },
      { type: 'promo', name: 'Coding Plan 首月特惠', description: '首月9.9元体验', discount: '首月¥9.9', validFrom: '2026-06-01', validTo: null, appliesTo: ['doubao-seed-2.1-pro'], source: 'manual' },
      { type: 'free-tier', name: '新用户赠送', description: '注册送50万Token', discount: '免费50万Token', validFrom: '2026-01-01', validTo: null, appliesTo: ['*'], source: 'manual' },
    ],
  },
  {
    platformId: 'siliconflow',
    discounts: [
      { type: 'promo', name: '分时定价', description: '平时价低至高峰价50%', discount: '分时半价', validFrom: '2026-05-01', validTo: null, appliesTo: ['*'], source: 'manual' },
      { type: 'free-tier', name: '新用户赠送', description: '注册送2000万Token', discount: '免费2000万Token', validFrom: '2026-01-01', validTo: null, appliesTo: ['*'], source: 'manual' },
    ],
  },
  {
    platformId: 'zhipu',
    discounts: [
      { type: 'free-tier', name: 'GLM-4-Flash 永久免费', description: 'GLM-4-Flash模型零成本调用', discount: '免费', validFrom: '2025-06-01', validTo: null, appliesTo: ['glm-4-flash'], source: 'manual' },
    ],
  },
  {
    platformId: 'deepseek',
    discounts: [
      { type: 'promo', name: '错峰半价', description: '夜间(00:30-08:30)调用5折', discount: '5折', validFrom: '2025-02-26', validTo: null, appliesTo: ['*'], source: 'manual' },
    ],
  },
  {
    platformId: 'tencent',
    discounts: [
      { type: 'free-tier', name: '混元-Lite 永久免费', description: '混元-Lite模型零成本调用', discount: '免费', validFrom: '2025-06-01', validTo: null, appliesTo: ['hunyuan-lite'], source: 'manual' },
    ],
  },
  {
    platformId: 'openrouter',
    discounts: [
      { type: 'promo', name: '部分Provider折扣', description: '部分第三方Provider有额外折扣(如GMICloud 5%)', discount: '最高5%off', validFrom: null, validTo: null, appliesTo: ['*'], source: 'auto' },
    ],
  },
]

// ============================================================
// 主流程
// ============================================================

async function main() {
  const args = process.argv.slice(2)
  const onlyOpenRouter = args.includes('--openrouter')
  const withEndpoints = args.includes('--endpoints')
  
  console.log('='.repeat(60))
  console.log('TP 数据采集')
  console.log('='.repeat(60))
  
  // Layer 1: OpenRouter
  if (!onlyOpenRouter || args.includes('--openrouter')) {
    const orData = await fetchOpenRouterModels()
    
    // Layer 1+: 端点详情
    if (withEndpoints) {
      console.log('\n[TP-L1+] 正在获取各 Provider 端点详情...')
      for (const [modelId, model] of Object.entries(orData)) {
        const endpoints = await fetchOpenRouterEndpoints(modelId)
        if (endpoints.length > 0) {
          model.endpoints = endpoints
          console.log(`  ${modelId}: ${endpoints.length} 个Provider`)
        }
      }
    }
    
    // 输出摘要
    console.log('\n--- OpenRouter 采集结果（¥/百万Token）---')
    for (const [id, m] of Object.entries(orData)) {
      console.log(`${m.name}: 输入¥${m.openrouter.inputCNY.toFixed(2)} | 输出¥${m.openrouter.outputCNY.toFixed(2)} | 缓存¥${m.openrouter.cacheCNY.toFixed(4)}`)
    }
    
    // 写入临时JSON（供人工校验后更新到 models.js）
    const outPath = resolve(__dirname, '../.temp/openrouter-prices.json')
    writeFileSync(outPath, JSON.stringify(orData, null, 2), 'utf-8')
    console.log(`\n[TP] OpenRouter 数据已保存到 ${outPath}`)
    console.log('[TP] 请人工校验后更新 src/data/models.js')
  }
  
  // Layer 3: 折扣信息
  console.log('\n--- 各平台折扣/优惠信息 ---')
  for (const platform of PLATFORM_DISCOUNTS) {
    console.log(`\n[${platform.platformId}]`)
    for (const d of platform.discounts) {
      console.log(`  - [${d.type}] ${d.name}: ${d.description} (${d.discount})`)
    }
  }
  
  // 写入折扣数据
  const discountPath = resolve(__dirname, '../src/data/discounts.js')
  const discountContent = `/**\n * TP 平台折扣/优惠数据\n * Layer 3 - 手动维护\n * \n * 最后更新: ${new Date().toISOString().split('T')[0]}\n */\n\nconst PLATFORM_DISCOUNTS = ${JSON.stringify(PLATFORM_DISCOUNTS, null, 2)}\n\nexport default PLATFORM_DISCOUNTS\n`
  writeFileSync(discountPath, discountContent, 'utf-8')
  console.log(`\n[TP] 折扣数据已写入 ${discountPath}`)
  
  console.log('\n' + '='.repeat(60))
  console.log('采集完成')
  console.log('='.repeat(60))
  console.log('\n数据架构说明:')
  console.log('  Layer 1 (OpenRouter自动):  海外模型代理价 + 各Provider端点 → .temp/openrouter-prices.json')
  console.log('  Layer 2 (国内平台半自动):  各平台官方定价 → 需爬取或手动录入 src/data/models.js')
  console.log('  Layer 3 (折扣/优惠手动):   套餐、限时、免费额度 → src/data/discounts.js')
}

main().catch(err => {
  console.error('[TP] 采集失败:', err)
  process.exit(1)
})
