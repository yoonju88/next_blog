'use client'
import React, { useState } from 'react'
import AddToCartButton from "@/components/cart/add-to-cart-button"
import { Input } from '@/components/ui/input'
import { Property } from "@/types/property"
import { Label } from '@radix-ui/react-dropdown-menu'

type Props = {
    item: Property
}

export default function SelectedQuantityToCart({ item }: Props) {
    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    return (
        <>
            <div >
                <Label className='text-left mb-2 pl-2 text-foreground/80'>
                    Order Quantity
                </Label>
                <Input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder='Choose your order quantity'
                />
            </div>

            <AddToCartButton
                property={item}
                quantity={quantity}
                onAddedToCartAction={() => setOpen(true)}
            >
                Add to Cart
            </AddToCartButton>
        </>
    )
}
