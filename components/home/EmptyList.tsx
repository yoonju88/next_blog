'use client'

import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'


export default function EmptyList({ title, message
}: {
    title: string;
    message: string;
}) {
    const router = useRouter()
    return (
        <div className='mt-4 text-center flex flex-col gap-6'>
            <h2 className='text-4xl font-bold text-primary'>{title}</h2>
            <p className="text-xl">{message}</p>
            <Button
                variant="default"
                onClick={() => router.back()}
                className="group hover:no-underline hover:font-semibold text-base mb-2 text-white"
            >
                <ArrowLeftIcon /> Return
            </Button>
        </div>
    )
}