/**
 * TP 数据模型定义（v3 - 文本/图像/视频三类 + 国家区域）
 * 收录区间：TOP50 精选商用模型
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
// 模态分类（仅商用三类）
// ============================================================

export const MODALITIES = {
  'text->text': { label: '文本', icon: '📝', color: 'blue' },
  'text->image': { label: '图像', icon: '🎨', color: 'pink' },
  'text->video': { label: '视频', icon: '🎬', color: 'orange' },
}

// ============================================================
// 国家 / 区域定义
// ============================================================

export const COUNTRIES = {
  US: { id: 'US', label: '美国', flag: '🇺🇸', region: 'na' },
  CN: { id: 'CN', label: '中国', flag: '🇨🇳', region: 'apac' },
  FR: { id: 'FR', label: '法国', flag: '🇫🇷', region: 'eu' },
  GB: { id: 'GB', label: '英国', flag: '🇬🇧', region: 'eu' },
  JP: { id: 'JP', label: '日本', flag: '🇯🇵', region: 'apac' },
}

export const REGIONS = {
  na: { id: 'na', label: '北美', color: 'indigo' },
  eu: { id: 'eu', label: '欧洲', color: 'blue' },
  apac: { id: 'apac', label: '亚太', color: 'red' },
}

// ============================================================
// 平台定义
// ============================================================

export const PLATFORMS = [
  // 美国
  { id: 'openai', name: 'OpenAI', nameCn: 'OpenAI', country: 'US', type: 'official', color: '#10A37F', url: 'https://platform.openai.com' },
  { id: 'anthropic', name: 'Anthropic', nameCn: 'Anthropic', country: 'US', type: 'official', color: '#D4A574', url: 'https://www.anthropic.com' },
  { id: 'google', name: 'Google', nameCn: 'Google AI', country: 'US', type: 'official', color: '#4285F4', url: 'https://ai.google.dev' },
  { id: 'xai', name: 'xAI', nameCn: 'xAI', country: 'US', type: 'official', color: '#1DA1F2', url: 'https://x.ai' },
  { id: 'mistral', name: 'Mistral', nameCn: 'Mistral', country: 'FR', type: 'official', color: '#F70000', url: 'https://mistral.ai' },
  { id: 'openrouter', name: 'OpenRouter', nameCn: 'OpenRouter', country: 'US', type: 'proxy', color: '#6366F1', url: 'https://openrouter.ai' },
  // 中国
  { id: 'bailian', name: 'Bailian', nameCn: '百炼', country: 'CN', type: 'official', color: '#FF6A00', url: 'https://bailian.console.aliyun.com' },
  { id: 'volcengine', name: 'Volcengine', nameCn: '火山引擎', country: 'CN', type: 'official', color: '#3370FF', url: 'https://www.volcengine.com' },
  { id: 'zhipu', name: 'ZhipuAI', nameCn: '智谱AI', country: 'CN', type: 'official', color: '#3772FF', url: 'https://open.bigmodel.cn' },
  { id: 'tencent', name: 'TencentCloud', nameCn: '腾讯云', country: 'CN', type: 'official', color: '#006EFF', url: 'https://cloud.tencent.com' },
  { id: 'deepseek', name: 'DeepSeek', nameCn: 'DeepSeek', country: 'CN', type: 'official', color: '#4D6BFE', url: 'https://platform.deepseek.com' },
  { id: 'siliconflow', name: 'SiliconFlow', nameCn: '硅基流动', country: 'CN', type: 'proxy', color: '#7C3AED', url: 'https://siliconflow.cn' },
  { id: 'minimax', name: 'MiniMax', nameCn: 'MiniMax', country: 'CN', type: 'official', color: '#FF4081', url: 'https://www.minimaxi.com' },
  { id: 'stepfun', name: 'StepFun', nameCn: '阶跃星辰', country: 'CN', type: 'official', color: '#6B21A8', url: 'https://platform.stepfun.com' },
  { id: 'yi', name: 'Yi', nameCn: '零一万物', country: 'CN', type: 'official', color: '#0EA5E9', url: 'https://platform.lingyiwanwu.com' },
  { id: 'kimi', name: 'Kimi', nameCn: 'Kimi (月之暗面)', country: 'CN', type: 'official', color: '#1A1A1A', url: 'https://platform.moonshot.cn' },
  { id: 'ernie', name: 'ERNIE', nameCn: '文心一言', country: 'CN', type: 'official', color: '#2932E1', url: 'https://cloud.baidu.com' },
  // 日本
  { id: 'sakura', name: 'Sakura', nameCn: 'Sakura AI', country: 'JP', type: 'official', color: '#EB4D9B', url: 'https://sakura.ai' },
  // 图像 / 视频平台（海外）
  { id: 'stability', name: 'Stability AI', nameCn: 'Stability AI', country: 'US', type: 'official', color: '#FFCD00', url: 'https://stability.ai' },
  { id: 'fal', name: 'fal.ai', nameCn: 'fal.ai', country: 'US', type: 'proxy', color: '#22D3EE', url: 'https://fal.ai' },
  { id: 'runway', name: 'Runway', nameCn: 'Runway', country: 'US', type: 'official', color: '#111827', url: 'https://runwayml.com' },
  { id: 'luma', name: 'Luma', nameCn: 'Luma Dream Machine', country: 'US', type: 'official', color: '#7C3AED', url: 'https://lumalabs.ai' },
  // 图像 / 视频平台（国内）
  { id: 'jimeng', name: 'Jimeng', nameCn: '即梦', country: 'CN', type: 'official', color: '#FF5C00', url: 'https://jimeng.jianying.com' },
  { id: 'wanx', name: 'Wanx', nameCn: '阿里万相', country: 'CN', type: 'official', color: '#FF8C00', url: 'https://bailian.console.aliyun.com' },
  { id: 'kling', name: 'Kling', nameCn: '可灵', country: 'CN', type: 'official', color: '#14B8A6', url: 'https://klingai.com' },
  { id: 'seedance', name: 'Seedance', nameCn: '即梦视频', country: 'CN', type: 'official', color: '#8B5CF6', url: 'https://jimeng.jianying.com' },
]

// 模型类型标签
export const MODEL_TAGS = {
  flagship: { label: '旗舰', color: 'red' },
  balanced: { label: '平衡', color: 'blue' },
  small: { label: '轻量', color: 'green' },
  reasoning: { label: '推理', color: 'purple' },
  free: { label: '免费', color: 'emerald' },
}

// 变化类型 logo（用于首页最近变化）
export const CHANGE_TYPES = {
  new: { label: '新进榜', icon: '🆕', color: 'text-green-600', bg: 'bg-green-50' },
  up: { label: '涨价', icon: '📈', color: 'text-red-600', bg: 'bg-red-50' },
  down: { label: '降价', icon: '📉', color: 'text-blue-600', bg: 'bg-blue-50' },
}
