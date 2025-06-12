'use client'

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import { Property } from '@/types/property'
import { CartItem, CartContextType } from '@/types/cart'


const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const addToCart = (property: Property) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.property.id === property.id)
            if (existing) {
                return prev.map(item =>
                    item.property.id === property.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { id: property.id, property, quantity: 1 }]
        })
    }

    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) {
            const parsed = JSON.parse(stored) as CartItem[];
            const now = Date.now();
            const filtered = parsed.filter(item => {
                const created = new Date(item.createdAt).getTime();
                return now - created < 24 * 60 * 60 * 1000; // 24시간 미만인 것만
            });
            setCartItems(filtered);
        }
    }, []);

    useEffect(() => {
        const itemsWithTimestamp = cartItems.map(item => ({
            ...item,
            createdAt: item.createdAt || new Date().toISOString(),
        }));
        localStorage.setItem('cart', JSON.stringify(itemsWithTimestamp));
    }, [cartItems]);

    const removeFromCart = (propertyId: string) => {
        setCartItems(prev => prev.filter(item => item.property.id !== propertyId))
    }

    const updateQuantity = (propertyId: string, quantity: number) => {
        if (quantity <= 0) return
        setCartItems(prev =>
            prev.map(item =>
                item.property.id === propertyId
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const totalItems = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    const totalPrice = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                const price = item.property.price || 0; // price가 Property에 있어야 함
                return sum + price * item.quantity;
            }, 0),
        [cartItems]
    );

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
} 