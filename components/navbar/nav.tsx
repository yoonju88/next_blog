'use client'

import Link from 'next/link'
import { DarkModeSwatch } from './DarkModeSwatch'
import AuthButtons from './auth-buttons'
import { usePathname } from 'next/navigation'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'


export default function Nav() {
    const pathname = usePathname() // Current page path

    //check if the given link is the active page
    const isActive = (href: string): boolean => {
        if (href === '/') {
            return pathname === '/';
        }
        // pathname이 href로 시작하는지 확인 (서브 경로도 포함)
        return pathname.startsWith(href);
    };

    return (
        <header className="p-8 flex items-center justify-between">
            <h1 className='text-2xl text-primary font-bold'>
                <Link href="/">
                    CosCorée
                </Link>
            </h1>
            <nav className="flex space-x-6">
                <div className="flex gap-6 text-md items-center">
                    <Link
                        href='/my-favourites'
                    >
                        <HeartIcon />
                    </Link>
                    <Link
                        href='/cart'
                    >
                        <ShoppingCartIcon />
                    </Link>

                </div>
                <div className="flex space-x-6 items-center">
                    <span className="border-x-1 px-4 border-muted-foreground/30">
                        <DarkModeSwatch />
                    </span>
                    <AuthButtons />
                </div>
            </nav>
        </header >
    )
}
