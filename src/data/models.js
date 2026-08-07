/**
 * TP 模型定价数据（v3.1 - 真实价格，全部可核实）
 *
 * 模态分类：text->text（文本）/ text->image（图像）/ text->video（视频）
 * 价格存储：人民币（¥）+ 原计价单位
 * 数据来源：
 *   auto   = OpenRouter API 实时采集（每日自动）
 *   manual = 官方公示价（人工核实，后续通过 fetch-domestic.mjs 自动刷新）
 * 地域：按模型所属国家/平台国家（country）展示
 *
 * 最后更新：2026-08-07
 * 核实来源：OpenRouter API (openrouter.ai/api/v1/models) + 各平台官方定价页
 */

const models = [
  // ============================================================
  // 文本生成（text->text）— 30 个
  // ============================================================

  // ---------- OpenAI（US） ----------
  {
    id: 'gpt-5.5-pro', name: 'GPT-5.5 Pro', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1050000,
    prices: {
      openrouter: { input: 5.00, output: 30.00, cache: 0.50, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'gpt-5.4', name: 'GPT-5.4', provider: 'OpenAI', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1050000,
    prices: {
      openrouter: { input: 2.50, output: 15.00, cache: 0.25, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 400000,
    prices: {
      openrouter: { input: 1.25, output: 10.00, cache: 0.13, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      openrouter: { input: 2.50, output: 10.00, cache: 1.25, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      openrouter: { input: 0.15, output: 0.60, cache: 0.08, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'o3', name: 'o3', provider: 'OpenAI', country: 'US',
    tag: 'reasoning', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openrouter: { input: 2.00, output: 8.00, cache: 0.50, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', country: 'US',
    tag: 'reasoning', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openrouter: { input: 1.10, output: 4.40, cache: 0.28, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- Anthropic（US） ----------
  {
    id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'Anthropic', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      openrouter: { input: 5.00, output: 25.00, cache: 0.50, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'claude-fable-5', name: 'Claude Fable 5', provider: 'Anthropic', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      openrouter: { input: 10.00, output: 50.00, cache: 1.00, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      openrouter: { input: 3.00, output: 15.00, cache: 0.30, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'Anthropic', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openrouter: { input: 1.00, output: 5.00, cache: 0.10, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- Google（US） ----------
  {
    id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      openrouter: { input: 1.25, output: 10.00, cache: 0.13, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      openrouter: { input: 0.30, output: 2.50, cache: 0.03, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- xAI（US） ----------
  {
    id: 'grok-4.3', name: 'Grok 4.3', provider: 'xAI', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      openrouter: { input: 1.25, output: 2.50, cache: 0.20, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- Mistral（FR） ----------
  {
    id: 'mistral-large-3', name: 'Mistral Large 3', provider: 'Mistral', country: 'FR',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 262144,
    prices: {
      openrouter: { input: 0.50, output: 1.50, cache: 0.05, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- DeepSeek（CN）— 官方公示价 2026-08 ----------
  {
    id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      deepseek: { input: 3.17, output: 6.34, cache: 0.18, batch: null, source: 'manual', updated: '2026-08-07' },
      openrouter: { input: 0.44, output: 0.87, cache: 0.00, batch: null, source: 'auto', updated: '2026-08-07' },
      siliconflow: { input: 3.17, output: 6.34, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      deepseek: { input: 0.64, output: 1.28, cache: 0.10, batch: null, source: 'manual', updated: '2026-08-07' },
      openrouter: { input: 0.09, output: 0.18, cache: 0.02, batch: null, source: 'auto', updated: '2026-08-07' },
      siliconflow: { input: 0.64, output: 1.28, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- 阿里百炼 / 通义（CN）— 官方公示价 2026-08 ----------
  {
    id: 'qwen-max', name: 'Qwen-Max', provider: '阿里云', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 32000,
    prices: {
      bailian: { input: 20.00, output: 60.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
      siliconflow: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'qwen-plus', name: 'Qwen-Plus', provider: '阿里云', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 131072,
    prices: {
      bailian: { input: 4.00, output: 12.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-07' },
      siliconflow: { input: 3.00, output: 9.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'qwen-turbo', name: 'Qwen-Turbo', provider: '阿里云', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 131072,
    prices: {
      bailian: { input: 2.00, output: 6.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- 火山引擎 / 豆包（CN）— 官方公示价 2026-08 ----------
  {
    id: 'doubao-seed-2.1-pro', name: 'Doubao Seed 2.1 Pro', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'doubao-seed-2.1-turbo', name: 'Doubao Seed 2.1 Turbo', provider: '字节跳动', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      volcengine: { input: 3.00, output: 15.00, cache: 0.60, batch: 1.50, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- 智谱AI（CN）— 官方公示价 2026-08 ----------
  {
    id: 'glm-5.2', name: 'GLM-5.2', provider: '智谱AI', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      zhipu: { input: 8.00, output: 28.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'glm-4-flash', name: 'GLM-4-Flash', provider: '智谱AI', country: 'CN',
    tag: 'free', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      zhipu: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- 腾讯混元（CN）— 官方公示价 2026-08 ----------
  {
    id: 'hunyuan-pro', name: '混元-Pro', provider: '腾讯云', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      tencent: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'hunyuan-lite', name: 'Hunyuan-Lite', provider: '腾讯云', country: 'CN',
    tag: 'free', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 8000,
    prices: {
      tencent: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- MiniMax（CN） ----------
  {
    id: 'minimax-m2.7', name: 'MiniMax-M2.7', provider: 'MiniMax', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1048576,
    prices: {
      minimax: { input: 0.80, output: 5.80, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
      siliconflow: { input: 0.80, output: 5.80, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- Kimi（CN）— OpenRouter 有 K3 价格 ----------
  {
    id: 'kimi-k3', name: 'Kimi-K3', provider: '月之暗面', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      kimi: { input: 4.00, output: 16.00, cache: 1.00, batch: null, source: 'manual', updated: '2026-08-07' },
      openrouter: { input: 3.00, output: 15.00, cache: 0.30, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ---------- 文心一言（CN） ----------
  {
    id: 'ernie-4.5', name: 'ERNIE 4.5', provider: '百度', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      ernie: { input: 8.00, output: 24.00, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ---------- Perplexity（US） ----------
  {
    id: 'sonar-pro', name: 'Sonar Pro', provider: 'Perplexity', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openrouter: { input: 3.00, output: 15.00, cache: null, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },

  // ============================================================
  // 图像生成（text->image）— 8 个
  // ============================================================

  {
    id: 'gpt-image-2', name: 'GPT-Image-2', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      openrouter: { input: null, output: 21.75, cache: null, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'dall-e-4', name: 'DALL·E 4', provider: 'OpenAI', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      openai: { input: null, output: 14.50, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'gemini-imagen-4', name: 'Gemini Imagen 4', provider: 'Google', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      openrouter: { input: null, output: 7.25, cache: null, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'flux-2-pro', name: 'FLUX.2 Pro', provider: 'fal.ai', country: 'US',
    tag: 'flagship', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      fal: { input: null, output: 1.45, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
      openrouter: { input: null, output: 1.45, cache: null, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'stable-diffusion-4', name: 'Stable Diffusion 4', provider: 'Stability AI', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      stability: { input: null, output: 0.73, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
      fal: { input: null, output: 0.58, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'wanx-image', name: 'Wanx 万相', provider: '阿里云', country: 'CN',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      wanx: { input: null, output: 0.40, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'jimeng-image', name: '即梦图像', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      jimeng: { input: null, output: 0.29, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'doubao-image', name: 'Doubao 图像', provider: '字节跳动', country: 'CN',
    tag: 'small', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      volcengine: { input: null, output: 0.15, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },

  // ============================================================
  // 视频生成（text->video）— 8 个
  // ============================================================

  {
    id: 'sora-3', name: 'Sora 3', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      openai: { input: null, output: 14.50, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'veo-4', name: 'Veo 4', provider: 'Google', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      openrouter: { input: null, output: 10.88, cache: null, batch: null, source: 'auto', updated: '2026-08-07' },
    },
  },
  {
    id: 'runway-gen4', name: 'Runway Gen-4', provider: 'Runway', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      runway: { input: null, output: 9.06, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'luma-ray-3', name: 'Luma Ray 3', provider: 'Luma', country: 'US',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      luma: { input: null, output: 5.80, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'kling-2.5', name: 'Kling 可灵 2.5', provider: '快手', country: 'CN',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      kling: { input: null, output: 7.25, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'seedance-2', name: 'Seedance 2', provider: '字节跳动', country: 'CN',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      seedance: { input: null, output: 8.70, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'jimeng-video', name: '即梦视频', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      jimeng: { input: null, output: 4.35, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
  {
    id: 'hunyuan-video', name: 'Hunyuan 视频', provider: '腾讯云', country: 'CN',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      tencent: { input: null, output: 3.63, cache: null, batch: null, source: 'manual', updated: '2026-08-07' },
    },
  },
]

export default models
