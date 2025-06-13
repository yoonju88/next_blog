'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import SearchModal from './searchModal'

export default function SearchButtonWithModal() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className="text-foreground hover:text-primary p-0 bg-none"
                onClick={() => setOpen(true)}
            >
                <Search className="w-5 h-5" />
            </button>
            <SearchModal open={open} onCloseAction={() => setOpen(false)} />
        </>
    )
}