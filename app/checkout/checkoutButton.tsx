'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleCheckout } from "@/lib/checkout";
import { useCart } from '@/context/cart-context';
import { toast } from "sonner"

interface CheckoutButtonProps {
    couponCode?: string;
    discount?: number;
    pointsUsed?: number;
}

export default function CheckoutButton({
    couponCode,
    discount,
    pointsUsed
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false)
    const { cartItems } = useCart()


    const onCheckoutClick = async () => {
        setLoading(true)
        if (cartItems.length === 0) {
            toast.error("Your cart is empty")
            return
        }
        try {
            await handleCheckout(cartItems, couponCode, discount, pointsUsed)
        } catch (err: any) {
            console.error("Checkout error:", err)
            toast.error("Payment Failed", {
                description: err.message || "An unknown error occurred.",
            });
            setLoading(false) // 에러 시에만 로딩 해제
        }
    }

    return (
        <Button
            onClick={onCheckoutClick}
            disabled={loading || cartItems.length === 0}
            variant='default'
        >
            {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
    )
}
