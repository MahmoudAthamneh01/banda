'use client';

import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 md:ml-[80px] lg:ml-[80px] transition-all duration-300">
                <div className="h-full w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
