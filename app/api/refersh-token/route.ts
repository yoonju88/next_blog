import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 사용자의 브라우저(클라이언트)가 Firebase로부터 받은 단기 ID 토큰(유효기간 1시간)과 장기 리프레시 토큰을 가집니다. 
// ID 토큰이 만료될 때쯤, 클라이언트는 이 API(/api/refresh-token)를 호출해서 새 ID 토큰을 발급받아 계속 로그인 상태를 유지합니다.
//주요 특징: 모든 인증 부담이 클라이언트에 있습니다. 
// 서버 액션 같은 서버 중심 기능을 사용할 때는 매번 클라이언트가 보내준 단기 토큰을 검증해야 해서 비효율적입니다.
export const GET = async (request: NextRequest) => {
    const redirectPath = request.nextUrl.searchParams.get("redirect") ?? "/";

    // cookies()는 동기 함수이므로 await 제거
    const cookieStore = cookies();

    const refreshToken = (await cookieStore).get("firebaseAuthRefreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    try {
        // Secure Token API 호출 → 새 ID Token 발급
        const resp = await fetch(
            `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            }
        );

        if (!resp.ok) throw new Error(`status ${resp.status}`);

        const { id_token: idToken, expires_in } = await resp.json();

        // 새 ID Token 쿠키 저장
        (await cookieStore).set("firebaseAuthToken", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: Number(expires_in), // 보통 3600초
            path: "/",
            sameSite: "strict",
        });

        return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch (err) {
        console.error("Failed to refresh token:", err);
        return NextResponse.redirect(new URL("/", request.url));
    }
};


/*
export const GET = async (request: NextRequest) => {
    const path = request.nextUrl.searchParams.get("redirect")

    if (!path) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("firebaseAuthRefreshToken")?.value

    if (!refreshToken) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    try {
        const response = await fetch(
            `https://securetoken.googletoken.googleapis.com/v1/token?key={process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        })
        const json = await response.json()
        const newToken = json.id_token;
        cookieStore.set("firebaseAuthToken", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        return NextResponse.redirect(new URL(path, request.url))
    } catch (e) {
        console.log("Failed to refresh token:", e)
        return NextResponse.redirect(new URL("/", request.url))
    }
}*/