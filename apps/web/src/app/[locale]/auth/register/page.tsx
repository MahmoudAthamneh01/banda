'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Mail, Phone, Loader2, ShoppingBag, Briefcase, TrendingUp, HelpCircle } from 'lucide-react';

export default function RegisterPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [showRoleHelp, setShowRoleHelp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    termsAccepted: false,
  });

  const roles = [
    {
      id: 'buyer',
      name: 'Buyer',
      icon: ShoppingBag,
      desc: 'Browse and purchase products',
      color: 'from-sky-500 to-panda-500',
    },
    {
      id: 'maker',
      name: 'Maker',
      icon: Briefcase,
      desc: 'Sell your products',
      color: 'from-silk-500 to-panda-500',
    },
    {
      id: 'investor',
      name: 'Investor',
      icon: TrendingUp,
      desc: 'Fund batches and earn',
      color: 'from-jade-500 to-sky-500',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: Redirect to /auth/verify
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Create Account</h1>
          <p className="text-slate-400">Join the sovereign digital marketplace</p>
        </div>

        {/* Method Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              method === 'email'
                ? 'bg-panda-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              method === 'phone'
                ? 'bg-panda-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="h-4 w-4 inline mr-2" />
            Phone
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {method === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              placeholder={method === 'email' ? 'you@example.com' : '+86 123 4567 8900'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-panda-500 focus:ring-2 focus:ring-panda-500"
              required
            />
            <span className="text-sm text-slate-400">
              I agree to the{' '}
              <Link href="/en/legal/terms" className="text-panda-400 hover:text-panda-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/en/legal/privacy" className="text-panda-400 hover:text-panda-300">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            disabled={loading || !formData.termsAccepted}
            className="w-full py-3 bg-panda-500 hover:bg-panda-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/en/auth/signin" className="text-panda-400 hover:text-panda-300 font-medium">
            Sign in
          </Link>
        </div>

        {/* AI Role Helper */}
        <button
          onClick={() => setShowRoleHelp(!showRoleHelp)}
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Which role should I choose?
        </button>

        {showRoleHelp && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-300">🐼 Choose based on your goal:</p>
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-start gap-3"
                >
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{role.name}</h4>
                    <p className="text-xs text-slate-400">{role.desc}</p>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-slate-500 italic">
              💡 Tip: Start as Buyer, you can upgrade to Maker/Investor later
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
