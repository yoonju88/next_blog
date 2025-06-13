'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SearchModal({ open, onCloseAction }: { open: boolean; onCloseAction: () => void }) {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleSearch = () => {
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setQuery("")
        onCloseAction()
    }

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Search Products</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search for products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        autoFocus
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}