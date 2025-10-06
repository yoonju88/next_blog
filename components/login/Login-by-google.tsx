'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import GoogleLogo from "@/public/Google-logo.png"
import { toast } from "sonner"

export default function LoginByGoogle() {
    const auth = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        if (!auth) return;

        setIsLoading(true)
        try {
            await auth.loginWithGoogle()
            toast.success("Login succes!")
            router.refresh()
        } catch (error) {
            if (error instanceof Error) {
                // 사용자가 팝업을 닫은 경우는 에러 메시지를 표시하지 않음
                if (!error.message.includes("popup-closed-by-user")) {
                    toast.error("Login error")
                }
            }
            console.error("Google login error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleGoogleLogin}
            className="w-full bg-secondary"
            variant="outline"
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                </div>
            ) : (
                <>
                    <Image
                        src={GoogleLogo}
                        alt="google logo"
                        className='object-cover w-5 h-5 mr-2'
                    />
                    Continue with Google
                </>
            )}
        </Button>
    )
}
