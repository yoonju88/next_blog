import React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateSaleAction, removeSaleAction } from '@/app/admin-dashboard/action'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { DialogDescription } from '@radix-ui/react-dialog'

export default function AddSaleDialog({ open, onClose, selectedIds, defaultSalePrice, defaultSaleRate, defaultSaleStartDate, defaultSaleEndDate }: {
    open: boolean,
    onClose: () => void,
    selectedIds: string[],
    defaultSalePrice: number,
    defaultSaleRate: number,
    defaultSaleStartDate: string,
    defaultSaleEndDate: string
}) {
    const auth = useAuth()
    const router = useRouter()
    const [salePrice, setSalePrice] = useState(
        defaultSalePrice !== undefined && defaultSalePrice !== null
            ? defaultSalePrice.toString()
            : ''
    )
    const [saleRate, setSaleRate] = useState(
        defaultSaleRate !== undefined && defaultSaleRate !== null
            ? defaultSaleRate.toString()
            : ''
    )
    const [saleStartDate, setSaleStartDate] = useState(defaultSaleStartDate || '')
    const [saleEndDate, setSaleEndDate] = useState(defaultSaleEndDate || '')

    const handleSubmit = async () => {
        const token = await auth?.user?.getIdToken()
        if (!token) return

        try {
            await updateSaleAction({
                selectedIds,
                salePrice: Number(salePrice),
                saleRate: Number(saleRate),
                saleStartDate: saleStartDate ? new Date(saleStartDate).toISOString() : undefined,
                saleEndDate: saleEndDate ? new Date(saleEndDate).toISOString() : undefined,

            }, token)
            toast.success('Sale applied to selected products ✅')
        } catch {
            toast.error('Failed to apply sale ❌')
        }
        onClose()
        router.refresh()
    }

    const handleRemove = async () => {
        try {
            await removeSaleAction(selectedIds)
            toast.success('Sale removed successfully ✅')
        } catch {
            toast.error('Failed to remove sale ❌')
        }
        onClose()
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="border-none">
                <DialogHeader>
                    <DialogTitle>Add sale</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Please add Sale Information here.
                </DialogDescription>
                <div className="space-y-4 py-2">
                    <Label>Discount Price(€)</Label>
                    <Input
                        type="number"
                        placeholder="Discounted Price(€)"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                    />
                    <Label>Discount Rate(%)</Label>
                    <Input
                        type="number"
                        placeholder="Discount Rate(%)"
                        value={saleRate}
                        onChange={(e) => setSaleRate(e.target.value)}
                    />
                    <Label>Sale Start Date</Label>
                    <Input
                        type="date"
                        value={saleStartDate}
                        onChange={(e) => setSaleStartDate(e.target.value)}
                    />
                    <Label>Sale End Date</Label>
                    <Input
                        type="date"
                        value={saleEndDate}
                        onChange={(e) => setSaleEndDate(e.target.value)}
                    />
                    <div className="flex gap-4 justify-end mt-6">
                        <Button onClick={handleSubmit}>Apply</Button>
                        <Button onClick={handleRemove} variant='destructive'>Remove Sale</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
