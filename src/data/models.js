/**
 * TP 模型定价数据
 * 
 * 价格统一存储为：人民币 / 百万Token
 * 数据来源标记：auto（自动采集）/ manual（手动录入）
 * 
 * 最后更新：2026-08-03
 */

const models = [
  // ==================== OpenAI ====================
  {
    id: 'gpt-5.6',
    name: 'GPT-5.6',
    provider: 'OpenAI',
    tag: 'flagship',
    contextLength: 1050000,
    modality: 'text->text',
    // 人民币/百万Token
    prices: {
      openai: { input: 36.25, output: 217.50, cache: null, batch: 108.75, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 36.25, output: 217.50, cache: 7.25, batch: 108.75, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'OpenAI',
    tag: 'small',
    contextLength: 1050000,
    modality: 'text->text',
    prices: {
      openai: { input: 1.45, output: 8.70, cache: null, batch: 4.35, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 1.45, output: 8.70, cache: 0.14, batch: 4.35, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 mini',
    provider: 'OpenAI',
    tag: 'small',
    contextLength: 272000,
    modality: 'text->text',
    prices: {
      openai: { input: 1.81, output: 14.50, cache: null, batch: 7.25, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 1.81, output: 14.50, cache: 0.18, batch: 7.25, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'OpenAI',
    tag: 'reasoning',
    contextLength: 200000,
    modality: 'text->text',
    prices: {
      openai: { input: 7.98, output: 31.90, cache: null, batch: 15.95, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 7.98, output: 31.90, cache: 0.80, batch: 15.95, source: 'auto', updated: '2026-08-03' },
    },
  },

  // ==================== Anthropic ====================
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    tag: 'flagship',
    contextLength: 1000000,
    modality: 'text->text',
    prices: {
      anthropic: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    tag: 'balanced',
    contextLength: 1000000,
    modality: 'text->text',
    prices: {
      anthropic: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    tag: 'small',
    contextLength: 200000,
    modality: 'text->text',
    prices: {
      anthropic: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    provider: 'Anthropic',
    tag: 'flagship',
    contextLength: 1000000,
    modality: 'text->text',
    prices: {
      anthropic: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },

  // ==================== Google ====================
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    tag: 'flagship',
    contextLength: 1049000,
    modality: 'text->text',
    prices: {
      google: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'Google',
    tag: 'balanced',
    contextLength: 1049000,
    modality: 'text->text',
    prices: {
      google: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },

  // ==================== DeepSeek ====================
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    tag: 'small',
    contextLength: 1049000,
    modality: 'text->text',
    prices: {
      deepseek: { input: 1.02, output: 2.03, cache: 0.10, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 1.02, output: 2.03, cache: 0.10, batch: null, source: 'auto', updated: '2026-08-03' },
      siliconflow: { input: 1.02, output: 2.03, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },
  {
    id: 'deepseek-v3.2',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    tag: 'balanced',
    contextLength: 164000,
    modality: 'text->text',
    prices: {
      deepseek: { input: 2.03, output: 2.90, cache: 0.20, batch: null, source: 'manual', updated: '2026-08-03' },
      openrouter: { input: 2.03, output: 2.90, cache: 0.20, batch: null, source: 'auto', updated: '2026-08-03' },
      siliconflow: { input: 2.03, output: 2.90, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },

  // ==================== 阿里百炼 ====================
  {
    id: 'qwen-max',
    name: 'Qwen-Max',
    provider: '阿里云',
    tag: 'flagship',
    contextLength: 32000,
    modality: 'text->text',
    prices: {
      bailian: { input: 20.00, output: 60.00, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
      siliconflow: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },
  {
    id: 'qwen-plus',
    name: 'Qwen-Plus',
    provider: '阿里云',
    tag: 'balanced',
    contextLength: 131072,
    modality: 'text->text',
    prices: {
      bailian: { input: 4.00, output: 12.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-03' },
      siliconflow: { input: 3.00, output: 9.00, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },

  // ==================== 火山引擎 ====================
  {
    id: 'doubao-seed-2.1-pro',
    name: 'Doubao Seed 2.1 Pro',
    provider: '字节跳动',
    tag: 'balanced',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-2.1-turbo',
    name: 'Doubao Seed 2.1 Turbo',
    provider: '字节跳动',
    tag: 'small',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 3.00, output: 15.00, cache: 0.60, batch: 1.50, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-evolving',
    name: 'Doubao Seed Evolving',
    provider: '字节跳动',
    tag: 'flagship',
    contextLength: 256000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-2.0-pro-32k',
    name: 'Doubao Seed 2.0 Pro 32K',
    provider: '字节跳动',
    tag: 'balanced',
    contextLength: 32000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 3.20, output: 16.00, cache: 0.64, batch: 1.60, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-2.0-lite-32k',
    name: 'Doubao Seed 2.0 Lite 32K',
    provider: '字节跳动',
    tag: 'small',
    contextLength: 32000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 0.60, output: 3.60, cache: 0.12, batch: 0.30, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-2.0-mini-32k',
    name: 'Doubao Seed 2.0 Mini 32K',
    provider: '字节跳动',
    tag: 'free',
    contextLength: 32000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 0.20, output: 2.00, cache: 0.04, batch: 0.10, source: 'manual', updated: '2026-08-04' },
    },
  },
  {
    id: 'doubao-seed-2.0-code-128k',
    name: 'Doubao Seed 2.0 Code 128K',
    provider: '字节跳动',
    tag: 'balanced',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      volcengine: { input: 4.80, output: 24.00, cache: 0.96, batch: 2.40, source: 'manual', updated: '2026-08-04' },
    },
  },

  // ==================== 智谱 ====================
  {
    id: 'glm-4-plus',
    name: 'GLM-4-Plus',
    provider: '智谱AI',
    tag: 'balanced',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      zhipu: { input: 50.00, output: 50.00, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },
  {
    id: 'glm-4-flash',
    name: 'GLM-4-Flash',
    provider: '智谱AI',
    tag: 'free',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      zhipu: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },

  // ==================== 腾讯 ====================
  {
    id: 'hunyuan-pro',
    name: '混元-Pro',
    provider: '腾讯云',
    tag: 'balanced',
    contextLength: 128000,
    modality: 'text->text',
    prices: {
      tencent: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-03' },
    },
  },

  // ==================== xAI ====================
  {
    id: 'grok-4',
    name: 'Grok 4',
    provider: 'xAI',
    tag: 'flagship',
    contextLength: 256000,
    modality: 'text->text',
    prices: {
      openrouter: { input: 21.75, output: 108.75, cache: null, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },

  // ==================== Mistral ====================
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    tag: 'balanced',
    contextLength: 262000,
    modality: 'text->text',
    prices: {
      openrouter: { input: 3.63, output: 10.88, cache: null, batch: null, source: 'auto', updated: '2026-08-03' },
    },
  },
]

export default models
