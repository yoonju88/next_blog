import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'
import PropertyTable from './properties/property-table'

export default async function AdminDashboard({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
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
                    <Link href="/admin-dashboard/banner">
                        Banner
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
                    <Link href="/admin-dashboard/delivery">
                        Analyse
                    </Link>
                </Button>
            </div>

        </div>
    )
}
