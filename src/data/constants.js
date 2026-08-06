/**
 * TP 数据模型定义
 * 支持多种计价单位，默认 "每百万Token"
 */

// ============================================================
// 计价单位定义
// ============================================================

export const PRICING_UNITS = {
  per_million_tokens: { id: 'per_million_tokens', label: '¥/百万Token', shortLabel: '¥/MTok' },
  per_image: { id: 'per_image', label: '¥/张', shortLabel: '¥/张' },
  per_second: { id: 'per_second', label: '¥/秒', shortLabel: '¥/秒' },
  per_minute: { id: 'per_minute', label: '¥/分钟', shortLabel: '¥/分钟' },
  per_1k_chars: { id: 'per_1k_chars', label: '¥/千字符', shortLabel: '¥/千字' },
}

// ============================================================
// 模态分类
// ============================================================

export const MODALITIES = {
  'text->text': { label: '文本', icon: '📝', color: 'blue' },
  'multimodal': { label: '多模态', icon: '🧩', color: 'purple' },
  'text->image': { label: '图像生成', icon: '🎨', color: 'pink' },
  'text->video': { label: '视频生成', icon: '🎬', color: 'orange' },
  'audio->text': { label: '语音识别', icon: '🎤', color: 'green' },
  'text->audio': { label: '语音合成', icon: '🔊', color: 'teal' },
}

// ============================================================
// 平台定义
// ============================================================

export const PLATFORMS = [
  // 海外
  { id: 'openrouter', name: 'OpenRouter', nameCn: 'OpenRouter', type: 'proxy', region: 'overseas', color: '#6366F1', url: 'https://openrouter.ai' },
  { id: 'openai', name: 'OpenAI', nameCn: 'OpenAI 官方', type: 'official', region: 'overseas', color: '#10A37F', url: 'https://platform.openai.com' },
  { id: 'anthropic', name: 'Anthropic', nameCn: 'Anthropic 官方', type: 'official', region: 'overseas', color: '#D4A574', url: 'https://www.anthropic.com' },
  { id: 'google', name: 'Google', nameCn: 'Google AI', type: 'official', region: 'overseas', color: '#4285F4', url: 'https://ai.google.dev' },
  { id: 'xai', name: 'xAI', nameCn: 'xAI 官方', type: 'official', region: 'overseas', color: '#1DA1F2', url: 'https://x.ai' },
  { id: 'mistral', name: 'Mistral', nameCn: 'Mistral 官方', type: 'official', region: 'overseas', color: '#F70000', url: 'https://mistral.ai' },
  // 国内
  { id: 'bailian', name: 'Bailian', nameCn: '百炼', type: 'official', region: 'china', color: '#FF6A00', url: 'https://bailian.console.aliyun.com' },
  { id: 'volcengine', name: 'Volcengine', nameCn: '火山引擎', type: 'official', region: 'china', color: '#3370FF', url: 'https://www.volcengine.com' },
  { id: 'zhipu', name: 'ZhipuAI', nameCn: '智谱AI', type: 'official', region: 'china', color: '#3772FF', url: 'https://open.bigmodel.cn' },
  { id: 'tencent', name: 'TencentCloud', nameCn: '腾讯云', type: 'official', region: 'china', color: '#006EFF', url: 'https://cloud.tencent.com' },
  { id: 'deepseek', name: 'DeepSeek', nameCn: 'DeepSeek 官方', type: 'official', region: 'china', color: '#4D6BFE', url: 'https://platform.deepseek.com' },
  { id: 'siliconflow', name: 'SiliconFlow', nameCn: '硅基流动', type: 'proxy', region: 'china', color: '#7C3AED', url: 'https://siliconflow.cn' },
  { id: 'minimax', name: 'MiniMax', nameCn: 'MiniMax', type: 'official', region: 'china', color: '#FF4081', url: 'https://www.minimaxi.com' },
  { id: 'stepfun', name: 'StepFun', nameCn: '阶跃星辰', type: 'official', region: 'china', color: '#6B21A8', url: 'https://platform.stepfun.com' },
  { id: 'yi', name: 'Yi', nameCn: '零一万物', type: 'official', region: 'china', color: '#0EA5E9', url: 'https://platform.lingyiwanwu.com' },
]

// 模型类型标签
export const MODEL_TAGS = {
  flagship: { label: '旗舰', color: 'red' },
  balanced: { label: '平衡', color: 'blue' },
  small: { label: '轻量', color: 'green' },
  reasoning: { label: '推理', color: 'purple' },
  free: { label: '免费', color: 'emerald' },
}

// 区域
export const REGIONS = {
  overseas: { label: '海外', color: 'indigo' },
  china: { label: '国内', color: 'red' },
}
