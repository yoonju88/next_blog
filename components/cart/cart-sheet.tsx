'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import numeral from "numeral"
import Link from "next/link"

export default function CartSheet() {
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()

    return (
        <Sheet>
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
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-4">
                        {items.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.property.id} className="flex gap-4 py-4 border-b">
                                        <div className="relative w-20 h-20">
                                            <Image
                                                src={item.property.images[0]}
                                                alt={item.property.name}
                                                fill
                                                className="object-cover rounded-md"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.property.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                €{numeral(item.property.price).format("0,0")}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.property.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.property.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => removeFromCart(item.property.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {items.length > 0 && (
                        <div className="border-t pt-4">
                            <div className="flex justify-between mb-4">
                                <span className="font-medium">Total</span>
                                <span className="font-medium">€{numeral(totalPrice).format("0,0")}</span>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/checkout">Checkout</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
} 