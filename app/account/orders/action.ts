'use server'
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/firebase/server"

const prisma = new PrismaClient();

export async function getOrders() {
    try {
        // 1. 서버가 직접 만든 '세션 쿠키'를 읽음
        const sessionCookie = (await cookies()).get('session')?.value || ''
        if (!sessionCookie) {
            throw new Error('Not authenticated: No session cookie found.');
        }
        //console.log("✅ 1단계 성공: 세션 쿠키를 찾았습니다.");
        // 2. ID 토큰 검증 대신 '세션 쿠키'를 검증하여 사용자 정보를 얻습니다.
        // checkRevoked: true 옵션은 사용자의 세션이 서버에서 무효화되었는지 확인합니다.  
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        const firebaseUID = decodedToken.uid;

        // 3. Prisma로 데이터베이스 조회 
        const userWithOrders = await prisma.user.findUnique({
            where: { firebaseUID: firebaseUID },
            include: {
                orders: {
                    include: {
                        payment: true,
                        items: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!userWithOrders) {
            // 유저 자체가 없는 경우
            return {
                success: false,
                error: 'No user found. Please log in or register.'
            };
        }
        // 4. 주문 목록 반환
        return {
            success: true,
            orders: JSON.parse(JSON.stringify(userWithOrders.orders))
        };
    } catch (error: any) {
        console.error('Failed to get orders:', error?.message ?? error);
        // 인증 오류와 일반 오류를 구분하여 메시지 반환
        const errorMessage = error.code?.startsWith('auth/')
            ? 'Authentication failed. Please log in again.'
            : error.message;
        return { success: false, error: errorMessage };
    }
}
