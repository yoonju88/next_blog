'use client'

import { useCart } from '@/context/cart-context';
import Image from 'next/image'
import Link from 'next/link'
import imageUrlFormatter from '@/lib/imageUrlFormatter';


export const CartList = () => {
    const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="p-10">
                <h2 className="text-2xl font-semibold mb-4">The cart is empty 🛒</h2>
                <Link href="/">
                    <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Go to Products</button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        <Image
                            src={imageUrlFormatter(item.property.images[0])}
                            alt={item.property.name}
                            width={100}
                            height={100}
                            className="rounded object-cover"
                        />

                        <div className="flex-1">
                            <h3 className="text-xl font-medium">{item.property.name}</h3>
                            <p className="text-muted-foreground">{item.property.brand}</p>
                            <p className="mt-1">{item.property.price.toLocaleString()}원</p>
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
            <div className="mt-10 border-t pt-6">
                <p className="text-lg">총 수량: <strong>{totalItems}</strong> 개</p>
                <p className="text-lg">총 금액: <strong>{totalPrice.toLocaleString()}원</strong></p>
                <div className="flex gap-4 mt-6">
                    <button onClick={clearCart} className="px-6 py-2 bg-destructive text-white rounded-lg">전체 비우기</button>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg">결제하기</button>
                </div>
            </div>
        </div>
    );
};