'use client';

import { Bell, Wallet } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@bandachao/ui';
import { motion } from 'framer-motion';

export function Header({ title }: { title: string }) {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between p-8 pb-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 text-sm mt-1">Sovereign Maker Space</p>
            </motion.div>

            <div className="flex items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm"
                >
                    <Wallet size={16} />
                    <span className="font-mono font-bold">¥ 24,500.00</span>
                </motion.div>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Button>

                <div className="w-10 h-10 rounded-full bg-slate-900 text-slate-100 flex items-center justify-center font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
