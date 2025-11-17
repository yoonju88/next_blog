import React from "react";
import { getActionPromoCoupon } from "@/lib/coupon.server";

export default async function EventCouponBanner() {
    const coupon = await getActionPromoCoupon();
    if (!coupon) return null;

    return (
        <div className="bg-foreground/80 p-3 text-center font-semibold h-[40px] flex justify-center items-center">
            <p className="absolute whitespace-nowrap animate-marquee text-white">
                Get 10% off your first order with code
                <span className="font-extrabold text-md p-2">
                    {coupon.code}
                </span>
            </p>
        </div>
    );
}