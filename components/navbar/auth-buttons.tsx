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
    const auth = useAuth();
    //두 번의 부정(!)을 통해 값을 명시적으로 boolean으로 변환
    //값이 존재한다면 true, 값이 없으면 false.
    const user = auth.currentUser
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
                            <AvatarFallback className="text-sky-950">
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
                            <Link href="/reviews" >
                                My reviews
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account/my-favourites" >
                                My Favourites
                            </Link>
                        </DropdownMenuItem>
                        {!!auth.customClaims?.admin && (
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
                                await auth.logout()
                                router.refresh()
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
                            <div className="text-foreground/70 hover:text-primary transition-all duration-300">
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