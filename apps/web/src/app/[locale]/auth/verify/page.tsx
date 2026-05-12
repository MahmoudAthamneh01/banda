'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Loader2, Mail, Phone, HelpCircle } from 'lucide-react';
import { authFlowCopy, normalizeLocale } from '@/i18n/ui-copy';

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const locale = normalizeLocale(typeof params.locale === 'string' ? params.locale : 'en');
  const copy = authFlowCopy[locale];
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);

    // Simulate API call until the backend exposes OTP verification endpoints.
    setTimeout(() => {
      setLoading(false);
      router.push(`/${locale}/onboarding`);
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(60);
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">{copy.verify.title}</h1>
          <p className="text-slate-400">
            {copy.verify.subtitle} {method === 'email' ? copy.methods.email : copy.methods.phone}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {copy.verify.check}{' '}
            <span className="font-medium text-slate-300">
              {method === 'email' ? copy.verify.inbox : copy.verify.messages}
            </span>
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              method === 'email'
                ? 'bg-panda-500 text-white'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            {copy.methods.email}
          </button>
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              method === 'phone'
                ? 'bg-panda-500 text-white'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="h-4 w-4" />
            {copy.methods.phone}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500 focus:border-panda-500"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 bg-panda-500 hover:bg-panda-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {copy.verify.verifying}
              </>
            ) : (
              copy.verify.submit
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-slate-400">
              {copy.verify.resendIn} <span className="font-medium text-slate-300">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-panda-400 hover:text-panda-300 font-medium"
            >
              {copy.verify.resend}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          {copy.verify.helpButton}
        </button>

        {showHelp && (
          <div className="mt-4 p-4 bg-panda-500/10 border border-panda-500/20 rounded-lg">
            <p className="text-sm text-slate-300 mb-2">{copy.verify.helpTitle}</p>
            <ul className="text-sm text-slate-400 space-y-1">
              {copy.verify.helpSteps.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
