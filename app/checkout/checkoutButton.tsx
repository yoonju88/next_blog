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
    onPaymentSuccessAction?: () => void;
}

export default function CheckoutButton({
    couponCode,
    discount,
    pointsUsed,
    onPaymentSuccessAction,
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false)
    const { cartItems } = useCart()


    const onCheckoutClick = async () => {
        setLoading(true)
        if (cartItems.length === 0) {
            toast.error("Your cart is empty")
            return
        }

        const cartItemsForPayment = cartItems.map(item => ({
            productId: item.productId || item.property?.id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            images: item.images
        }));

        const invalidItems = cartItemsForPayment.filter(item => !item.productId);
        if (invalidItems.length > 0) {
            toast.error("Some items in your cart are missing product information");
            console.error("Invalid cart items:", invalidItems);
            setLoading(false);
            return;
        }

        try {
            await handleCheckout(cartItemsForPayment, couponCode, discount, pointsUsed)
            if (onPaymentSuccessAction) {
                onPaymentSuccessAction()
            }
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
