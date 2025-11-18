import React from "react";
import { getActionPromoCoupon } from "@/lib/coupon.server";

export default async function EventCouponBanner() {
    const coupon = await getActionPromoCoupon();
    if (!coupon) return null;

    return (
        <div className="relative overflow-hidden bg-gray-800 h-[45px] flex items-center">
            <div className="flex animate-marquee whitespace-nowrap text-white uppercase">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center text-white uppercase px-8">
                        Get <span className="font-extrabold text-2xl pl-1">10% off </span>
                        your first order with code
                        <span className="font-extrabold text-2xl px-2 animate-pulse">{coupon.code}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}