'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Lock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

type AuthMode = 'phone' | 'wechat' | 'alipay';

interface LoginPageProps {
  params: {
    locale: string;
  };
}

export default function LoginPage({ params }: LoginPageProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, locale: params.locale }),
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
      } else {
        setError(data.message || 'Failed to send code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      setError('Please enter phone and code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, locale: params.locale }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on user role
        const redirect = data.redirect || `/${params.locale}/square`;
        router.push(redirect);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWeChatLogin = () => {
    // Redirect to WeChat OAuth
    window.location.href = `/api/auth/wechat?locale=${params.locale}`;
  };

  const handleAlipayLogin = () => {
    // Redirect to Alipay OAuth
    window.location.href = `/api/auth/alipay?locale=${params.locale}`;
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-panda-500 to-cyan-500 mb-4">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome to BandaChao</h1>
          <p className="text-slate-400 mt-2">Login to continue</p>
        </div>

        {/* Auth Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('phone')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              mode === 'phone'
                ? 'bg-panda-500 text-white'
                : 'bg-ink-900 text-slate-400 hover:bg-ink-850'
            }`}
          >
            <Phone size={18} className="inline mr-2" />
            Phone
          </button>
          <button
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

        {/* Auth Forms */}
        <div className="bg-ink-900 rounded-2xl p-6 border border-ink-800">
          {mode === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+86 138 0000 0000"
                  className="w-full px-4 py-3 bg-ink-950 border border-ink-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                />
              </div>

              {codeSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-ink-950 border border-ink-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-danger-500 bg-danger-500/10 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {!codeSent ? (
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-panda-500 hover:bg-panda-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-panda-500 hover:bg-panda-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <button
                    onClick={() => {
                      setCodeSent(false);
                      setCode('');
                      setError('');
                    }}
                    className="w-full py-3 px-4 bg-ink-850 hover:bg-ink-800 text-slate-300 font-medium rounded-xl transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'wechat' && (
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <p className="text-slate-400 text-sm">WeChat QR Code</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Scan QR code with WeChat to login
              </p>
              <button
                onClick={handleWeChatLogin}
                className="w-full py-3 px-4 bg-[#07C160] hover:bg-[#06A850] text-white font-medium rounded-xl transition-colors"
              >
                Login with WeChat
              </button>
            </div>
          )}

          {mode === 'alipay' && (
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <p className="text-slate-400 text-sm">Alipay QR Code</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Scan QR code with Alipay to login
              </p>
              <button
                onClick={handleAlipayLogin}
                className="w-full py-3 px-4 bg-[#1677FF] hover:bg-[#0958D9] text-white font-medium rounded-xl transition-colors"
              >
                Login with Alipay
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          By continuing, you agree to BandaChao's{' '}
          <a href={`/${params.locale}/legal/terms`} className="text-panda-500 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
