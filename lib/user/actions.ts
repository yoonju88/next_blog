'use server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface UserData {
    firebaseUID: string
    email: string
    name: string
    points: number;
}

/**
 * Firebase UID를 기반으로 Prisma 데이터베이스에서 사용자를 찾거나 생성합니다 (Upsert).
 * @param userData - Firebase에서 받은 사용자 정보
 */

export async function findOrderUser(userData: UserData) {
    try {
        const user = await prisma.user.upsert({
            where: {
                firebaseUID: userData.firebaseUID,
            },
            update: {
                name: userData.name,
                email: userData.email,
            },
            create: {
                firebaseUID: userData.firebaseUID,
                email: userData.email,
                name: userData.name,
                points: userData.points ?? 0,
            }
        })
        console.log("✅ Prisma: User found or created successfully:", user.email);
        return { success: true, user };
    } catch (error: any) {
        console.error("❌ Prisma: Failed to find or create user:", error.message);
        return { success: false, error: error.message };
    }
}