import React from 'react'

interface PriceProps {
    subtotal: number;
    totalDiscount: number;
    shippingFee: number;
    finalPrice: number;
    tax: number;
    taxAmount: number;
}

export default function SummaryPayment({
    subtotal,
    totalDiscount,
    shippingFee,
    finalPrice,
    tax,
    taxAmount = 0
}: PriceProps) {
    const formatEuro = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    })

    return (
        <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between text-green-600">
                <span>Total discounts: </span>
                <span>-{totalDiscount.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{shippingFee.toLocaleString()} €</span>
            </div>
            {/* 4. 세금 항목을 별도로 명시 (가장 중요한 부분) */}
            <div className="flex justify-between border-t border-dashed pt-2 text-muted-foreground">
                <span >VAT ({(tax * 100).toFixed(0)}%)</span>
                <span >
                    {formatEuro.format(taxAmount)} €
                </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{finalPrice.toLocaleString()} €</span>
            </div>
        </div>
    )
}
