import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import type { PromiseSearchParams } from '@/types/routes'

export default async function AdminDashboard({
    searchParams
}: {
    searchParams?: PromiseSearchParams
}) {
    const searchParamsValue = await searchParams

    return (
        <div>
            <Breadcrumbs items={[
                {
                    label: "Dashboard",
                },
            ]}
            />
            <h1 className="text-4xl font-bold mt-6">Admin Dashboard</h1>
            <div className="flex gap-4 mt-6">
                <Button
                    asChild
                >
                    <Link href="/admin-dashboard/banners">
                        Banners
                    </Link>
                </Button>
                <Button
                    asChild
                >
                    <Link href="/admin-dashboard/properties">
                        Products
                    </Link>
                </Button>
                <Button
                    asChild
                >
                    <Link href="/admin-dashboard/coupons">
                        <Tag className="h-4 w-4 mr-2" />
                        Coupons
                    </Link>
                </Button>
                <Button
                    asChild
                >
                    <Link href="/admin-dashboard/orders">
                        Orders
                    </Link>
                </Button>
                <Button
                    asChild
                >
                    <Link href="/admin-dashboard/delivery">
                        Analyse
                    </Link>
                </Button>
            </div>

        </div >
    )
}
