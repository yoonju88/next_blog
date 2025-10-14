'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { useCart } from "@/context/cart-context"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('Checking payment status...')
    const [error, setError] = useState(false)
    const { user: currentUser } = useAuth()
    const { refreshCart } = useCart()

    useEffect(() => {
        // sessionId가 없으면 오류 처리
        if (!sessionId) {
            setStatus('No session ID provided')
            setError(true)
            setLoading(false)
        }
        // currentUser가 아직 로드되지 않았으면 아무것도 하지 않고 대기
        if (!currentUser) {
            return;
        }

        const verifyPaymentAndClearCart = async () => {
            try {
                // 2. 결제 확인 API 호출
                const res = await fetch(`/api/payment/verify?session_id=${sessionId}`)
                const data = await res.json()

                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Payment Verification failed')
                }

                setStatus('✅ Payment successful! Your order has been confirmed.')
                setError(false)

                // 3. 장바구니 비우기 API 호출 (결제 확인 성공 후 실행)
                // 토큰 만료 문제를 방지하기 위해 true 플래그로 토큰을 새로고침
                const idToken = await currentUser.getIdToken(true);
                const cartClearRes = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                // 장바구니 비우기 성공 처리
                if (cartClearRes.ok) {
                    console.log('Cart successfully cleared on server.');
                    refreshCart();
                    console.log('Cart view refresh triggered.');
                } else {
                    const errorText = await cartClearRes.text();
                    let errorMessage = errorText;
                    console.error('Failed to clear cart:', errorMessage);
                }
            } catch (err) {
                console.error('Verification error:', err)
                setStatus('⚠️ An error occurred during verification.')
                setError(true)
            } finally { setLoading(false) }
        }
        verifyPaymentAndClearCart();
    }, [sessionId, currentUser])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-4 text-center">
                    Payment Status
                </h1>

                {loading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Verifying your payment...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className={`text-lg mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
                            {status}
                        </p>

                        {!error && (
                            <button
                                onClick={() => router.push('/orders')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                View My Orders
                            </button>
                        )}

                        {error && (
                            <button
                                onClick={() => router.push('/checkout')}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Return to Checkout
                            </button>
                        )}
                    </div>
                )}

                <p className="mt-6 text-xs text-gray-400 text-center break-all">
                    Session ID: {sessionId || 'N/A'}
                </p>
            </div>
        </div>
    )
}
