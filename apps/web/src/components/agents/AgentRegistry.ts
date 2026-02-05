/**
 * AgentRegistry - Central registry for all AI agents in the BandaChao ecosystem
 * 
 * Each agent has:
 * - Unique ID and name
 * - Trigger conditions (when to appear)
 * - Capabilities (what they can do)
 * - Personality traits
 * - Lottie animation asset
 */

export type AgentRole =
  | 'negotiation'
  | 'fraud-detection'
  | 'dispute-resolution'
  | 'style-advisor'
  | 'trust-safety'
  | 'gamification'
  | 'support'
  | 'onboarding';

export type AgentTrigger =
  | 'manual' // User clicks "Ask Panda"
  | 'exit-intent' // User about to leave
  | 'low-stock' // Product running out
  | 'high-price' // Price above threshold
  | 'trust-score-low' // Seller trust score concerns
  | 'dispute-opened' // New dispute created
  | 'first-visit' // New user onboarding
  | 'idle-cart' // Cart abandoned for >5 min
  | 'style-question' // User browsing fashion/jewelry
  | 'red-packet-available'; // Gamification reward ready

export interface Agent {
  id: string;
  name: string;
  nameAr: string;
  nameZh: string;
  role: AgentRole;
  description: string;
  descriptionAr: string;
  descriptionZh: string;
  triggers: AgentTrigger[];
  capabilities: string[];
  personality: {
    tone: 'friendly' | 'professional' | 'playful' | 'authoritative';
    emoji?: string;
  };
  lottieAsset: string; // Path to lottie animation
  color: string; // Theme color for this agent
  pillar?: 'square' | 'cockpit' | 'vault' | 'throne'; // Which pillar this agent primarily serves
}

/**
 * All 8 AI Agents in the BandaChao ecosystem
 */
export const AGENTS: Record<string, Agent> = {
  DEAL_CAT: {
    id: 'deal-cat',
    name: 'Deal Cat',
    nameAr: 'القط التاجر',
    nameZh: '交易猫',
    role: 'negotiation',
    description: 'Helps negotiate better prices and bulk deals',
    descriptionAr: 'يساعد في التفاوض على أسعار أفضل وصفقات الجملة',
    descriptionZh: '帮助谈判更好的价格和批量交易',
    triggers: ['manual', 'high-price'],
    capabilities: [
      'Price negotiation',
      'Bulk discount calculation',
      'Competitor price comparison',
      'Deal suggestions',
    ],
    personality: {
      tone: 'friendly',
      emoji: '🐱',
    },
    lottieAsset: '/assets/lottie/agents/deal_cat.json',
    color: '#F6C453', // silk-500
    pillar: 'square',
  },

  CYBER_WUKONG: {
    id: 'cyber-wukong',
    name: 'Cyber Wukong',
    nameAr: 'ووكونغ السيبراني',
    nameZh: '赛博悟空',
    role: 'fraud-detection',
    description: 'Protects from fraud and detects suspicious activity',
    descriptionAr: 'يحمي من الاحتيال ويكتشف الأنشطة المشبوهة',
    descriptionZh: '防止欺诈并检测可疑活动',
    triggers: ['trust-score-low', 'manual'],
    capabilities: [
      'Fraud detection',
      'Seller verification',
      'Transaction monitoring',
      'Risk assessment',
    ],
    personality: {
      tone: 'authoritative',
      emoji: '🐵',
    },
    lottieAsset: '/assets/lottie/agents/wukong_idle.json',
    color: '#EF4444', // danger-500
    pillar: 'square',
  },

  MAGISTRATE_MANDRILL: {
    id: 'magistrate-mandrill',
    name: 'Magistrate Mandrill',
    nameAr: 'القاضي ماندريل',
    nameZh: '法官狒狒',
    role: 'dispute-resolution',
    description: 'Mediates disputes and resolves conflicts fairly',
    descriptionAr: 'يتوسط في النزاعات ويحل الخلافات بإنصاف',
    descriptionZh: '调解纠纷并公平解决冲突',
    triggers: ['dispute-opened', 'manual'],
    capabilities: [
      'Dispute mediation',
      'Evidence review',
      'Fair judgment',
      'Refund processing',
    ],
    personality: {
      tone: 'professional',
      emoji: '⚖️',
    },
    lottieAsset: '/assets/lottie/agents/mandrill_idle.json',
    color: '#7C3AED', // panda-500
    pillar: 'throne',
  },

  STYLE_GURU: {
    id: 'style-guru',
    name: 'Style Guru',
    nameAr: 'خبير الأناقة',
    nameZh: '时尚大师',
    role: 'style-advisor',
    description: 'Provides fashion and style recommendations',
    descriptionAr: 'يقدم توصيات الموضة والأناقة',
    descriptionZh: '提供时尚和风格建议',
    triggers: ['style-question', 'manual'],
    capabilities: [
      'Style recommendations',
      'Outfit coordination',
      'Trend analysis',
      'Size guidance',
    ],
    personality: {
      tone: 'friendly',
      emoji: '👗',
    },
    lottieAsset: '/assets/lottie/agents/style_guru.json',
    color: '#FF3D81', // ruby-500
    pillar: 'square',
  },

  TRUST_MOTHER: {
    id: 'trust-mother',
    name: 'Trust Mother',
    nameAr: 'أم الثقة',
    nameZh: '信任妈妈',
    role: 'trust-safety',
    description: 'Ensures safe transactions and builds trust',
    descriptionAr: 'تضمن المعاملات الآمنة وتبني الثقة',
    descriptionZh: '确保交易安全并建立信任',
    triggers: ['first-visit', 'manual'],
    capabilities: [
      'Trust building',
      'Safety education',
      'Verification guidance',
      'Community standards',
    ],
    personality: {
      tone: 'friendly',
      emoji: '🤱',
    },
    lottieAsset: '/assets/lottie/agents/trust_mother.json',
    color: '#10B981', // jade-500
    pillar: 'square',
  },

  HUNGRY_PANDA: {
    id: 'hungry-panda',
    name: 'Hungry Panda',
    nameAr: 'الباندا الجائع',
    nameZh: '饿熊猫',
    role: 'gamification',
    description: 'Manages rewards, red packets, and gamification',
    descriptionAr: 'يدير المكافآت والظروف الحمراء واللعبة',
    descriptionZh: '管理奖励、红包和游戏化',
    triggers: ['red-packet-available', 'manual'],
    capabilities: [
      'Red packet distribution',
      'Points management',
      'Achievement tracking',
      'Streak rewards',
    ],
    personality: {
      tone: 'playful',
      emoji: '🐼',
    },
    lottieAsset: '/assets/lottie/agents/hungry_panda.json',
    color: '#F59E0B', // warn-500
    pillar: 'square',
  },

  CHATTY_BIRD: {
    id: 'chatty-bird',
    name: 'Chatty Bird',
    nameAr: 'الطائر الثرثار',
    nameZh: '聊天鸟',
    role: 'support',
    description: 'Provides customer support and answers questions',
    descriptionAr: 'يقدم دعم العملاء ويجيب على الأسئلة',
    descriptionZh: '提供客户支持并回答问题',
    triggers: ['manual', 'idle-cart'],
    capabilities: [
      'General support',
      'FAQ answers',
      'Order tracking',
      'Product information',
    ],
    personality: {
      tone: 'friendly',
      emoji: '🐦',
    },
    lottieAsset: '/assets/lottie/agents/chatty_bird.json',
    color: '#38BDF8', // sky-500
    pillar: 'square',
  },

  HOST_PANDA: {
    id: 'host-panda',
    name: 'Host Panda',
    nameAr: 'الباندا المضيف',
    nameZh: '主持熊猫',
    role: 'onboarding',
    description: 'Guides new users through the platform',
    descriptionAr: 'يرشد المستخدمين الجدد عبر المنصة',
    descriptionZh: '引导新用户使用平台',
    triggers: ['first-visit'],
    capabilities: [
      'Platform tour',
      'Feature education',
      'Setup assistance',
      'Quick tips',
    ],
    personality: {
      tone: 'friendly',
      emoji: '🎯',
    },
    lottieAsset: '/assets/lottie/agents/host_panda.json',
    color: '#7C3AED', // panda-500
    pillar: 'square',
  },
};

/**
 * Get agent by ID
 */
export function getAgent(id: string): Agent | undefined {
  return Object.values(AGENTS).find((agent) => agent.id === id);
}

/**
 * Get agents by trigger condition
 */
export function getAgentsByTrigger(trigger: AgentTrigger): Agent[] {
  return Object.values(AGENTS).filter((agent) =>
    agent.triggers.includes(trigger)
  );
}

/**
 * Get agents by pillar
 */
export function getAgentsByPillar(
  pillar: 'square' | 'cockpit' | 'vault' | 'throne'
): Agent[] {
  return Object.values(AGENTS).filter((agent) => agent.pillar === pillar);
}

/**
 * Get agent by role
 */
export function getAgentsByRole(role: AgentRole): Agent[] {
  return Object.values(AGENTS).filter((agent) => agent.role === role);
}
