'use client'
import React from 'react';
import { Label } from '@/components/ui/label'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useFilters } from '@/context/FilterContext';

export default function FilterBar() {
    const {
        status,
        setStatus,
        paymentStatus,
        setPaymentStatus,
        user,
        setUser,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
    } = useFilters();

    const handleSearch = () => {
        console.log({ status, paymentStatus, user, startDate, endDate });
        // 여기서 부모 fetch 또는 필터링 실행
    };

    return (
        <div className='mb-10'>
            <h2 className="pb-6 text-right pr-4">Filter </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:flex lg:flex-wrap lg:gap-12 justify-center items-end border-b py-6 border-t">
                <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select value={status} onValueChange={(value: string) => setStatus(value)}>
                        <SelectTrigger className="lg:w-40 w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Select value={paymentStatus} onValueChange={(value: string) => setPaymentStatus(value)}>
                        <SelectTrigger className="lg:w-40 w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>User</Label>
                    <Input
                        type="text"
                        placeholder="Name or Email"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="lg:w-40 w-ful"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="lg:w-40 w-ful"
                    />
                </div>
                <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="lg:w-40 w-ful"
                    />
                </div>
            </div >
            {/* <div className="w-full flex justify-center mb-4">
                <Button onClick={handleSearch} className="mt-4">
                    Search
                </Button>
            </div> */}
        </div>
    );
}