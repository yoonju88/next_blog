import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import { auth } from "@/firebase/server";

// Ensure Node.js runtime (Prisma is not supported on the Edge runtime)
export const runtime = "nodejs";
export const dynamic = 'force-dynamic'

console.log("Node.js runtime active")
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
    const requestHeaders = new Headers(req.headers)
    const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
    try {
        console.log("DEBUG 1: API Route Started.")
        //  1. 데이터 수신
        const { firebaseToken, cartItems, couponCode, discount, pointsUsed } = await req.json()
        //2. 인증 및 사용자 조회 → UID 추출
        const decodedToken = await auth.verifyIdToken(firebaseToken)
        const firebaseUID = decodedToken.uid;
        //Prisma에서 User 찾기
        let user = await prisma.user.findUnique({
            where: { firebaseUID }
        })
        console.log("DEBUG 2: Firebase UID:", firebaseUID);
        console.log("DEBUG 3: User email:", decodedToken.email);

        if (!user) {
            console.log("DEBUG 4: User not found, creating new user...");
            user = await prisma.user.create({
                data: {
                    firebaseUID: firebaseUID,
                    email: decodedToken.email || `${firebaseUID}@example.com`,
                    name: decodedToken.name || null,
                }
            })
            console.log("DEBUG 5: New user created:", user.id);
        } else {
            console.log("DEBUG 4: User found:", user.id);
        }


        // 3. 금액 계산 (유로 단위)
        const totalSubtotal = cartItems.reduce(
            (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
        );
        const totalDiscountAmount = (discount || 0) + (pointsUsed || 0);
        const finalAmount = Math.max(totalSubtotal - totalDiscountAmount, 0)

        console.log("DEBUG 6: Total amount:", finalAmount);
        // 4. Stripe Line Items 구성 (상품 + 할인)
        const lineItems: any[] = cartItems.map((item: any) => ({
            price_data: {
                currency: 'eur',
                product_data: { name: item.name },
                // 💡 상품 가격: 상품 개당 가격을 센트(Cents) 단위로 변환합니다.
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: Number(item.quantity) || 1,
        }));


        // 🚨 할인 금액을 마이너스 Line Item으로 추가하여 Stripe에 정확한 최종 금액을 전달합니다.
        if (totalDiscountAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Coupon/Points Discount' },
                    // 💡 할인 금액: 마이너스 값을 센트 단위로 변환합니다.
                    unit_amount: Math.round(-totalDiscountAmount * 100),
                },
                quantity: 1, // 수량은 1
            });
        }
        console.log("DEBUG 7: Creating Stripe session...");
        // 5. Stripe 세션 생성
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // 💡 세금, 배송비 등 추가 옵션을 나중에 여기에 추가 가능
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`
        })
        console.log("DEBUG 8: Stripe session created:", session.id);
        console.log("DEBUG 9: Creating order in DB...");
        // 6. Prisma Order 생성 (DB 저장)
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: finalAmount,
                status: 'pending',
                payment: {
                    create: {
                        provider: 'stripe',
                        amount: finalAmount,
                        status: 'unpaid',
                        stripeSessionId: session.id,
                        couponCode: couponCode || null,
                        pointsUsed: pointsUsed || 0,
                    },
                },
            },
        })
        console.log("DEBUG 10: Order created:", order.id);
        return NextResponse.json({
            url: session.url,
            orderId: order.id
        })
    } catch (error: any) {
        console.error("💥 Payment Error:", error)
        return NextResponse.json(
            { message: error.message || "결제 세션 생성 중 알 수 없는 오류 발생" },
            { status: 500 }
        )
    }
}


