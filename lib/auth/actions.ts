'use server';

import { cookies } from 'next/headers';
import { auth } from '@/firebase/server'; // Firebase Admin SDK

/*
 * 클라이언트에서 받은 ID 토큰을 사용하여 안전한 서버 측 세션 쿠키를 생성합니다.
 * 이 쿠키는 httpOnly로 설정되어 XSS 공격으로부터 보호됩니다.
 */
export async function setAuthCookie(token: string, refreshToken?: string) {
    try {
        // ✅ 세션 쿠키의 만료 기간을 여기서 설정합니다. (단위: 밀리초)

        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
        const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

        // 'session'이라는 이름으로 쿠키를 설정합니다.
        const cookieStore = await cookies();

        // 서버 검증용 세션 쿠키
        cookieStore.set('session', sessionCookie, {
            httpOnly: true, // 클라이언트 JavaScript에서 접근 불가
            secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 HTTPS 강제
            maxAge: expiresIn, // 쿠키의 최대 수명을 위에서 설정한 값과 동일하게 맞춥니다.
            path: '/', // 사이트 전체에서 사용 가능
        });

        // 미들웨어에서 경량 검증에 사용하는 ID 토큰 쿠키
        cookieStore.set('firebaseAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn / 1000, // seconds for ID token typical 3600s
            path: '/',
            sameSite: 'strict',
        });

        // 리프레시 토큰이 전달된 경우, 갱신 라우트에서 사용
        if (refreshToken) {
            cookieStore.set('firebaseAuthRefreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                // Firebase refresh token 장기 유효. 30일 정도로 설정 가능.
                maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                path: '/',
                sameSite: 'strict',
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error creating session cookie:', error);
        return { success: false };
    }
}

/**
 * 로그아웃 시 서버 측 세션 쿠키를 삭제합니다.
 */
export async function clearAuthCookie() {
    const store = await cookies();
    store.delete('session');
    store.delete('firebaseAuthToken');
    store.delete('firebaseAuthRefreshToken');
}