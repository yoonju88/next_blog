"use server"
import { auth, firestore } from "@/firebase/server"
import { cookies } from "next/headers"
import { prisma } from '@/lib/prisma';

export const deleteUserFavourites = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if (!token) { return }
    const decodedToken = await auth.verifyIdToken(token)
    await firestore.collection("favourites").doc(decodedToken.uid).delete()
}

// 포인트 적립
export async function addUserPoints(userId: string, points: number) {
    return prisma.user.update({
        where: { id: userId },
        data: { points: { increment: points } },
    });
}

// 포인트 차감
export async function usedUserPoints(userId: string, points: number) {
    return prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: points } },
    });
}

// 유저 조회
export async function getUserPoints(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, points: true, name: true },
    });
}