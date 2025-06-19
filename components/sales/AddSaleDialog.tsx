import React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateSaleAction, removeSaleAction } from '@/app/admin-dashboard/action'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AddSaleDialog({ open, onClose, selectedIds, defaultSalePrice, defaultSaleRate, defaultSaleStartDate, defaultSaleEndDate }: {
    open: boolean,
    onClose: () => void,
    selectedIds: string[],
    defaultSalePrice: number,
    defaultSaleRate: number,
    defaultSaleStartDate: string,
    defaultSaleEndDate: string
}) {
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
        try {
            await updateSaleAction({
                selectedIds,
                salePrice: Number(salePrice),
                saleRate: Number(saleRate),
                saleStartDate: saleStartDate ? new Date(saleStartDate).toISOString() : undefined,
                saleEndDate: saleEndDate ? new Date(saleEndDate).toISOString() : undefined,
            })
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add sale</DialogTitle>
                </DialogHeader>
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
                    <Button onClick={handleSubmit}>Apply</Button>
                    <Button onClick={handleRemove}>Remove Sale</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
