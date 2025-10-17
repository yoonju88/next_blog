'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleCheckout } from "@/lib/checkout";
import { useCart } from '@/context/cart-context';
import { toast } from "sonner"


export default function CheckoutButton() {
    const [loading, setLoading] = useState(false)
    const { cartItems } = useCart()

    const onCheckoutClick = async () => {
        setLoading(true)
        try {
            await handleCheckout(cartItems);
        } catch (err: any) {
            toast.error("Payment Failed", {
                description: err.message || "An unknown error occurred.",
            });
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
