'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Minus, Plus, Trash2, CheckCircle, XCircle } from "lucide-react"
import numeral from "numeral"
import Link from "next/link"
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getCouponByCode, validateCoupon, calculateDiscount } from '@/lib/coupons'
import { Coupon } from '@/types/coupon'
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/client"

type Props = {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

export function useUserPoints(userId?: string) {
    const [points, setPoints] = useState<number>(0)

    useEffect(() => {
        if (!userId) {
            // setPoints(0) // 이 부분이 주석/삭제됨
            return
        }
        const fetchPoints = async () => {
            const userRef = doc(db, "users", userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
                const data = userSnap.data()
                setPoints(typeof data.points === "number" ? data.points : 0)
            } else {
                setPoints(0)
            }
        }
        fetchPoints()
    }, [userId])

    return points
}

export default function CartSheet({ open, onOpenChangeAction }: Props) {
    const { user } = useAuth();
    const userPoints = useUserPoints(user?.uid);
    const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);
    const [usedPoints, setUsedPoints] = useState(0);

    if (user === undefined) {
        return <div>Loading...</div>
    }
    if (!user) {
        return <div>Please log in.</div>
    }

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

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponStatus("idle");
    };

    // 세일 가격이 있을 경우 우선 적용해서 소계 계산
    const subtotal = cartItems.reduce((sum, item) => {
        const price = !isNaN(item.property.salePrice) ? item.property.salePrice : item.property.price
        return sum + price * item.quantity
    }, 0)
    const totalSaleDiscount = cartItems.reduce((sum, item) => {
        const regular = item.property.price;
        const sale = !isNaN(item.property.salePrice) ? item.property.salePrice : regular;
        const diff = Math.max(regular - sale, 0);
        return sum + diff * item.quantity;
    }, 0);

    const totalDiscount = totalSaleDiscount + discount + usedPoints;

    const finalPrice = Math.max(totalPrice - discount - usedPoints, 0);
    const savingsPercentage = totalPrice > 0 ? Math.round((discount / totalPrice) * 100) : 0;
    return (
        <Sheet open={open} onOpenChange={onOpenChangeAction}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="px-4">
                <SheetHeader>
                    <SheetTitle className="text-lg">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-4 max-h-[calc(65vh-100px)]">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item, i) => {
                                    const isOnSale = item.property.onSale && !isNaN(item.property.salePrice)
                                    const unitPrice = isOnSale ? item.property.salePrice : item.property.price
                                    const totalPriceForItem = unitPrice * item.quantity
                                    return (
                                        <div key={`${item.id} + ${i}`} className="flex gap-4 py-4 border-b border-gray-300">
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={imageUrlFormatter(item.property.images[0])}
                                                    alt={item.property.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="flex-1 flex justify-center items-center gap-4">
                                                <div>
                                                    <h3 className="font-medium">{item.property.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {isOnSale && (
                                                            <span className="text-sm line-through text-muted-foreground">
                                                                €{item.property.price.toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-foreground">
                                                            €{unitPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        x {item.quantity} = €{totalPriceForItem.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.property.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span>
                                                        {isNaN(item.quantity) ? 0 : item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.property.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => removeFromCart(item.property.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-300 pt-4 space-y-4 mb-10">
                            {/* 쿠폰 섹션 */}
                            <div className="space-y-2">
                                <label htmlFor="coupon" className="block text-sm font-medium">
                                    Discount Coupon
                                </label>

                                {/* 적용된 쿠폰 표시 */}
                                {appliedCoupon && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md border-b">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                {appliedCoupon.code} - {appliedCoupon.description}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-600 hover:text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* 쿠폰 입력 필드 */}
                                {!appliedCoupon && (
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <Input
                                                id="coupon"
                                                type="text"
                                                className={`pr-10 ${couponStatus === "error" ? "border-red-500" : ""}`}
                                                value={couponCode}
                                                onChange={(e) => {
                                                    setCouponCode(e.target.value);
                                                    setCouponStatus("idle");
                                                }}
                                                placeholder="Enter coupon code"
                                                onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                                                disabled={loading}
                                            />
                                            {couponStatus === "success" && (
                                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                                            )}
                                            {couponStatus === "error" && (
                                                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <Button onClick={handleApplyCoupon} disabled={!couponCode.trim() || loading}>
                                            {loading ? "Applying..." : "Apply"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {/* 포인트 입력 UI */}
                            <div className="space-y-2">
                                <label htmlFor="points" className="block text-sm font-medium">Use Points</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Current Points: {userPoints}</span>
                                    {userPoints >= 1 ? (
                                        <Input
                                            id="points"
                                            type="number"
                                            min={0}
                                            max={userPoints}
                                            value={usedPoints}
                                            onChange={(e) => {
                                                let value = Math.floor(Number(e.target.value));
                                                if (isNaN(value) || value < 0) value = 0;
                                                if (value > userPoints) value = userPoints;
                                                setUsedPoints(value);
                                            }}
                                            placeholder={`Max ${userPoints}`}
                                        />
                                    ) : (
                                        <span className="text-sm text-red-400 pl-4">You don't have any points</span>
                                    )}
                                </div>

                            </div>
                            {/* 가격 요약 */}
                            <div className="space-y-2 pt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">€{numeral(subtotal).format("0,0")}</span>
                                </div>

                                {discount > 0 && (
                                    <>
                                        <div className="flex justify-between text-green-600">
                                            <span className="text-sm">Discount</span>
                                            <span className="font-medium">-€{numeral(discount).format("0,0")}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-green-600">
                                            <span>Discount Rate</span>
                                            <span>{savingsPercentage}% Discount</span>
                                        </div>
                                    </>
                                )}
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 pt-2 border-t border-blue-100">
                                        <span>Total Savings</span>
                                        <span>-€{numeral(totalDiscount).format("0,0")}</span>
                                    </div>
                                )}
                                {/* VAT 계산 */}
                                {(() => {
                                    const vatRate = 0.2;
                                    const vatAmount = finalPrice - finalPrice / (1 + vatRate);
                                    return (
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Included VAT (20%)</span>
                                            <span>€{numeral(vatAmount).format("0,0.00")}</span>
                                        </div>
                                    );
                                })()}

                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>€{numeral(finalPrice).format("0,0")}</span>
                                </div>
                            </div>

                            <Button asChild className="w-full">
                                <Link href="/checkout">Checkout</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

