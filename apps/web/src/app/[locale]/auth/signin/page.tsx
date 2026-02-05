'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Lock, Mail, Phone, HelpCircle, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: Actual auth logic
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue to your account</p>
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
            />
          </div>

          {error && (
            <div className="p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg text-danger-500 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-panda-500 hover:bg-panda-600 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center">
          <Link
            href="/en/auth/forgot-password"
            className="block text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/en/auth/register" className="text-panda-400 hover:text-panda-300 font-medium">
              Create one
            </Link>
          </div>
        </div>

        {/* AI Helper */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Need help signing in?
        </button>

        {showHelp && (
          <div className="mt-4 p-4 bg-panda-500/10 border border-panda-500/20 rounded-lg">
            <p className="text-sm text-slate-300 mb-2">🐼 Common issues:</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• OTP didn't arrive? Check spam or try phone method</li>
              <li>• Forgot password? Use the reset link above</li>
              <li>• Account locked? Contact support</li>
            </ul>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
