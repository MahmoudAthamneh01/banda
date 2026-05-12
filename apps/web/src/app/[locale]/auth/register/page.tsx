'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Briefcase, HelpCircle, Loader2, Mail, ShoppingBag, TrendingUp } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';

type RegistrationRole = 'BUYER' | 'MAKER' | 'INVESTOR';

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

function redirectForRole(locale: string, role: string) {
  if (role === 'MAKER' || role === 'ADMIN' || role === 'OWNER') {
    return `/${locale}/cockpit`;
  }
  if (role === 'INVESTOR') {
    return `/${locale}/vault/opportunities`;
  }

  return `/${locale}/square`;
}

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [referralCode, setReferralCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [showRoleHelp, setShowRoleHelp] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BUYER' as RegistrationRole,
    termsAccepted: false,
  });

  const roles = [
    {
      id: 'BUYER' as const,
      name: 'Buyer',
      icon: ShoppingBag,
      desc: 'Browse and purchase products',
      color: 'from-sky-500 to-panda-500',
    },
    {
      id: 'MAKER' as const,
      name: 'Maker',
      icon: Briefcase,
      desc: 'Sell products and respond to RFQs',
      color: 'from-silk-500 to-panda-500',
    },
    {
      id: 'INVESTOR' as const,
      name: 'Investor',
      icon: TrendingUp,
      desc: 'Fund batches and track returns',
      color: 'from-jade-500 to-sky-500',
    },
  ];

  useEffect(() => {
    setReferralCode(new URLSearchParams(window.location.search).get('ref') || undefined);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.termsAccepted) return;

    setLoading(true);
    setError('');

    try {
      const data = await ApiClient.post<AuthResponse>('/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        referralCode,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(redirectForRole(locale, data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Create Account</h1>
          <p className="text-slate-400">Join the sovereign digital marketplace</p>
        </div>

        <div className="mb-6 bg-white/5 p-1 rounded-lg">
          <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-white">
            <Mail className="h-4 w-4" />
            Email Registration
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="********"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account Role</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const active = formData.role === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`text-left p-3 border rounded-lg transition-colors ${
                      active
                        ? 'border-panda-500 bg-panda-500/15'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{role.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{role.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {referralCode && (
            <div className="text-xs text-panda-300 bg-panda-500/10 border border-panda-500/20 rounded-lg px-3 py-2">
              Referral code applied: {referralCode}
            </div>
          )}

          {error && (
            <div className="text-sm text-danger-500 bg-danger-500/10 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(event) => setFormData({ ...formData, termsAccepted: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-panda-500 focus:ring-2 focus:ring-panda-500"
              required
            />
            <span className="text-sm text-slate-400">
              I agree to the{' '}
              <Link href={`/${locale}/legal/terms`} className="text-panda-400 hover:text-panda-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href={`/${locale}/legal/privacy`} className="text-panda-400 hover:text-panda-300">
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

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href={`/${locale}/auth/login`} className="text-panda-400 hover:text-panda-300 font-medium">
            Sign in
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setShowRoleHelp(!showRoleHelp)}
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Which role should I choose?
        </button>

        {showRoleHelp && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-300">Choose based on your immediate goal:</p>
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
              You can change operational access later from account settings.
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
