'use server'
import { PrismaClient, Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { Order, GetOrdersResponse } from "@/types/order";

const prisma = new PrismaClient();

interface GetOrdersOptions {
    status?: "completed" | "pending" | "cancelled" | "shipped";
    startDate?: string; // ISO 문자열
    endDate?: string;
}

export async function getAllOrders(options: GetOrdersOptions = {}): Promise<GetOrdersResponse> {
    const { status, startDate, endDate } = options;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (startDate || endDate) {
        where.createdAt = {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
        };
    }

    try {
        const sessionCookie = (await cookies()).get("session")?.value || "";
        if (!sessionCookie) throw new Error("Not authenticated");

        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        const firebaseUID = decodedToken.uid;

        const user = await prisma.user.findUniqueOrThrow({
            where: { firebaseUID },
            select: { id: true, name: true, isAdmin: true },
        });

        if (!user.isAdmin) throw new Error("Access denied. Admins only");

        const ordersRaw = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, firebaseUID: true } },
                payment: { select: { id: true, status: true, amount: true, provider: true, pointsUsed: true, couponCode: true, createdAt: true } },
                items: { select: { id: true, productId: true, productName: true, price: true, quantity: true, imageUrl: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // earnedPoints 계산 & Date -> ISO
        const orders: Order[] = ordersRaw.map(order => {
            const earnedPoints = order.payment ? Math.floor(order.payment.amount / 100) : 0;
            return {
                ...order,
                earnedPoints,
                createdAt: order.createdAt.toISOString(),
                payment: order.payment ? { ...order.payment, createdAt: order.payment.createdAt.toISOString() } : null
            };
        });

        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
        const totalOrders = orders.length;

        return { success: true, orders, totalAmount, totalItems, totalOrders };
    } catch (error: any) {
        console.error("Failed to get orders:", error);
        return { success: false, error: error.message };
    }
}