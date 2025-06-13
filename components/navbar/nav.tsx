'use client'

import Link from 'next/link'
import { DarkModeSwatch } from './DarkModeSwatch'
import AuthButtons from './auth-buttons'
import { usePathname, useSearchParams } from 'next/navigation'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import SearchButtonWithModal from './searchButtonWithModal'

export default function Nav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isActive = (href: string, query?: { key: string; value: string }): boolean => {
        if (href === '/') {
            return pathname === '/';
        }

        if (query) {
            return pathname === href && searchParams.get(query.key) === query.value;
        }

        return pathname === href;
    };

    const navLinkClass = (href: string, query?: { key: string; value: string }) =>
        cn(
            "relative inline-block uppercase text-sm text-foreground hover:text-primary transition-all duration-300 px-1 py-1",
            "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:origin-center after:transition-transform after:duration-300",
            isActive(href, query) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
        )

    return (
        <header className="p-8">
            <div className="flex items-center justify-between">
                <h1 className='text-2xl text-primary font-bold'>
                    <Link href="/">
                        CosCorée
                    </Link>
                </h1>
                <nav className="flex-1 flex justify-center">
                    <div className="flex gap-4 text-md items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className={cn(
                                    "relative inline-block uppercase text-sm text-foreground hover:text-primary transition-all duration-300 px-1 py-1",
                                    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:origin-center after:transition-transform after:duration-300",
                                    pathname === "/property" && !searchParams.toString() ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                                )}>
                                    Shop
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href="/property">All Products</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/property?category=skincare">Skincare</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/property?category=makeup">Makeup</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/property?category=haircare">Haircare</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link
                            href='/property?sort=newest'
                            className={navLinkClass("/property", { key: "sort", value: "newest" })}
                        >
                            New Arrivals
                        </Link>
                        <Link
                            href='/property?sort=best'
                            className={navLinkClass("/property", { key: "sort", value: "best" })}
                        >
                            Best Sellers
                        </Link>
                        <Link
                            href='/property?sale=true'
                            className={navLinkClass("/property", { key: "sale", value: "true" })}
                        >
                            Sale
                        </Link>
                    </div>
                </nav>
                <div className="flex space-x-3 items-center">
                    <SearchButtonWithModal />
                    <Link
                        href='/my-favourites'
                        className="text-foreground hover:text-primary transition-all duration-300"
                    >
                        <HeartIcon className="w-5 h-5" />
                    </Link>
                    <Link
                        href='/cart'
                        className="text-foreground hover:text-primary transition-all duration-300"
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                    </Link>
                    <span className="border-x-1 px-4 border-muted-foreground/30">
                        <DarkModeSwatch />
                    </span>
                    <AuthButtons />
                </div>
            </div>
        </header>
    )
}
