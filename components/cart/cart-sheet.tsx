'use client'
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth";
import CartItem from "./CartItem"
import CartSummary from "./CartSummary";

type Props = {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChangeAction }: Props) {
    const { user } = useAuth();
    const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, refreshCart } = useCart();
    const [loading, setLoading] = useState(false);

    if (user === undefined) return <div>Loading...</div>
    if (!user) return <Link href="/login"><ShoppingCart className="h-5 w-5" /></Link>


    return (
        <Sheet open={open} onOpenChange={onOpenChangeAction}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="px-4 flex flex-col overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-lg">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-3 flex flex-col h-full">
                                {cartItems.map((item, i) => (
                                    <CartItem
                                        key={`${item.id}-${i}`}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <CartSummary totalPrice={totalPrice} />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

