'use client'
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Order } from '@/types/order';
import Image from 'next/image';
import storagePathToUrl from '@/lib/storagePathToUrl';

interface OrderDetailsProps {
    order: Order;
    getPaymentStatusColorAction: (status: string) => string;
}

export default function OrderDetails({ order, getPaymentStatusColorAction }: OrderDetailsProps) {
    return (
        <div className="px-6 pb-6 space-y-4">
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Order Items:</h3>
                {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        {item.imageUrl && <Image src={storagePathToUrl(item.imageUrl)} alt={item.productName} width="100" height="100" className="w-14 h-14 object-cover rounded-sm" />}
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × €{item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Details:</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Payment Status:</span>
                    </div>
                    <span className={`font-medium ${getPaymentStatusColorAction(order.payment?.status || 'unknown')}`}>
                        {order.payment?.status.toUpperCase() || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}