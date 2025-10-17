'use client'

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Coupon, CreateCouponData } from "@/types/coupon"

interface CouponFormDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onSubmitAction: (data: CreateCouponData) => void
    editingCoupon?: Coupon | null
}

export default function CouponFormDialog({
    open,
    onOpenChangeAction,
    onSubmitAction,
    editingCoupon
}: CouponFormDialogProps) {
    const [formData, setFormData] = useState<Partial<CreateCouponData>>({
        code: '',
        description: '',
        discount: 0,
        type: 'fixed',
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 86400000),
    })

    useEffect(() => {
        if (open) {
            if (editingCoupon) {
                setFormData({
                    code: editingCoupon.code,
                    description: editingCoupon.description,
                    discount: editingCoupon.discount,
                    type: editingCoupon.type,
                    usageLimit: editingCoupon.usageLimit,
                    validFrom: new Date(editingCoupon.validFrom),
                    validUntil: new Date(editingCoupon.validUntil),
                    maxDiscount: editingCoupon.maxDiscount,
                    minAmount: editingCoupon.minAmount,
                })
            } else {
                setFormData({
                    code: '',
                    description: '',
                    discount: 0,
                    type: 'fixed',
                    usageLimit: 100,
                    validFrom: new Date(),
                    validUntil: new Date(Date.now() + 30 * 86400000),
                })
            }
        }
    }, [editingCoupon, open])

    const handleSubmit = () => {
        if (!formData.code || !formData.description || !formData.validFrom || !formData.validUntil) return
        onSubmitAction(formData as CreateCouponData)
        onOpenChangeAction(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Coupon Code</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="SAVE10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="10€ discount for new customers"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: 'fixed' | 'percentage') =>
                                    setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount">Discount</Label>
                            <Input
                                id="discount"
                                type="number"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    {formData.type === 'percentage' && (
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscount">Max Discount (€)</Label>
                            <Input
                                id="maxDiscount"
                                type="number"
                                value={formData.maxDiscount || ''}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || undefined })}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="minAmount">Minimum Order (€)</Label>
                        <Input
                            id="minAmount"
                            type="number"
                            value={formData.minAmount || ''}
                            onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || undefined })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usageLimit">Usage Limit</Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="validFrom">Valid From</Label>
                            <Input
                                id="validFrom"
                                type="datetime-local"
                                value={formData.validFrom ? new Date(formData.validFrom).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData({ ...formData, validFrom: new Date(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Valid Until</Label>
                            <Input
                                id="validUntil"
                                type="datetime-local"
                                value={formData.validUntil ? new Date(formData.validUntil).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button variant="default" onClick={() => onOpenChangeAction(false)} className="bg-primary/80 text-white">Cancel</Button>
                        <Button onClick={handleSubmit}>{editingCoupon ? "Update" : "Create"}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}