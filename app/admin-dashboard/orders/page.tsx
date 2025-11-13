import { getAllOrders } from "./action";
import { redirect } from "next/navigation";
import AdminOrderListClient from "./AdminOrderListClient"
import StatsCard from "@/components/admin/StatsCard";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export default async function AdminOrdersPage() {
    const result = await getAllOrders()
    // 인증 실패 시 로그인 페이지로 리디렉션
    if (!result.success) {
        if (result.error?.includes('Not authenticated')) {
            redirect('/login');
        }
        // 권한 없음
        if (result.error?.includes('Access denied')) {
            redirect('/');
        }
        return (
            <div className="p-8 text-center">
                <p className="text-red-600">Error: {result.error}</p>
            </div>
        );
    }

    const orders = result.orders || []
    const statsData = [
        {
            title: "Total Orders",
            value: result.totalOrders || 0,
            bgColor: "bg-blue-100",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            title: "Total Revenue",
            value: result.totalAmount?.toFixed(2) || "0.00",
            bgColor: "bg-green-100",
            icon: (
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "Total Items Sold",
            value: result.totalItems || 0,
            bgColor: "bg-purple-100",
            icon: (
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { href: "/admin-dashboard", label: "Dashboard" },
                    { href: "", label: "Orders" },
                ]}
            />
            <h1 className="text-3xl font-bold mb-10 text-left">Order Management</h1>
            <div className="flex justify-center lg:gap-10 gap-6 flex-wrap ">
                {statsData.map((stat) => (
                    <StatsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        bgColor={stat.bgColor}
                    >
                        {stat.icon}
                    </StatsCard>
                ))}
                <AdminOrderListClient orders={orders} />
            </div >
        </div>
    );
}
