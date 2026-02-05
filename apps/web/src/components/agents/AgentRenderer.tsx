'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from './AgentRegistry';
import { AgentEventBus } from './AgentEventBus';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface AgentRendererProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  renderMode?: 'modal' | 'drawer' | 'popover';
}

/**
 * AgentRenderer - Universal UI component for displaying AI agents
 * 
 * Displays agent with:
 * - Lottie animation (or fallback emoji)
 * - Chat interface
 * - Agent personality and branding
 * - Multiple render modes (modal/drawer/popover)
 */
export default function AgentRenderer({
  agent,
  isOpen,
  onClose,
  initialMessage,
  renderMode = 'drawer',
}: AgentRendererProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'agent',
        content: initialMessage || `Hello! I'm ${agent.name}. ${agent.description}`,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, agent, initialMessage, messages.length]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Record action in event bus
    AgentEventBus.recordAction(agent.id, 'message_sent', {
      content: input,
    });

    try {
      // TODO: Replace with actual AI API call
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();

      const agentMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: data.message || 'I apologize, I encountered an error.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('[AgentRenderer] Error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: 'Sorry, I encountered a technical issue. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, agent.id]);

  const handleClose = useCallback(() => {
    AgentEventBus.dismissAgent(agent.id, 'user_closed');
    onClose();
  }, [agent.id, onClose]);

  // Render different layouts based on mode
  const containerVariants = {
    modal: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    drawer: 'fixed bottom-0 right-0 z-50 m-4',
    popover: 'fixed bottom-20 right-4 z-50',
  };

  const contentVariants = {
    modal: 'w-full max-w-2xl',
    drawer: 'w-96',
    popover: 'w-80',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for modal */}
          {renderMode === 'modal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={handleClose}
            />
          )}

          {/* Agent Container */}
          <div className={containerVariants[renderMode]}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`${contentVariants[renderMode]} bg-ink-900 border border-ink-700 rounded-2xl shadow-soft-lg overflow-hidden`}
              style={{ maxHeight: isMinimized ? '80px' : '600px' }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-ink-800"
                style={{ backgroundColor: `${agent.color}15` }}
              >
                {/* Agent Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${agent.color}30` }}
                >
                  {agent.personality.emoji || '🤖'}
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{agent.name}</h3>
                  <p className="text-xs text-slate-400">{agent.role.replace('-', ' ')}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 size={16} className="text-slate-400" />
                    ) : (
                      <Minimize2 size={16} className="text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              {!isMinimized && (
                <>
                  <div className="h-96 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-panda-500 text-white'
                              : 'bg-ink-850 text-slate-200'
                          }`}
                          style={
                            message.role === 'agent'
                              ? { backgroundColor: `${agent.color}20` }
                              : undefined
                          }
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div
                          className="px-4 py-2 rounded-2xl"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            />
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-ink-800 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-ink-950 border border-ink-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: agent.color }}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
