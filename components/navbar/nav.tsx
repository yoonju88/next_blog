'use client'

import Link from 'next/link'
import { DarkModeSwatch } from './DarkModeSwatch'
import AuthButtons from './auth-buttons'
import { usePathname, useSearchParams } from 'next/navigation'
import { HeartIcon } from 'lucide-react'
import {
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenu,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils'
import SearchButtonWithModal from './searchButtonWithModal'
import CartSheet from '../cart/cart-sheet'
import { useState } from 'react'
import ListItem from './ListItem'
import Image from 'next/image'
import { ImageDataType } from '@/types/image'

interface NavProps {
    // ✅ Prop의 이름과 구조가 { menuImage: ... } 형태와 일치해야 합니다.
    menuImage: ImageDataType | null;
}

export default function Nav({ menuImage }: NavProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)


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
            "relative inline-block lg:uppercase lg:text-sm text-[12px] text-foreground hover:text-primary transition-all duration-300 px-0.5 py-1",
            "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:origin-center after:transition-transform after:duration-300",
            isActive(href, query) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
        )

    return (
        <header className="p-8">
            <div className="flex items-center justify-between lg:flex-row flex-col gap-6">
                <h1 className='text-3xl text-foreground font-bold'>
                    <Link href="/">
                        CosCorée
                    </Link>
                </h1>
                <nav className="flex-1 flex justify-center">
                    <div className="flex gap-4 text-md items-center">
                        <NavigationMenu >
                            <NavigationMenuList className="flex items-center gap-4">
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="uppercase text-sm">
                                        <span className={cn(
                                            "relative inline-block lg:uppercase lg:text-sm text-[12px] text-foreground hover:text-primary transition-all duration-300 px-1 py-1",
                                            "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:origin-center after:transition-transform after:duration-300",
                                            pathname === "/property" && !searchParams.toString() ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                                        )}>Shop</span>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent >
                                        <ul className="grid gap-2 w-full lg:w-[600px] lg:grid-cols-[.75fr_1fr] grid-cols-[.55fr_1fr] mx-auto">
                                            {/* 왼쪽 이미지 + 설명 */}
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/property"
                                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-4 no-underline outline-none focus:shadow-md select-none"
                                                    >
                                                        <div className="relative w-full h-30">
                                                            {menuImage && menuImage.url ? (
                                                                <Image
                                                                    src={menuImage.url}
                                                                    alt={menuImage.alt}
                                                                    fill
                                                                    className="object-cover absolute rounded-md"
                                                                />
                                                            ) : (
                                                                // 데이터가 없을 때 표시할 대체 UI (정적 이미지 또는 텍스트)
                                                                <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md text-gray-500">
                                                                    Menu Image Not Set
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mb-1 text-lg font-medium">All Products</div>
                                                        <p className="text-muted-foreground text-[12px] leading-tight">
                                                            Browse our full range of skincare, makeup, and sun care products.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            {/* 오른쪽 카테고리 리스트 */}
                                            <ListItem href="/property?category=skincare" title="Skin Care">
                                                Hydrating creams, cleansers, serums & more.
                                            </ListItem>
                                            <ListItem href="/property?category=makeup" title="Make Up">
                                                Foundations, lipsticks, palettes, and more.
                                            </ListItem>
                                            <ListItem href="/property?category=suncare" title="Sun Care">
                                                Sunblocks and after-sun products.
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
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
                            On Sale
                        </Link>
                    </div>
                </nav>
                <div className="flex space-x-3 items-center">
                    <SearchButtonWithModal />
                    <Link
                        href='/account/my-favourites'
                        className="text-foreground hover:text-primary transition-all duration-300"
                    >
                        <HeartIcon className="w-5 h-5" />
                    </Link>
                    <CartSheet open={open} onOpenChangeAction={setOpen} />
                    <span className="border-x-1 px-4 border-muted-foreground/30">
                        <DarkModeSwatch />
                    </span>
                    <AuthButtons />
                </div>
            </div>
        </header>
    )
}
