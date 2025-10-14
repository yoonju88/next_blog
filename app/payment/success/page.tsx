'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('Checking payment status...')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!sessionId) {
            setStatus('No session ID provided')
            setError(true)
            setLoading(false)
            return
        }

        fetch(`/api/payment/verify?session_id=${sessionId}`)
            .then(async (res) => {
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.message || 'Verification failed')
                }
                return data
            })
            .then(data => {
                if (data.success) {
                    setStatus('✅ Payment successful! Your order has been confirmed.')
                    setError(false)
                } else {
                    setStatus('❌ Payment verification failed.')
                    setError(true)
                }
            })
            .catch((err) => {
                console.error('Verification error:', err)
                setStatus('⚠️ An error occurred during verification.')
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [sessionId])

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
