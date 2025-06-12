import { Property } from './property'

export type CartItem = {
    id: string;
    property: Property
    quantity: number
    createdAt?: string;
}

export type CartContextType = {
    cartItems: CartItem[]
    addToCart: (property: Property) => void
    removeFromCart: (propertyId: string) => void
    updateQuantity: (propertyId: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
} 