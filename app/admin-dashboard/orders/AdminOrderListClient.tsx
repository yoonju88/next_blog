'use client'
import React from 'react';
import { FilterProvider } from '@/context/FilterContext';
import { AdminOrderListProps } from '@/types/adminOrderList'
import AdminOrderList from '@/components/admin/AdminOrderList';


export default function AdminOrderListClient({ orders }: AdminOrderListProps) {
    return (
        <FilterProvider>
            <AdminOrderList orders={orders} />
        </FilterProvider>
    );
}