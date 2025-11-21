'use client'
import React from 'react';
import { User, Calendar, Gift, ChevronDown, ChevronUp, HomeIcon } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderHeaderProps {
    order: Order;
    isExpanded: boolean;
    toggleOrderAction: (id: string) => void;
    getStatusColorAction: (status: string) => string;
}

export default function OrderHeader({ order, isExpanded, toggleOrderAction, getStatusColorAction }: OrderHeaderProps) {
    const formattedAddress = order.user.address
        ? [
            order.user.address.street,
            order.user.address.city,
            order.user.address.state,
            order.user.address.zipCode,
            order.user.address.country
        ]
            .filter(part => part) // 빈 문자열 제거
            .join(', ')          // 쉼표로 연결
        : null; // 주소가 없으면 null
    return (
        <div className="p-6 cursor-pointer" onClick={() => toggleOrderAction(order.id)}>
            <div className="flex justify-between items-start mb-2 flex-wrap gap-4 text-foreground/80">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap13">
                        <span className="text-sm font-medium">Order Number:</span>
                        <span className="text-sm px-3 py-1 rounded">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm ">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{order.user.name || 'Unknown'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{order.user.email}</span>
                    </div>
                    {order.user.address && (
                        <div className="flex items-center gap-2 text-sm">
                            <HomeIcon className="h-4 w-4" />
                            <span>
                                {formattedAddress}
                            </span>
                        </div>
                    )}
                    {typeof order.user.points === 'number' && (
                        <div className="flex items-center gap-2 text-sm">
                            <Gift className="h-4 w-4" />
                            <span>Current Points: {order.user.points.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-EU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColorAction(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-2xl font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                    {order.earnedPoints && order.earnedPoints > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                            <Gift className="h-4 w-4" />+{order.earnedPoints} pts
                        </div>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}