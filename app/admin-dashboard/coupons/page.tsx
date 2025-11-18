import { getAllCoupons } from "@/lib/coupons"
import CouponList from "@/components/coupon/CouponList"

export default async function CouponsPage() {
    const coupons = await getAllCoupons()

    return (
        <div className="">
            <h1>Coupons</h1>
            <CouponList initialCoupons={coupons} />
        </div>
    )
}