'use client';

import { useState, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentRenderer from '../agents/AgentRenderer';
import { AGENTS } from '../agents/AgentRegistry';
import { AgentEventBus, useAgentEvent } from '../agents/AgentEventBus';

interface AskPandaProps {
  context?: 'landing' | 'about' | 'faq' | 'status' | 'legal';
  suggestions?: string[];
}

/**
 * AskPanda - Integrated with AgentEventBus and AgentRenderer
 * 
 * Now uses the unified agent system instead of custom UI
 */
export function AskPanda({ context = 'landing' }: AskPandaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agent] = useState(() => AGENTS.CHATTY_BIRD); // Use Chatty Bird as default

  // Listen for manual agent triggers
  useAgentEvent('AGENT_TRIGGER', (event) => {
    if (event.payload?.trigger === 'manual') {
      setIsOpen(true);
    }
  });

  // Listen for agent dismissal
  useAgentEvent('AGENT_DISMISS', (event) => {
    if (event.payload?.agentId === agent.id) {
      setIsOpen(false);
    }
  });

  const handleOpen = useCallback(() => {
    AgentEventBus.triggerAgent('manual', agent.id, { context });
    setIsOpen(true);
  }, [agent.id, context]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-panda-500 to-panda-600 rounded-full shadow-glow-primary flex items-center justify-center text-white hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agent Renderer */}
      <AgentRenderer
        agent={agent}
        isOpen={isOpen}
        onClose={handleClose}
        initialMessage={`Hi! I'm ${agent.name}. How can I help you today?`}
        renderMode="drawer"
      />
    </>
  );
}
