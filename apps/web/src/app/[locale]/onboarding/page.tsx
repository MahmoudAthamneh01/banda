'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { ShoppingBag, Briefcase, TrendingUp, Globe, MapPin, DollarSign, Sparkles, ArrowRight, ArrowLeft, Check, MessageCircle, Send, X } from 'lucide-react';

type Role = 'buyer' | 'maker' | 'investor' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showAI, setShowAI] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState({
    country: '',
    language: 'en',
    timezone: 'UTC+8',
    currency: 'CNY',
  });
  const [goals, setGoals] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const roles = [
    {
      id: 'buyer' as const,
      name: 'Buyer',
      icon: ShoppingBag,
      desc: 'Browse and purchase quality products from verified makers',
      benefits: ['Access 10K+ products', 'Escrow protection', 'Fast shipping'],
      color: 'from-sky-500 to-panda-500',
    },
    {
      id: 'maker' as const,
      name: 'Maker',
      icon: Briefcase,
      desc: 'Sell your products and manage your manufacturing',
      benefits: ['List unlimited products', 'RFQ system', 'Analytics dashboard'],
      color: 'from-silk-500 to-panda-500',
    },
    {
      id: 'investor' as const,
      name: 'Investor',
      icon: TrendingUp,
      desc: 'Fund manufacturing batches and earn yield',
      benefits: ['Real commerce yield', 'Risk transparency', 'Batch tracking'],
      color: 'from-jade-500 to-sky-500',
    },
  ];

  const buyerGoals = ['Electronics', 'Fashion', 'Home & Garden', 'Industrial Parts'];
  const makerGoals = ['Increase sales', 'Source materials', 'Find investors', 'Expand globally'];
  const investorGoals = ['Low risk', 'Medium risk', 'High return', 'Long term'];

  const getGoalOptions = () => {
    if (role === 'buyer') return buyerGoals;
    if (role === 'maker') return makerGoals;
    if (role === 'investor') return investorGoals;
    return [];
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      if (step === 1 && !showAI) {
        setTimeout(() => setShowAI(true), 500);
      }
    } else {
      // Complete onboarding
      router.push('/en/kyc');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) return role !== null;
    if (step === 2) return profile.country && profile.language;
    if (step === 3) return goals.length > 0;
    return false;
  };

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? 'bg-success-500 text-white'
                      : s === step
                      ? 'bg-panda-500 text-white'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      s < step ? 'bg-success-500' : 'bg-white/5'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step === 1 ? 'text-slate-200' : 'text-slate-500'}>Choose Role</span>
            <span className={step === 2 ? 'text-slate-200' : 'text-slate-500'}>Profile</span>
            <span className={step === 3 ? 'text-slate-200' : 'text-slate-500'}>Goals</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Main Content */}
          <div className="w-full lg:w-[600px]">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {/* Step 1: Choose Role */}
              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-200 mb-3">Choose Your Role</h2>
                  <p className="text-slate-400 mb-8">You can switch later from settings</p>
                  
                  <div className="space-y-5">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={`w-full p-8 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-panda-500 bg-panda-500/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-6">
                            <div className={`h-16 w-16 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-200 mb-2">{r.name}</h3>
                              <p className="text-base text-slate-400 mb-4">{r.desc}</p>
                              <div className="flex flex-wrap gap-3">
                                {r.benefits.map((benefit, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1.5 bg-white/10 rounded text-sm text-slate-300"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Profile Basics */}
              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-200 mb-3">Basic Information</h2>
                  <p className="text-slate-400 mb-8">Help us personalize your experience</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Country
                      </label>
                      <select
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500"
                      >
                        <option value="">Select country</option>
                        <option value="CN">China</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="DE">Germany</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Language
                      </label>
                      <select
                        value={profile.language}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500"
                      >
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500"
                        >
                          <option value="UTC+8">UTC+8 (Beijing)</option>
                          <option value="UTC-5">UTC-5 (New York)</option>
                          <option value="UTC+0">UTC+0 (London)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          <DollarSign className="h-4 w-4 inline mr-2" />
                          Currency
                        </label>
                        <select
                          value={profile.currency}
                          onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500"
                        >
                          <option value="CNY">CNY (¥)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Goals */}
              {step === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-200 mb-3">Your Goals</h2>
                  <p className="text-slate-400 mb-8">
                    What are you looking for? (Select all that apply)
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {getGoalOptions().map((goal) => {
                      const isSelected = goals.includes(goal);
                      return (
                        <button
                          key={goal}
                          onClick={() => toggleGoal(goal)}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-panda-500 bg-panda-500/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-slate-200 font-medium text-base">{goal}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
                <Button
                  onClick={handleBack}
                  disabled={step === 1}
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-200 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-panda-500 hover:bg-panda-600 text-white disabled:opacity-50"
                >
                  {step === 3 ? 'Continue to KYC' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* AI Helper Panel */}
          <div className="w-full lg:w-[280px]">
            {showAI && (
              <div className="bg-gradient-to-br from-panda-500/20 to-sky-500/20 backdrop-blur-sm border border-panda-500/30 rounded-2xl p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-panda-400" />
                  <h3 className="font-bold text-slate-200">Host Panda</h3>
                </div>
                
                <p className="text-sm text-slate-300 mb-4">
                  🐼 Need guidance? I'm here to help!
                </p>

                {step === 1 && (
                  <div className="space-y-3 text-sm text-slate-400">
                    <p><strong className="text-slate-200">Which role to choose?</strong></p>
                    <p>• Start as <strong>Buyer</strong> if you're exploring</p>
                    <p>• Choose <strong>Maker</strong> if you want to sell</p>
                    <p>• Pick <strong>Investor</strong> for funding opportunities</p>
                    <p className="text-xs text-slate-500 italic">💡 You can upgrade your role anytime</p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3 text-sm text-slate-400">
                    <p><strong className="text-slate-200">Why we ask:</strong></p>
                    <p>• Country: For shipping & compliance</p>
                    <p>• Language: Better experience</p>
                    <p>• Currency: Accurate pricing</p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3 text-sm text-slate-400">
                    <p><strong className="text-slate-200">Personalizing your feed:</strong></p>
                    <p>Based on your goals, we'll show you:</p>
                    <p>• Relevant products</p>
                    <p>• Matching opportunities</p>
                    <p>• Curated recommendations</p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChat ? 'Close chat' : 'Ask a question'}
                </Button>

                {/* Chat Interface */}
                {showChat && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    {/* Chat History */}
                    <div className="max-h-48 overflow-y-auto space-y-3 mb-3">
                      {chatHistory.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2">Ask me anything about onboarding!</p>
                      ) : (
                        chatHistory.map((msg, i) => (
                          <div key={i} className={`text-sm p-2 rounded-lg ${msg.role === 'user' ? 'bg-panda-500/20 text-slate-200 ml-4' : 'bg-white/5 text-slate-300 mr-4'}`}>
                            {msg.role === 'ai' && <span className="text-panda-400 text-xs">🐼 </span>}
                            {msg.text}
                          </div>
                        ))
                      )}
                    </div>
                    {/* Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-panda-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatMessage.trim()) {
                            setChatHistory([...chatHistory, { role: 'user', text: chatMessage }]);
                            setTimeout(() => {
                              setChatHistory(prev => [...prev, { role: 'ai', text: 'Great question! Based on your selection, I recommend starting with the Buyer role. It gives you full access to explore products while you decide if you want to become a Maker or Investor later.' }]);
                            }, 500);
                            setChatMessage('');
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="bg-panda-500 hover:bg-panda-600 px-3"
                        onClick={() => {
                          if (chatMessage.trim()) {
                            setChatHistory([...chatHistory, { role: 'user', text: chatMessage }]);
                            setTimeout(() => {
                              setChatHistory(prev => [...prev, { role: 'ai', text: 'Great question! Based on your selection, I recommend starting with the Buyer role. It gives you full access to explore products while you decide if you want to become a Maker or Investor later.' }]);
                            }, 500);
                            setChatMessage('');
                          }
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
