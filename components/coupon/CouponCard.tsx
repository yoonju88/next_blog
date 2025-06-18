'use client'

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Euro, Percent, Users, Edit } from "lucide-react"
import { Coupon } from "@/types/coupon"
import { useAuth } from "@/context/auth"
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CouponCardProps {
    coupon: Coupon
    onEditAction: () => void
    onDeleteAction: () => void
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date))
}

const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    if (!coupon.isActive) return <Badge variant="secondary">Inactive</Badge>
    if (now < new Date(coupon.validFrom)) return <Badge variant="outline">Pending</Badge>
    if (now > new Date(coupon.validUntil)) return <Badge variant="destructive">Expired</Badge>
    if (coupon.usedCount >= coupon.usageLimit) return <Badge variant="destructive">Limit Reached</Badge>
    return <Badge variant="default">Active</Badge>
}

export default function CouponCard({ coupon, onEditAction, onDeleteAction }: CouponCardProps) {
    const auth = useAuth()
    const router = useRouter()

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <span className="font-mono text-lg">{coupon.code}</span>
                            {getStatusBadge(coupon)}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{coupon.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onEditAction}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmDeleteButton
                            onConfirmAction={async () => onDeleteAction()}
                            title="Delete this coupon?"
                            description="This will permanently remove the coupon."
                            buttonText="Delete Coupon"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        {coupon.type === 'fixed' ? <Euro className="h-4 w-4" /> : <Percent className="h-4 w-4" />}
                        <span>
                            {coupon.type === 'fixed' ? `€${coupon.discount}` : `${coupon.discount}%`}
                            {coupon.maxDiscount && ` (max €${coupon.maxDiscount})`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>From: {formatDate(coupon.validFrom)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Until: {formatDate(coupon.validUntil)}</span>
                    </div>
                </div>
                {coupon.minAmount && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        Minimum order: €{coupon.minAmount}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}