export interface Coupon {
    id: string;
    code: string;
    discount: number;
    description: string;
    type: 'fixed' | 'percentage';
    minAmount?: number;
    maxDiscount?: number;
    usageLimit: number;
    usedCount: number;
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCouponData {
    code: string;
    discount: number;
    description: string;
    type: 'fixed' | 'percentage';
    minAmount?: number;
    maxDiscount?: number;
    usageLimit: number;
    validFrom: Date;
    validUntil: Date;
}

export interface UpdateCouponData {
    code?: string;
    discount?: number;
    description?: string;
    type?: 'fixed' | 'percentage';
    minAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    validFrom?: Date;
    validUntil?: Date;
    isActive?: boolean;
} 