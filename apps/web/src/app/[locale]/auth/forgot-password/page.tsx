'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import { authFlowCopy, normalizeLocale } from '@/i18n/ui-copy';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = normalizeLocale(typeof params.locale === 'string' ? params.locale : 'en');
  const copy = authFlowCopy[locale];
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call until the backend exposes password reset endpoints.
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
          <h1 className="text-2xl font-bold text-slate-200 mb-2">
            {copy.forgot.sentTitle} {method === 'email' ? copy.forgot.emailTarget : copy.forgot.phoneTarget}
          </h1>
          <p className="text-slate-400 mb-6">
            {copy.forgot.sentBody} <span className="font-medium text-slate-300">{identifier}</span>
          </p>
          <p className="text-sm text-slate-500 mb-8">{copy.forgot.sentHint}</p>
          <Link href={`/${locale}/auth/login`}>
            <Button className="w-full">{copy.forgot.backToSignIn}</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">{copy.forgot.title}</h1>
          <p className="text-slate-400">{copy.forgot.subtitle}</p>
        </div>

        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              method === 'email'
                ? 'bg-panda-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            {copy.methods.email}
          </button>
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              method === 'phone'
                ? 'bg-panda-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="h-4 w-4 inline mr-2" />
            {copy.methods.phone}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {method === 'email' ? copy.forgot.emailAddress : copy.forgot.phoneNumber}
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
                {copy.forgot.sending}
              </>
            ) : (
              copy.forgot.send
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong>{copy.forgot.nextTitle}</strong>
          </p>
          <ul className="mt-2 text-sm text-slate-400 space-y-1">
            {copy.forgot.nextSteps.map((step) => (
              <li key={step}>- {step}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          {copy.forgot.remember}{' '}
          <Link href={`/${locale}/auth/login`} className="text-panda-400 hover:text-panda-300 font-medium">
            {copy.forgot.signIn}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
