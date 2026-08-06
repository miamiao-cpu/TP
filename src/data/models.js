/**
 * TP 模型定价数据（TOP50 扩充版）
 * 
 * 价格存储：人民币 + 原计价单位
 * 数据来源：manual（手动录入）/ auto（OpenRouter 自动采集）
 * 国内外价格分列：海外大模型只列海外价，国内模型只列国内价
 * 
 * 最后更新：2026-08-06
 */

const models = [
  // ==================== OpenAI ====================
  {
    id: 'gpt-5.6',
    name: 'GPT-5.6',
    provider: 'OpenAI',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1050000,
    prices: {
      openai: { input: 36.25, output: 217.50, cache: null, batch: 108.75, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 36.25, output: 217.50, cache: 7.25, batch: 108.75, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'OpenAI',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1050000,
    prices: {
      openai: { input: 1.45, output: 8.70, cache: null, batch: 4.35, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 0.73, output: 4.35, cache: 0.07, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 mini',
    provider: 'OpenAI',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 400000,
    prices: {
      openai: { input: 1.81, output: 14.50, cache: null, batch: 7.25, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.81, output: 14.50, cache: 0.18, batch: 7.25, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'OpenAI',
    tag: 'reasoning',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 200000,
    prices: {
      openai: { input: 7.98, output: 31.90, cache: null, batch: 15.95, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 7.98, output: 31.90, cache: 1.99, batch: 15.95, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'o3',
    name: 'o3',
    provider: 'OpenAI',
    tag: 'reasoning',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 200000,
    prices: {
      openai: { input: 15.00, output: 60.00, cache: 7.50, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'embedding-v4',
    name: 'Embedding-v4',
    provider: 'OpenAI',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 8192,
    prices: {
      openai: { input: 0.14, output: null, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== Anthropic ====================
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      anthropic: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      anthropic: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 200000,
    prices: {
      anthropic: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    provider: 'Anthropic',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      anthropic: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ==================== Google ====================
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    tag: 'flagship',
    modality: 'multimodal',
    pricingUnit: 'per_million_tokens',
    contextLength: 1049000,
    prices: {
      google: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'Google',
    tag: 'balanced',
    modality: 'multimodal',
    pricingUnit: 'per_million_tokens',
    contextLength: 1049000,
    prices: {
      google: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gemini-3.1-flash',
    name: 'Gemini 3.1 Flash',
    provider: 'Google',
    tag: 'small',
    modality: 'multimodal',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      google: { input: 1.70, output: 10.10, cache: 0.34, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== DeepSeek ====================
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1049000,
    prices: {
      deepseek: { input: 1.02, output: 2.03, cache: 0.10, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.02, output: 2.03, cache: 0.20, batch: null, source: 'auto', updated: '2026-08-05' },
      siliconflow: { input: 1.02, output: 2.03, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'deepseek-v3.2',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 164000,
    prices: {
      deepseek: { input: 2.03, output: 2.90, cache: 0.20, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.95, output: 2.90, cache: 0.98, batch: null, source: 'auto', updated: '2026-08-05' },
      siliconflow: { input: 2.03, output: 2.90, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== xAI ====================
  {
    id: 'grok-4',
    name: 'Grok 4',
    provider: 'xAI',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      xai: { input: 21.75, output: 108.75, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 9.06, output: 18.13, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ==================== Mistral ====================
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 262000,
    prices: {
      mistral: { input: 3.63, output: 10.88, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 3.63, output: 10.88, cache: 0.36, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ==================== 阿里百炼 ====================
  {
    id: 'qwen-max',
    name: 'Qwen-Max',
    provider: '阿里云',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 32000,
    prices: {
      bailian: { input: 20.00, output: 60.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'qwen-plus',
    name: 'Qwen-Plus',
    provider: '阿里云',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 131072,
    prices: {
      bailian: { input: 4.00, output: 12.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 3.00, output: 9.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'qwen-turbo',
    name: 'Qwen-Turbo',
    provider: '阿里云',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 131072,
    prices: {
      bailian: { input: 2.00, output: 6.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== 火山引擎 ====================
  {
    id: 'doubao-seed-2.1-pro',
    name: 'Doubao Seed 2.1 Pro',
    provider: '字节跳动',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.1-turbo',
    name: 'Doubao Seed 2.1 Turbo',
    provider: '字节跳动',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      volcengine: { input: 3.00, output: 15.00, cache: 0.60, batch: 1.50, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-evolving',
    name: 'Doubao Seed Evolving',
    provider: '字节跳动',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 256000,
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.0-pro-32k',
    name: 'Doubao Seed 2.0 Pro 32K',
    provider: '字节跳动',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 32000,
    prices: {
      volcengine: { input: 3.20, output: 16.00, cache: 0.64, batch: 1.60, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.0-lite-32k',
    name: 'Doubao Seed 2.0 Lite 32K',
    provider: '字节跳动',
    tag: 'small',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 32000,
    prices: {
      volcengine: { input: 0.60, output: 3.60, cache: 0.12, batch: 0.30, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.0-mini-32k',
    name: 'Doubao Seed 2.0 Mini 32K',
    provider: '字节跳动',
    tag: 'free',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 32000,
    prices: {
      volcengine: { input: 0.20, output: 2.00, cache: 0.04, batch: 0.10, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.0-code-128k',
    name: 'Doubao Seed 2.0 Code 128K',
    provider: '字节跳动',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      volcengine: { input: 4.80, output: 24.00, cache: 0.96, batch: 2.40, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== 智谱AI ====================
  {
    id: 'glm-5.2',
    name: 'GLM-5.2',
    provider: '智谱AI',
    tag: 'flagship',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 1000000,
    prices: {
      zhipu: { input: 8.00, output: 28.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'glm-4-plus',
    name: 'GLM-4-Plus',
    provider: '智谱AI',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      zhipu: { input: 50.00, output: 50.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'glm-4-flash',
    name: 'GLM-4-Flash',
    provider: '智谱AI',
    tag: 'free',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      zhipu: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== 腾讯云 ====================
  {
    id: 'hunyuan-pro',
    name: '混元-Pro',
    provider: '腾讯云',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 128000,
    prices: {
      tencent: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'hunyuan-a13b',
    name: 'Hunyuan-A13B',
    provider: '腾讯云',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 256000,
    prices: {
      tencent: { input: 4.00, output: 12.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'hunyuan-lite',
    name: 'Hunyuan-Lite',
    provider: '腾讯云',
    tag: 'free',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 8000,
    prices: {
      tencent: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ==================== MiniMax ====================
  {
    id: 'minimax-m2.5',
    name: 'MiniMax-M2.5',
    provider: 'MiniMax',
    tag: 'balanced',
    modality: 'text->text',
    pricingUnit: 'per_million_tokens',
    contextLength: 256000,
    prices: {
      minimax: { input: 2.00, output: 16.20, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 2.00, output: 16.20, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
]

export default models
