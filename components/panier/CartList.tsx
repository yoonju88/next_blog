'use client'

import Image from 'next/image'
import imageUrlFormatter from '@/lib/imageUrlFormatter';

interface CartItemType {
    id: string;
    quantity: number;
    property: {
        id: string;
        name: string;
        price: number;
        images: string[]
        brand: string;
    }
}
interface CheckoutCartListProps {
    cartItems: CartItemType[]
}

export const CheckoutCartList = ({ cartItems }: CheckoutCartListProps) => {

    return (
        <ul className="flex flex-col w-full gap-4">
            {cartItems.map(item => (
                <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-gray-200 py-3">
                    <div className="relative w-15 h-15">
                        <Image
                            src={imageUrlFormatter(item.property.images[0])}
                            alt={item.property.name}
                            fill
                            className="rounded object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-semibold">{item.property.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.quantity} × €{item.property.price.toLocaleString()}
                        </p>
                    </div>
                    <p className="font-bold">
                        €{(item.property.price * item.quantity).toLocaleString()}
                    </p>
                </li>
            ))}
        </ul>
    );
};