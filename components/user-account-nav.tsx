'use client'

import { signOut, useSession } from 'next-auth/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, LayoutDashboard, User } from 'lucide-react'
import Link from 'next/link'

export function UserAccountNav({
    align = 'end',
    side = 'bottom'
}: {
    align?: 'start' | 'center' | 'end',
    side?: 'top' | 'right' | 'bottom' | 'left'
}) {
    const { data: session } = useSession()
    const user = session?.user

    if (!user) return null

    const initials = user.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : user.email?.charAt(0).toUpperCase() || 'U'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:outline-none">
                <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-blue-500/20 transition-all cursor-pointer">
                    <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                side={side}
                className="w-56 p-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl"
            >
                <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-100">{user.name}</p>
                        <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400 truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem asChild className="rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-800 transition-colors cursor-pointer my-1">
                    <Link href="/dashboard" className="flex items-center w-full px-2 py-1.5">
                        <LayoutDashboard className="mr-2.5 h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem
                    className="rounded-lg focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer my-1 px-2 py-1.5"
                    onSelect={(event) => {
                        event.preventDefault()
                        signOut({
                            callbackUrl: `${window.location.origin}/auth/login`,
                        })
                    }}
                >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span className="text-sm font-medium">Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
