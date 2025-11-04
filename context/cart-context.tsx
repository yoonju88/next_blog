'use client'

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react'
import { Property } from '@/types/property'
import { CartItem, CartContextType } from '@/types/cart'
import { useAuth } from './auth'
import { db } from '@/firebase/client'
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        const loadCartItems = async () => {
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid)
                    const userDoc = await getDoc(userRef)
                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        const cart = userData.cart || []

                        // 🔹 productId 추출 (id 또는 property.id 둘 다 체크)
                        const productIds = cart
                            .map((item: any) => item.productId || item.id || item.property?.id)
                            .filter(Boolean) as string[];

                        if (productIds.length === 0) {
                            setCartItems([])
                            return
                        }

                        // 🔹 DB에서 실제 상품 정보 가져오기
                        const productsInDb = await fetch('/api/products', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ids: productIds })
                        }).then(res => res.json())

                        const productMap = new Map(productsInDb.map((p: any) => [p.id, p]))


                        // 🔹 DB에 존재하는 상품만 유지하고, productId 명시적 설정
                        const cartWithExistingProducts = cart
                            .map((item: any) => {
                                const productId = item.productId || item.id || item.property?.id
                                const product = productMap.get(productId)
                                if (!product || typeof product !== 'object' || !('id' in product)) return null

                                return {
                                    ...item,
                                    productId: (product as { id: string }).id, // 🔥 명시적으로 설정
                                    id: (product as { id: string }).id,
                                    property: {
                                        ...item.property,
                                        id: (product as { id: string }).id
                                    }
                                }
                            })
                            .filter((item: null): item is typeof item => item !== null);

                        if (cartWithExistingProducts.length !== cart.length) {
                            console.log("🔥 DB에 없는 상품 자동 제거됨")
                            await setDoc(userRef, { cart: cartWithExistingProducts }, { merge: true })
                        }

                        setCartItems(cartWithExistingProducts)
                    } else {
                        setCartItems([])
                    }
                } catch (error) {
                    console.error("Error loading cart items:", error)
                    setCartItems([])
                }
            } else {
                setCartItems([])
            }
        }
        loadCartItems()
    }, [user, refreshTrigger])

    const refreshCart = useCallback(() => {
        setRefreshTrigger(prev => prev + 1)
        console.log("Cart refresh trigger updated.")
    }, [])

    const addToCart = async (property: Property, quantityInput?: number) => {
        const quantity = !quantityInput || isNaN(quantityInput) || quantityInput < 1 ? 1 : quantityInput

        const newItem = {
            id: property.id,
            productId: property.id, // 🔥 명시적으로 추가
            property,
            quantity,
            name: property.name,
            price: property.price,
            images: property.images || [],
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
                const existingItemIndex = userData.cart?.findIndex(
                    (item: any) => (item.productId || item.id) === property.id
                )
                if (existingItemIndex > -1) {
                    const updatedCart = [...userData.cart]
                    updatedCart[existingItemIndex].quantity += quantity
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
                const itemToRemove = userData.cart.find(
                    (item: CartItem) => item.property.id === propertyId
                )
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
                const price = (item.property.onSale && item.property.salePrice)
                    ? item.property.salePrice
                    : item.property.price || 0
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
        refreshCart,
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

export function useUserPoints(userId?: string) {
    const [points, setPoints] = useState<number>(0)

    useEffect(() => {
        if (!userId) {
            setPoints(0)
            return
        }

        const fetchPoints = async () => {
            try {
                const userRef = doc(db, "users", userId)
                const userSnap = await getDoc(userRef)

                if (userSnap.exists()) {
                    const data = userSnap.data()
                    setPoints(typeof data.points === "number" ? data.points : 0)
                } else {
                    setPoints(0)
                }
            } catch (error) {
                console.error("Error fetching user points:", error)
                setPoints(0)
            }
        }

        fetchPoints()
    }, [userId])

    return points
}