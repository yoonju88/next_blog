import { Payment } from "./payment"
import { Address } from "./user"

// 간소화된 User 정보 (주문에서 사용)
export type OrderUser = {
    name: string | null;
    email: string;
    firebaseUID?: string;
    address: Address;
}

export type Order = {
    id: string
    totalAmount: number
    status: string
    createdAt: string
    payment: Payment | null
    items: OrderItem[]
    user: OrderUser
    earnedPoints?: number;
}

export type OrderItem = {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
}


// Admin용 통계 데이터
export type OrderStatistics = {
    totalOrders: number;
    totalAmount: number;
    totalItems: number;
}

// API 응답 타입
export type GetOrdersResponse = {
    success: boolean;
    orders?: Order[];
    totalAmount?: number;
    totalItems?: number;
    totalOrders?: number;
    count?: number;
    error?: string;
}