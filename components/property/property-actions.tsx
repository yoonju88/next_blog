'use client'

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Property } from "@/types/property"
import { toast } from "sonner"
import numeral from "numeral"

type Props = {
    property: Property
}

export default function PropertyActions({ property }: Props) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart(property)
        toast.success("Added to cart", {
            description: "The item has been added to your cart."
        })
    }

    return (
        <div className="flex mt-10 mb-14">
            <span className="title-font font-medium text-2xl text-foreground hover:text-primary transition-all duration-300">
                € {numeral(property?.price).format("0,0")}
            </span>
            <div className="flex space-x-4 ml-auto">
                <Button variant="outline" className="bg-white">
                    Add to Wish List
                </Button>
                <Button onClick={handleAddToCart}>
                    Add to Cart
                </Button>
            </div>
        </div>
    )
} 