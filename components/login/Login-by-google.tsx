'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import GoogleLogo from "@/public/Google-logo.png"

export default function LoginByGoogle() {
    const auth = useAuth()
    const router = useRouter()

    return (
        <Button
            onClick={async () => {
                //사용자가 임의로 구글 로그인 모달을 닫아도 에러가 뜨지 않음 
                try {
                    await auth?.loginWithGoogle()
                    router.refresh()
                } catch (e) { console.error("Close login with google modal", e); }
            }}
            className="w-full bg-secondary upp"
            variant="outline"
        >
            <Image src={GoogleLogo} alt="google logo" className='object-cover fill w-5.5 h-5.5' />
            Continue with Google
        </Button>
    )
}
