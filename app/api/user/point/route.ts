import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "userId is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { firebaseUID: userId },
            select: { points: true }
        });

        if (!user) {
            return NextResponse.json(
                { success: true, points: 0 }, // 사용자 없으면 0 포인트
                { status: 200 }
            );
        }

        return NextResponse.json({
            success: true,
            points: user?.points ?? 0
        });
    } catch (error: any) {
        console.error("Failed to fetch user points:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}