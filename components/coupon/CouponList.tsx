'use client'

import { useState } from 'react'
import { Coupon, CreateCouponData } from "@/types/coupon"
import { getAllCoupons } from "@/lib/coupons"
import { createCoupon, updateCoupon, deleteCoupon } from '@/app/admin-dashboard/coupons/action'
import CouponCard from "./CouponCard"
import CouponFormDialog from "./CouponDialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/auth"
import { useRouter } from 'next/navigation'

interface CouponListProps {
    initialCoupons: Coupon[]
}

export default function CouponList({ initialCoupons }: CouponListProps) {
    const auth = useAuth();
    const router = useRouter()
    const [coupons, setCoupons] = useState(initialCoupons)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const refresh = async () => {
        const updated = await getAllCoupons()
        setCoupons(updated)
    }

    const handleDelete = async (id: string) => {
        const token = await auth?.user?.getIdToken()
        if (!token) return
        try {
            await deleteCoupon(id, token)
            toast.success("Deleted successfully")
        } catch {
            toast.error("Delete failed")
        }
        refresh()
    }
    const handleCreate = async (data: CreateCouponData) => {
        const token = await auth?.user?.getIdToken()
        if (!token) return
        await createCoupon(data, token)
        toast.success("Coupon created")
        refresh()
    }

    const handleUpdate = async (id: string, data: Partial<CreateCouponData>) => {
        const token = await auth?.user?.getIdToken()
        if (!token) return
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        )
        await updateCoupon(id, cleanedData, token)
        toast.success("Coupon updated")
        refresh()
    }

    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-start mb-10">
                <Button onClick={() => { setEditingCoupon(null); setIsDialogOpen(true) }}>
                    <Plus className="h-4 w-4 mr-2" /> Create Coupon
                </Button>
            </div>
            <div className="grid gap-4">
                {coupons.map(coupon => (
                    <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        onEditAction={() => { setEditingCoupon(coupon); setIsDialogOpen(true) }}
                        onDeleteAction={() => handleDelete(coupon.id)}
                    />
                ))}
            </div>
            <CouponFormDialog
                open={isDialogOpen}
                onOpenChangeAction={setIsDialogOpen}
                onSubmitAction={editingCoupon
                    ? (data) => handleUpdate(editingCoupon.id, data)
                    : handleCreate}
                editingCoupon={editingCoupon}
            />
        </div>
    )
}