import { Property } from './property'

export type CartItem = {
    id: string;
    productId: string;
    property: Property;
    name: string;
    price: number;
    images?: string[];
    quantity: number;
    createdAt?: string;
}

export type CartContextType = {
    cartItems: CartItem[]
    addToCart: (property: Property, quantity: number) => void
    removeFromCart: (propertyId: string) => void
    updateQuantity: (propertyId: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    refreshCart: () => void
} 