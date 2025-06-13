'use client'

import { useCart } from '@/context/cart-context';
import Image from 'next/image'
import Link from 'next/link'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import PaymentButton from './payment-button';


export const CartList = () => {
    const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    if (cartItems.length === 0) {
        return (
            <div className="p-10">
                <h2 className="text-2xl font-semibold mb-4">The cart is empty 🛒</h2>
                <Link href="/property">
                    <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Go to Products</button>
                </Link>
            </div>
        )
    }
    return (
        <div className="w-full max-w-3xl mx-auto mt-20">
            <ul className="flex w-full gap-4">
                {cartItems.map(item => (
                    <li key={item.id} className="flex">
                        <Image
                            src={imageUrlFormatter(item.property.images[0])}
                            alt={item.property.name}
                            width={100}
                            height={100}
                            className="rounded object-cover"
                        />
                        <div className="flex flex-1 justify-between">
                            <div className="p-2">
                                <h3 className="text-lg font-medium">{item.property.name}</h3>
                                <p className="text-muted-foreground text-sm">{item.property.brand}</p>
                                <p className="mt-1">{item.property.price.toLocaleString()}€</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <button onClick={() => updateQuantity(item.property.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.property.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                                <button onClick={() => removeFromCart(item.property.id)} className="ml-4 text-red-500">삭제</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-10 border-t pt-6 ">
                <p className="text-lg">Total Items:  <strong>{totalItems}</strong></p>
                <p className="text-lg">Total Price: <strong>{totalPrice.toLocaleString()}€</strong></p>
                <div className="flex gap-4 mt-6">
                    <button onClick={clearCart} className="px-6 py-2 bg-destructive text-white rounded-lg">Clear Cart</button>
                    <PaymentButton />
                </div>
            </div>
        </div>
    );
};