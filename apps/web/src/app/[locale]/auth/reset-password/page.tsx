'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Loader2, X, Check } from 'lucide-react';
import { authFlowCopy, normalizeLocale } from '@/i18n/ui-copy';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const locale = normalizeLocale(typeof params.locale === 'string' ? params.locale : 'en');
  const copy = authFlowCopy[locale];
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordCriteria = [
    { label: copy.reset.criteria[0], test: (p: string) => p.length >= 8 },
    { label: copy.reset.criteria[1], test: (p: string) => /[A-Z]/.test(p) },
    { label: copy.reset.criteria[2], test: (p: string) => /[a-z]/.test(p) },
    { label: copy.reset.criteria[3], test: (p: string) => /[0-9]/.test(p) },
  ];

  const getPasswordStrength = () => {
    const passed = passwordCriteria.filter((c) => c.test(password)).length;
    if (passed === 0) return { label: '', color: '' };
    if (passed <= 2) return { label: copy.reset.weak, color: 'text-danger-500' };
    if (passed === 3) return { label: copy.reset.medium, color: 'text-warn-500' };
    return { label: copy.reset.strong, color: 'text-success-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(copy.reset.mismatch);
      return;
    }

    const allPassed = passwordCriteria.every((c) => c.test(password));
    if (!allPassed) {
      setError(copy.reset.requirementsMissing);
      return;
    }

    setLoading(true);

    // Simulate API call until the backend exposes password reset endpoints.
    setTimeout(() => {
      setLoading(false);
      router.push(`/${locale}/auth/login?reset=success`);
    }, 1500);
  };

  const strength = getPasswordStrength();

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">{copy.reset.title}</h1>
          <p className="text-slate-400">{copy.reset.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {copy.reset.newPassword}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
            {password && strength.label && (
              <p className={`mt-1 text-xs font-medium ${strength.color}`}>
                {copy.reset.strength} {strength.label}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {copy.reset.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
              required
            />
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
            <p className="text-sm font-medium text-slate-300">{copy.reset.requirementsTitle}</p>
            {passwordCriteria.map((criterion, i) => {
              const passes = password && criterion.test(password);
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {passes ? (
                    <Check className="h-4 w-4 text-success-500" />
                  ) : (
                    <X className="h-4 w-4 text-slate-500" />
                  )}
                  <span className={passes ? 'text-success-500' : 'text-slate-400'}>
                    {criterion.label}
                  </span>
                </div>
              );
            })}
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
                {copy.reset.resetting}
              </>
            ) : (
              copy.reset.submit
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
