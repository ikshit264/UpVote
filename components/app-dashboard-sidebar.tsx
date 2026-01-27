'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    ChevronLeft,
    Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import AnimatedLogo from '@/components/animated-logo';

interface Company {
    id: string;
    name: string;
    email: string;
}

interface Application {
    id: string;
    name: string;
}

export default function AppDashboardSidebar({
    company,
    application
}: {
    company: Company;
    application: Application;
}) {
    const pathname = usePathname();
    const appId = application.id;

    const navItems = [
        { name: 'Analytics', href: `/dashboard/${appId}/analytics`, icon: LayoutDashboard },
        { name: 'Feedback', href: `/dashboard/${appId}/feedback`, icon: MessageSquare },
        { name: 'Users', href: `/dashboard/${appId}/users`, icon: Users },
        { name: 'Settings', href: `/dashboard/${appId}/settings`, icon: Settings },
    ];

    return (
        <div className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-2.5 font-black text-xl italic text-zinc-900 dark:text-white uppercase tracking-tighter">
                    <AnimatedLogo size="xs" />
                    UpVote
                </div>
            </div>

            {/* Application Context */}
            <div className="px-4 mb-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all group"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>All Applications</span>
                </Link>
                <div className="mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-indigo-600" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100 truncate">
                                {application.name}
                            </p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">
                                Current App
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                                {item.name}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
                <div className="mb-4 px-3">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest truncate">{company.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{company.email}</p>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
