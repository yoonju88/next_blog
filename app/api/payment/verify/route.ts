import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { consumeCouponServer } from '@/lib/coupon.server'

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const prisma = new PrismaClient()


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('session_id')
        //Session ID 유효성 검사
        if (!sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID is required' },
                { status: 400 }
            );
        }
        // Stripe에서 세션 정보 조회
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        // 결제 상태 확인 및 데이터베이스 업데이트
        if (session.payment_status === 'paid') {
            // ✅ stripeSessionId로 찾기
            const payment = await prisma.payment.findUnique({
                where: { stripeSessionId: sessionId },
                include: { order: true }
            })
            if (!payment) {
                // 이미 업데이트되었거나 유효하지 않은 세션일 수 있습니다.
                return NextResponse.json(
                    { success: false, message: 'Payment record not found' },
                    { status: 404 }
                );
            }

            // 결제 성공시 쿠폰 소모
            if (payment.couponCode) {
                await consumeCouponServer(payment.couponCode)
            }

            if (payment.status === 'paid') {
                return NextResponse.json({
                    success: true,
                    message: 'Payment already verified',
                    paymentStatus: session.payment_status
                })
            }

            // Payment 상태 업데이트
            await prisma.payment.update({
                where: { stripeSessionId: sessionId },
                data: { status: 'paid' }
            })

            // Order 상태 업데이트
            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'completed' }
            });
            // 유저 포인트 적립
            const pointsEarned = Math.max(0, payment.amount * 0.01);
            const pointsSpent = payment.pointsUsed || 0;
            const netPoints = Math.max(pointsEarned - pointsSpent, -pointsSpent);
            await prisma.user.update({
                where: { id: payment.order.userId },
                data: { points: { increment: netPoints } }
            });
            //console.log(`Updated points for user ${payment.order.userId}: +${pointsEarned} - ${pointsSpent}`)
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                paymentStatus: session.payment_status
            })
        }
        // 결제 미완료 시 처리
        return NextResponse.json({
            success: false,
            message: 'Payment not completed',
            paymentStatus: session.payment_status
        })
    } catch (error: any) {
        // 오류 처리
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}