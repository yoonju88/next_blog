import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // 데이터가 배열이 아니면 배열로 변환
        const products = Array.isArray(data) ? data : [data];

        // Firebase 상품들을 Prisma에 upsert
        for (const product of products) {
            await prisma.product.upsert({
                where: { id: product.id }, // Firebase ID 그대로 사용
                update: {
                    name: product.name,
                    price: product.price,
                    stock: product.stock || 999, // Firebase에 stock이 없으면 충분한 재고 설정
                    images: product.images || [],
                },
                create: {
                    id: product.id, // Firebase ID를 Prisma에도 동일하게 사용
                    name: product.name,
                    price: product.price,
                    stock: product.stock || 999,
                    images: product.images || [],
                }
            });
        }
        console.log(`✅ Synced ${products.length} products to Prisma`);
        return NextResponse.json({
            success: true,
            count: products.length
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json([], { status: 500 });
    }
}