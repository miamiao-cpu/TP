/**
 * TP 数据模型定义
 * 所有价格统一为 "每百万Token" 单位存储
 */

// 平台定义
export const PLATFORMS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    nameCn: 'OpenRouter',
    type: 'proxy',
    region: 'overseas',
    color: '#6366F1',
    url: 'https://openrouter.ai',
  },
  {
    id: 'bailian',
    name: 'Bailian',
    nameCn: '百炼',
    type: 'official',
    region: 'china',
    color: '#FF6A00',
    url: 'https://bailian.console.aliyun.com',
  },
  {
    id: 'volcengine',
    name: 'Volcengine',
    nameCn: '火山引擎',
    type: 'official',
    region: 'china',
    color: '#3370FF',
    url: 'https://www.volcengine.com',
  },
  {
    id: 'zhipu',
    name: 'ZhipuAI',
    nameCn: '智谱AI',
    type: 'official',
    region: 'china',
    color: '#3772FF',
    url: 'https://open.bigmodel.cn',
  },
  {
    id: 'tencent',
    name: 'TencentCloud',
    nameCn: '腾讯云',
    type: 'official',
    region: 'china',
    color: '#006EFF',
    url: 'https://cloud.tencent.com',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    nameCn: '硅基流动',
    type: 'proxy',
    region: 'china',
    color: '#7C3AED',
    url: 'https://siliconflow.cn',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    nameCn: 'OpenAI 官方',
    type: 'official',
    region: 'overseas',
    color: '#10A37F',
    url: 'https://platform.openai.com',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    nameCn: 'Anthropic 官方',
    type: 'official',
    region: 'overseas',
    color: '#D4A574',
    url: 'https://www.anthropic.com',
  },
  {
    id: 'google',
    name: 'Google',
    nameCn: 'Google AI',
    type: 'official',
    region: 'overseas',
    color: '#4285F4',
    url: 'https://ai.google.dev',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    nameCn: 'DeepSeek 官方',
    type: 'official',
    region: 'china',
    color: '#4D6BFE',
    url: 'https://platform.deepseek.com',
  },
]

// 模型类型标签
export const MODEL_TAGS = {
  flagship: { label: '旗舰', color: 'red' },
  balanced: { label: '平衡', color: 'blue' },
  small: { label: '轻量', color: 'green' },
  reasoning: { label: '推理', color: 'purple' },
  free: { label: '免费', color: 'emerald' },
}
