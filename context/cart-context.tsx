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
    // 이 값이 변경되면 장바구니 데이터 로딩을 강제합니다.
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // 1. useEffect 훅이 user와 refreshTrigger의 변경을 감지하고, 그에 따라 loadCartItems를 호출합니다.
    useEffect(() => {
        const loadCartItems = async () => {
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid)
                    const userDoc = await getDoc(userRef)
                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        setCartItems(userData.cart || [])
                    } else {
                        setCartItems([])
                    }
                } catch (error) {
                    console.error("Error loading cart items:", error);
                    setCartItems([]);
                }
            } else {
                // 2. user가 없으면 무한 호출 대신, 장바구니를 그냥 비웁니다.
                setCartItems([])
            }
        }

        loadCartItems()
    }, [user, refreshTrigger])

    //장바구니 갱신을 강제하는 함수
    const refreshCart = useCallback(() => {
        setRefreshTrigger(prev => prev + 1)
        console.log("Cart refresh trigger updated.");
    }, [])

    const addToCart = async (property: Property, quantityInput?: number) => {
        const quantity = !quantityInput || isNaN(quantityInput) || quantityInput < 1 ? 1 : quantityInput;

        const newItem = {
            id: property.id,
            property,
            quantity,
            name: property.name,
            price: property.price,
            images: property.images || [],  // images 배열도 함께 저장합니다.
            createdAt: new Date().toISOString()

        }
        // 1. 로컬 상태에 추가
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
        // 2. 파이어스토어 유저 데이터에 저장
        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userData = userDoc.data()
                const existingItemIndex = userData.cart?.findIndex((item: any) => item.productId === property.id)
                if (existingItemIndex > -1) {
                    const updatedCart = [...userData.cart];
                    updatedCart[existingItemIndex].quantity += quantity;
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
    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        if (!userId) {
            setPoints(0);
            return;
        }

        const fetchPoints = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setPoints(typeof data.points === "number" ? data.points : 0);
                } else {
                    setPoints(0);
                }
            } catch (error) {
                console.error("Error fetching user points:", error);
                setPoints(0);
            }
        };

        fetchPoints();
    }, [userId]);

    return points;
}