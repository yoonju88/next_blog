'use client'

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Property } from "@/types/property"
import { toast } from "sonner"

import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"

type Props = {
    property: Property
    children: React.ReactNode;
    quantity?: number;
    onAddedToCartAction?: () => void
}

export default function AddToCartButton({ property, children, onAddedToCartAction, quantity }: Props) {
    const { addToCart } = useCart()
    const { user } = useAuth()
    const router = useRouter()

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Login Required", {
                description: "Please login to add items to your cart."
            })
            router.push('/login')
            return
        }

        addToCart(property, quantity)
        onAddedToCartAction?.()
        toast.success("Added to Cart", {
            description: "The item has been added to your cart."
        })

    }

    return (
        <Button onClick={handleAddToCart}>
            {children}
        </Button>
    )
} 