"use client"
import { useRouter } from "next/navigation"
import CommonLoginForm from "@/components/login-form"

export default function LoginFofm() {
    const router = useRouter();

    return (
        <CommonLoginForm
            onSuccessAction={() => { router.refresh() }}
        />
    )
}
