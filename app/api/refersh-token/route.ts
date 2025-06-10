import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


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