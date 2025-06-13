'use client'
import { useRouter } from 'next/navigation';

export default function PaymentButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-all duration-300"
        >
            Payment
        </button>
    )
}
