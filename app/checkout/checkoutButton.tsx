'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleCheckout } from "@/lib/checkout";
import { toast } from "sonner"


interface CheckoutButtonProps {
    cartItems: any[];
    couponCode?: string;
    discount?: number;
    usedPoints?: number;
}

export default function CheckoutButton({
    cartItems,
    couponCode = "",
    discount = 0,
    usedPoints = 0,
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false)

    const onCheckoutClick = async () => {
        setLoading(true)
        try {
            await handleCheckout(cartItems, couponCode, discount, usedPoints);
        } catch (err) {
            alert("payment failed")
            console.log(err)
        } finally {
            setLoading(false)
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
