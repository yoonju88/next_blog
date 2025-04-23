import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import RegisterForm from './register-form'
import Link from 'next/link'

export default function Register() {
    return (
        <Card className="w-[450px] sm:w-[500px]">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    Register
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
        </Card>
    )
}

