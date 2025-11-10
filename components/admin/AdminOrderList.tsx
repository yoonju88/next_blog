
'use client'
import React, { useState, useMemo } from 'react';
import { Package } from 'lucide-react';

import FilterBar from './filterBar';
import OrderHeader from './OrderHeader';
import OrderDetails from './OrderDetails';
import Pagination from './Pagination';
import { useFilters } from '@/context/FilterContext';
import { AdminOrderListProps } from '@/types/adminOrderList'


export default function AdminOrderList({ orders }: AdminOrderListProps) {
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 5; // 한 페이지에 표시할 주문 수


    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) newSet.delete(orderId);
            else newSet.add(orderId);
            return newSet;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'text-green-600';
            case 'pending': return 'text-yellow-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const { status, paymentStatus, user, startDate, endDate } = useFilters();

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (status !== 'all' && order.status.toLowerCase() !== status.toLowerCase()) return false;
            if (paymentStatus !== 'all' && order.payment?.status.toLowerCase() !== paymentStatus.toLowerCase()) return false;
            if (user) { // 'user' 검색어가 있을 경우에만 필터링
                const searchTerm = user.toLowerCase();

                // 1. 이메일 매치 확인 (email은 항상 존재한다고 가정)
                const emailMatch = order.user.email.toLowerCase().includes(searchTerm);

                // 2. 이름 매치 확인 (name이 null/undefined일 수 있음을 대비)
                //    order.user.name이 존재할 때만 .toLowerCase()와 .includes()를 실행
                const nameMatch = order.user.name
                    ? order.user.name.toLowerCase().includes(searchTerm)
                    : false;

                // 3. 이메일과 이름 둘 다 매치되지 않으면 제외 (return false)
                if (!emailMatch && !nameMatch) {
                    return false;
                }
            } const orderDate = new Date(order.createdAt);
            if (startDate && orderDate < new Date(startDate)) return false;
            if (endDate && orderDate > new Date(endDate)) return false;
            return true;
        });
    }, [orders, status, paymentStatus, user, startDate, endDate]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const currentOrders = filteredOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center" >
                <Package className="h-16 w-16 mx-auto mb-4 opacity-30 text-gray-400" />
                <p className="text-lg text-gray-500" >
                    No orders found
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <FilterBar
            />
            <div className="divide-y divide-gray-200 rounded-lg border-gray-200 border">
                {currentOrders.map(order => (
                    <div
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <OrderHeader
                            order={order}
                            isExpanded={expandedOrders.has(order.id)}
                            toggleOrder={toggleOrder}
                            getStatusColor={getStatusColor}
                        />
                        {expandedOrders.has(order.id) &&
                            <OrderDetails
                                order={order}
                                getPaymentStatusColor={getPaymentStatusColor}
                            />
                        }
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
            />
        </div>
    );
}