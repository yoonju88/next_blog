import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function Notfound() {
    return (
        <div className='flex flex-col gap-4 items-center justify-center text-center'>
            <h1 className="text-4xl text-red-500 uppercase font-bold tracking-wide">404 Not found</h1>
            <Button variant="link" className="hover:tracking-wider rounded-2xl transition-all durartion-500 ease-in">
                <Link href="/" className="text-xl">Return to Home</Link>
            </Button>
        </div>
    )
}
