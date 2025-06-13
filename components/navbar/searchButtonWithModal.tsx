'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import SearchModal from './searchModal'

export default function SearchButtonWithModal() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary"
                onClick={() => setOpen(true)}
            >
                <Search className="w-5 h-5" />
            </Button>

            <SearchModal open={open} onCloseAction={() => setOpen(false)} />
        </>
    )
}