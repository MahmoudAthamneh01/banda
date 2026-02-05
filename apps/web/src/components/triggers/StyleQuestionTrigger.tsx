'use client';

import { useEffect, useState } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';
import type { AgentTrigger } from '../agents/AgentRegistry';

interface StyleQuestionTriggerProps {
  keywords?: string[];
  agentId?: string;
}

const defaultKeywords = [
  'style',
  'design',
  'color',
  'customize',
  'modify',
  'change',
  'adjust',
  'improve',
  '风格',
  '设计',
  '颜色',
  '定制',
  'أسلوب',
  'تصميم',
  'لون',
];

/**
 * StyleQuestionTrigger - Triggers when user asks about product styling
 * 
 * Monitors user interactions (chat, search, product views) for style-related
 * queries and triggers Style Guru agent
 */
export function StyleQuestionTrigger({
  keywords = defaultKeywords,
  agentId = 'style_guru',
}: StyleQuestionTriggerProps) {
  const [lastTrigger, setLastTrigger] = useState<number>(0);
  const cooldownPeriod = 2 * 60 * 1000; // 2 minutes

  useEffect(() => {
    const checkForStyleKeywords = (text: string) => {
      const lowerText = text.toLowerCase();
      return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
    };

    // Monitor input fields for style questions
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const text = target.value;

      // Check cooldown
      if (Date.now() - lastTrigger < cooldownPeriod) {
        return;
      }

      if (text.length > 15 && checkForStyleKeywords(text)) {
        console.log('[StyleQuestionTrigger] Detected style-related query:', text.substring(0, 50));

        AgentEventBus.triggerAgent('STYLE_QUESTION' as AgentTrigger, agentId, {
          query: text,
          timestamp: Date.now(),
        });

        setLastTrigger(Date.now());
      }
    };

    // Monitor chat messages
    const handleMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message;

      if (!message || Date.now() - lastTrigger < cooldownPeriod) {
        return;
      }

      if (checkForStyleKeywords(message)) {
        console.log('[StyleQuestionTrigger] Detected style question in chat');

        AgentEventBus.triggerAgent('STYLE_QUESTION' as AgentTrigger, agentId, {
          query: message,
          source: 'chat',
          timestamp: Date.now(),
        });

        setLastTrigger(Date.now());
      }
    };

    // Add event listeners
    document.addEventListener('input', handleInput);
    document.addEventListener('chatMessage', handleMessage);

    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('chatMessage', handleMessage);
    };
  }, [keywords, agentId, lastTrigger, cooldownPeriod]);

  return null;
}

export default StyleQuestionTrigger;
