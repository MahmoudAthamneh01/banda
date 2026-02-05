'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@bandachao/ui';
import { Shield, Upload, Camera, CheckCircle, XCircle, Loader2, AlertCircle, ArrowLeft, ArrowRight, Check, HelpCircle } from 'lucide-react';

export default function KYCPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'approved' | 'rejected'>('idle');
  const [showHelp, setShowHelp] = useState(false);
  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  });
  const [consent, setConsent] = useState({
    dataProcessing: false,
    accuracy: false,
  });

  const handleFileUpload = (type: 'idFront' | 'idBack' | 'selfie', file: File) => {
    setFiles({ ...files, [type]: file });
  };

  const handleSubmit = () => {
    setLoading(true);
    setStatus('pending');
    
    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      setStatus('approved');
    }, 3000);
  };

  const canProceed = () => {
    if (step === 1) return true; // Info step
    if (step === 2) return files.idFront && files.idBack;
    if (step === 3) return files.selfie;
    if (step === 4) return consent.dataProcessing && consent.accuracy;
    return false;
  };

  // Success State
  if (status === 'approved') {
    return (
      <AuthLayout>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Verification Complete!</h1>
          <p className="text-slate-400 mb-8">
            Your identity has been verified. Welcome to BandaChao!
          </p>
          <Button
            onClick={() => router.push('/en/square')}
            className="bg-panda-500 hover:bg-panda-600 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Rejected State
  if (status === 'rejected') {
    return (
      <AuthLayout>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-danger-500/20 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-danger-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Verification Failed</h1>
          <p className="text-slate-400 mb-4">
            We couldn't verify your identity. Please try again.
          </p>
          <div className="p-4 bg-warn-500/10 border border-warn-500/20 rounded-lg mb-8 text-left">
            <p className="text-sm text-slate-300 mb-2"><strong>Common issues:</strong></p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• ID photo is blurry or cut off</li>
              <li>• Name doesn't match document</li>
              <li>• Document expired or not accepted</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setStatus('idle')}>
              Try Again
            </Button>
            <Button variant="ghost">
              Contact Support
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Pending State
  if (status === 'pending') {
    return (
      <AuthLayout>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="h-20 w-20 mx-auto mb-6">
            <Loader2 className="h-20 w-20 text-panda-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Verifying Your Identity</h1>
          <p className="text-slate-400 mb-8">
            This usually takes 30-60 seconds...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="h-2 w-2 bg-panda-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 bg-panda-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 bg-panda-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
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
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      s < step ? 'bg-success-500' : 'bg-white/5'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span className={step === 1 ? 'text-slate-200' : ''}>Why KYC?</span>
            <span className={step === 2 ? 'text-slate-200' : ''}>Identity</span>
            <span className={step === 3 ? 'text-slate-200' : ''}>Selfie</span>
            <span className={step === 4 ? 'text-slate-200' : ''}>Review</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {/* Step 1: Why KYC? */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-panda-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-panda-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-200">Identity Verification</h2>
                  <p className="text-slate-400">Required for full platform access</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-1">Trust & Safety</h3>
                    <p className="text-sm text-slate-400">Protect all users from fraud and scams</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-1">Compliance</h3>
                    <p className="text-sm text-slate-400">Meet regulatory requirements</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-1">Full Access</h3>
                    <p className="text-sm text-slate-400">Unlock all features and higher limits</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                <p className="text-sm text-slate-300">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Your data is encrypted and stored securely. We never share it without your consent.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: ID Upload */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Upload Your ID</h2>
              <p className="text-slate-400 mb-6">Passport, National ID, or Driver's License</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-panda-500/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-300 mb-1">ID Front</p>
                  <p className="text-xs text-slate-500">
                    {files.idFront ? files.idFront.name : 'Click to upload'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload('idFront', e.target.files[0])}
                    className="hidden"
                  />
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-panda-500/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-300 mb-1">ID Back</p>
                  <p className="text-xs text-slate-500">
                    {files.idBack ? files.idBack.name : 'Click to upload'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload('idBack', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-4 bg-warn-500/10 border border-warn-500/20 rounded-lg">
                <p className="text-sm text-slate-300 mb-2"><strong>Guidelines:</strong></p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Clear photo with good lighting</li>
                  <li>• All text must be readable</li>
                  <li>• No glare or shadows</li>
                  <li>• Document not expired</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Selfie */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Take a Selfie</h2>
              <p className="text-slate-400 mb-6">We'll match it with your ID photo</p>

              <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-panda-500/50 transition-colors cursor-pointer mb-6">
                <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-slate-300 mb-1">
                  {files.selfie ? 'Selfie captured' : 'Click to take photo'}
                </p>
                <p className="text-xs text-slate-500">Face the camera and look straight ahead</p>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => e.target.files && handleFileUpload('selfie', e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                <p className="text-sm text-slate-300 mb-2"><strong>Tips:</strong></p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Remove glasses and hat</li>
                  <li>• Face forward with neutral expression</li>
                  <li>• Good lighting on your face</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Review & Submit</h2>
              <p className="text-slate-400 mb-6">Confirm your information is correct</p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">ID Documents</p>
                  <p className="text-slate-200">✓ Front and back uploaded</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Selfie</p>
                  <p className="text-slate-200">✓ Photo captured</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.dataProcessing}
                    onChange={(e) => setConsent({ ...consent, dataProcessing: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-panda-500 focus:ring-2 focus:ring-panda-500"
                  />
                  <span className="text-sm text-slate-400">
                    I consent to the processing of my personal data for identity verification
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.accuracy}
                    onChange={(e) => setConsent({ ...consent, accuracy: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-panda-500 focus:ring-2 focus:ring-panda-500"
                  />
                  <span className="text-sm text-slate-400">
                    I confirm that all information provided is accurate and up-to-date
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              variant="ghost"
              className="text-slate-400 hover:text-slate-200 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-panda-500 hover:bg-panda-600 text-white disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-success-500 hover:bg-success-600 text-white disabled:opacity-50"
              >
                Submit for Verification
              </Button>
            )}
          </div>

          {/* AI Help */}
          {(step === 2 || step === 3) && (
            <>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Need help with photos?
              </button>

              {showHelp && (
                <div className="mt-4 p-4 bg-panda-500/10 border border-panda-500/20 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">🐼 Photo tips:</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Use natural daylight if possible</li>
                    <li>• Place document on dark background</li>
                    <li>• Hold camera parallel to document</li>
                    <li>• Avoid flash to prevent glare</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
