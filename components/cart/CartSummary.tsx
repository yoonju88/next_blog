import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function CartSummary({ totalPrice }: { totalPrice: number }) {

    return (
        <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>€{totalPrice.toLocaleString()}</span>
            </div>
            <div className="pt-4 mb-4">
                <Button asChild className="w-full">
                    <Link href="/checkout">Proceed to Payment</Link>
                </Button>
            </div>
        </div>
    )
}
