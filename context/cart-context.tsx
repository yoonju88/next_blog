'use client'

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import { Property } from '@/types/property'
import { CartItem, CartContextType } from '@/types/cart'
import { useAuth } from './auth'
import { db } from '@/firebase/client'
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore'

const CartContext = createContext<CartContextType | undefined>(undefined)


export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const loadCartItems = async () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid)
                const userDoc = await getDoc(userRef)
                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    setCartItems(userData.cart || [])
                }
            }
        }
        loadCartItems()
    }, [user])

    const addToCart = async (property: Property, quantity: number) => {
        const newItem = {
            id: property.id,
            property,
            quantity,
            createdAt: new Date().toISOString()
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.property.id === property.id)
            if (existing) {
                return prev.map(item =>
                    item.property.id === property.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, newItem]
        })

        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userData = userDoc.data()
                const existingItem = userData.cart?.find((item: CartItem) => item.property.id === property.id)
                
                if (existingItem) {
                    const updatedCart = userData.cart.map((item: CartItem) =>
                        item.property.id === property.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                    await setDoc(userRef, { cart: updatedCart }, { merge: true })
                } else {
                    await updateDoc(userRef, {
                        cart: arrayUnion(newItem)
                    })
                }
            }
        }
    }

    const removeFromCart = async (propertyId: string) => {
        setCartItems(prev => prev.filter(item => item.property.id !== propertyId))

        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userData = userDoc.data()
                const itemToRemove = userData.cart.find((item: CartItem) => item.property.id === propertyId)
                if (itemToRemove) {
                    await updateDoc(userRef, {
                        cart: arrayRemove(itemToRemove)
                    })
                }
            }
        }
    }

    const updateQuantity = async (propertyId: string, quantity: number) => {
        if (quantity <= 0) return
        setCartItems(prev =>
            prev.map(item =>
                item.property.id === propertyId
                    ? { ...item, quantity }
                    : item
            )
        )

        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userData = userDoc.data()
                const updatedCart = userData.cart.map((item: CartItem) =>
                    item.property.id === propertyId
                        ? { ...item, quantity }
                        : item
                )
                await setDoc(userRef, { cart: updatedCart }, { merge: true })
            }
        }
    }

    const clearCart = async () => {
        setCartItems([])
        if (user) {
            const userRef = doc(db, 'users', user.uid)
            await setDoc(userRef, { cart: [] }, { merge: true })
        }
    }

    const totalItems = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    )

    const totalPrice = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                const price = item.property.price || 0
                return sum + price * item.quantity
            }, 0),
        [cartItems]
    )

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    }

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