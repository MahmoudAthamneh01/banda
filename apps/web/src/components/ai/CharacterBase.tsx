"use client";

/**
 * AI Character Base Components
 * Shared UI primitives for all AI characters
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import type { AICharacter, MotionSignature, AICharacterUIState } from '@/lib/ai/types';

// Motion variants for different signatures
export const motionVariants: Record<MotionSignature, {
  initial: object;
  animate: object;
  exit: object;
}> = {
  bounce: {
    initial: { scale: 0, y: 20 },
    animate: { scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5 } },
    exit: { scale: 0, y: 20 },
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  float: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { y: -20, opacity: 0 },
  },
  pulse: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  wiggle: {
    initial: { rotate: -10, scale: 0 },
    animate: { rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 200 } },
    exit: { rotate: 10, scale: 0 },
  },
};

// Character Avatar Component
interface CharacterAvatarProps {
  character: AICharacter;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function CharacterAvatar({ character, size = 'md', animated = true }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
  };

  const { motionSignature, primaryColor } = character.styleTokens;

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg`}
      style={{ 
        backgroundColor: `${primaryColor}20`,
        border: `2px solid ${primaryColor}`,
      }}
      animate={animated ? {
        y: motionSignature === 'float' ? [0, -5, 0] : 0,
        rotate: motionSignature === 'wiggle' ? [0, -3, 3, 0] : 0,
        scale: motionSignature === 'pulse' ? [1, 1.05, 1] : 1,
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      <span role="img" aria-label={character.displayName}>
        {character.emoji}
      </span>
    </motion.div>
  );
}

// Character Bubble - Small tooltip-like appearance
interface CharacterBubbleProps {
  character: AICharacter;
  message: string;
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  autoHide?: number; // ms
}

export function CharacterBubble({
  character,
  message,
  onDismiss,
  onAction,
  actionLabel,
  autoHide = 5000,
}: CharacterBubbleProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  const variants = motionVariants[character.styleTokens.motionSignature];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
        >
          <div 
            className="glass-card p-4 max-w-xs shadow-xl"
            style={{ borderColor: `${character.styleTokens.primaryColor}40` }}
          >
            <div className="flex items-start gap-3">
              <CharacterAvatar character={character} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-xs font-semibold"
                    style={{ color: character.styleTokens.primaryColor }}
                  >
                    {character.displayName}
                  </span>
                  <button
                    onClick={() => {
                      setVisible(false);
                      onDismiss?.();
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-300">{message}</p>
                {onAction && actionLabel && (
                  <button
                    onClick={onAction}
                    className="mt-2 text-xs font-medium px-3 py-1 rounded-full transition-colors"
                    style={{ 
                      backgroundColor: `${character.styleTokens.primaryColor}20`,
                      color: character.styleTokens.primaryColor,
                    }}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Character Panel - Larger side panel
interface CharacterPanelProps {
  character: AICharacter;
  title?: string;
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
}

export function CharacterPanel({
  character,
  title,
  children,
  visible,
  onClose,
  position = 'right',
}: CharacterPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [muted, setMuted] = useState(false);

  const positionClasses = {
    left: 'left-4 top-1/4',
    right: 'right-4 top-1/4',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const variants = motionVariants[character.styleTokens.motionSignature];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed z-50 ${positionClasses[position]}`}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
        >
          <div 
            className="glass-card shadow-2xl overflow-hidden"
            style={{ 
              borderColor: `${character.styleTokens.primaryColor}40`,
              width: minimized ? 'auto' : '320px',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-3"
              style={{ backgroundColor: `${character.styleTokens.primaryColor}10` }}
            >
              <div className="flex items-center gap-2">
                <CharacterAvatar character={character} size="sm" />
                {!minimized && (
                  <div>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: character.styleTokens.primaryColor }}
                    >
                      {character.displayName}
                    </span>
                    {title && (
                      <p className="text-xs text-slate-400">{title}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={minimized ? 'Expand' : 'Minimize'}
                >
                  {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4"
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Ticker Component - For Chatty Bird style updates
interface TickerProps {
  character: AICharacter;
  items: Array<{ id: string; text: string; onClick?: () => void }>;
  visible: boolean;
  onMute?: () => void;
}

export function CharacterTicker({ character, items, visible, onMute }: TickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!visible || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <motion.div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <div 
        className="glass-card px-4 py-2 flex items-center gap-3 shadow-lg"
        style={{ borderColor: `${character.styleTokens.primaryColor}40` }}
      >
        <CharacterAvatar character={character} size="sm" animated />
        <AnimatePresence mode="wait">
          <motion.button
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={currentItem.onClick}
            className="text-sm text-slate-300 hover:text-white transition-colors max-w-md truncate"
          >
            {currentItem.text}
          </motion.button>
        </AnimatePresence>
        {items.length > 1 && (
          <div className="flex gap-1">
            {items.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-panda-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
        <button
          onClick={onMute}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Mute for today"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Hook to manage character UI state
export function useCharacterUI(characterId: string): {
  state: AICharacterUIState;
  show: () => void;
  hide: () => void;
  minimize: () => void;
  mute: (duration?: number) => void;
  unmute: () => void;
  setMuted: (value: boolean) => void;
} {
  const storageKey = `ai_character_${characterId}`;

  const [state, setState] = useState<AICharacterUIState>(() => {
    if (typeof window === 'undefined') {
      return { visible: false, minimized: false, muted: false, dismissCount: 0 };
    }
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if mute has expired
      if (parsed.mutedUntil && Date.now() > parsed.mutedUntil) {
        parsed.muted = false;
        parsed.mutedUntil = undefined;
      }
      return parsed;
    }
    return { visible: false, minimized: false, muted: false, dismissCount: 0 };
  });

  // Persist state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, storageKey]);

  const show = useCallback(() => {
    if (!state.muted) {
      setState(s => ({ ...s, visible: true }));
    }
  }, [state.muted]);

  const hide = useCallback(() => {
    setState(s => ({ 
      ...s, 
      visible: false, 
      dismissCount: s.dismissCount + 1,
      lastInteraction: Date.now(),
    }));
  }, []);

  const minimize = useCallback(() => {
    setState(s => ({ ...s, minimized: !s.minimized }));
  }, []);

  const mute = useCallback((duration = 24 * 60 * 60 * 1000) => {
    setState(s => ({ 
      ...s, 
      muted: true, 
      mutedUntil: Date.now() + duration,
      visible: false,
    }));
  }, []);

  const unmute = useCallback(() => {
    setState(s => ({ ...s, muted: false, mutedUntil: undefined }));
  }, []);

  const setMuted = useCallback((value: boolean) => {
    if (value) {
      mute();
    } else {
      unmute();
    }
  }, [mute, unmute]);

  return { state, show, hide, minimize, mute, unmute, setMuted };
}
