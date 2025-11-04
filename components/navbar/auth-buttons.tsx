'use client'
import { useAuth } from "@/context/auth";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { CircleUserRound } from "lucide-react";


export default function AuthButtons() {
    const router = useRouter();
    const { user, loading, logout, customClaims } = useAuth();

    if (loading) {
        return (
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        );
    }

    return (
        <>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <Image
                                src={user.photoURL ? user.photoURL : "/default-avatar.jpg"}
                                alt="User avatar"
                                width={70}
                                height={70}
                            />
                            <AvatarFallback className="text-foreground">
                                {(user.displayName || user.email || "U")?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            <div> {user.displayName}</div>
                            <div className='font-normal text-xs'>
                                {user.email}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account" >
                                My Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account/orders" >
                                My orders
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/reviews" >
                                My reviews
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account/my-favourites" >
                                My Favourites
                            </Link>
                        </DropdownMenuItem>
                        {!!customClaims?.admin && (
                            <DropdownMenuItem asChild>
                                <Link href="/admin-dashboard" >
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {/* {!auth.customClaims?.admin && (
                            <DropdownMenuItem asChild>
                                <Link href="/account/my-favourites" >
                                    My Favourites
                                </Link>
                            </DropdownMenuItem>
                        )} */}
                        <DropdownMenuItem
                            onClick={async () => {
                                await logout()
                                router.push('/');
                            }}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="text-foreground hover:text-primary transition-all duration-300">
                                <CircleUserRound />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href="/login" className="scale-105 hover:text-primary  hover:font-semibold text-muted-foreground transition-all duration-500">
                                    Login
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/register" className="scale-105 hover:text-primary hover:font-semibold text-muted-foreground transition-all duration-500">
                                    Sign in
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </>
    )
}