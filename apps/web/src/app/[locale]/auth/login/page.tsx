'use client';

import { FormEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';

type AuthMode = 'email' | 'wechat' | 'alipay';

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

export default function LoginPage() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await ApiClient.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(redirectForRole(locale, data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLogin = (provider: 'WeChat' | 'Alipay') => {
    setError(`${provider} OAuth is not configured yet. Use email login for the local backend.`);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-panda-500 to-cyan-500 mb-4">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome to BandaChao</h1>
          <p className="text-slate-400 mt-2">Login to continue</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              mode === 'email'
                ? 'bg-panda-500 text-white'
                : 'bg-ink-900 text-slate-400 hover:bg-ink-850'
            }`}
          >
            <Mail size={18} className="inline mr-2" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setMode('wechat')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              mode === 'wechat'
                ? 'bg-[#07C160] text-white'
                : 'bg-ink-900 text-slate-400 hover:bg-ink-850'
            }`}
          >
            WeChat
          </button>
          <button
            type="button"
            onClick={() => setMode('alipay')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              mode === 'alipay'
                ? 'bg-[#1677FF] text-white'
                : 'bg-ink-900 text-slate-400 hover:bg-ink-850'
            }`}
          >
            Alipay
          </button>
        </div>

        <div className="bg-ink-900 rounded-2xl p-6 border border-ink-800">
          {mode === 'email' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-ink-950 border border-ink-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    className="w-full pl-11 pr-4 py-3 bg-ink-950 border border-ink-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-danger-500 bg-danger-500/10 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-panda-500 hover:bg-panda-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {mode === 'wechat' && (
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <p className="text-slate-400 text-sm">WeChat QR Code</p>
                </div>
              </div>
              {error && <p className="text-sm text-danger-500">{error}</p>}
              <button
                type="button"
                onClick={() => handleExternalLogin('WeChat')}
                className="w-full py-3 px-4 bg-[#07C160] hover:bg-[#06A850] text-white font-medium rounded-xl transition-colors"
              >
                Login with WeChat
              </button>
            </div>
          )}

          {mode === 'alipay' && (
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <p className="text-slate-400 text-sm">Alipay QR Code</p>
                </div>
              </div>
              {error && <p className="text-sm text-danger-500">{error}</p>}
              <button
                type="button"
                onClick={() => handleExternalLogin('Alipay')}
                className="w-full py-3 px-4 bg-[#1677FF] hover:bg-[#0958D9] text-white font-medium rounded-xl transition-colors"
              >
                Login with Alipay
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          By continuing, you agree to BandaChao&apos;s{' '}
          <a href={`/${locale}/legal/terms`} className="text-panda-500 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
