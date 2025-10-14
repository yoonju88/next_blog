"use client"
import { getAuth } from "firebase/auth";

export async function handleCheckout(
    cartItems: any[],
    couponCode?: string,
    discount?: number,
    pointsUsed?: number,
) {
    try {
        // Firebase 인증 토큰 가져오기
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) { throw new Error('You must log in before checkout.') }

        // Firebase 토큰 발급
        const token = await user.getIdToken()
        console.log(process.env.STRIPE_SECRET_KEY)

        // 서버에 보낼 카트 아이템을 API 스키마에 맞게 매핑
        const mappedCartItems = cartItems.map((item: any) => {
            const basePrice = (item?.property?.onSale && !isNaN(item?.property?.salePrice))
                ? Number(item.property.salePrice)
                : Number(item?.property?.price || item?.price || 0)
            return {
                name: item?.property?.name || item?.name || "Item",
                price: basePrice,
                quantity: Number(item?.quantity) || 1,
            }
        })

        // 결제 요청 데이터 구성
        const payload = {
            firebaseToken: token,
            cartItems: mappedCartItems,
            couponCode: couponCode || null,
            discount: discount || 0,
            pointsUsed: pointsUsed || 0,
        };

        // 서버로 결제 세션 생성 요청
        const res = await fetch("/api/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        // 응답이 HTML(리다이렉트/에러 페이지)일 수도 있으므로 content-type 확인
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
            const text = await res.text()
            console.error("Non-JSON response from /api/payment:", text.slice(0, 200))
            throw new Error("서버 응답 형식이 올바르지 않습니다. 로그인 상태 또는 미들웨어 설정을 확인해주세요.")
        }

        const data = await res.json();
        if (!res.ok) {
            console.error("❌ Payment API Error:", data);
            throw new Error(data.message || "결제 요청 중 오류가 발생했습니다.");
        }

        // Stripe 세션 URL로 이동
        if (data.url) {
            window.location.href = data.url; // ✅ Stripe의 redirectToCheckout 대체
        } else {
            throw new Error("결제 페이지 URL이 반환되지 않았습니다.");
        }
    } catch (error: any) {
        console.error("Checkout Error:", error.message);
        alert(error.message || "결제 요청에 실패했습니다.");
    }
}




