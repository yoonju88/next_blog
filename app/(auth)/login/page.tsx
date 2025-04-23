import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoginForm from '@/components/login-form'
import Link from 'next/link'

export default function Login() {
    return (
        <Card className="w-[450px] sm:w-[500px]">
            <CardHeader >
                <CardTitle className='text-3xl font-bold'>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    )
}
