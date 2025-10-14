import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose"


export async function middleware(request: NextRequest) {
    // console.log("Middlewaore:", request.url)
    // Always allow API routes to pass through without auth redirects
    if (request.nextUrl.pathname.startsWith('/api/')) return NextResponse.next()


    const cookieStore = await cookies()
    const token = cookieStore.get("firebaseAuthToken")?.value;

    const { pathname } = request.nextUrl

    // 로그인 필요 페이지 접근시 토큰 없으면 리다이렉트
    if (!token && pathname.startsWith("/checkout")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //token이 없을 때 (즉, 로그인 안 되어 있을 때), 요청한 경로(pathname)가 아래 중 하나라면 그때는 NextResponse.next()를 호출해서, 요청을 그냥 통과
    if (!token && (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/property")
    )
    ) {
        return NextResponse.next()
    }
    //로그인한 사용자가 로그인/회원가입 페이지로 가려는 걸 막는 로직
    if (token && (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password"))
    ) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    const decodedToken = decodeJwt(token)
    // 지금 시간이 토큰의 만료시간을 지났는가
    if (
        decodedToken.exp &&
        (decodedToken.exp - 300) * 1000 < Date.now()
    ) {
        return NextResponse.redirect(
            new URL(
                `/api/refersh-token?redirect=${encodeURIComponent(
                    request.nextUrl.pathname
                )}`,
                request.url
            )
        )
    }

    //관리자가 아닌데, /admin-dashboard 페이지에 접근하려고 한다면 (홈페이지)로 리다이렉트
    if (!decodedToken.admin && pathname.startsWith("/admin-dashboard")) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    //사용자가 관리자? 요청한 URL 경로가 /account/my-favorites로 시작하면 홈(/)으로 리다이렉트
    /*if (decodedToken.admin && pathname.startsWith("/my-favorites")) {
        return NextResponse.redirect(new URL("/", request.url))
    }
*/
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin-dashboard",
        "/admin-dashboard/:path*",
        "/login",
        "/forgot-password",
        "/register",
        "/account",
        "/account/:path*", // "/account/my-favorites"
        "/property",
        "/property/:path*",
        "/checkout",
        "/account/:path*",
        "/api/payment"
    ],
}