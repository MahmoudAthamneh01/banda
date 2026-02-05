'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    PackageSearch,
    FileText,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@bandachao/ui';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const { logout } = useAuth();

    const toggle = () => setIsOpen(!isOpen);

    const navItems = [
        { label: 'Overview', href: '/en/cockpit', icon: LayoutDashboard },
        { label: 'Import', href: '/en/cockpit/import', icon: PackageSearch },
        { label: 'RFQ Manager', href: '/en/cockpit/rfq', icon: FileText },
        { label: 'Settings', href: '/en/cockpit/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={toggle}>
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            <motion.aside
                initial={{ width: isOpen ? 240 : 80 }}
                animate={{ width: isOpen ? 240 : 80 }}
                className={cn(
                    "fixed left-0 top-0 h-screen bg-slate-900 text-slate-100 flex flex-col z-40 transition-all duration-300 border-r border-slate-800",
                    "hidden md:flex"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-bold text-xl tracking-wider text-emerald-400"
                            >
                                BANDA
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <button onClick={toggle} className="p-1 hover:bg-slate-800 rounded transition">
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="block">
                                <div className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg transition-colors relative group",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                                )}>
                                    <item.icon size={22} className={cn(isActive && "text-emerald-400")} />
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-medium text-sm"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {/* Hover indicator for collapsed state */}
                                    {!isOpen && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 p-3 w-full rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={22} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
