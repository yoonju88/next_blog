export type Payment = {
    id: string;
    status: string;
    amount: number;
    provider?: string | null;
    pointsUsed?: number;
    couponCode?: string | null;
    createdAt: string;
}
