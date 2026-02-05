'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    MessageSquare,
    Send,
    Search,
    MoreVertical,
    Paperclip,
    Image as ImageIcon,
    Phone,
    Video,
    X,
    Check,
    CheckCheck,
    Clock,
    Factory,
    User,
} from 'lucide-react';

// Mock Conversations
const MOCK_CONVERSATIONS = [
    {
        id: 'conv1',
        participant: {
            name: 'Hangzhou Premier Tea',
            type: 'factory',
            avatar: 'HPT',
        },
        lastMessage: {
            text: 'Thank you for your investment! Production starts next week.',
            sender: 'them',
            timestamp: '2026-02-03T14:30:00',
            read: false,
        },
        unreadCount: 2,
        online: true,
    },
    {
        id: 'conv2',
        participant: {
            name: 'Support Team',
            type: 'support',
            avatar: 'ST',
        },
        lastMessage: {
            text: 'Your deposit has been processed successfully',
            sender: 'them',
            timestamp: '2026-02-03T11:00:00',
            read: true,
        },
        unreadCount: 0,
        online: true,
    },
    {
        id: 'conv3',
        participant: {
            name: 'EcoWood Industries',
            type: 'factory',
            avatar: 'EI',
        },
        lastMessage: {
            text: 'Looking forward to the next cycle!',
            sender: 'you',
            timestamp: '2026-02-02T16:45:00',
            read: true,
        },
        unreadCount: 0,
        online: false,
    },
    {
        id: 'conv4',
        participant: {
            name: 'Jingdezhen Ceramics',
            type: 'factory',
            avatar: 'JC',
        },
        lastMessage: {
            text: 'Final distribution will be processed on schedule',
            sender: 'them',
            timestamp: '2026-02-01T10:20:00',
            read: true,
        },
        unreadCount: 0,
        online: true,
    },
];

// Mock Messages for selected conversation
const MOCK_MESSAGES = [
    {
        id: 'm1',
        text: 'Hello! I have a question about the investment terms',
        sender: 'you',
        timestamp: '2026-02-03T14:00:00',
        status: 'read',
    },
    {
        id: 'm2',
        text: 'Hi! I\'d be happy to help. What would you like to know?',
        sender: 'them',
        timestamp: '2026-02-03T14:05:00',
        status: 'read',
    },
    {
        id: 'm3',
        text: 'What\'s the expected start date for production?',
        sender: 'you',
        timestamp: '2026-02-03T14:10:00',
        status: 'read',
    },
    {
        id: 'm4',
        text: 'Production is scheduled to start on February 10th. We\'ll send detailed updates as we progress through each milestone.',
        sender: 'them',
        timestamp: '2026-02-03T14:15:00',
        status: 'read',
    },
    {
        id: 'm5',
        text: 'That sounds great. Will you provide regular progress reports?',
        sender: 'you',
        timestamp: '2026-02-03T14:20:00',
        status: 'read',
    },
    {
        id: 'm6',
        text: 'Absolutely! You\'ll receive weekly progress reports and can view live updates in your portfolio dashboard.',
        sender: 'them',
        timestamp: '2026-02-03T14:25:00',
        status: 'delivered',
    },
    {
        id: 'm7',
        text: 'Thank you for your investment! Production starts next week.',
        sender: 'them',
        timestamp: '2026-02-03T14:30:00',
        status: 'delivered',
    },
];

export default function MessagesPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            const message = {
                id: `m${messages.length + 1}`,
                text: newMessage,
                sender: 'you' as const,
                timestamp: new Date().toISOString(),
                status: 'sent' as const,
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
        conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent': return <Check className="h-3 w-3 text-slate-500" />;
            case 'delivered': return <CheckCheck className="h-3 w-3 text-slate-400" />;
            case 'read': return <CheckCheck className="h-3 w-3 text-panda-400" />;
            default: return <Clock className="h-3 w-3 text-slate-500" />;
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <Card className="bg-ink-850 border-border h-[calc(100vh-12rem)]">
                <div className="flex h-full">
                    {/* Conversations List */}
                    <div className="w-80 border-r border-border flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-border">
                            <h2 className="text-xl font-bold text-slate-200 mb-3">Messages</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-panda-500"
                                />
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.map((conv, index) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`p-4 cursor-pointer border-b border-border hover:bg-ink-800/50 transition-colors ${
                                        selectedConversation.id === conv.id ? 'bg-ink-800 border-l-2 border-l-panda-500' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                                conv.participant.type === 'factory' ? 'bg-jade-500' :
                                                conv.participant.type === 'support' ? 'bg-sky-500' :
                                                'bg-panda-500'
                                            }`}>
                                                {conv.participant.avatar}
                                            </div>
                                            {conv.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-400 border-2 border-ink-800 rounded-full" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-white font-medium truncate">{conv.participant.name}</h4>
                                                <span className="text-xs text-slate-500">
                                                    {formatTime(conv.lastMessage.timestamp)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm truncate ${
                                                    conv.unreadCount > 0 ? 'text-white font-medium' : 'text-slate-400'
                                                }`}>
                                                    {conv.lastMessage.sender === 'you' && 'You: '}
                                                    {conv.lastMessage.text}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <div className="ml-2 w-5 h-5 bg-jade-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                    selectedConversation.participant.type === 'factory' ? 'bg-jade-500' :
                                    selectedConversation.participant.type === 'support' ? 'bg-sky-500' :
                                    'bg-panda-500'
                                }`}>
                                    {selectedConversation.participant.avatar}
                                </div>
                                <div>
                                    <h3 className="text-slate-200 font-medium">{selectedConversation.participant.name}</h3>
                                    <p className="text-xs text-slate-400">
                                        {selectedConversation.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${message.sender === 'you' ? 'order-2' : 'order-1'}`}>
                                        <div className={`p-3 rounded-lg ${
                                            message.sender === 'you'
                                                ? 'bg-panda-500 text-white'
                                                : 'bg-ink-800 text-slate-200'
                                        }`}>
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
                                            message.sender === 'you' ? 'justify-end' : 'justify-start'
                                        }`}>
                                            <span>{formatTime(message.timestamp)}</span>
                                            {message.sender === 'you' && getStatusIcon(message.status)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-border">
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full px-4 py-2 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    />
                                </div>
                                <Button
                                    className="bg-panda-500 hover:bg-panda-600 hover:shadow-glow-primary"
                                    onClick={handleSend}
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Press Enter to send, Shift+Enter for new line
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
