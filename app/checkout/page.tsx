'use client'
import { useState, useMemo } from "react"
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart-context"
import { getCouponByCode, validateCoupon, calculateDiscount } from '@/lib/coupons'
import { Coupon } from '@/types/coupon'
import { calculateShippingFee } from "@/lib/shipping"
import { CheckoutCartList } from "@/components/cart/CartList";
import CouponInput from "@/components/cart/SubmitCoupon";
import PointInput from "@/components/cart/PointInput";
import SummaryPayment from "@/components/cart/SummaryPayment";
import CheckoutButton from "./checkoutButton";
import { toast } from "sonner"
import { useUserPoints } from '@/lib/user/useUserPoints'

export default function CheckoutPage() {
    const { user } = useAuth();
    const [refreshPoints, setRefreshPoints] = useState(0);
    const userPoints = useUserPoints(user?.uid, refreshPoints)
    const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);
    const [usedPoints, setUsedPoints] = useState(0);
    const Tax_RATE = 0.2
    //총 무게 및 배송비 계산
    const totalWeight = useMemo(
        () => cartItems.reduce((sum, item) => sum + (item.property.weight || 0) * item.quantity, 0),
        [cartItems]
    );
    const shippingFee = useMemo(() => calculateShippingFee(totalWeight), [totalWeight]);

    // 세일 가격이 있을 경우 우선 적용해서 소계 계산
    const subtotal = useMemo(
        () => cartItems.reduce((sum: number, item: any) => {
            const basePrice = !isNaN(item.property.salePrice)
                ? item.property.salePrice
                : item.property.price

            // [2단계] 세금 포함 가격을 계산
            const inclusivePrice = basePrice * (1 + Tax_RATE)
            return sum + inclusivePrice * item.quantity
        }, 0),
        [cartItems]
    )

    const totalWithSaleDiscount = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                const basePrice = !isNaN(item.property.salePrice)
                    ? item.property.salePrice
                    : item.property.price;
                const itemTax = basePrice * Tax_RATE
                return sum + itemTax * item.quantity;
            }, 0),
        [cartItems]
    );

    const totalDiscount = totalWithSaleDiscount + discount + usedPoints + shippingFee;

    const finalPrice = Math.max(totalPrice - (discount || 0) - (usedPoints || 0), 0);

    const savingsPercentage = totalPrice > 0 ? Math.round((discount / totalPrice) * 100) : 0;
    const taxableAmount = finalPrice;
    const taxAmount = taxableAmount * Tax_RATE;
    const FinalTotalPrice = finalPrice + shippingFee + taxAmount

    //쿠폰 적용
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        setLoading(true);
        try {
            const coupon = await getCouponByCode(couponCode);

            if (!coupon) {
                setDiscount(0);
                setAppliedCoupon(null);
                setCouponStatus("error");
                toast.error("Invalid coupon code");
                return;
            }

            if (!coupon.isActive || coupon.usedCount > 0) {
                setDiscount(0)
                setAppliedCoupon(null)
                setCouponStatus("error")
                toast.error("This coupon has already been used")
                return
            }

            const validation = validateCoupon(coupon, totalPrice);

            if (!validation.isValid) {
                setDiscount(0);
                setAppliedCoupon(null);
                setCouponStatus("error");
                toast.error(validation.message);
                return;
            }
            const discountAmount = calculateDiscount(coupon, totalPrice);
            setDiscount(discountAmount);
            setAppliedCoupon(coupon);
            setCouponStatus("success");
        } catch (error) {
            console.error('Error applying coupon:', error);
            toast.error("Failed to apply coupon");
            setCouponStatus("error");
        } finally {
            setLoading(false);
        }
    };
    //쿠폰 제거
    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponStatus("idle");
    };

    const handlePaymentSuccess = () => {
        // 결제 성공 후 포인트 훅 재호출
        setRefreshPoints(prev => prev + 1)
        setUsedPoints(0)
        handleRemoveCoupon()
        toast.success("Payment completed! Points updated.")
    }

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            {/* 장바구니 리스트 */}
            <CheckoutCartList cartItems={cartItems} />
            {/* 포인트 사용 */}
            <PointInput
                userPoints={userPoints}
                usedPoints={usedPoints}
                setUsedPoints={setUsedPoints}
            />
            {/* 쿠폰 입력 */}
            <CouponInput
                appliedCoupon={appliedCoupon}
                discount={discount}
                handleRemoveCoupon={handleRemoveCoupon}
                handleApplyCoupon={handleApplyCoupon}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                loading={loading}
            />
            {/* 결제 요약 */}
            <SummaryPayment
                subtotal={subtotal}
                totalDiscount={totalDiscount}
                shippingFee={shippingFee}
                finalPrice={FinalTotalPrice}
                tax={Tax_RATE}
                taxAmount={taxAmount}
            />
            {/* 결제 버튼 */}
            <div className="pt-6">
                <CheckoutButton
                    couponCode={appliedCoupon?.code}
                    discount={discount}
                    pointsUsed={usedPoints}
                    onPaymentSuccessAction={handlePaymentSuccess}
                />
            </div>
        </main>
    )
}