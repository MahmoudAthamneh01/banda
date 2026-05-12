export type UiLocale = 'en' | 'ar' | 'zh';

export const supportedUiLocales: UiLocale[] = ['en', 'ar', 'zh'];

export function normalizeLocale(locale?: string): UiLocale {
  return supportedUiLocales.includes(locale as UiLocale) ? (locale as UiLocale) : 'en';
}

export function localePath(pathname: string, nextLocale: UiLocale) {
  const parts = pathname.split('/');
  if (supportedUiLocales.includes(parts[1] as UiLocale)) {
    parts[1] = nextLocale;
    return parts.join('/') || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname === '/' ? '' : pathname}`;
}

export const uiCopy = {
  en: {
    languageNames: {
      en: 'English',
      ar: 'العربية',
      zh: '中文',
    },
    shell: {
      about: 'About',
      faq: 'FAQ',
      status: 'Status',
      signIn: 'Sign in',
      getStarted: 'Get Started',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      returns: 'Return & Refund Policy',
      company: 'Company',
      aboutUs: 'About Us',
      systemStatus: 'System Status',
      start: 'Get Started',
      exploreMarketplace: 'Explore Marketplace',
      becomeMaker: 'Become a Maker',
      createAccount: 'Create Account',
      footerDescription: 'A sovereign digital marketplace for makers, buyers, and investors.',
      rights: 'All rights reserved.',
      help: 'Help',
    },
    landing: {
      heroPrefix: 'The Sovereign',
      heroHighlight: 'Digital Marketplace',
      heroBody:
        'Connect directly with makers, invest in production batches, and transact in a closed-loop digital ecosystem. No intermediaries. No hidden fees. Full transparency.',
      createAccount: 'Create Account',
      exploreMarketplace: 'Explore Marketplace',
      pillarsTitle: 'Five Pillars of BandaChao',
      pillarsSubtitle: 'A complete digital nation with distinct roles and functions',
      enter: 'Enter',
      pillars: {
        square: {
          name: 'Square',
          desc: 'Discover products from verified makers worldwide',
        },
        cockpit: {
          name: 'Cockpit',
          desc: 'Manage your manufacturing and sales operations',
        },
        playground: {
          name: 'Playground',
          desc: 'Invest in batches and opportunities',
        },
        social: {
          name: 'Social',
          desc: 'Community feed, videos, and maker connections',
        },
        vault: {
          name: 'Vault',
          desc: 'Secure wallet and financial management',
        },
      },
      howTitle: 'How It Works',
      howSubtitle: 'Simple. Secure. Sovereign.',
      steps: [
        {
          title: 'Sign Up',
          desc: 'Create your account in 60 seconds. Choose your role: Buyer, Maker, or Investor.',
        },
        {
          title: 'Explore',
          desc: 'Browse verified products, respond to RFQs, or invest in production batches.',
        },
        {
          title: 'Transact',
          desc: 'Buy, sell, or invest with escrow protection. Fast settlements in your currency.',
        },
      ],
      trustTitle: 'Built on Trust',
      trustSubtitle: 'Security, compliance, and transparency at every step',
      features: [
        {
          title: 'Escrow Protection',
          desc: 'Every transaction secured by smart escrow',
        },
        {
          title: 'Verified Makers',
          desc: 'KYC-verified manufacturers you can trust',
        },
        {
          title: 'Instant Settlement',
          desc: 'Fast payouts in your preferred currency',
        },
      ],
      stats: ['Active Makers', 'Products Listed', 'Monthly Volume', 'Happy Buyers'],
      ctaTitle: 'Start in 60 Seconds',
      ctaBody: 'Join thousands of makers and buyers in the sovereign digital marketplace',
      ctaButton: 'Create Your Account',
    },
    auth: {
      back: 'Back',
      welcome: 'Welcome to BandaChao',
      loginSubtitle: 'Login to continue',
      email: 'Email',
      wechat: 'WeChat',
      alipay: 'Alipay',
      emailAddress: 'Email Address',
      password: 'Password',
      fullName: 'Full Name',
      passwordHint: 'At least 8 characters',
      enterCredentials: 'Please enter email and password',
      loginFailed: 'Login failed',
      loggingIn: 'Logging in...',
      login: 'Login',
      qrCode: 'QR Code',
      externalNotConfigured: 'OAuth is not configured yet. Use email login for the production backend.',
      externalLogin: 'Login with',
      agreementPrefix: "By continuing, you agree to BandaChao's",
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      createTitle: 'Create Account',
      createSubtitle: 'Join the sovereign digital marketplace',
      emailRegistration: 'Email Registration',
      roleLabel: 'Account Role',
      roles: {
        BUYER: {
          name: 'Buyer',
          desc: 'Browse and purchase products',
        },
        MAKER: {
          name: 'Maker',
          desc: 'Sell products and respond to RFQs',
        },
        INVESTOR: {
          name: 'Investor',
          desc: 'Fund batches and track returns',
        },
      },
      referralApplied: 'Referral code applied:',
      acceptTermsPrefix: 'I agree to the',
      acceptTermsAnd: 'and',
      creating: 'Creating account...',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      roleHelpButton: 'Which role should I choose?',
      roleHelpIntro: 'Choose based on your immediate goal:',
      roleHelpNote: 'You can change operational access later from account settings.',
      registrationFailed: 'Registration failed',
    },
  },
  ar: {
    languageNames: {
      en: 'English',
      ar: 'العربية',
      zh: '中文',
    },
    shell: {
      about: 'من نحن',
      faq: 'الأسئلة',
      status: 'الحالة',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      legal: 'قانوني',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      returns: 'سياسة الإرجاع والاسترداد',
      company: 'الشركة',
      aboutUs: 'من نحن',
      systemStatus: 'حالة النظام',
      start: 'ابدأ الآن',
      exploreMarketplace: 'استكشف السوق',
      becomeMaker: 'كن مصنعًا',
      createAccount: 'إنشاء حساب',
      footerDescription: 'سوق رقمي مستقل يربط المصنعين والمشترين والمستثمرين.',
      rights: 'جميع الحقوق محفوظة.',
      help: 'المساعدة',
    },
    landing: {
      heroPrefix: 'السوق الرقمي',
      heroHighlight: 'السيادي',
      heroBody:
        'تواصل مباشرة مع المصنعين، استثمر في دفعات الإنتاج، وتعامل داخل منظومة رقمية مغلقة وشفافة بلا وسطاء أو رسوم مخفية.',
      createAccount: 'إنشاء حساب',
      exploreMarketplace: 'استكشف السوق',
      pillarsTitle: 'الأعمدة الخمسة في BandaChao',
      pillarsSubtitle: 'منظومة رقمية كاملة بأدوار ووظائف واضحة',
      enter: 'دخول',
      pillars: {
        square: {
          name: 'السوق',
          desc: 'اكتشف منتجات من مصنعين موثقين حول العالم',
        },
        cockpit: {
          name: 'لوحة التشغيل',
          desc: 'أدر التصنيع والمبيعات والطلبات من مكان واحد',
        },
        playground: {
          name: 'ساحة الاستثمار',
          desc: 'استثمر في دفعات الإنتاج والفرص المتاحة',
        },
        social: {
          name: 'المجتمع',
          desc: 'منشورات وفيديوهات وتواصل مباشر مع المصنعين',
        },
        vault: {
          name: 'الخزنة',
          desc: 'محفظة آمنة وإدارة مالية واضحة',
        },
      },
      howTitle: 'كيف يعمل',
      howSubtitle: 'بسيط. آمن. مستقل.',
      steps: [
        {
          title: 'سجّل حسابك',
          desc: 'أنشئ حسابك خلال دقيقة واختر دورك: مشتري، مصنع، أو مستثمر.',
        },
        {
          title: 'استكشف',
          desc: 'تصفح المنتجات الموثقة، أرسل طلبات عروض، أو استثمر في دفعات الإنتاج.',
        },
        {
          title: 'تعامل بثقة',
          desc: 'اشترِ أو بع أو استثمر مع حماية الضمان وتسويات سريعة.',
        },
      ],
      trustTitle: 'مبني على الثقة',
      trustSubtitle: 'أمان وامتثال وشفافية في كل خطوة',
      features: [
        {
          title: 'حماية الضمان',
          desc: 'كل معاملة محمية بنظام ضمان واضح',
        },
        {
          title: 'مصنعون موثقون',
          desc: 'مصنعون خضعوا للتحقق ويمكن التعامل معهم بثقة',
        },
        {
          title: 'تسوية سريعة',
          desc: 'دفعات أسرع وبالعملة المناسبة لك',
        },
      ],
      stats: ['مصنع نشط', 'منتج معروض', 'حجم شهري', 'مشتري سعيد'],
      ctaTitle: 'ابدأ خلال 60 ثانية',
      ctaBody: 'انضم إلى المصنعين والمشترين في سوق رقمي مستقل',
      ctaButton: 'أنشئ حسابك',
    },
    auth: {
      back: 'رجوع',
      welcome: 'مرحبًا بك في BandaChao',
      loginSubtitle: 'سجّل الدخول للمتابعة',
      email: 'البريد',
      wechat: 'ويتشات',
      alipay: 'علي باي',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      passwordHint: '8 أحرف على الأقل',
      enterCredentials: 'أدخل البريد الإلكتروني وكلمة المرور',
      loginFailed: 'فشل تسجيل الدخول',
      loggingIn: 'جار تسجيل الدخول...',
      login: 'تسجيل الدخول',
      qrCode: 'رمز QR',
      externalNotConfigured: 'تسجيل OAuth غير مفعّل بعد. استخدم تسجيل الدخول بالبريد.',
      externalLogin: 'تسجيل الدخول عبر',
      agreementPrefix: 'بالمتابعة، أنت توافق على',
      terms: 'شروط الخدمة',
      privacy: 'سياسة الخصوصية',
      createTitle: 'إنشاء حساب',
      createSubtitle: 'انضم إلى السوق الرقمي السيادي',
      emailRegistration: 'التسجيل بالبريد الإلكتروني',
      roleLabel: 'نوع الحساب',
      roles: {
        BUYER: {
          name: 'مشتري',
          desc: 'تصفح وشراء المنتجات',
        },
        MAKER: {
          name: 'مصنع',
          desc: 'بيع المنتجات والرد على طلبات العروض',
        },
        INVESTOR: {
          name: 'مستثمر',
          desc: 'تمويل الدفعات ومتابعة العوائد',
        },
      },
      referralApplied: 'تم تطبيق رمز الإحالة:',
      acceptTermsPrefix: 'أوافق على',
      acceptTermsAnd: 'و',
      creating: 'جار إنشاء الحساب...',
      createAccount: 'إنشاء حساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signIn: 'تسجيل الدخول',
      roleHelpButton: 'أي دور أختار؟',
      roleHelpIntro: 'اختر الدور حسب هدفك الحالي:',
      roleHelpNote: 'يمكن تعديل صلاحيات التشغيل لاحقًا من إعدادات الحساب.',
      registrationFailed: 'فشل إنشاء الحساب',
    },
  },
  zh: {
    languageNames: {
      en: 'English',
      ar: 'العربية',
      zh: '中文',
    },
    shell: {
      about: '关于',
      faq: '常见问题',
      status: '状态',
      signIn: '登录',
      getStarted: '开始使用',
      legal: '法律',
      privacy: '隐私政策',
      terms: '服务条款',
      returns: '退换与退款政策',
      company: '公司',
      aboutUs: '关于我们',
      systemStatus: '系统状态',
      start: '开始使用',
      exploreMarketplace: '浏览市场',
      becomeMaker: '成为工厂',
      createAccount: '创建账户',
      footerDescription: '面向制造商、买家和投资人的主权数字市场。',
      rights: '保留所有权利。',
      help: '帮助',
    },
    landing: {
      heroPrefix: '主权',
      heroHighlight: '数字市场',
      heroBody:
        '直接连接制造商，投资生产批次，并在闭环数字生态中完成交易。无中间商、无隐藏费用、全程透明。',
      createAccount: '创建账户',
      exploreMarketplace: '浏览市场',
      pillarsTitle: 'BandaChao 五大支柱',
      pillarsSubtitle: '拥有清晰角色与功能的完整数字生态',
      enter: '进入',
      pillars: {
        square: {
          name: '市场',
          desc: '发现来自全球认证制造商的产品',
        },
        cockpit: {
          name: '驾驶舱',
          desc: '管理制造、销售与订单运营',
        },
        playground: {
          name: '投资场',
          desc: '投资生产批次和商业机会',
        },
        social: {
          name: '社区',
          desc: '动态、视频以及与制造商的连接',
        },
        vault: {
          name: '金库',
          desc: '安全钱包与财务管理',
        },
      },
      howTitle: '如何运作',
      howSubtitle: '简单。安全。自主。',
      steps: [
        {
          title: '注册',
          desc: '60 秒创建账户，并选择买家、制造商或投资人角色。',
        },
        {
          title: '探索',
          desc: '浏览认证产品，提交询价，或投资生产批次。',
        },
        {
          title: '交易',
          desc: '通过托管保护进行购买、销售或投资，并获得快速结算。',
        },
      ],
      trustTitle: '建立在信任之上',
      trustSubtitle: '每一步都兼顾安全、合规与透明',
      features: [
        {
          title: '托管保护',
          desc: '每笔交易都由托管机制保护',
        },
        {
          title: '认证制造商',
          desc: '通过 KYC 验证的可信制造商',
        },
        {
          title: '即时结算',
          desc: '以偏好的货币快速收款',
        },
      ],
      stats: ['活跃制造商', '上架产品', '月交易额', '满意买家'],
      ctaTitle: '60 秒开始',
      ctaBody: '加入面向制造商和买家的主权数字市场',
      ctaButton: '创建账户',
    },
    auth: {
      back: '返回',
      welcome: '欢迎来到 BandaChao',
      loginSubtitle: '登录后继续',
      email: '邮箱',
      wechat: '微信',
      alipay: '支付宝',
      emailAddress: '邮箱地址',
      password: '密码',
      fullName: '姓名',
      passwordHint: '至少 8 个字符',
      enterCredentials: '请输入邮箱和密码',
      loginFailed: '登录失败',
      loggingIn: '正在登录...',
      login: '登录',
      qrCode: '二维码',
      externalNotConfigured: 'OAuth 尚未配置。请使用邮箱登录生产后端。',
      externalLogin: '使用以下方式登录',
      agreementPrefix: '继续即表示你同意 BandaChao 的',
      terms: '服务条款',
      privacy: '隐私政策',
      createTitle: '创建账户',
      createSubtitle: '加入主权数字市场',
      emailRegistration: '邮箱注册',
      roleLabel: '账户角色',
      roles: {
        BUYER: {
          name: '买家',
          desc: '浏览并购买产品',
        },
        MAKER: {
          name: '制造商',
          desc: '销售产品并回复询价',
        },
        INVESTOR: {
          name: '投资人',
          desc: '投资生产批次并追踪回报',
        },
      },
      referralApplied: '已应用邀请码：',
      acceptTermsPrefix: '我同意',
      acceptTermsAnd: '和',
      creating: '正在创建账户...',
      createAccount: '创建账户',
      alreadyHaveAccount: '已有账户？',
      signIn: '登录',
      roleHelpButton: '我应该选择哪个角色？',
      roleHelpIntro: '请根据当前目标选择：',
      roleHelpNote: '之后可以在账户设置中调整运营权限。',
      registrationFailed: '注册失败',
    },
  },
} as const;

export type UiCopy = (typeof uiCopy)['en'];
