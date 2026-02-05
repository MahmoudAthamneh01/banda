"use client";

/**
 * 🐼 HOST_PANDA - The Onboarding Guide
 * Welcomes new users, guides through onboarding, explains platform features
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hand, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Store,
  CreditCard,
  Star,
  Gift,
  X,
  Sparkles
} from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { logAIAction } from '@/lib/ai/logger';
import { CharacterAvatar, CharacterPanel, CharacterBubble, useCharacterUI } from './CharacterBase';
import type { AIEvent } from '@/lib/ai/types';

const character = getCharacter('HOST_PANDA');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  link: string;
}

interface HostPandaProps {
  locale: string;
  isFirstVisit?: boolean;
}

export function HostPanda({ locale, isFirstVisit = false }: HostPandaProps) {
  const { state, show, hide, setMuted } = useCharacterUI('HOST_PANDA');
  const [greeting, setGreeting] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'account',
      title: 'Create Account',
      description: 'Sign up to start trading',
      icon: CheckCircle2,
      completed: true,
      link: `/${locale}/auth/register`,
    },
    {
      id: 'kyc',
      title: 'Verify Identity',
      description: 'Complete KYC for full access',
      icon: ShieldCheck,
      completed: false,
      link: `/${locale}/kyc`,
    },
    {
      id: 'store',
      title: 'Setup Store',
      description: 'List your first product',
      icon: Store,
      completed: false,
      link: `/${locale}/cockpit/products/new`,
    },
    {
      id: 'payment',
      title: 'Add Payment Method',
      description: 'Connect your wallet or bank',
      icon: CreditCard,
      completed: false,
      link: `/${locale}/cockpit/wallet`,
    },
    {
      id: 'first-sale',
      title: 'Make Your First Sale',
      description: 'Earn your first revenue',
      icon: Star,
      completed: false,
      link: `/${locale}/cockpit/orders`,
    },
  ]);
  const [currentTip, setCurrentTip] = useState<string | null>(null);

  // Calculate progress
  const completedSteps = steps.filter(s => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  // Listen for onboarding events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // First visit welcome
    unsubscribes.push(
      aiEventBus.on('USER_FIRST_VISIT', (event) => {
        setGreeting('Welcome to Banda Chao! 🎉');
        show();

        logAIAction({
          characterId: 'HOST_PANDA',
          action: 'welcome_greeting',
          event,
          result: {
            success: true,
            characterId: 'HOST_PANDA',
            action: 'welcome_greeting',
            requiresApproval: false,
          },
        });

        // Auto-hide greeting after delay
        setTimeout(() => {
          setGreeting(null);
          setShowOnboarding(true);
        }, 3000);
      })
    );

    // Onboarding started
    unsubscribes.push(
      aiEventBus.on('ONBOARDING_STARTED', (event) => {
        setShowOnboarding(true);
        show();

        logAIAction({
          characterId: 'HOST_PANDA',
          action: 'show_onboarding',
          event,
          result: {
            success: true,
            characterId: 'HOST_PANDA',
            action: 'show_onboarding',
            requiresApproval: false,
          },
        });
      })
    );

    // KYC incomplete reminder
    unsubscribes.push(
      aiEventBus.on('KYC_INCOMPLETE', (event) => {
        setCurrentTip('Complete your KYC to unlock all platform features!');
        show();

        setTimeout(() => setCurrentTip(null), 5000);
      })
    );

    // Onboarding step completed
    unsubscribes.push(
      aiEventBus.on('ONBOARDING_STEP_COMPLETE', (event) => {
        const stepId = event.payload.stepId as string;
        
        setSteps(prev => prev.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        ));

        // Celebration message
        const stepName = steps.find(s => s.id === stepId)?.title;
        if (stepName) {
          setCurrentTip(`Great job completing "${stepName}"! 🎉`);
          setTimeout(() => setCurrentTip(null), 3000);
        }
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [show, steps]);

  // Show first visit greeting
  useEffect(() => {
    if (isFirstVisit) {
      aiEventBus.emit('USER_FIRST_VISIT', { referrer: typeof document !== 'undefined' ? document.referrer : '' }, `/${locale}`);
    }
  }, [isFirstVisit, locale]);

  // Welcome greeting bubble
  if (greeting && !state.muted) {
    return (
      <CharacterBubble
        character={character}
        message={greeting}
        autoHide={0}
        onDismiss={() => {
          setGreeting(null);
          setShowOnboarding(true);
        }}
        onAction={() => {
          setGreeting(null);
          setShowOnboarding(true);
        }}
        actionLabel="Get Started"
      />
    );
  }

  // Tip bubble
  if (currentTip && !state.muted && !showOnboarding) {
    return (
      <CharacterBubble
        character={character}
        message={currentTip}
        onDismiss={() => setCurrentTip(null)}
        autoHide={5000}
      />
    );
  }

  // Full onboarding panel
  if (!state.visible || state.muted || !showOnboarding) return null;

  return (
    <CharacterPanel
      character={character}
      title="Getting Started"
      visible={showOnboarding}
      onClose={() => {
        setShowOnboarding(false);
        hide();
      }}
      position="right"
    >
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Your Progress</span>
            <span className="text-sm font-bold text-green-400">{completedSteps}/{steps.length}</span>
          </div>
          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          {progress === 100 && (
            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <Sparkles className="w-4 h-4" />
              Onboarding complete!
            </div>
          )}
        </div>

        {/* Steps Checklist */}
        <div className="space-y-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isNext = !step.completed && steps.slice(0, index).every(s => s.completed);

            return (
              <motion.a
                key={step.id}
                href={step.completed ? undefined : step.link}
                className={`block p-3 rounded-lg transition-colors ${
                  step.completed 
                    ? 'bg-green-500/10 cursor-default'
                    : isNext
                    ? 'bg-green-500/20 hover:bg-green-500/30 cursor-pointer'
                    : 'bg-slate-700/50 opacity-60 cursor-not-allowed'
                }`}
                whileHover={!step.completed && isNext ? { scale: 1.02 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : isNext
                      ? 'bg-green-500/30 text-green-400'
                      : 'bg-slate-600 text-slate-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.completed ? 'text-green-400' : 'text-slate-200'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400">{step.description}</p>
                  </div>
                  {isNext && !step.completed && (
                    <ArrowRight className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Benefits Preview */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-400" />
            Complete onboarding to unlock:
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Full marketplace access
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Buyer protection & escrow
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Referral rewards program
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2">
          <a
            href={`/${locale}/docs`}
            className="flex-1 btn-ghost text-sm flex items-center justify-center gap-1"
          >
            <BookOpen className="w-4 h-4" />
            Help Docs
          </a>
          <button
            onClick={() => {
              setShowOnboarding(false);
              hide();
            }}
            className="flex-1 btn-ghost text-sm"
          >
            Skip for now
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-slate-500 text-center">
          {character.displayName} is here to help you get started!
        </p>
      </div>
    </CharacterPanel>
  );
}

// Floating welcome widget for homepage
export function PandaWelcomeBanner({ locale }: { locale: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-700/50"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
      
      <div className="flex items-center gap-4">
        <CharacterAvatar character={character} size="lg" />
        <div className="flex-1">
          <p className="font-semibold text-slate-200 mb-1">
            Welcome to Banda Chao! 🎉
          </p>
          <p className="text-sm text-slate-400">
            I'm {character.displayName}, your guide. Ready to explore?
          </p>
        </div>
        <a
          href={`/${locale}/auth/register`}
          className="btn-primary bg-green-500 hover:bg-green-600"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </motion.div>
  );
}

// Mini onboarding progress indicator
export function OnboardingProgress({ 
  completed = 0, 
  total = 5 
}: { 
  completed?: number; 
  total?: number;
}) {
  const progress = (completed / total) * 100;

  return (
    <div className="flex items-center gap-2">
      <CharacterAvatar character={character} size="sm" />
      <div className="flex-1">
        <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-slate-400">{completed}/{total}</span>
    </div>
  );
}
