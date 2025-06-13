'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoginForm from '@/components/login/login-form'

export default function LoginPage() {

    return (
        <Card className="w-[450px] sm:w-[500px]">
            <CardHeader>
                <CardTitle className='text-3xl font-bold'>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    )
}
