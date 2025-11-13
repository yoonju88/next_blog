// app/admin-dashboard/coupons/page.tsx
import { getAllCoupons } from "@/lib/coupons"
import { Breadcrumbs } from "@/components/ui/breadcrumb"
import CouponList from "@/components/coupon/CouponList"

export default async function CouponsPage() {

    const coupons = await getAllCoupons()

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { href: "/admin-dashboard", label: "Dashboard" },
                    { href: "", label: "Coupons" },
                ]}
            />
            <h1 className="text-3xl font-bold">Coupon Management</h1>
            <CouponList initialCoupons={coupons} />
        </div>
    )
}