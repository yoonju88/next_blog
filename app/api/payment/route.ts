import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import { auth } from "@/firebase/server";


// Ensure Node.js runtime (Prisma is not supported on the Edge runtime)
export const runtime = "nodejs";
export const dynamic = 'force-dynamic'

console.log("Node.js runtime active")
import { PrismaClient, Prisma, Product } from '@prisma/client'


const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
    const requestHeaders = new Headers(req.headers)
    const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
    try {
        // console.log("DEBUG 1: API Route Started.")
        //  1. 데이터 수신
        const { firebaseToken, cartItems, couponCode, discount, pointsUsed } = await req.json()
        //2. 인증 및 사용자 조회 → UID 추출
        //console.log("Received cartItems:", JSON.stringify(cartItems, null, 2));
        const decodedToken = await auth.verifyIdToken(firebaseToken)
        const firebaseUID = decodedToken.uid;
        //Prisma에서 User 찾기
        let user = await prisma.user.findUnique({
            where: { firebaseUID: decodedToken.uid }
        })
        // console.log("DEBUG 2: Firebase UID:", firebaseUID);
        // console.log("DEBUG 3: User email:", decodedToken.email);

        if (!user) {
            console.log("DEBUG 4: User not found, creating new user...");
            user = await prisma.user.create({
                data: {
                    firebaseUID: firebaseUID,
                    email: decodedToken.email || `${firebaseUID}@example.com`,
                    name: decodedToken.name || null,
                }
            })
        }

        // 3. 금액 계산 (유로 단위)
        const totalSubtotal = cartItems.reduce(
            (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
        );
        const totalDiscountAmount = (discount || 0) + (pointsUsed || 0);
        const finalAmount = Math.max(totalSubtotal - totalDiscountAmount, 0)
        //console.log("DEBUG 6: Total amount:", finalAmount);
        const productIds = cartItems
            .map((item: any) => item.productId) // <-- (1) 오타 수정 (porductId -> productId)
            .filter(Boolean);                   // <-- (2) 'undefined', 'null' 등 필터

        // (3) 유효한 ID가 하나도 없는 경우
        if (productIds.length === 0) {
            return NextResponse.json(
                { message: `Your cart contains no valid items.` },
                { status: 400 }
            );
        }

        const productsInDb = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true },
            skip: 0,
            take: productIds.length,
        });

        const productIdsInDb = new Set(productsInDb.map(p => p.id));
        // cartItems에서 추출한 유효한 ID 목록(productIds)과 DB에 실제 있는 ID 목록(productIdsInDb)을 비교
        const missingProductIds = productIds.filter((id: string) => !productIdsInDb.has(id));

        if (missingProductIds.length > 0) {
            console.warn(`[Pre-check Failed] Products not found: ${missingProductIds.join(', ')}`);
            return NextResponse.json(
                { message: `One or more products (${missingProductIds[0]}) could not be found. Please refresh your cart.` },
                { status: 400 } // 400 Bad Request
            );
        }
        // 4. Stripe Line Items 구성
        // Stripe는 음수 unit_amount를 허용하지 않으므로 최종 금액 단일 라인으로 청구합니다.
        if (finalAmount <= 0) {
            throw new Error("Final amount must be at least €0.01 after discounts/points.");
        }

        const lineItems: any[] = [{
            price_data: {
                currency: 'eur',
                product_data: { name: 'Order total' },
                unit_amount: Math.max(1, Math.round(finalAmount * 100)),
            },
            quantity: 1,
        }];
        //console.log("DEBUG 7: Creating Stripe session...");
        // 5. Stripe 세션 생성
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // 💡 세금, 배송비 등 추가 옵션을 나중에 여기에 추가 가능
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`,
            metadata: {
                userId: user.id
            }
        })
        //console.log("DEBUG 8: Stripe session created:", session.id);
        //console.log("DEBUG 9: Creating order in DB...");
        // --- 재고 확인 및 주문 생성 트랜잭션 ---
        const requestItems = cartItems.map((item: any) => ({
            id: item.productId,
            quantity: item.quantity,
        })).filter(item => item.id && item.quantity > 0)

        const order = await prisma.$transaction(async (tx) => {
            // 5-1. 주문할 상품들의 현재 재고를 확인합니다. (최적화)
            const idsToLock = requestItems.map(i => i.id)
            const productsToLock = await tx.$queryRaw<Product[]>`
                SELECT * FROM "Product"
                WHERE id IN (${Prisma.join(idsToLock)})
                FOR UPDATE
            `

            // 5-2. 재고가 충분한지 확인합니다.
            for (const item of requestItems) {
                const product = productsToLock.find((p) => p.id === item.id);
                if (!product) {
                    // Pre-check에서 확인했지만, 트랜잭션 안전을 위해 한 번 더 확인
                    throw new Error(`Product with ID ${item.id} not found.`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(
                        `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                    );
                }
            }

            // 6. Prisma Order 생성 (DB 저장)
            const createOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    totalAmount: finalAmount,
                    status: 'pending',
                    items: {
                        create: cartItems.map((item: any) => ({
                            productId: item.productId,
                            productName: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            imageUrl: Array.isArray(item.images) && item.images.length > 0
                                ? item.images[0]
                                : null,
                        })),
                    },
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
            // 5-4. 재고를 차감합니다.
            for (const item of requestItems) {
                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            console.log(`✅ Stock updated and Order ${createOrder.id} created successfully.`);
            //console.log(JSON.stringify(cartItems))
            return createOrder
        })
        return NextResponse.json({
            url: session.url,
            order // 트랜잭션에서 반환된 값
        });
    } catch (error: any) {
        console.error("💥 Payment Error:", error)
        return NextResponse.json(
            { message: error.message || "결제 세션 생성 중 알 수 없는 오류 발생" },
            { status: 500 }
        )
    }
}


