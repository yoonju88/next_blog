import React from 'react'
import { Button } from '../ui/button';

interface coupon {
    code: string;
}

interface checkoutCouponProps {
    appliedCoupon: coupon | null;
    discount: number;
    handleRemoveCoupon: () => void
    handleApplyCoupon: () => Promise<void>
    couponCode: string;
    setCouponCode: (code: string) => void;
    loading: boolean;
}

export default function CouponInput({
    appliedCoupon,
    discount,
    handleRemoveCoupon,
    couponCode,
    handleApplyCoupon,
    setCouponCode,
    loading
}: checkoutCouponProps) {
    return (
        <div className="border-t pt-4">
            <p className='mb-2 font-medium'>Coupon </p>
            {appliedCoupon ? (
                <div className="flex items-center justify-between">
                    <p>
                        Applied Coupon: <strong>{appliedCoupon.code}</strong> (
                        -€{discount.toLocaleString()})
                    </p>
                    <Button variant="ghost" onClick={handleRemoveCoupon}>
                        Remove
                    </Button>
                </div>
            ) : (

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="border rounded-md p-2 flex-1"
                    />
                    <Button onClick={handleApplyCoupon} disabled={loading}>
                        Apply
                    </Button>
                </div>
            )}
        </div>
    )
}
