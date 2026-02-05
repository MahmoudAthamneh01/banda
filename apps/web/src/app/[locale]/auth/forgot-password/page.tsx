'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Mail, Phone, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-200 mb-2">Check Your {method === 'email' ? 'Email' : 'Phone'}</h1>
          <p className="text-slate-400 mb-6">
            We've sent a password reset link to <span className="font-medium text-slate-300">{identifier}</span>
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Didn't receive it? Check your spam folder or try again in 60 seconds.
          </p>
          <Link href="/en/auth/signin">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Reset Password</h1>
          <p className="text-slate-400">We'll send you a reset link</p>
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
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={method === 'email' ? 'you@example.com' : '+86 123 4567 8900'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-panda-500 hover:bg-panda-600 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong>What happens next?</strong>
          </p>
          <ul className="mt-2 text-sm text-slate-400 space-y-1">
            <li>• You'll receive a reset link (valid for 1 hour)</li>
            <li>• Click the link to create a new password</li>
            <li>• Sign in with your new password</li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Remember your password?{' '}
          <Link href="/en/auth/signin" className="text-panda-400 hover:text-panda-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
