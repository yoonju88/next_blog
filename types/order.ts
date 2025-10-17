import { Payment } from "./payment"

export type Order = {
    id: string
    totalAmount: number
    status: string
    createdAt: string
    payment: Payment | null
    items: OrderItem[]
}

export type OrderItem = {
    id: string
    productName: string
    price: number;
    quantity: number;
}