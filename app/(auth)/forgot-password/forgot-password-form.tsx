"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth } from '@/firebase/client'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await sendPasswordResetEmail(auth, email)
            }}
            className='flex flex-col gap-4'
        >
            <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <Button type="submit"
                className='w-full'
            >
                Reset password
            </Button>
        </form>
    )
}
