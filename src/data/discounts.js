/**
 * TP 平台折扣/优惠数据
 * Layer 3 - 手动维护
 * 
 * 最后更新: 2026-08-03
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

export default PLATFORM_DISCOUNTS
