import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { products, productIds } = body;

        if (productIds && Array.isArray(productIds)) {
            if (productIds.length === 0) {
                return NextResponse.json([]);
            }

            const foundProducts = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIds
                    }
                }
            });

            return NextResponse.json(foundProducts);
        }

        // products 배열로 upsert하는 경우 (상품 생성/수정)
        if (products && Array.isArray(products)) {
            if (products.length === 0) {
                return NextResponse.json({
                    success: true,
                    message: 'No products to process',
                    products: []
                });
            }

            const results = [];

            for (const product of products) {
                const { id: productId, name, price, stock, images } = product;

                if (!productId || typeof productId !== 'string') {
                    console.error('Invalid productId:', productId, 'for product:', product);
                    throw new Error(`Invalid or missing productId for product: ${name || 'unknown'}`);
                }

                if (!name || price === undefined || stock === undefined) {
                    throw new Error(`Missing required fields for product ${productId}`);
                }

                const validImages = Array.isArray(images) ? images : [];

                const result = await prisma.product.upsert({
                    where: { id: productId },
                    update: {
                        name,
                        price: Number(price),
                        stock: Number(stock),
                        images: validImages
                    },
                    create: {
                        id: productId,
                        name,
                        price: Number(price),
                        stock: Number(stock),
                        images: validImages
                    },
                });

                results.push(result);
            }

            return NextResponse.json({
                success: true,
                message: `${results.length} products processed`,
                products: results
            });
        }
        return NextResponse.json(
            { message: 'Either products array or productIds array is required' },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json([], { status: 500 });
    }
}