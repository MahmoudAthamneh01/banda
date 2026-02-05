import { getDictionaries } from '@/i18n/i18n.server';
import { HelpCircle, MessageCircle, Mail, Phone, Search } from 'lucide-react';

interface HelpPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { locale } = await params;
  const dict = await getDictionaries(locale as 'ar' | 'en' | 'zh');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top right corner, choose your account type (Buyer, Seller, or Investor), and follow the registration steps. You can use phone, WeChat, or Alipay to register.',
        },
        {
          q: 'What are the different account types?',
          a: 'Buyers purchase products directly from factories. Sellers/Factories list products and fulfill orders. Investors fund production cycles and earn returns. You can have multiple roles.',
        },
        {
          q: 'Is BandaChao free to use?',
          a: 'Registration is free. We charge a small service fee on completed transactions (5% for buyers, 3% for sellers). Investors share profits based on their investment percentage.',
        },
      ],
    },
    {
      category: 'Buying & Ordering',
      questions: [
        {
          q: 'How do I find products?',
          a: 'Use the search bar, browse categories, or let our AI agents (like Deal Cat) recommend products based on your needs. You can filter by price, MOQ, delivery time, and trust score.',
        },
        {
          q: 'What is Minimum Order Quantity (MOQ)?',
          a: 'MOQ is the smallest quantity a factory will produce. It varies by product and factory. Some factories offer lower MOQs for first-time buyers or sample orders.',
        },
        {
          q: 'How does payment work?',
          a: 'We use an escrow system. Your payment is held securely until you confirm receipt and quality of goods. Accepted payment methods include bank transfer, WeChat Pay, and Alipay.',
        },
        {
          q: 'What if I receive damaged or wrong products?',
          a: 'Contact the seller immediately and open a dispute. Provide photos and details. Our mediation team will help resolve issues. Refunds or replacements are issued based on our buyer protection policy.',
        },
      ],
    },
    {
      category: 'Selling & Manufacturing',
      questions: [
        {
          q: 'How do I list my factory on BandaChao?',
          a: 'Register as a seller, complete factory verification (business license, facility photos), and start listing products. Our team reviews all factories to ensure quality and legitimacy.',
        },
        {
          q: 'What is the Trust Score?',
          a: 'Trust Score (0-100) is calculated from order history, buyer ratings, on-time delivery, quality metrics, and third-party certifications. Higher scores get better visibility and more orders.',
        },
        {
          q: 'Can I offer custom manufacturing?',
          a: 'Yes! Enable "Custom Orders" in your factory settings. Buyers can submit specifications and you can provide quotes. Custom orders often have higher margins.',
        },
      ],
    },
    {
      category: 'Investing',
      questions: [
        {
          q: 'How does investment work on BandaChao?',
          a: 'Fund production cycles for factories. When products sell, you earn a share of profits proportional to your investment. Typical cycles are 30-90 days with projected ROI of 10-25%.',
        },
        {
          q: 'What are the risks?',
          a: 'Investments carry risk. If products don\'t sell or production fails, you may lose your investment. Review factory trust scores, past performance, and diversify across multiple cycles.',
        },
        {
          q: 'How do I withdraw profits?',
          a: 'Profits are distributed automatically at cycle end to your account balance. Withdraw anytime to your linked bank account (2-3 business days) or use for new investments.',
        },
      ],
    },
    {
      category: 'AI Agents & Features',
      questions: [
        {
          q: 'What are AI agents?',
          a: 'AI agents are smart assistants that help you: find deals (Deal Cat), negotiate (Cyber Wukong), resolve disputes (Magistrate Mandrill), optimize designs (Style Guru), and more.',
        },
        {
          q: 'How do I activate an agent?',
          a: 'Agents activate automatically based on your actions (like viewing products or having cart items). You can also manually chat with any agent via the "Ask Panda" button.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How do I change my password?',
          a: 'Go to Settings > Security > Change Password. You\'ll need to verify your identity via SMS or email code.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes. We use bank-level encryption and never store full card numbers. All payments are processed through certified payment gateways (PCI DSS compliant).',
        },
        {
          q: 'How do I delete my account?',
          a: 'Settings > Account > Delete Account. Note: You must resolve all pending orders and disputes first. Account deletion is permanent and cannot be undone.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-panda-950 border-b border-ink-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-panda-500/10 border border-panda-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="text-panda-500" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Help Center</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-4 bg-ink-900 border border-ink-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="space-y-6">
              <h2 className="text-2xl font-bold text-panda-500">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <details
                    key={faqIndex}
                    className="group bg-ink-900 border border-ink-800 rounded-xl overflow-hidden hover:border-ink-700 transition-colors"
                  >
                    <summary className="cursor-pointer p-6 font-semibold text-slate-200 flex items-center justify-between hover:text-panda-500 transition-colors">
                      {faq.q}
                      <span className="text-slate-500 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-slate-300 leading-relaxed border-t border-ink-800 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 text-center hover:border-panda-500/50 transition-colors">
            <div className="w-16 h-16 bg-jade-500/10 border border-jade-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-jade-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-slate-400 text-sm mb-4">Chat with our support team in real-time</p>
            <button className="w-full py-2 px-4 bg-jade-500 hover:bg-jade-600 text-white rounded-xl font-medium transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 text-center hover:border-panda-500/50 transition-colors">
            <div className="w-16 h-16 bg-panda-500/10 border border-panda-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-panda-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-slate-400 text-sm mb-4">Response within 24 hours</p>
            <a
              href="mailto:support@bandachao.com"
              className="block w-full py-2 px-4 bg-panda-500 hover:bg-panda-600 text-white rounded-xl font-medium transition-colors"
            >
              Send Email
            </a>
          </div>

          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 text-center hover:border-panda-500/50 transition-colors">
            <div className="w-16 h-16 bg-silk-500/10 border border-silk-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="text-silk-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-slate-400 text-sm mb-4">Mon-Fri, 9AM-6PM CST</p>
            <a
              href="tel:+8612345678"
              className="block w-full py-2 px-4 bg-silk-500 hover:bg-silk-600 text-white rounded-xl font-medium transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>

        {/* AI Agent CTA */}
        <div className="mt-12 bg-gradient-to-br from-panda-950 to-jade-950 border border-panda-500/30 rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
            <p className="text-slate-300 mb-6">
              Ask our AI assistant Chatty Bird - she's available 24/7 and can help with most
              questions instantly
            </p>
            <button className="px-8 py-4 bg-jade-500 hover:bg-jade-600 text-white rounded-xl font-semibold transition-colors">
              Talk to Chatty Bird →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
