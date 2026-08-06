/**
 * TP 模型定价数据（v3 - TOP50 精选商用模型）
 *
 * 模态分类：text->text（文本）/ text->image（图像）/ text->video（视频）
 * 价格存储：人民币（¥）+ 原计价单位
 * 数据来源：manual（手动录入）/ auto（OpenRouter 自动采集）
 * 地域：按模型所属国家/平台国家（country）展示，不再区分国内/海外
 *
 * 最后更新：2026-08-06
 */

const models = [
  // ============================================================
  // 文本生成（text->text）
  // ============================================================

  // ---------- OpenAI（US） ----------
  {
    id: 'gpt-5.6', name: 'GPT-5.6', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1050000,
    prices: {
      openai: { input: 36.25, output: 217.50, cache: null, batch: 108.75, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 36.25, output: 217.50, cache: 7.25, batch: 108.75, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', provider: 'OpenAI', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1050000,
    prices: {
      openai: { input: 1.45, output: 8.70, cache: null, batch: 4.35, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 0.73, output: 4.35, cache: 0.07, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gpt-5-mini', name: 'GPT-5 mini', provider: 'OpenAI', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 400000,
    prices: {
      openai: { input: 1.81, output: 14.50, cache: null, batch: 7.25, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.81, output: 14.50, cache: 0.18, batch: 7.25, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', country: 'US',
    tag: 'reasoning', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openai: { input: 7.98, output: 31.90, cache: null, batch: 15.95, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 7.98, output: 31.90, cache: 1.99, batch: 15.95, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'o3', name: 'o3', provider: 'OpenAI', country: 'US',
    tag: 'reasoning', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      openai: { input: 15.00, output: 60.00, cache: 7.50, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- Anthropic（US） ----------
  {
    id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'Anthropic', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      anthropic: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 36.25, output: 181.25, cache: 3.63, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      anthropic: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 14.50, output: 72.50, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'Anthropic', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      anthropic: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 7.25, output: 36.25, cache: 0.73, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'claude-fable-5', name: 'Claude Fable 5', provider: 'Anthropic', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      anthropic: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 72.50, output: 362.50, cache: 7.25, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ---------- Google（US） ----------
  {
    id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      google: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 14.50, output: 87.00, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'Google', country: 'US',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      google: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 10.88, output: 54.38, cache: 1.09, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', provider: 'Google', country: 'US',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      google: { input: 1.70, output: 10.10, cache: 0.34, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- xAI（US） ----------
  {
    id: 'grok-4', name: 'Grok 4', provider: 'xAI', country: 'US',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      xai: { input: 21.75, output: 108.75, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 9.06, output: 18.13, cache: 1.45, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ---------- Mistral（FR） ----------
  {
    id: 'mistral-large-3', name: 'Mistral Large 3', provider: 'Mistral', country: 'FR',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 262000,
    prices: {
      mistral: { input: 3.63, output: 10.88, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 3.63, output: 10.88, cache: 0.36, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },

  // ---------- DeepSeek（CN） ----------
  {
    id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1049000,
    prices: {
      deepseek: { input: 1.02, output: 2.03, cache: 0.10, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.02, output: 2.03, cache: 0.20, batch: null, source: 'auto', updated: '2026-08-05' },
      siliconflow: { input: 1.02, output: 2.03, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 164000,
    prices: {
      deepseek: { input: 2.03, output: 2.90, cache: 0.20, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: 1.95, output: 2.90, cache: 0.98, batch: null, source: 'auto', updated: '2026-08-05' },
      siliconflow: { input: 2.03, output: 2.90, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 阿里百炼 / 通义（CN） ----------
  {
    id: 'qwen-max', name: 'Qwen-Max', provider: '阿里云', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 32000,
    prices: {
      bailian: { input: 20.00, output: 60.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'qwen-plus', name: 'Qwen-Plus', provider: '阿里云', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 131072,
    prices: {
      bailian: { input: 4.00, output: 12.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 3.00, output: 9.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'qwen-turbo', name: 'Qwen-Turbo', provider: '阿里云', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 131072,
    prices: {
      bailian: { input: 2.00, output: 6.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 火山引擎 / 豆包（CN） ----------
  {
    id: 'doubao-seed-2.1-pro', name: 'Doubao Seed 2.1 Pro', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.1-turbo', name: 'Doubao Seed 2.1 Turbo', provider: '字节跳动', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      volcengine: { input: 3.00, output: 15.00, cache: 0.60, batch: 1.50, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-evolving', name: 'Doubao Seed Evolving', provider: '字节跳动', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 256000,
    prices: {
      volcengine: { input: 6.00, output: 30.00, cache: 1.20, batch: 3.00, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-seed-2.0-lite-32k', name: 'Doubao Seed 2.0 Lite 32K', provider: '字节跳动', country: 'CN',
    tag: 'small', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 32000,
    prices: {
      volcengine: { input: 0.60, output: 3.60, cache: 0.12, batch: 0.30, source: 'manual', updated: '2026-08-06' },
    },
  },
  // ---------- 智谱AI（CN） ----------
  {
    id: 'glm-5.2', name: 'GLM-5.2', provider: '智谱AI', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 1000000,
    prices: {
      zhipu: { input: 8.00, output: 28.00, cache: 2.00, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'glm-4-flash', name: 'GLM-4-Flash', provider: '智谱AI', country: 'CN',
    tag: 'free', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      zhipu: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 腾讯混元（CN） ----------
  {
    id: 'hunyuan-pro', name: '混元-Pro', provider: '腾讯云', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 128000,
    prices: {
      tencent: { input: 16.00, output: 48.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'hunyuan-lite', name: 'Hunyuan-Lite', provider: '腾讯云', country: 'CN',
    tag: 'free', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 8000,
    prices: {
      tencent: { input: 0, output: 0, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- MiniMax（CN） ----------
  {
    id: 'minimax-m2.5', name: 'MiniMax-M2.5', provider: 'MiniMax', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 256000,
    prices: {
      minimax: { input: 2.00, output: 16.20, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 2.00, output: 16.20, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 阶跃星辰（CN） ----------
  {
    id: 'step-3', name: 'Step-3', provider: '阶跃星辰', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 256000,
    prices: {
      stepfun: { input: 4.00, output: 16.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 零一万物（CN） ----------
  {
    id: 'yi-large', name: 'Yi-Large', provider: '零一万物', country: 'CN',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      yi: { input: 4.00, output: 12.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 2.00, output: 6.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- Kimi（CN） ----------
  {
    id: 'kimi-k2', name: 'Kimi-K2', provider: '月之暗面', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 256000,
    prices: {
      kimi: { input: 4.00, output: 16.00, cache: 1.00, batch: null, source: 'manual', updated: '2026-08-06' },
      siliconflow: { input: 4.00, output: 16.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- 文心一言（CN） ----------
  {
    id: 'ernie-5.0', name: 'ERNIE 5.0', provider: '百度', country: 'CN',
    tag: 'flagship', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 256000,
    prices: {
      ernie: { input: 18.00, output: 54.00, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ---------- Sakura（JP） ----------
  {
    id: 'sakura-jp-large', name: 'Sakura-JP-Large', provider: 'Sakura AI', country: 'JP',
    tag: 'balanced', modality: 'text->text', pricingUnit: 'per_million_tokens', contextLength: 200000,
    prices: {
      sakura: { input: 3.60, output: 14.40, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ============================================================
  // 图像生成（text->image）
  // ============================================================

  {
    id: 'gpt-image-2', name: 'GPT-Image-2', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      openai: { input: null, output: 21.75, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: null, output: 21.75, cache: null, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'dall-e-4', name: 'DALL·E 4', provider: 'OpenAI', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      openai: { input: null, output: 14.50, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'gemini-imagen-4', name: 'Gemini Imagen 4', provider: 'Google', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      google: { input: null, output: 7.25, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: null, output: 7.25, cache: null, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'stable-diffusion-4', name: 'Stable Diffusion 4', provider: 'Stability AI', country: 'US',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      stability: { input: null, output: 0.73, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      fal: { input: null, output: 0.58, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'flux-2-pro', name: 'FLUX.2 Pro', provider: 'fal.ai', country: 'US',
    tag: 'flagship', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      fal: { input: null, output: 1.45, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: null, output: 1.45, cache: null, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'wanx-image', name: 'Wanx 万相', provider: '阿里云', country: 'CN',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      wanx: { input: null, output: 0.40, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'jimeng-image', name: '即梦图像', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      jimeng: { input: null, output: 0.29, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'doubao-image', name: 'Doubao 图像', provider: '字节跳动', country: 'CN',
    tag: 'small', modality: 'text->image', pricingUnit: 'per_image', contextLength: 0,
    prices: {
      volcengine: { input: null, output: 0.15, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },

  // ============================================================
  // 视频生成（text->video）
  // ============================================================

  {
    id: 'sora-3', name: 'Sora 3', provider: 'OpenAI', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      openai: { input: null, output: 14.50, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'veo-4', name: 'Veo 4', provider: 'Google', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      google: { input: null, output: 10.88, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      openrouter: { input: null, output: 10.88, cache: null, batch: null, source: 'auto', updated: '2026-08-05' },
    },
  },
  {
    id: 'runway-gen4', name: 'Runway Gen-4', provider: 'Runway', country: 'US',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      runway: { input: null, output: 9.06, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      fal: { input: null, output: 7.25, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'luma-ray-3', name: 'Luma Ray 3', provider: 'Luma', country: 'US',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      luma: { input: null, output: 5.80, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
      fal: { input: null, output: 4.35, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'kling-2.5', name: 'Kling 可灵 2.5', provider: '快手', country: 'CN',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      kling: { input: null, output: 7.25, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'seedance-2', name: 'Seedance 2', provider: '字节跳动', country: 'CN',
    tag: 'flagship', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      seedance: { input: null, output: 8.70, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'jimeng-video', name: '即梦视频', provider: '字节跳动', country: 'CN',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      jimeng: { input: null, output: 4.35, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'wanx-video', name: 'Wanx 万相视频', provider: '阿里云', country: 'CN',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      wanx: { input: null, output: 5.80, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
  {
    id: 'hunyuan-video', name: 'Hunyuan 视频', provider: '腾讯云', country: 'CN',
    tag: 'balanced', modality: 'text->video', pricingUnit: 'per_second', contextLength: 0,
    prices: {
      tencent: { input: null, output: 3.63, cache: null, batch: null, source: 'manual', updated: '2026-08-06' },
    },
  },
]

export default models
