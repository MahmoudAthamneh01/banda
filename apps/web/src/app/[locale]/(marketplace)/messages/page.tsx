'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Search,
  Send,
  Paperclip,
  Image,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Check,
  CheckCheck,
  Clock,
  Smile,
  Mic,
  Archive,
  Trash2,
  Pin,
  Bell,
  BellOff,
  Star,
  MessageSquare,
  ShoppingBag,
  BadgeCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

// Mock Conversations
const CONVERSATIONS = [
  {
    id: 1,
    name: 'TechZone Factory',
    avatar: '🏭',
    verified: true,
    lastMessage: "Great! I'll ship your order today. You should receive tracking info within 2 hours.",
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    orderRef: 'BC-78453',
  },
  {
    id: 2,
    name: 'Fashion Forward',
    avatar: '👗',
    verified: true,
    lastMessage: 'The size M is back in stock! Would you like to proceed with the order?',
    timestamp: '1 hour ago',
    unread: 1,
    online: false,
    orderRef: null,
  },
  {
    id: 3,
    name: 'GamerGear Pro',
    avatar: '🎮',
    verified: true,
    lastMessage: 'Your keyboard is on the way! Let me know if you have any questions.',
    timestamp: 'Yesterday',
    unread: 0,
    online: true,
    orderRef: 'BC-65821',
  },
  {
    id: 4,
    name: 'Tea Masters',
    avatar: '🍵',
    verified: false,
    lastMessage: 'Thank you for your order! Hope you enjoy the tea collection.',
    timestamp: '3 days ago',
    unread: 0,
    online: false,
    orderRef: 'BC-42156',
  },
];

const MESSAGES = [
  {
    id: 1,
    sender: 'seller',
    text: "Hello! Thank you for your order. I noticed you ordered the Pro X3 earbuds. Great choice! 🎧",
    timestamp: '10:15 AM',
    status: 'read',
  },
  {
    id: 2,
    sender: 'buyer',
    text: "Hi! Yes, I'm excited about them. When can I expect shipping?",
    timestamp: '10:18 AM',
    status: 'read',
  },
  {
    id: 3,
    sender: 'seller',
    text: "I'll be shipping your order today! You'll receive the tracking number within 2 hours after dispatch.",
    timestamp: '10:20 AM',
    status: 'read',
  },
  {
    id: 4,
    sender: 'buyer',
    text: 'Perfect! Also, do you have any compatible cases for these earbuds?',
    timestamp: '10:22 AM',
    status: 'read',
  },
  {
    id: 5,
    sender: 'seller',
    text: "Yes! We have a premium silicone case that fits perfectly. It's ¥29 and comes in 5 colors. Would you like me to add it to your order? I can still include it before shipping.",
    timestamp: '10:25 AM',
    status: 'read',
  },
  {
    id: 6,
    sender: 'buyer',
    text: "That sounds great! I'll take the black one please.",
    timestamp: '10:28 AM',
    status: 'delivered',
  },
  {
    id: 7,
    sender: 'seller',
    text: "Great! I'll ship your order today. You should receive tracking info within 2 hours.",
    timestamp: '10:30 AM',
    status: 'delivered',
  },
];

const QUICK_REPLIES = [
  "What's the tracking number?",
  "When will it ship?",
  "Can I modify my order?",
  "Is this item in stock?",
];

export default function MessagesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = CONVERSATIONS.find(c => c.id === selectedConversation);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add message logic here
    setMessage('');
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    setShowMobileChat(true);
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Messages', href: `/${locale}/messages` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="h-[calc(100vh-180px)] flex">
        
        {/* ===== CONVERSATION LIST ===== */}
        <div className={`w-full md:w-96 border-r border-border flex flex-col bg-ink-900 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-ink-850 border border-border rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-panda-500/50"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all ${
                  selectedConversation === conv.id 
                    ? 'bg-panda-500/10 border-l-2 border-l-panda-500' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{conv.avatar}</span>
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-jade-500 rounded-full border-2 border-onyx-950" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-white font-medium truncate">{conv.name}</span>
                        {conv.verified && <BadgeCheck className="h-4 w-4 text-jade-400" />}
                      </div>
                      <span className="text-xs text-slate-500">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                    {conv.orderRef && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-panda-400 bg-panda-500/10 px-2 py-0.5 rounded-full">
                        <ShoppingBag className="h-3 w-3" />
                        {conv.orderRef}
                      </span>
                    )}
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-panda-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{conv.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CHAT AREA ===== */}
        <div className={`flex-1 flex flex-col bg-onyx-900/30 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-xl">{selectedChat.avatar}</span>
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-jade-500 rounded-full border-2 border-onyx-900" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-medium">{selectedChat.name}</span>
                      {selectedChat.verified && <BadgeCheck className="h-4 w-4 text-jade-400" />}
                    </div>
                    <span className="text-xs text-slate-500">
                      {selectedChat.online ? 'Online' : 'Last seen recently'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Order Reference Banner */}
                {selectedChat.orderRef && (
                  <div className="bg-panda-500/10 border border-panda-500/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-panda-400" />
                      <span className="text-sm text-panda-300">Discussing Order: <strong>{selectedChat.orderRef}</strong></span>
                    </div>
                    <Link href={`/${locale}/orders/${selectedChat.orderRef}`}>
                      <Button size="sm" variant="ghost" className="text-panda-400 text-xs">
                        View Order
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Messages */}
                {MESSAGES.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === 'buyer' ? 'order-2' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.sender === 'buyer'
                          ? 'bg-panda-500 text-white rounded-br-sm'
                          : 'bg-white/10 text-white rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'buyer' ? 'justify-end' : ''}`}>
                        <span className="text-xs text-slate-500">{msg.timestamp}</span>
                        {msg.sender === 'buyer' && (
                          msg.status === 'read' 
                            ? <CheckCheck className="h-3 w-3 text-sky-400" />
                            : <Check className="h-3 w-3 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-white/10 flex gap-2 overflow-x-auto">
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(reply)}
                    className="flex-shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
                <button className="flex-shrink-0 px-3 py-1.5 bg-panda-500/10 border border-panda-500/30 rounded-full text-xs text-panda-400 hover:bg-panda-500/20 transition-colors flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Suggest
                </button>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-end gap-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Image className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-panda-500/50 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-panda-500 hover:bg-panda-600 h-11 w-11 p-0"
                    disabled={!message.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-12 w-12 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Select a conversation</h2>
                <p className="text-slate-400">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </BuyerShell>
  );
}
