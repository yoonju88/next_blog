import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "../../../admin-dashboard/orders/action"

export const runtime = "nodejs"
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url)

        // query string에서 필터 값 추출
        const status = searchParams.get("status") as "completed" | "pending" | "cancelled" | "shipped" | null;
        const startDate = searchParams.get("startDate") ?? undefined;
        const endDate = searchParams.get("endDate") ?? undefined;

        // getAllOrders 호출
        const result = await getAllOrders({
            status: status ?? undefined,
            startDate,
            endDate,
        });
        // 1️⃣ 요청 자체 실패 (인증 실패, 서버 에러 등)
        if (!result.success) {
            console.error("❌ 주문 조회 실패:", result.error);
            // 권한 관련 에러는 403으로 반환
            if (result.error?.includes("Access denied") || result.error?.includes("Admins only")) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 403 }
                );
            }
            // 인증 관련 에러는 401로 반환
            if (result.error?.includes("Not authenticated")) {
                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        const orders = result.orders! ?? []
        if (orders.length === 0) {
            console.warn("주문이 없습니다.");
        }
        // 3️⃣ 이제 안전하게 사용 가능
        return NextResponse.json({
            success: true,
            count: orders.length,
            orders,
            totalAmount: result.totalAmount,
            totalItems: result.totalItems,
            totalOrders: result.totalOrders
        });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}