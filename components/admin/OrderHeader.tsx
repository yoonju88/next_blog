'use client'
import React from 'react';
import { User, Calendar, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderHeaderProps {
    order: Order;
    isExpanded: boolean;
    toggleOrder: (id: string) => void;
    getStatusColor: (status: string) => string;
}

export default function OrderHeader({ order, isExpanded, toggleOrder, getStatusColor }: OrderHeaderProps) {
    return (
        <div className="p-6 cursor-pointer" onClick={() => toggleOrder(order.id)}>
            <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Order ID:</span>
                        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">{order.id.slice(0, 12)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{order.user.name || 'Unknown'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{order.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-EU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-2xl font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                    {order.earnedPoints && order.earnedPoints > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-blue-600">
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